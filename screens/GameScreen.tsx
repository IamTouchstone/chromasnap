import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { THEME } from '../game/constants';
import { Block, DifficultyState, Puzzle } from '../game/types';
import { generatePuzzle, getDailySeed } from '../game/generator';
import { INITIAL_DIFFICULTY, adaptDifficultyOnSuccess, adaptDifficultyOnFailure } from '../game/difficulty';
import { calculateRoundScore, isStreakOnFire } from '../game/scoring';
import { HeaderBar } from '../components/HeaderBar';
import { TargetDisplay } from '../components/TargetDisplay';
import { TimerBar } from '../components/TimerBar';
import { BoardView } from '../components/BoardView';
import {
  playTapSound,
  playCorrectSound,
  playStreakSound,
  playMistakeSound,
} from '../services/audio';
import {
  triggerHapticTap,
  triggerHapticSuccess,
  triggerHapticWarning,
} from '../services/haptics';
import { recordRoundSolved } from '../services/storage';

interface GameScreenProps {
  isDailyChallenge?: boolean;
  onSessionEnd: (finalScore: number, finalStreak: number, solves: number) => void;
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

  const [selectedBlockIds, setSelectedBlockIds] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState<number>(puzzle.maxTimeSeconds);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShake, setIsShake] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [highlightedBlockIds, setHighlightedBlockIds] = useState<Set<string> | undefined>(undefined);

  // Round start timestamp
  const roundStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<any>(null);
  const isTransitioningRef = useRef<boolean>(false);

  // Hardware back button support on Android
  useEffect(() => {
    const backAction = () => {
      handleExit();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [score, streak, solvesCount]);

  // Load next puzzle
  const loadNextPuzzle = useCallback((nextDiff: DifficultyState) => {
    const newPuzzle = generatePuzzle(nextDiff);
    setDifficulty(nextDiff);
    setPuzzle(newPuzzle);
    setSelectedBlockIds(new Set());
    setTimeRemaining(newPuzzle.maxTimeSeconds);
    setIsSuccess(false);
    setIsShake(false);
    setIsTimedOut(false);
    setHighlightedBlockIds(undefined);
    roundStartTimeRef.current = Date.now();
    isTransitioningRef.current = false;
  }, []);

  // Timer loop
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

  // Handle timeout
  const handleTimeout = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    playMistakeSound();
    triggerHapticWarning();

    // Reveal the correct solution for 1 second as specified in PRD Section 21
    setHighlightedBlockIds(new Set(puzzle.solutionBlockIds));
    setIsTimedOut(true);
    setStreak(0); // Streak resets on timeout
  };

  // Continue after timeout
  const handleRetryAfterTimeout = () => {
    const nextDiff = adaptDifficultyOnFailure(difficulty);
    loadNextPuzzle(nextDiff);
  };

  // Handle block tap
  const handleBlockPress = (block: Block) => {
    if (isSuccess || isTimedOut || isTransitioningRef.current) return;

    playTapSound();
    triggerHapticTap();

    const nextSelected = new Set(selectedBlockIds);
    if (nextSelected.has(block.id)) {
      nextSelected.delete(block.id);
    } else {
      nextSelected.add(block.id);
    }
    setSelectedBlockIds(nextSelected);

    // Calculate sum of selected blocks
    const currentSum = Array.from(nextSelected).reduce((sum, id) => {
      const b = puzzle.blocks.find((blk) => blk.id === id);
      return sum + (b ? b.value : 0);
    }, 0);

    // 1. EXACT SNAP (Success!)
    if (currentSum === puzzle.target) {
      isTransitioningRef.current = true;
      setIsSuccess(true);

      const solveTime = (Date.now() - roundStartTimeRef.current) / 1000;
      const nextStreak = streak + 1;
      const newSolves = solvesCount + 1;

      // Audio & Haptics
      if (isStreakOnFire(nextStreak)) {
        playStreakSound();
      } else {
        playCorrectSound();
      }
      triggerHapticSuccess();

      // Calculate deterministic score
      const breakdown = calculateRoundScore(
        timeRemaining,
        puzzle.maxTimeSeconds,
        nextSelected.size,
        nextStreak
      );

      const newScore = score + breakdown.totalRoundPoints;
      setScore(newScore);
      setStreak(nextStreak);
      setSolvesCount(newSolves);

      recordRoundSolved(solveTime, nextStreak);

      // Adaptive difficulty
      const nextDiff = adaptDifficultyOnSuccess(difficulty, solveTime);

      // Smooth, immediate transition under 400ms (PRD Section 20)
      setTimeout(() => {
        loadNextPuzzle(nextDiff);
      }, 380);
      return;
    }

    // 2. EXCEEDED TARGET (Mistake/Warning)
    if (currentSum > puzzle.target) {
      playMistakeSound();
      triggerHapticWarning();
      setIsShake(true);
      setTimeout(() => {
        setIsShake(false);
      }, 300);
    }
  };

  const handleExit = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    onSessionEnd(score, streak, solvesCount);
  };

  // Compute current total
  const currentTotal = Array.from(selectedBlockIds).reduce((sum, id) => {
    const b = puzzle.blocks.find((blk) => blk.id === id);
    return sum + (b ? b.value : 0);
  }, 0);

  const isExceeded = currentTotal > puzzle.target;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header: Score, Streak, Exit button */}
        <HeaderBar
          score={score}
          streak={streak}
          onExitPress={handleExit}
          showExit={true}
        />

        {/* Center Top: Target Display + Timer */}
        <View style={styles.targetSection}>
          <TargetDisplay
            target={puzzle.target}
            currentTotal={currentTotal}
            isSuccess={isSuccess}
            isExceeded={isExceeded}
          />
          <TimerBar
            remainingSeconds={timeRemaining}
            maxSeconds={puzzle.maxTimeSeconds}
          />
        </View>

        {/* Center: Grid Board */}
        <View style={styles.boardSection}>
          <BoardView
            gridSize={puzzle.gridSize}
            blocks={puzzle.blocks}
            selectedBlockIds={selectedBlockIds}
            highlightedBlockIds={highlightedBlockIds}
            isSuccess={isSuccess}
            isShake={isShake}
            onBlockPress={handleBlockPress}
            disabled={isSuccess || isTimedOut}
          />
        </View>

        {/* Bottom Status / Timeout action */}
        <View style={styles.footerSection}>
          {isTimedOut ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleRetryAfterTimeout}
              accessibilityRole="button"
              accessibilityLabel="Try Again"
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>TIME'S UP • TAP TO TRY AGAIN</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.hintContainer}>
              <Text style={styles.gridHintText}>
                {puzzle.gridSize}×{puzzle.gridSize} GRID • LEVEL {difficulty.level}
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  targetSection: {
    alignItems: 'center',
    width: '100%',
  },
  boardSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerSection: {
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  hintContainer: {
    alignItems: 'center',
  },
  gridHintText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.textMuted,
    textTransform: 'uppercase',
  },
  retryButton: {
    backgroundColor: THEME.surfaceHighlight,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: THEME.danger,
    alignItems: 'center',
  },
  retryText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: THEME.white,
  },
});
