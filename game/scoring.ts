import { ScoreBreakdown } from './types';

export function calculateRoundScore(
  timeRemainingSeconds: number,
  maxTimeSeconds: number,
  blockCountUsed: number,
  streak: number
): ScoreBreakdown {
  const base = 100;

  // Speed bonus: up to +100 proportional to remaining time
  const timeRatio = Math.max(0, Math.min(1, timeRemainingSeconds / maxTimeSeconds));
  const speedBonus = Math.round(timeRatio * 100);

  // Efficiency bonus: +25 for compact solutions (<= 2 blocks), +10 for 3 blocks
  let efficiencyBonus = 0;
  if (blockCountUsed <= 2) {
    efficiencyBonus = 25;
  } else if (blockCountUsed === 3) {
    efficiencyBonus = 10;
  }

  // Round points before streak multiplier
  const roundBase = base + speedBonus + efficiencyBonus;

  // Streak multiplier applied to round points (e.g. streak 1 => x1, streak 2 => x1.2 or incremental points)
  // To match PRD "SCORE 2,450, STREAK x7", streak gives bonus scaling:
  const streakBonusMultiplier = 1 + Math.min(streak - 1, 15) * 0.2;
  const totalRoundPoints = Math.round(roundBase * streakBonusMultiplier);

  return {
    base,
    speedBonus,
    efficiencyBonus,
    totalRoundPoints,
  };
}

export function formatScore(score: number): string {
  return score.toLocaleString('en-US');
}

export function isStreakOnFire(streak: number): boolean {
  return streak >= 10;
}
