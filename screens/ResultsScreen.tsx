import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { THEME } from '../game/constants';
import { ChromaButton } from '../components/ChromaButton';
import { formatScore } from '../game/scoring';
import { StoredSettings } from '../game/types';

interface ResultsScreenProps {
  score: number;
  streak: number;
  solves: number;
  level?: number;
  settings: StoredSettings;
  onPlayAgain: () => void;
  onHomePress: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  streak,
  solves,
  level = 1,
  settings,
  onPlayAgain,
  onHomePress,
}) => {
  const isNewBestScore = score > 0 && score >= settings.bestScore;
  const isNewBestLevel = level > 1 && level >= (settings.bestLevel || 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topSection}>
          <Text style={styles.eyebrow}>RUN COMPLETE</Text>
          {isNewBestScore && (
            <View style={styles.newBestBadge}>
              <Text style={styles.newBestText}>★ NEW BEST SCORE ★</Text>
            </View>
          )}
          {!isNewBestScore && isNewBestLevel && (
            <View style={styles.newBestBadge}>
              <Text style={styles.newBestText}>★ NEW BEST LEVEL ★</Text>
            </View>
          )}
        </View>

        {/* Center Stats Display */}
        <View style={styles.centerSection}>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text style={styles.scoreNumber}>{formatScore(score)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.subStatBlock}>
              <Text style={styles.subStatLabel}>LEVEL</Text>
              <Text style={styles.subStatValue}>{level}</Text>
            </View>

            <View style={styles.subStatBlock}>
              <Text style={styles.subStatLabel}>BEST</Text>
              <Text style={styles.subStatValue}>{formatScore(settings.bestScore)}</Text>
            </View>

            <View style={styles.subStatBlock}>
              <Text style={styles.subStatLabel}>STREAK</Text>
              <Text style={styles.subStatValue}>×{streak}</Text>
            </View>

            <View style={styles.subStatBlock}>
              <Text style={styles.subStatLabel}>SOLVES</Text>
              <Text style={styles.subStatValue}>{solves}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Actions: PLAY AGAIN & HOME */}
        <View style={styles.bottomSection}>
          <ChromaButton
            title="PLAY AGAIN"
            size="large"
            variant="primary"
            onPress={onPlayAgain}
            style={styles.playAgainBtn}
          />
          <View style={{ height: 16 }} />
          <ChromaButton
            title="HOME"
            size="medium"
            variant="outline"
            onPress={onHomePress}
            style={styles.homeBtn}
          />
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
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 4,
    color: THEME.textSecondary,
    textTransform: 'uppercase',
  },
  newBestBadge: {
    backgroundColor: THEME.warning,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 10,
  },
  newBestText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#101010',
    letterSpacing: 1.5,
  },
  centerSection: {
    alignItems: 'center',
    width: '100%',
  },
  statBlock: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
    color: THEME.textSecondary,
  },
  scoreNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: THEME.textPrimary,
    letterSpacing: -1,
    marginTop: 4,
  },
  divider: {
    width: '70%',
    height: 1,
    backgroundColor: THEME.surfaceBorder,
    marginVertical: 28,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  subStatBlock: {
    alignItems: 'center',
    minWidth: 80,
  },
  subStatLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.textSecondary,
  },
  subStatValue: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.textPrimary,
    marginTop: 4,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  playAgainBtn: {
    width: 240,
    height: 64,
    borderRadius: 18,
  },
  homeBtn: {
    width: 160,
  },
});
