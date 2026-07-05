import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export function useHabits() {
  const habits = useQuery(api.habits.getActiveHabits) ?? [];
  const todayCompletions = useQuery(api.habits.getTodayCompletions) ?? [];

  const createHabitMutation = useMutation(api.habits.createHabit);
  const completeHabitMutation = useMutation(api.habits.completeHabit);
  const archiveHabitMutation = useMutation(api.habits.archiveHabit);

  async function createHabit(args: {
    name: string;
    icon?: string;
    missionType?: "defense" | "offense" | "support" | "training";
    targetFrequency: "daily" | "weekly";
    difficulty: "easy" | "medium" | "hard";
  }) {
    return createHabitMutation(args);
  }

  async function completeHabit(habitId: Id<"habitDefinition">) {
    return completeHabitMutation({ habitId });
  }

  async function archiveHabit(habitId: Id<"habitDefinition">) {
    return archiveHabitMutation({ habitId });
  }

  function isCompletedToday(habitId: Id<"habitDefinition">): boolean {
    return todayCompletions.includes(habitId as string);
  }

  const completedCount = habits.filter((h: { _id: Id<"habitDefinition"> }) => isCompletedToday(h._id)).length;
  const totalCount = habits.length;

  return {
    habits,
    todayCompletions,
    completedCount,
    totalCount,
    createHabit,
    completeHabit,
    archiveHabit,
    isCompletedToday,
  };
}
