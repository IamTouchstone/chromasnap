export type ChromaColor = 'RED' | 'BLUE' | 'YELLOW' | 'GREEN' | 'PURPLE';

export type ColorValue = 1 | 2 | 3 | 4 | 5;

export interface ColorDef {
  color: ChromaColor;
  value: ColorValue;
  hex: string;
  name: string;
  textColor: string;
}

export interface Block {
  id: string;
  color: ChromaColor;
  value: ColorValue;
  row: number;
  col: number;
}

export type GridSize = 3 | 4 | 5;

export interface Puzzle {
  gridSize: GridSize;
  blocks: Block[];
  target: number;
  solutionBlockIds: string[];
  maxTimeSeconds: number;
}

export interface DifficultyState {
  level: number;
  gridSize: GridSize;
  minTarget: number;
  maxTarget: number;
  targetBlockCountMin: number;
  targetBlockCountMax: number;
  timeLimitSeconds: number;
  consecutiveSuccesses: number;
  consecutiveFailures: number;
}

export interface ScoreBreakdown {
  base: number;
  speedBonus: number;
  efficiencyBonus: number;
  totalRoundPoints: number;
}

export interface StoredSettings {
  bestScore: number;
  bestStreak: number;
  gamesPlayed: number;
  correctAnswers: number;
  bestSolveTime: number | null; // in seconds
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  tutorialComplete: boolean;
  dailySeedDate: string | null;
}

export type ScreenName = 'SPLASH' | 'HOME' | 'TUTORIAL' | 'GAME' | 'RESULTS';
