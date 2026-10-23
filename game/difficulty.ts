import { DifficultyState, GridSize } from './types';

export function getTargetsRequiredForLevel(level: number): number {
  if (level <= 1) return 5;
  if (level === 2) return 6;
  if (level === 3) return 7;
  if (level === 4) return 8;
  if (level === 5) return 9;
  if (level === 6) return 10;
  if (level === 7) return 10;
  if (level === 8) return 11;
  return Math.min(15, 11 + Math.floor((level - 8) / 2));
}

export const INITIAL_DIFFICULTY: DifficultyState = {
  level: 1,
  gridSize: 3,
  minTarget: 3,
  maxTarget: 6,
  targetBlockCountMin: 2,
  targetBlockCountMax: 2,
  timeLimitSeconds: 15,
  targetsRequired: 5,
  consecutiveSuccesses: 0,
  consecutiveFailures: 0,
};

export function getDifficultyForLevel(level: number): Omit<DifficultyState, 'consecutiveSuccesses' | 'consecutiveFailures'> {
  const safeLevel = Math.max(1, Math.floor(level));
  const targetsRequired = getTargetsRequiredForLevel(safeLevel);

  if (safeLevel === 1) {
    return {
      level: 1,
      gridSize: 3,
      minTarget: 3,
      maxTarget: 6,
      targetBlockCountMin: 2,
      targetBlockCountMax: 2,
      timeLimitSeconds: 15,
      targetsRequired,
    };
  }

  if (safeLevel === 2) {
    return {
      level: 2,
      gridSize: 3,
      minTarget: 4,
      maxTarget: 8,
      targetBlockCountMin: 2,
      targetBlockCountMax: 3,
      timeLimitSeconds: 14,
      targetsRequired,
    };
  }

  if (safeLevel === 3) {
    return {
      level: 3,
      gridSize: 3,
      minTarget: 5,
      maxTarget: 10,
      targetBlockCountMin: 2,
      targetBlockCountMax: 3,
      timeLimitSeconds: 12,
      targetsRequired,
    };
  }

  if (safeLevel === 4) {
    return {
      level: 4,
      gridSize: 4,
      minTarget: 6,
      maxTarget: 13,
      targetBlockCountMin: 2,
      targetBlockCountMax: 4,
      timeLimitSeconds: 12,
      targetsRequired,
    };
  }

  if (safeLevel === 5) {
    return {
      level: 5,
      gridSize: 4,
      minTarget: 8,
      maxTarget: 16,
      targetBlockCountMin: 2,
      targetBlockCountMax: 4,
      timeLimitSeconds: 11,
      targetsRequired,
    };
  }

  if (safeLevel === 6) {
    return {
      level: 6,
      gridSize: 4,
      minTarget: 10,
      maxTarget: 20,
      targetBlockCountMin: 3,
      targetBlockCountMax: 5,
      timeLimitSeconds: 10,
      targetsRequired,
    };
  }

  if (safeLevel === 7) {
    return {
      level: 7,
      gridSize: 5,
      minTarget: 11,
      maxTarget: 22,
      targetBlockCountMin: 3,
      targetBlockCountMax: 5,
      timeLimitSeconds: 12,
      targetsRequired,
    };
  }

  if (safeLevel === 8) {
    return {
      level: 8,
      gridSize: 5,
      minTarget: 13,
      maxTarget: 25,
      targetBlockCountMin: 3,
      targetBlockCountMax: 6,
      timeLimitSeconds: 11,
      targetsRequired,
    };
  }

  if (safeLevel === 9) {
    return {
      level: 9,
      gridSize: 5,
      minTarget: 15,
      maxTarget: 28,
      targetBlockCountMin: 4,
      targetBlockCountMax: 6,
      timeLimitSeconds: 10,
      targetsRequired,
    };
  }

  if (safeLevel === 10) {
    return {
      level: 10,
      gridSize: 5,
      minTarget: 16,
      maxTarget: 31,
      targetBlockCountMin: 4,
      targetBlockCountMax: 7,
      timeLimitSeconds: 10,
      targetsRequired,
    };
  }

  // Level 11+: Infinite high-level scalability beyond standard bounds
  const extraLevels = safeLevel - 10;
  return {
    level: safeLevel,
    gridSize: 5,
    minTarget: Math.min(20, 16 + Math.floor(extraLevels * 0.5)),
    maxTarget: Math.min(36, 31 + Math.floor(extraLevels * 0.6)),
    targetBlockCountMin: Math.min(5, 4 + Math.floor(extraLevels / 4)),
    targetBlockCountMax: Math.min(8, 7 + Math.floor(extraLevels / 3)),
    timeLimitSeconds: Math.max(8, 10 - Math.floor(extraLevels / 5)),
    targetsRequired,
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
