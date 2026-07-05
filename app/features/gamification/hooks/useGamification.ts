import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { xpProgressInLevel } from "../engine/xpEngine";
import type { LevelProgress } from "../types";

export type UserStatsWithProgress = {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | undefined;
  progress: LevelProgress;
};

export function useUserStats(): UserStatsWithProgress | null {
  const stats = useQuery(api.gamification.getUserStats, {});
  if (!stats) return null;

  return {
    totalXP: stats.totalXP,
    level: stats.level,
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    lastActivityDate: stats.lastActivityDate,
    progress: xpProgressInLevel(stats.totalXP),
  };
}

export function useAchievements() {
  return useQuery(api.gamification.getAchievements, {});
}
