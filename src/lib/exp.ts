import { LEVEL_DIVISOR } from '@/types';

/**
 * totalExp からレベルを算出
 * level = Math.floor(Math.sqrt(totalExp / 20)) + 1
 */
export function calculateLevel(totalExp: number): number {
  return Math.floor(Math.sqrt(totalExp / LEVEL_DIVISOR)) + 1;
}

/**
 * 指定レベルに到達するために必要な totalExp の閾値
 * level = floor(sqrt(exp / N)) + 1 の逆算:
 *   exp = (level - 1)^2 * N
 */
export function expThresholdForLevel(level: number): number {
  return (level - 1) ** 2 * LEVEL_DIVISOR;
}

/**
 * 現在の totalExp に対する、次のレベルまでの進捗率 (0〜1)
 */
export function progressToNextLevel(totalExp: number): number {
  const currentLevel = calculateLevel(totalExp);
  const currentThreshold = expThresholdForLevel(currentLevel);
  const nextThreshold = expThresholdForLevel(currentLevel + 1);
  const range = nextThreshold - currentThreshold;
  if (range <= 0) return 0;
  return (totalExp - currentThreshold) / range;
}
