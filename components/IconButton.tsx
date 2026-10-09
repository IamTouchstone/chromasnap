import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  View,
} from 'react-native';
import { THEME } from '../game/constants';
import { playButtonSound } from '../services/audio';
import { triggerHapticButton } from '../services/haptics';

interface IconButtonProps {
  iconType: 'sound-on' | 'sound-off' | 'haptics-on' | 'haptics-off' | 'help' | 'home';
  onPress: () => void;
  accessibilityLabel: string;
  size?: number;
  active?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  iconType,
  onPress,
  accessibilityLabel,
  size = 48,
  active = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.9, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    playButtonSound();
    triggerHapticButton();
    onPress();
  };

  const renderIconContent = () => {
    switch (iconType) {
      case 'sound-on':
        return <Text style={styles.iconChar}>🔊</Text>;
      case 'sound-off':
        return <Text style={styles.iconChar}>🔇</Text>;
      case 'haptics-on':
        return <Text style={styles.iconChar}>📳</Text>;
      case 'haptics-off':
        return <Text style={styles.iconChar}>📴</Text>;
      case 'help':
        return <Text style={[styles.iconChar, { fontSize: 18, fontWeight: '900' }]}>?</Text>;
      case 'home':
        return <Text style={styles.iconChar}>⌂</Text>;
      default:
        return null;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: active ? THEME.surfaceHighlight : THEME.surface,
          },
        ]}
      >
        {renderIconContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
  },
  iconChar: {
    color: THEME.textPrimary,
    fontSize: 18,
  },
});
