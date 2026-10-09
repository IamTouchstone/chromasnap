import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../game/constants';
import { formatScore, isStreakOnFire } from '../game/scoring';

interface HeaderBarProps {
  score: number;
  streak: number;
  onExitPress?: () => void;
  showExit?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  score,
  streak,
  onExitPress,
  showExit = true,
}) => {
  const onFire = isStreakOnFire(streak);

  return (
    <View style={styles.container}>
      {/* Left: Exit/Close button */}
      <View style={styles.leftCol}>
        {showExit && onExitPress && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onExitPress}
            accessibilityRole="button"
            accessibilityLabel="Exit run"
            style={styles.exitButton}
          >
            <Text style={styles.exitText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Center: Score */}
      <View style={styles.centerCol}>
        <Text style={styles.label}>SCORE</Text>
        <Text style={styles.scoreValue}>{formatScore(score)}</Text>
      </View>

      {/* Right: Streak */}
      <View style={styles.rightCol}>
        <Text style={styles.label}>STREAK</Text>
        <View style={styles.streakRow}>
          <Text style={[styles.streakValue, onFire && styles.streakOnFire]}>
            ×{streak}
          </Text>
          {onFire && (
            <View style={styles.fireBadge}>
              <Text style={styles.fireBadgeText}>FIRE</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
  },
  leftCol: {
    width: 60,
    alignItems: 'flex-start',
  },
  centerCol: {
    alignItems: 'center',
  },
  rightCol: {
    width: 80,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.textPrimary,
    letterSpacing: 0.5,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakValue: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.textPrimary,
  },
  streakOnFire: {
    color: THEME.warning,
  },
  fireBadge: {
    backgroundColor: THEME.danger,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 5,
  },
  fireBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  exitButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: THEME.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitText: {
    color: THEME.textSecondary,
    fontSize: 16,
    fontWeight: '800',
  },
});
