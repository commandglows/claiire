import { XP } from "@/constants/xpValues";
import type { LevelProgress, XPAction } from "../types";

/**
 * XP required to REACH level n (cumulative total).
 * Progression: each level gap = 100 * n
 *   Level 1 →  0 XP total
 *   Level 2 → 100 XP total  (gap: 100)
 *   Level 3 → 300 XP total  (gap: 200)
 *   Level 4 → 600 XP total  (gap: 300)
 *   Level n → 100 * n*(n-1)/2
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return (100 * level * (level - 1)) / 2;
}

/** Level from a cumulative XP total (always >= 1). */
export function calculateLevel(totalXP: number): number {
  if (totalXP <= 0) return 1;
  let level = 1;
  while (xpForLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
}

/** XP needed to advance to the next level. */
export function xpToNextLevel(totalXP: number): number {
  const level = calculateLevel(totalXP);
  return xpForLevel(level + 1) - totalXP;
}

/** Progress within the current level. */
export function xpProgressInLevel(totalXP: number): LevelProgress {
  const level = calculateLevel(totalXP);
  const levelStart = xpForLevel(level);
  const levelEnd = xpForLevel(level + 1);
  const requiredInLevel = levelEnd - levelStart;
  const currentInLevel = totalXP - levelStart;
  const percentage = Math.round((currentInLevel / requiredInLevel) * 100);

  return {
    level,
    totalXP,
    currentInLevel,
    requiredInLevel,
    percentage,
    xpToNext: levelEnd - totalXP,
  };
}

/** XP reward for a given action. */
export function calculateXPReward(action: XPAction): number {
  const rewards: Record<XPAction, number> = {
    sleep_log: XP.SLEEP_LOG,
    sleep_log_with_notes: XP.SLEEP_LOG + XP.LOG_WITH_NOTES,
    mood_log: XP.MOOD_LOG,
    mood_log_with_trigger: XP.MOOD_LOG + XP.LOG_WITH_TRIGGER,
    mood_log_with_notes: XP.MOOD_LOG + XP.LOG_WITH_NOTES,
    crisis_log: XP.CRISIS_LOG,
    habit_complete: XP.HABIT_COMPLETE,
    habit_streak_7: XP.HABIT_STREAK_7,
    habit_streak_30: XP.HABIT_STREAK_30,
    daily_combo: XP.DAILY_COMBO,
  };
  return rewards[action];
}
