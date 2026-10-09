import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Block, ColorValue } from '../game/types';
import { COLOR_DEFINITIONS, THEME } from '../game/constants';

interface BlockViewProps {
  block: Block;
  size: number;
  isSelected: boolean;
  isSuccess: boolean;
  isShake: boolean;
  onPress: (block: Block) => void;
  disabled?: boolean;
}

export const BlockView: React.FC<BlockViewProps> = ({
  block,
  size,
  isSelected,
  isSuccess,
  isShake,
  onPress,
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const colorDef = COLOR_DEFINITIONS[block.color];

  // Selection scale animation
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.05 : 1,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  }, [isSelected]);

  // Success snap animation
  useEffect(() => {
    if (isSuccess && isSelected) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.88,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSuccess]);

  // Shake animation on error/exceeded
  useEffect(() => {
    if (isShake && isSelected) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 6, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 4, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -4, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]).start();
    }
  }, [isShake]);

  // Dot color: Yellow needs dark dots, others need crisp white
  const dotColor = block.color === 'YELLOW' ? '#141414' : '#FFFFFF';
  const dotSize = Math.max(5, Math.round(size * 0.11));

  const renderDots = (val: ColorValue) => {
    const dotStyle = [styles.dot, { width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: dotColor }];

    switch (val) {
      case 1:
        return (
          <View style={styles.dotCenter}>
            <View style={dotStyle} />
          </View>
        );
      case 2:
        return (
          <View style={styles.dotRow}>
            <View style={dotStyle} />
            <View style={[styles.spacer, { width: dotSize * 1.5 }]} />
            <View style={dotStyle} />
          </View>
        );
      case 3:
        return (
          <View style={styles.dotColumn}>
            <View style={styles.dotCenter}>
              <View style={dotStyle} />
            </View>
            <View style={[styles.dotRow, { marginTop: dotSize * 0.8 }]}>
              <View style={dotStyle} />
              <View style={[styles.spacer, { width: dotSize * 1.8 }]} />
              <View style={dotStyle} />
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.dotGrid2x2}>
            <View style={styles.dotRow}>
              <View style={dotStyle} />
              <View style={[styles.spacer, { width: dotSize * 1.4 }]} />
              <View style={dotStyle} />
            </View>
            <View style={[styles.spacer, { height: dotSize * 1.4 }]} />
            <View style={styles.dotRow}>
              <View style={dotStyle} />
              <View style={[styles.spacer, { width: dotSize * 1.4 }]} />
              <View style={dotStyle} />
            </View>
          </View>
        );
      case 5:
        return (
          <View style={styles.dotGridQuincunx}>
            <View style={styles.dotRow}>
              <View style={dotStyle} />
              <View style={[styles.spacer, { width: dotSize * 1.6 }]} />
              <View style={dotStyle} />
            </View>
            <View style={[styles.dotCenter, { marginVertical: dotSize * 0.4 }]}>
              <View style={dotStyle} />
            </View>
            <View style={styles.dotRow}>
              <View style={dotStyle} />
              <View style={[styles.spacer, { width: dotSize * 1.6 }]} />
              <View style={dotStyle} />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const borderRadius = Math.max(10, Math.round(size * 0.22));

  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          { translateX: shakeAnim },
        ],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPress(block)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${colorDef.name} block value ${block.value}`}
        style={[
          styles.block,
          {
            width: size,
            height: size,
            borderRadius,
            backgroundColor: colorDef.hex,
            borderWidth: isSelected ? 3.5 : 0,
            borderColor: THEME.outlineSelected,
          },
        ]}
      >
        {renderDots(block.value)}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  block: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  dot: {
    opacity: 0.95,
  },
  dotCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotGrid2x2: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotGridQuincunx: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {},
});
