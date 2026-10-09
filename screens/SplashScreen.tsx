import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { THEME, COLOR_DEFINITIONS } from '../game/constants';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const block1Anim = useRef(new Animated.Value(0)).current;
  const block2Anim = useRef(new Animated.Value(0)).current;
  const block3Anim = useRef(new Animated.Value(0)).current;
  const block4Anim = useRef(new Animated.Value(0)).current;
  const yellowAnim = useRef(new Animated.Value(0)).current;
  const logoTextAnim = useRef(new Animated.Value(0)).current;
  const containerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Four blocks appear one by one, align, compress into logo, wordmark fades in (total < 1.3s)
    Animated.sequence([
      Animated.stagger(80, [
        Animated.spring(block1Anim, { toValue: 1, friction: 6, useNativeDriver: true }),
        Animated.spring(block2Anim, { toValue: 1, friction: 6, useNativeDriver: true }),
        Animated.spring(block3Anim, { toValue: 1, friction: 6, useNativeDriver: true }),
        Animated.spring(block4Anim, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(yellowAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(logoTextAnim, { toValue: 1, duration: 240, useNativeDriver: true }),
      ]),
      Animated.delay(350),
      Animated.timing(containerAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  const blockSize = 48;
  const gap = 10;

  return (
    <Animated.View style={[styles.container, { opacity: containerAnim }]}>
      <View style={styles.content}>
        {/* Geometric Emblem Animation */}
        <View style={styles.emblemWrapper}>
          <View style={styles.emblemRow}>
            <Animated.View
              style={[
                styles.block,
                {
                  width: blockSize,
                  height: blockSize,
                  backgroundColor: COLOR_DEFINITIONS.RED.hex,
                  marginRight: gap,
                  transform: [{ scale: block1Anim }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.block,
                {
                  width: blockSize,
                  height: blockSize,
                  backgroundColor: COLOR_DEFINITIONS.BLUE.hex,
                  transform: [{ scale: block2Anim }],
                },
              ]}
            />
          </View>
          <View style={[styles.emblemRow, { marginTop: gap }]}>
            <Animated.View
              style={[
                styles.block,
                {
                  width: blockSize,
                  height: blockSize,
                  backgroundColor: COLOR_DEFINITIONS.GREEN.hex,
                  marginRight: gap,
                  transform: [{ scale: block3Anim }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.block,
                {
                  width: blockSize,
                  height: blockSize,
                  backgroundColor: COLOR_DEFINITIONS.PURPLE.hex,
                  transform: [{ scale: block4Anim }],
                },
              ]}
            />
          </View>

          {/* Yellow Center Accent */}
          <Animated.View
            style={[
              styles.centerAccent,
              {
                backgroundColor: COLOR_DEFINITIONS.YELLOW.hex,
                transform: [{ scale: yellowAnim }],
              },
            ]}
          />
        </View>

        {/* Wordmark */}
        <Animated.View style={{ opacity: logoTextAnim, marginTop: 32, alignItems: 'center' }}>
          <Text style={styles.brandTitle}>CHROMA SNAP</Text>
          <Text style={styles.tagline}>SEE • THINK • SNAP</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: THEME.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  content: {
    alignItems: 'center',
  },
  emblemWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emblemRow: {
    flexDirection: 'row',
  },
  block: {
    borderRadius: 14,
  },
  centerAccent: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    borderColor: THEME.background,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 4,
    color: THEME.textPrimary,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    color: THEME.textSecondary,
    marginTop: 8,
  },
});
