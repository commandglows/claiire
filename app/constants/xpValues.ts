// XP values — frontend constants (mirror of convex/xpValues.ts)
export const XP = {
  SLEEP_LOG: 15,
  MOOD_LOG: 10,
  CRISIS_LOG: 10,
  HABIT_COMPLETE: 20,
  HABIT_STREAK_7: 100,
  HABIT_STREAK_30: 500,
  DAILY_COMBO: 50,         // all missions done in a day
  LOG_WITH_TRIGGER: 5,     // bonus when trigger is identified
  LOG_WITH_NOTES: 5,       // bonus when notes added
} as const;

export type XPKey = keyof typeof XP;
