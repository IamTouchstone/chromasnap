import { DifficultyState, GridSize } from './types';

export const INITIAL_DIFFICULTY: DifficultyState = {
  level: 1,
  gridSize: 3,
  minTarget: 3,
  maxTarget: 5,
  targetBlockCountMin: 2,
  targetBlockCountMax: 2,
  timeLimitSeconds: 15,
  consecutiveSuccesses: 0,
  consecutiveFailures: 0,
};

export function getDifficultyForLevel(level: number): Omit<DifficultyState, 'consecutiveSuccesses' | 'consecutiveFailures'> {
  if (level <= 1) {
    return {
      level: 1,
      gridSize: 3,
      minTarget: 3,
      maxTarget: 5,
      targetBlockCountMin: 2,
      targetBlockCountMax: 2,
      timeLimitSeconds: 15,
    };
  }

  if (level === 2) {
    return {
      level: 2,
      gridSize: 3,
      minTarget: 4,
      maxTarget: 7,
      targetBlockCountMin: 2,
      targetBlockCountMax: 3,
      timeLimitSeconds: 12,
    };
  }

  if (level === 3) {
    return {
      level: 3,
      gridSize: 3,
      minTarget: 5,
      maxTarget: 9,
      targetBlockCountMin: 2,
      targetBlockCountMax: 3,
      timeLimitSeconds: 10,
    };
  }

  if (level === 4) {
    return {
      level: 4,
      gridSize: 4,
      minTarget: 6,
      maxTarget: 11,
      targetBlockCountMin: 2,
      targetBlockCountMax: 4,
      timeLimitSeconds: 8,
    };
  }

  if (level === 5) {
    return {
      level: 5,
      gridSize: 4,
      minTarget: 7,
      maxTarget: 14,
      targetBlockCountMin: 2,
      targetBlockCountMax: 4,
      timeLimitSeconds: 7,
    };
  }

  // Level 6+: Advanced 5x5 board or high speed 4x4
  const gridSize: GridSize = level >= 7 ? 5 : 4;
  return {
    level,
    gridSize,
    minTarget: 8,
    maxTarget: Math.min(18, 12 + Math.floor((level - 5) * 1.5)),
    targetBlockCountMin: 2,
    targetBlockCountMax: Math.min(5, 3 + Math.floor((level - 4) / 2)),
    timeLimitSeconds: Math.max(5, 7 - Math.floor((level - 5) * 0.5)),
  };
}

export function adaptDifficultyOnSuccess(current: DifficultyState, solveTimeSeconds: number): DifficultyState {
  const successes = current.consecutiveSuccesses + 1;
  // If player solves quickly (e.g. within 60% of time limit) and has 2 consecutive successes, advance level
  const isFast = solveTimeSeconds <= current.timeLimitSeconds * 0.6;
  const threshold = isFast ? 2 : 3;

  if (successes >= threshold) {
    const nextLevel = current.level + 1;
    const nextConfig = getDifficultyForLevel(nextLevel);
    return {
      ...nextConfig,
      consecutiveSuccesses: 0,
      consecutiveFailures: 0,
    };
  }

  return {
    ...current,
    consecutiveSuccesses: successes,
    consecutiveFailures: 0,
  };
}

export function adaptDifficultyOnFailure(current: DifficultyState): DifficultyState {
  const failures = current.consecutiveFailures + 1;

  if (failures >= 2 && current.level > 1) {
    // Step back one level to relieve frustration
    const prevLevel = current.level - 1;
    const prevConfig = getDifficultyForLevel(prevLevel);
    return {
      ...prevConfig,
      consecutiveSuccesses: 0,
      consecutiveFailures: 0,
    };
  }

  return {
    ...current,
    consecutiveSuccesses: 0,
    consecutiveFailures: failures,
  };
}
