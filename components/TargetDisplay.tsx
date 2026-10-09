import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { THEME } from '../game/constants';

interface TargetDisplayProps {
  target: number;
  currentTotal: number;
  isSuccess: boolean;
  isExceeded: boolean;
}

export const TargetDisplay: React.FC<TargetDisplayProps> = ({
  target,
  currentTotal,
  isSuccess,
  isExceeded,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const totalColorAnim = useRef(new Animated.Value(0)).current;

  // New target entrance animation
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.15, duration: 120, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, [target]);

  // Success pop animation
  useEffect(() => {
    if (isSuccess) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.25, duration: 100, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    }
  }, [isSuccess]);

  // Exceeded warning animation
  useEffect(() => {
    if (isExceeded) {
      Animated.sequence([
        Animated.timing(totalColorAnim, { toValue: 1, duration: 60, useNativeDriver: false }),
        Animated.timing(totalColorAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
      ]).start();
    }
  }, [isExceeded]);

  const totalTextColor = isSuccess
    ? THEME.success
    : isExceeded
    ? THEME.danger
    : THEME.textSecondary;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>TARGET</Text>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={styles.targetNumber}>{target}</Text>
      </Animated.View>

      <View style={styles.totalContainer}>
        {isSuccess ? (
          <Text style={[styles.totalText, { color: THEME.success }]}>
            TOTAL {currentTotal}  ✓
          </Text>
        ) : (
          <Text style={[styles.totalText, { color: totalTextColor }]}>
            TOTAL {currentTotal > 0 ? currentTotal : '0'}
            {isExceeded ? '  (TOO HIGH)' : ''}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 3,
    color: THEME.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  targetNumber: {
    fontSize: 76,
    fontWeight: '900',
    color: THEME.textPrimary,
    lineHeight: 82,
    letterSpacing: -1,
  },
  totalContainer: {
    minHeight: 28,
    marginTop: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
