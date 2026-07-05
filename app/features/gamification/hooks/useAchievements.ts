import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ACHIEVEMENT_MAP, type AchievementDef } from "@/constants/achievements";

type UnlockedAchievement = {
  _id: string;
  achievementId: string;
  unlockedAt: number;
  def: AchievementDef | null;
};

export function useAchievements() {
  const raw = useQuery(api.achievements.getUserAchievements) ?? [];

  const unlocked: UnlockedAchievement[] = (raw as { _id: string; achievementId: string; unlockedAt: number }[])
    .map((a) => ({
      ...a,
      def: ACHIEVEMENT_MAP[a.achievementId] ?? null,
    }))
    // Filter out daily_combo_YYYY-MM-DD entries (keep only named achievements)
    .filter((a) => a.def !== null);

  const unlockedIds = new Set(unlocked.map((a) => a.achievementId));
  const count = unlocked.length;

  return { unlocked, unlockedIds, count };
}
