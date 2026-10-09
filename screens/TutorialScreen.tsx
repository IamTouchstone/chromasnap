import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { THEME, COLOR_DEFINITIONS } from '../game/constants';
import { Block, ColorValue } from '../game/types';
import { BlockView } from '../components/BlockView';
import { TargetDisplay } from '../components/TargetDisplay';
import { playCorrectSound, playTapSound } from '../services/audio';
import { triggerHapticSuccess, triggerHapticTap } from '../services/haptics';

interface TutorialScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const TutorialScreen: React.FC<TutorialScreenProps> = ({
  onComplete,
  onSkip,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSuccess, setIsSuccess] = useState(false);

  // 3 Tutorial blocks: RED (1), BLUE (2), YELLOW (3)
  const tutorialBlocks: Block[] = [
    { id: 'tut-red', color: 'RED', value: 1, row: 0, col: 0 },
    { id: 'tut-blue', color: 'BLUE', value: 2, row: 0, col: 1 },
    { id: 'tut-yellow', color: 'YELLOW', value: 3, row: 0, col: 2 },
  ];

  const target = 4;

  const currentTotal = Array.from(selectedIds).reduce((sum, id) => {
    const b = tutorialBlocks.find((blk) => blk.id === id);
    return sum + (b ? b.value : 0);
  }, 0);

  const handleBlockPress = (block: Block) => {
    playTapSound();
    triggerHapticTap();

    const next = new Set(selectedIds);
    if (next.has(block.id)) {
      next.delete(block.id);
    } else {
      next.add(block.id);
    }
    setSelectedIds(next);

    const newTotal = Array.from(next).reduce((sum, id) => {
      const b = tutorialBlocks.find((blk) => blk.id === id);
      return sum + (b ? b.value : 0);
    }, 0);

    // If total equals 4: Trigger success!
    if (newTotal === target) {
      setIsSuccess(true);
      playCorrectSound();
      triggerHapticSuccess();
      setTimeout(() => {
        onComplete();
      }, 700);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Skip Button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={onSkip}
            accessibilityRole="button"
            accessibilityLabel="Skip tutorial"
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>SKIP</Text>
          </TouchableOpacity>
        </View>

        {/* Headline */}
        <View style={styles.header}>
          <Text style={styles.headline}>MAKE THE NUMBER.</Text>
          <Text style={styles.subheadline}>Tap blocks whose hidden values add to the target.</Text>
        </View>

        {/* Target display */}
        <View style={styles.targetSection}>
          <TargetDisplay
            target={target}
            currentTotal={currentTotal}
            isSuccess={isSuccess}
            isExceeded={currentTotal > target}
          />
        </View>

        {/* 3 Tutorial Blocks */}
        <View style={styles.blocksContainer}>
          <View style={styles.blocksRow}>
            {tutorialBlocks.map((b) => (
              <View key={b.id} style={styles.blockWrapper}>
                <BlockView
                  block={b}
                  size={84}
                  isSelected={selectedIds.has(b.id)}
                  isSuccess={isSuccess}
                  isShake={false}
                  onPress={handleBlockPress}
                />
                <Text style={styles.blockHint}>
                  {b.color} = {b.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Visual Tip */}
        <View style={styles.footer}>
          {isSuccess ? (
            <Text style={[styles.guideText, { color: THEME.success }]}>
              SNAP! EXACTLY 4. READY FOR PLAY.
            </Text>
          ) : (
            <Text style={styles.guideText}>
              TAP RED (1) + YELLOW (3) = 4
            </Text>
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
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  topBar: {
    alignItems: 'flex-end',
    paddingHorizontal: 8,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: THEME.surfaceHighlight,
  },
  skipText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.textSecondary,
    letterSpacing: 1.5,
  },
  header: {
    alignItems: 'center',
    marginVertical: 10,
  },
  headline: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 2,
    color: THEME.textPrimary,
  },
  subheadline: {
    fontSize: 13,
    color: THEME.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  targetSection: {
    alignItems: 'center',
  },
  blocksContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  blocksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockWrapper: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  blockHint: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.textSecondary,
    marginTop: 10,
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 30,
  },
  guideText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: THEME.textSecondary,
  },
});
