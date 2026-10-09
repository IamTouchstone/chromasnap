import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { THEME } from '../game/constants';
import { playButtonSound } from '../services/audio';
import { triggerHapticButton } from '../services/haptics';

interface ChromaButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'large' | 'medium' | 'small';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export const ChromaButton: React.FC<ChromaButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  style,
  textStyle,
  disabled = false,
  accessibilityLabel,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handlePress = () => {
    playButtonSound();
    triggerHapticButton();
    onPress();
  };

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';

  const sizeStyles = {
    large: { height: 60, paddingHorizontal: 36, borderRadius: 16 },
    medium: { height: 48, paddingHorizontal: 24, borderRadius: 12 },
    small: { height: 38, paddingHorizontal: 16, borderRadius: 10 },
  }[size];

  const fontSizeStyles = {
    large: { fontSize: 18, letterSpacing: 2 },
    medium: { fontSize: 15, letterSpacing: 1.5 },
    small: { fontSize: 12, letterSpacing: 1 },
  }[size];

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        style={[
          styles.buttonBase,
          sizeStyles,
          isPrimary && styles.primaryBtn,
          variant === 'secondary' && styles.secondaryBtn,
          isOutline && styles.outlineBtn,
          isDanger && styles.dangerBtn,
          style,
        ]}
      >
        <Text
          style={[
            styles.textBase,
            fontSizeStyles,
            isPrimary && styles.primaryText,
            (variant === 'secondary' || isOutline) && styles.secondaryText,
            isDanger && styles.dangerText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textBase: {
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  primaryBtn: {
    backgroundColor: THEME.white,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryText: {
    color: '#000000',
  },
  secondaryBtn: {
    backgroundColor: THEME.surfaceHighlight,
  },
  secondaryText: {
    color: THEME.textPrimary,
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: THEME.surfaceBorder,
  },
  dangerBtn: {
    backgroundColor: THEME.danger,
  },
  dangerText: {
    color: '#FFFFFF',
  },
});
