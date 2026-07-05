import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUser } from "./lib";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

const XP_BY_DIFFICULTY = { easy: 10, medium: 20, hard: 35 } as const;

export const createHabit = mutation({
  args: {
    name: v.string(),
    icon: v.optional(v.string()),
    missionType: v.optional(v.union(
      v.literal("defense"),
      v.literal("offense"),
      v.literal("support"),
      v.literal("training"),
    )),
    targetFrequency: v.union(v.literal("daily"), v.literal("weekly")),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const xpReward = XP_BY_DIFFICULTY[args.difficulty];

    const id = await ctx.db.insert("habitDefinition", {
      userId: user._id,
      name: args.name,
      icon: args.icon ?? "⚡",
      missionType: args.missionType,
      targetFrequency: args.targetFrequency,
      difficulty: args.difficulty,
      xpReward,
      isActive: true,
      createdAt: Date.now(),
    });

    // Achievement: first habit created
    await ctx.runMutation(internal.gamification.unlockAchievement, {
      userId: user._id,
      achievementId: "first_habit",
    });

    return id;
  },
});

export const archiveHabit = mutation({
  args: { habitId: v.id("habitDefinition") },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== user._id) {
      throw new ConvexError("NOT_FOUND");
    }
    return ctx.db.patch(args.habitId, { isActive: false });
  },
});

export const completeHabit = mutation({
  args: { habitId: v.id("habitDefinition") },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== user._id) {
      throw new ConvexError("NOT_FOUND");
    }

    const today = todayISO();

    // Idempotent — ignore if already completed today
    const existing = await ctx.db
      .query("habitCompletion")
      .withIndex("by_user_habit_date", (q) =>
        q.eq("userId", user._id).eq("habitId", args.habitId).eq("date", today),
      )
      .unique();

    if (existing) return { alreadyDone: true, xpAwarded: 0 };

    await ctx.db.insert("habitCompletion", {
      userId: user._id,
      habitId: args.habitId,
      date: today,
      createdAt: Date.now(),
    });

    // Also record in wellnessLog for the unified history
    await ctx.db.insert("wellnessLog", {
      userId: user._id,
      type: "habit",
      data: { habitId: args.habitId, habitName: habit.name },
      xpAwarded: habit.xpReward,
      createdAt: Date.now(),
    });

    await ctx.runMutation(internal.gamification.awardXP, {
      userId: user._id,
      xp: habit.xpReward,
      activityDate: today,
    });

    await ctx.runMutation(internal.analytics.analyzeUserPatterns, { userId: user._id });
    await ctx.runMutation(internal.achievements.checkDailyCombo, { userId: user._id, activityDate: today });
    await ctx.runMutation(internal.achievements.checkMilestones, { userId: user._id });

    return { alreadyDone: false, xpAwarded: habit.xpReward };
  },
});

export const getActiveHabits = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    return ctx.db
      .query("habitDefinition")
      .withIndex("by_user_active", (q) =>
        q.eq("userId", user._id).eq("isActive", true),
      )
      .order("asc")
      .collect();
  },
});

export const getTodayCompletions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [] as string[];

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [] as string[];

    const today = todayISO();
    const completions = await ctx.db
      .query("habitCompletion")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", today),
      )
      .collect();

    return completions.map((c) => c.habitId as string);
  },
});

export const getHabitStreak = query({
  args: { habitId: v.id("habitDefinition") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return 0;

    const completions = await ctx.db
      .query("habitCompletion")
      .withIndex("by_user_habit", (q) =>
        q.eq("userId", user._id).eq("habitId", args.habitId),
      )
      .order("desc")
      .take(60);

    const dates = completions.map((c) => c.date);
    if (dates.length === 0) return 0;

    // Count consecutive days ending today or yesterday
    const today = todayISO();
    let streak = 0;
    let current = today;

    for (const date of dates) {
      if (date === current) {
        streak++;
        // subtract one day
        const d = new Date(current);
        d.setDate(d.getDate() - 1);
        current = d.toISOString().slice(0, 10);
      } else if (date < current) {
        // Gap detected — stop
        break;
      }
    }

    return streak;
  },
});

/**
 * Get streaks for all active habits in one query.
 * Returns a map of habitId → streak count.
 */
export const getAllHabitStreaks = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return {};

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return {};

    const habits = await ctx.db
      .query("habitDefinition")
      .withIndex("by_user_active", (q) =>
        q.eq("userId", user._id).eq("isActive", true),
      )
      .collect();

    const result: Record<string, number> = {};
    const today = todayISO();

    for (const habit of habits) {
      const completions = await ctx.db
        .query("habitCompletion")
        .withIndex("by_user_habit", (q) =>
          q.eq("userId", user._id).eq("habitId", habit._id),
        )
        .order("desc")
        .take(60);

      const dates = completions.map((c) => c.date);
      let streak = 0;
      let current = today;

      for (const date of dates) {
        if (date === current) {
          streak++;
          const d = new Date(current);
          d.setDate(d.getDate() - 1);
          current = d.toISOString().slice(0, 10);
        } else if (date < current) {
          break;
        }
      }

      result[habit._id] = streak;
    }

    return result;
  },
});
