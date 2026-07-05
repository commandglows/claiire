import type { StreakStatus } from "../types";

/**
 * Calculate current streak from an array of unique YYYY-MM-DD date strings.
 * Counts consecutive days ending at the last date in the array.
 */
export function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const unique = [...new Set(dates)].sort();
  let streak = 1;

  for (let i = unique.length - 1; i > 0; i--) {
    const diffMs =
      new Date(unique[i]).getTime() - new Date(unique[i - 1]).getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * A streak is still active if the last activity was today or yesterday.
 * Both dates are YYYY-MM-DD strings.
 */
export function isStreakActive(lastActivityDate: string, today: string): boolean {
  const diffMs =
    new Date(today).getTime() - new Date(lastActivityDate).getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 1;
}

/**
 * Bonus XP awarded at streak milestones.
 * Only awarded once per milestone (caller must check it hasn't been given).
 */
export function streakMilestoneBonus(streak: number): number {
  if (streak === 30) return 500;
  if (streak === 7) return 100;
  if (streak === 3) return 25;
  return 0;
}

/** Full streak status for a user. */
export function getStreakStatus(
  dates: string[],
  today: string,
): StreakStatus {
  const currentStreak = calculateStreak(dates);
  const lastDate = dates.length > 0 ? [...dates].sort().at(-1)! : "";
  const active = lastDate ? isStreakActive(lastDate, today) : false;

  return {
    currentStreak: active ? currentStreak : 0,
    isActive: active,
    bonusXP: streakMilestoneBonus(currentStreak),
  };
}
