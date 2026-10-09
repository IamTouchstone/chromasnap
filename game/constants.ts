import { ChromaColor, ColorDef, ColorValue } from './types';

export const THEME = {
  background: '#101010',
  surface: '#1A1A1A',
  surfaceHighlight: '#262626',
  surfaceBorder: '#2E2E2E',
  textPrimary: '#FFFFFF',
  textSecondary: '#A7A7A7',
  textMuted: '#666666',
  white: '#FFFFFF',
  danger: '#FF453A',
  warning: '#FFD60A',
  success: '#34C759',
  outlineSelected: '#FFFFFF',
};

export const COLOR_DEFINITIONS: Record<ChromaColor, ColorDef> = {
  RED: {
    color: 'RED',
    value: 1,
    hex: '#FF3B30',
    name: 'Red',
    textColor: '#FFFFFF',
  },
  BLUE: {
    color: 'BLUE',
    value: 2,
    hex: '#2F80FF',
    name: 'Blue',
    textColor: '#FFFFFF',
  },
  YELLOW: {
    color: 'YELLOW',
    value: 3,
    hex: '#FFD60A',
    name: 'Yellow',
    textColor: '#101010', // Dark contrast for yellow
  },
  GREEN: {
    color: 'GREEN',
    value: 4,
    hex: '#34C759',
    name: 'Green',
    textColor: '#FFFFFF',
  },
  PURPLE: {
    color: 'PURPLE',
    value: 5,
    hex: '#AF52DE',
    name: 'Purple',
    textColor: '#FFFFFF',
  },
};

export const COLOR_VALUES_ARRAY: ColorDef[] = [
  COLOR_DEFINITIONS.RED,
  COLOR_DEFINITIONS.BLUE,
  COLOR_DEFINITIONS.YELLOW,
  COLOR_DEFINITIONS.GREEN,
  COLOR_DEFINITIONS.PURPLE,
];

export const VALUE_TO_COLOR: Record<ColorValue, ChromaColor> = {
  1: 'RED',
  2: 'BLUE',
  3: 'YELLOW',
  4: 'GREEN',
  5: 'PURPLE',
};
