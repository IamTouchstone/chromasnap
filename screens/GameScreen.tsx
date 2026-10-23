import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  BackHandler,
  Animated,
} from 'react-native';
import { THEME } from '../game/constants';
import { Block, DifficultyState, Puzzle } from '../game/types';
import { generatePuzzle, getDailySeed } from '../game/generator';
import { INITIAL_DIFFICULTY, getDifficultyForLevel } from '../game/difficulty';
import { calculateRoundScore, calculateLevelBonus, isStreakOnFire, formatScore } from '../game/scoring';
import { HeaderBar } from '../components/HeaderBar';
import { TargetDisplay } from '../components/TargetDisplay';
import { TimerBar } from '../components/TimerBar';
import { BoardView } from '../components/BoardView';
import {
  playTapSound,
  playCorrectSound,
  playStreakSound,
  playMistakeSound,
  playLevelCompleteSound,
  announceTarget,
  announceBlockValue,
  announceMatchAndNext,
  announceWrongMismatch,
  announceTimeUp,
  announceLevelComplete,
} from '../services/audio';
import {
  triggerHapticTap,
  triggerHapticSuccess,
  triggerHapticWarning,
  triggerHapticLevelComplete,
} from '../services/haptics';
import { recordRoundSolved } from '../services/storage';

interface GameScreenProps {
  isDailyChallenge?: boolean;
  onSessionEnd: (finalScore: number, finalStreak: number, solves: number, finalLevel: number) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  isDailyChallenge = false,
  onSessionEnd,
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyState>(INITIAL_DIFFICULTY);
  const [puzzle, setPuzzle] = useState<Puzzle>(() =>
    generatePuzzle(INITIAL_DIFFICULTY, isDailyChallenge ? getDailySeed() : undefined)
  );

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [solvesCount, setSolvesCount] = useState(0);
  const [levelTargetsCompleted, setLevelTargetsCompleted] = useState(0);

  const [isLevelCompleteAnim, setIsLevelCompleteAnim] = useState(false);
  const [levelCompletedInfo, setLevelCompletedInfo] = useState<{
    level: number;
    bonus: number;
    nextLevel: number;
  } | null>(null);
  const levelAnimScale = useRef(new Animated.Value(0.7)).current;
  const levelAnimOpacity = useRef(new Animated.Value(0)).current;

  const [selectedBlockIds, setSelectedBlockIds] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState<number>(puzzle.maxTimeSeconds);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShake, setIsShake] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [highlightedBlockIds, setHighlightedBlockIds] = useState<Set<string> | undefined>(undefined);

  const roundStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<any>(null);
  const isTransitioningRef = useRef<boolean>(false);

  useEffect(() => {
    setTimeout(() => announceTarget(puzzle.target), 700);
  }, []);

  useEffect(() => {
    const backAction = () => {
      handleExit();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [score, streak, solvesCount, difficulty.level]);

  useEffect(() => {
    if (isSuccess || isTimedOut || isTransitioningRef.current) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }
    const intervalMs = 50;
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = Math.max(0, prev - intervalMs / 1000);
        if (next <= 0) {
          clearInterval(timerIntervalRef.current!);
          handleTimeout();
          return 0;
        }
        return next;
      });
    }, intervalMs);
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isSuccess, isTimedOut, puzzle]);

  const handleTimeout = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    playMistakeSound();
    announceTimeUp();
    triggerHapticWarning();
    setHighlightedBlockIds(new Set(puzzle.solutionBlockIds));
    setIsTimedOut(true);
    setStreak(0);
  };

  const handleRetryAfterTimeout = () => {
    const newPuzzle = generatePuzzle(difficulty);
    setPuzzle(newPuzzle);
    announceTarget(newPuzzle.target);
    setSelectedBlockIds(new Set());
    setTimeRemaining(newPuzzle.maxTimeSeconds);
    setIsSuccess(false);
    setIsShake(false);
    setIsTimedOut(false);
    setHighlightedBlockIds(undefined);
    roundStartTimeRef.current = Date.now();
    isTransitioningRef.current = false;
  };

  const handleBlockPress = (block: Block) => {
    if (isSuccess || isTimedOut || isTransitioningRef.current || isLevelCompleteAnim) return;
    playTapSound();
    announceBlockValue(block.value);
    triggerHapticTap();

    const nextSelected = new Set(selectedBlockIds);
    if (nextSelected.has(block.id)) nextSelected.delete(block.id);
    else nextSelected.add(block.id);
    setSelectedBlockIds(nextSelected);

    const currentSum = Array.from(nextSelected).reduce((sum, id) => {
      const b = puzzle.blocks.find((blk) => blk.id === id);
      return sum + (b ? b.value : 0);
    }, 0);

    if (currentSum === puzzle.target) {
      isTransitioningRef.current = true;
      setIsSuccess(true);
      const solveTime = (Date.now() - roundStartTimeRef.current) / 1000;
      const nextStreak = streak + 1;
      const newSolves = solvesCount + 1;
      const nextLevelTargets = levelTargetsCompleted + 1;
      const isLevelUp = nextLevelTargets >= difficulty.targetsRequired;
      const breakdown = calculateRoundScore(timeRemaining, puzzle.maxTimeSeconds, nextSelected.size, nextStreak);
      recordRoundSolved(solveTime, nextStreak);

      if (isLevelUp) {
        const levelBonus = calculateLevelBonus(difficulty.level);
        const totalAwarded = breakdown.totalRoundPoints + levelBonus;
        setScore((prev) => prev + totalAwarded);
        setStreak(nextStreak);
        setSolvesCount(newSolves);
        setLevelTargetsCompleted(difficulty.targetsRequired);
        playLevelCompleteSound();
        announceLevelComplete(difficulty.level, difficulty.level + 1);
        triggerHapticLevelComplete();
        setLevelCompletedInfo({ level: difficulty.level, bonus: levelBonus, nextLevel: difficulty.level + 1 });
        setIsLevelCompleteAnim(true);
        levelAnimScale.setValue(0.7);
        levelAnimOpacity.setValue(0);
        Animated.sequence([
          Animated.parallel([
            Animated.timing(levelAnimOpacity, { toValue: 1, duration: 160, useNativeDriver: true }),
            Animated.spring(levelAnimScale, { toValue: 1, friction: 6, tension: 90, useNativeDriver: true }),
          ]),
          Animated.delay(1200),
          Animated.parallel([
            Animated.timing(levelAnimOpacity, { toValue: 0, duration: 240, useNativeDriver: true }),
            Animated.timing(levelAnimScale, { toValue: 1.08, duration: 240, useNativeDriver: true }),
          ]),
        ]).start();

        const nextLevel = difficulty.level + 1;
        const nextDiffConfig = getDifficultyForLevel(nextLevel);
        const nextDiff: DifficultyState = { ...nextDiffConfig, consecutiveSuccesses: 0, consecutiveFailures: 0 };
        const newPuzzle = generatePuzzle(nextDiff);

        setTimeout(() => {
          setDifficulty(nextDiff);
          setPuzzle(newPuzzle);
          announceTarget(newPuzzle.target);
          setSelectedBlockIds(new Set());
          setTimeRemaining(newPuzzle.maxTimeSeconds);
          setIsSuccess(false);
          setIsShake(false);
          setIsTimedOut(false);
          setHighlightedBlockIds(undefined);
          setLevelTargetsCompleted(0);
          setIsLevelCompleteAnim(false);
          setLevelCompletedInfo(null);
          roundStartTimeRef.current = Date.now();
          isTransitioningRef.current = false;
        }, 1700);
        return;
      }

      const nextPuzzle = generatePuzzle(difficulty);
      announceMatchAndNext(puzzle.target, nextPuzzle.target);

      setScore((prev) => prev + breakdown.totalRoundPoints);
      setStreak(nextStreak);
      setSolvesCount(newSolves);
      setLevelTargetsCompleted(nextLevelTargets);
      if (isStreakOnFire(nextStreak)) playStreakSound();
      else playCorrectSound();
      triggerHapticSuccess();

      setTimeout(() => {
        setPuzzle(nextPuzzle);
        setSelectedBlockIds(new Set());
        setTimeRemaining(nextPuzzle.maxTimeSeconds);
        setIsSuccess(false);
        setIsShake(false);
        setIsTimedOut(false);
        setHighlightedBlockIds(undefined);
        roundStartTimeRef.current = Date.now();
        isTransitioningRef.current = false;
      }, 600);
      return;
    }

    if (currentSum > puzzle.target) {
      playMistakeSound();
      announceWrongMismatch();
      triggerHapticWarning();
      setIsShake(true);
      setTimeout(() => setIsShake(false), 300);
    }
  };

  const handleExit = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    onSessionEnd(score, streak, solvesCount, difficulty.level);
  };

  const currentTotal = Array.from(selectedBlockIds).reduce((sum, id) => {
    const b = puzzle.blocks.find((blk) => blk.id === id);
    return sum + (b ? b.value : 0);
  }, 0);
  const isExceeded = currentTotal > puzzle.target;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderBar score={score} streak={streak} onExitPress={handleExit} showExit={true} />
        <View style={styles.targetSection}>
          <TargetDisplay target={puzzle.target} currentTotal={currentTotal} isSuccess={isSuccess} isExceeded={isExceeded} />
          <TimerBar remainingSeconds={timeRemaining} maxSeconds={puzzle.maxTimeSeconds} />
        </View>
        <View style={styles.boardSection}>
          <BoardView gridSize={puzzle.gridSize} blocks={puzzle.blocks} selectedBlockIds={selectedBlockIds} highlightedBlockIds={highlightedBlockIds} isSuccess={isSuccess} isShake={isShake} onBlockPress={handleBlockPress} disabled={isSuccess || isTimedOut} />
        </View>
        <View style={styles.footerSection}>
          {isTimedOut ? (
            <TouchableOpacity activeOpacity={0.85} onPress={handleRetryAfterTimeout} style={styles.retryButton}>
              <Text style={styles.retryText}>TIME'S UP • TAP TO TRY AGAIN</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.levelProgressContainer}>
              <View style={styles.levelRow}>
                <Text style={styles.levelTitle}>LEVEL {difficulty.level}</Text>
                <Text style={styles.gridTag}>{puzzle.gridSize}×{puzzle.gridSize} GRID</Text>
              </View>
              <Text style={styles.targetsProgressText}>{levelTargetsCompleted} / {difficulty.targetsRequired} TARGETS</Text>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${Math.min(100, Math.round((levelTargetsCompleted / difficulty.targetsRequired) * 100))}%` }]} />
              </View>
            </View>
          )}
        </View>
        {isLevelCompleteAnim && levelCompletedInfo && (
          <Animated.View pointerEvents="none" style={[styles.levelUpOverlay, { opacity: levelAnimOpacity }]}>
            <Animated.View style={[styles.levelUpCard, { transform: [{ scale: levelAnimScale }] }]}>
              <Text style={styles.levelUpStarBadge}>★ LEVEL PASSED ★</Text>
              <Text style={styles.levelUpMainTitle}>LEVEL {levelCompletedInfo.level}</Text>
              <View style={styles.levelUpBonusPill}><Text style={styles.levelUpBonusText}>+{formatScore(levelCompletedInfo.bonus)} BONUS</Text></View>
              <Text style={styles.levelUpNextLevelText}>ENTERING LEVEL {levelCompletedInfo.nextLevel}</Text>
            </Animated.View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: THEME.background },
  container: { flex: 1, backgroundColor: THEME.background, justifyContent: 'space-between', paddingVertical: 10 },
  targetSection: { alignItems: 'center', width: '100%' },
  boardSection: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 },
  footerSection: { minHeight: 64, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 },
  levelProgressContainer: { alignItems: 'center', width: '100%', maxWidth: 260 },
  levelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  levelTitle: { fontSize: 13, fontWeight: '900', letterSpacing: 2.5, color: THEME.textPrimary, textTransform: 'uppercase' },
  gridTag: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: THEME.textMuted, marginLeft: 8, textTransform: 'uppercase' },
  targetsProgressText: { fontSize: 11, fontWeight: '800', letterSpacing: 2, color: THEME.textSecondary, marginBottom: 6, textTransform: 'uppercase' },
  progressBarTrack: { width: 220, height: 4, borderRadius: 2, backgroundColor: THEME.surfaceHighlight, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 2, backgroundColor: THEME.warning },
  retryButton: { backgroundColor: THEME.surfaceHighlight, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 14, borderWidth: 1.5, borderColor: THEME.danger, alignItems: 'center' },
  retryText: { fontSize: 13, fontWeight: '900', letterSpacing: 1.5, color: THEME.white },
  levelUpOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(16, 16, 16, 0.88)', justifyContent: 'center', alignItems: 'center', zIndex: 999, paddingHorizontal: 28 },
  levelUpCard: { backgroundColor: THEME.surface, borderRadius: 24, paddingVertical: 28, paddingHorizontal: 32, alignItems: 'center', borderWidth: 1.5, borderColor: THEME.warning, width: '100%', maxWidth: 320 },
  levelUpStarBadge: { fontSize: 12, fontWeight: '900', letterSpacing: 3, color: THEME.warning, textTransform: 'uppercase', marginBottom: 8 },
  levelUpMainTitle: { fontSize: 34, fontWeight: '900', letterSpacing: 2, color: THEME.textPrimary, marginBottom: 12 },
  levelUpBonusPill: { backgroundColor: THEME.surfaceHighlight, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: THEME.surfaceBorder, marginBottom: 14 },
  levelUpBonusText: { fontSize: 14, fontWeight: '900', color: THEME.success, letterSpacing: 1.5 },
  levelUpNextLevelText: { fontSize: 11, fontWeight: '800', letterSpacing: 2, color: THEME.textSecondary, textTransform: 'uppercase' },
});