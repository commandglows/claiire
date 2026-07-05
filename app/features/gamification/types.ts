export type XPAction =
  | "sleep_log"
  | "sleep_log_with_notes"
  | "mood_log"
  | "mood_log_with_trigger"
  | "mood_log_with_notes"
  | "crisis_log"
  | "habit_complete"
  | "habit_streak_7"
  | "habit_streak_30"
  | "daily_combo";

export type LevelProgress = {
  level: number;
  totalXP: number;
  currentInLevel: number;
  requiredInLevel: number;
  percentage: number;
  xpToNext: number;
};

export type StreakStatus = {
  currentStreak: number;
  isActive: boolean;
  bonusXP: number;
};
