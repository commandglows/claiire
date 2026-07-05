import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

/**
 * Check and award daily combo: sleep + mood + habit in the same day.
 * Called after each tracking log.
 */
export const checkDailyCombo = internalMutation({
  args: {
    userId: v.id("userProfile"),
    activityDate: v.string(), // "YYYY-MM-DD"
  },
  handler: async (ctx, args) => {
    // Already awarded today?
    const existing = await ctx.db
      .query("achievement")
      .withIndex("by_user_achievement", (q) =>
        q.eq("userId", args.userId).eq("achievementId", `daily_combo_${args.activityDate}`),
      )
      .unique();
    if (existing) return null;

    // Get today's logs
    const startOfDay = new Date(args.activityDate).getTime();
    const endOfDay = startOfDay + 86_400_000;

    const logs = await ctx.db
      .query("wellnessLog")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(q.gte(q.field("createdAt"), startOfDay), q.lt(q.field("createdAt"), endOfDay)),
      )
      .collect();

    const types = new Set(logs.map((l) => l.type));
    const hasCombo = types.has("sleep") && types.has("mood") && types.has("habit");

    if (!hasCombo) return null;

    // Award daily combo achievement (unique per day)
    await ctx.db.insert("achievement", {
      userId: args.userId,
      achievementId: `daily_combo_${args.activityDate}`,
      unlockedAt: Date.now(),
    });

    // Also award the generic "daily_combo" achievement (first time only)
    await ctx.runMutation(internal.gamification.unlockAchievement, {
      userId: args.userId,
      achievementId: "daily_combo",
    });

    // Award combo XP
    await ctx.runMutation(internal.gamification.awardXP, {
      userId: args.userId,
      xp: 50,
      activityDate: args.activityDate,
    });

    return { comboAwarded: true, xp: 50 };
  },
});

/**
 * Check milestone achievements based on current stats.
 * Called after XP is awarded.
 */
export const checkMilestones = internalMutation({
  args: { userId: v.id("userProfile") },
  handler: async (ctx, args) => {
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    const logCount = await ctx.db
      .query("wellnessLog")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const crisisCount = logCount.filter((l) => l.type === "crisis").length;
    const totalLogs = logCount.length;

    const unlocked: string[] = [];

    async function tryUnlock(id: string) {
      const exists = await ctx.db
        .query("achievement")
        .withIndex("by_user_achievement", (q) =>
          q.eq("userId", args.userId).eq("achievementId", id),
        )
        .unique();
      if (!exists) {
        await ctx.runMutation(internal.gamification.unlockAchievement, {
          userId: args.userId,
          achievementId: id,
        });
        unlocked.push(id);
      }
    }

    // First log
    if (totalLogs >= 1) await tryUnlock("first_log");
    if (totalLogs >= 10) await tryUnlock("logs_10");
    if (totalLogs >= 50) await tryUnlock("logs_50");
    if (totalLogs >= 100) await tryUnlock("logs_100");

    // Crisis
    if (crisisCount >= 1) await tryUnlock("crisis_survived");
    if (crisisCount >= 5) await tryUnlock("crisis_5_survived");

    // Streaks
    if (stats) {
      if (stats.longestStreak >= 3) await tryUnlock("streak_3");
      if (stats.longestStreak >= 7) await tryUnlock("streak_7");
      if (stats.longestStreak >= 30) await tryUnlock("streak_30");
    }

    // Insights
    const patterns = await ctx.db
      .query("userPattern")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    if (patterns) await tryUnlock("first_insight");

    return unlocked;
  },
});

/**
 * Get all achievements for the current user (with unlock status).
 */
export const getUserAchievements = query({
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
      .query("achievement")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});
