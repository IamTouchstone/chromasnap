import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoredSettings } from '../game/types';

const STORAGE_KEY = '@chroma_snap_settings_v1';

const DEFAULT_SETTINGS: StoredSettings = {
  bestScore: 0,
  bestStreak: 0,
  bestLevel: 1,
  gamesPlayed: 0,
  correctAnswers: 0,
  bestSolveTime: null,
  soundEnabled: true,
  hapticsEnabled: true,
  tutorialComplete: false,
  dailySeedDate: null,
};

let memorySettings: StoredSettings = { ...DEFAULT_SETTINGS };

export async function loadStoredSettings(): Promise<StoredSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      memorySettings = {
        ...DEFAULT_SETTINGS,
        ...parsed,
      };
      return memorySettings;
    }
  } catch {
    // Fallback to in-memory defaults if storage read fails
  }
  return memorySettings;
}

export async function saveStoredSettings(newSettings: Partial<StoredSettings>): Promise<StoredSettings> {
  memorySettings = {
    ...memorySettings,
    ...newSettings,
  };
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(memorySettings));
  } catch {
    // Continue with in-memory state on persistence failure
  }
  return memorySettings;
}

export async function recordRoundSolved(solveTimeSeconds: number, streak: number): Promise<StoredSettings> {
  const current = memorySettings;
  const bestTime =
    current.bestSolveTime === null
      ? solveTimeSeconds
      : Math.min(current.bestSolveTime, solveTimeSeconds);

  return saveStoredSettings({
    correctAnswers: current.correctAnswers + 1,
    bestStreak: Math.max(current.bestStreak, streak),
    bestSolveTime: Number(bestTime.toFixed(2)),
  });
}

export async function recordGameEnd(
  finalScore: number,
  finalStreak: number,
  finalLevel: number = 1
): Promise<StoredSettings> {
  const current = memorySettings;
  return saveStoredSettings({
    gamesPlayed: current.gamesPlayed + 1,
    bestScore: Math.max(current.bestScore, finalScore),
    bestStreak: Math.max(current.bestStreak, finalStreak),
    bestLevel: Math.max(current.bestLevel || 1, finalLevel),
  });
}

export function getCachedSettings(): StoredSettings {
  return memorySettings;
}
