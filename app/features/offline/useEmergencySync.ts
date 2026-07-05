import { useEffect } from "react";
import { AppState } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCompanion } from "@/features/companion/hooks/useCompanion";
import {
  loadEmergencyCache,
  updateEmergencyCache,
  type CachedIntervention,
  type CachedHabit,
} from "./emergencyCache";

type InterventionStat = {
  interventionId: string;
  successRate: number | null;
};

type HabitData = {
  _id: string;
  name: string;
  icon?: string;
};

/**
 * Syncs critical data to the offline emergency cache.
 * Runs on mount and when app returns to foreground.
 * Call once in a top-level component.
 */
export function useEmergencySync() {
  const interventionStats = useQuery(api.interventions.getStats, {}) as InterventionStat[] | undefined;
  const habits = useQuery(api.habits.getActiveHabits, {}) as HabitData[] | undefined;
  const { personality } = useCompanion();

  // Load cache from disk on mount
  useEffect(() => {
    loadEmergencyCache();
  }, []);

  useEffect(() => {
    async function syncCache() {
      const interventions: CachedIntervention[] = [];

      const BUILTINS = [
        { id: "breathe", emoji: "🧘", title: "Respiration", desc: "Respiration carrée 4-4-4-4" },
        { id: "cold-water", emoji: "💧", title: "Eau froide", desc: "Poignets sous l'eau froide" },
        { id: "walk", emoji: "🚶", title: "Marche", desc: "5 minutes dehors" },
        { id: "call", emoji: "📞", title: "Appeler", desc: "Quelqu'un de confiance" },
        { id: "write", emoji: "✏️", title: "Écrire", desc: "Note ce qui se passe" },
        { id: "distraction", emoji: "🎮", title: "Diversion", desc: "Change-toi les idées" },
      ];

      for (const item of BUILTINS) {
        const stat = interventionStats?.find((s) => s.interventionId === item.id);
        interventions.push({
          ...item,
          successRate: stat?.successRate ?? null,
        });
      }

      // Sort by success rate, take top 3
      interventions.sort((a, b) => (b.successRate ?? -1) - (a.successRate ?? -1));

      const cachedHabits: CachedHabit[] = (habits ?? []).slice(0, 5).map((h) => ({
        id: h._id,
        name: h.name,
        icon: h.icon ?? "⚡",
      }));

      await updateEmergencyCache({
        interventions: interventions.slice(0, 3),
        habits: cachedHabits,
        companionName: personality?.name ?? "Ton compagnon",
        companionEmoji: personality?.emoji ?? "✨",
      });
    }

    if (interventionStats && habits) {
      syncCache();
    }

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && interventionStats && habits) {
        syncCache();
      }
    });

    return () => sub.remove();
  }, [interventionStats, habits, personality]);
}
