import React from 'react';
import { StyleSheet, View } from 'react-native';
import { THEME } from '../game/constants';

interface TimerBarProps {
  remainingSeconds: number;
  maxSeconds: number;
  width?: number | string;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  remainingSeconds,
  maxSeconds,
  width = '82%',
}) => {
  const fraction = Math.max(0, Math.min(1, remainingSeconds / maxSeconds));
  const isUrgent = fraction <= 0.25;

  const barColor = isUrgent ? THEME.danger : fraction <= 0.5 ? THEME.warning : THEME.textPrimary;

  return (
    <View style={[styles.container, { width: width as any }]}>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.round(fraction * 100)}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginVertical: 10,
    height: 6,
  },
  track: {
    width: '100%',
    height: 4,
    backgroundColor: THEME.surfaceHighlight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});
