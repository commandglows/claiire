import { useEffect, useRef } from "react";
import { useUserStats } from "./useGamification";
import { useCelebrationStore } from "../store/celebrationStore";
import type { CelebrationData } from "../store/celebrationStore";

/**
 * Detects level changes and streak milestones, fires celebration overlay.
 * Call once in a top-level component (e.g., AccueilScreen).
 */
export function useLevelUp() {
  const stats = useUserStats();
  const prevLevel = useRef<number | null>(null);
  const prevStreak = useRef<number | null>(null);
  const show = useCelebrationStore((s) => s.show);

  useEffect(() => {
    if (!stats) return;

    // On first load, just record values
    if (prevLevel.current === null) {
      prevLevel.current = stats.level;
      prevStreak.current = stats.currentStreak;
      return;
    }

    const celebrations: CelebrationData[] = [];

    // Level up
    if (stats.level > prevLevel.current) {
      celebrations.push({
        type: "level_up",
        emoji: "⬆️",
        title: `Niveau ${stats.level} !`,
        subtitle: "Tu continues de progresser. Chaque action te rapproche de la victoire.",
        xpBonus: 0,
      });
    }

    // Streak milestones
    const prev = prevStreak.current ?? 0;
    if (stats.currentStreak >= 30 && prev < 30) {
      celebrations.push({
        type: "streak_30",
        emoji: "👑",
        title: "30 jours de série !",
        subtitle: "Un mois entier sans lâcher. Tu es une légende.",
        xpBonus: 500,
      });
    } else if (stats.currentStreak >= 7 && prev < 7) {
      celebrations.push({
        type: "streak_7",
        emoji: "🔥",
        title: "7 jours de série !",
        subtitle: "Une semaine complète. Ta discipline est en acier.",
        xpBonus: 100,
      });
    } else if (stats.currentStreak >= 3 && prev < 3) {
      celebrations.push({
        type: "streak_3",
        emoji: "💪",
        title: "3 jours de série !",
        subtitle: "Le début de l'élan. Ne lâche rien.",
        xpBonus: 25,
      });
    }

    // Fire celebrations (queued)
    for (const c of celebrations) {
      show(c);
    }

    prevLevel.current = stats.level;
    prevStreak.current = stats.currentStreak;
  }, [stats?.level, stats?.currentStreak, show]);
}
