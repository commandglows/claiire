import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

// XP progression (mirrored from features/gamification/engine/xpEngine.ts)
// Level n requires 100 * n*(n-1)/2 total XP
function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return (100 * level * (level - 1)) / 2;
}

function calculateLevel(totalXP: number): number {
  if (totalXP <= 0) return 1;
  let level = 1;
  while (xpForLevel(level + 1) <= totalXP) level++;
  return level;
}

/** Get current user's gamification stats. */
export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return null;

    return ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
  },
});

/** Get current user's unlocked achievements. */
export const getAchievements = query({
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

/**
 * Award XP to a user and update level + streak.
 * Internal — called from tracking mutations, never directly from the client.
 */
export const awardXP = internalMutation({
  args: {
    userId: v.id("userProfile"),
    xp: v.number(),
    activityDate: v.string(), // "YYYY-MM-DD"
  },
  handler: async (ctx, args) => {
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!stats) return null;

    const totalXP = stats.totalXP + args.xp;
    const level = calculateLevel(totalXP);
    const leveledUp = level > stats.level;

    // Streak logic: increment if consecutive day, reset if gap, skip if same day
    let { currentStreak, longestStreak } = stats;
    if (stats.lastActivityDate !== args.activityDate) {
      const lastMs = stats.lastActivityDate
        ? new Date(stats.lastActivityDate).getTime()
        : 0;
      const todayMs = new Date(args.activityDate).getTime();
      const diffDays = (todayMs - lastMs) / (1000 * 60 * 60 * 24);

      currentStreak = diffDays <= 1 ? currentStreak + 1 : 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    }

    // Streak milestone bonus XP
    let milestoneXP = 0;
    if (currentStreak === 7) milestoneXP = 100;
    else if (currentStreak === 30) milestoneXP = 500;
    else if (currentStreak === 3) milestoneXP = 25;

    const finalXP = totalXP + milestoneXP;
    const finalLevel = milestoneXP > 0 ? calculateLevel(finalXP) : level;

    await ctx.db.patch(stats._id, {
      totalXP: finalXP,
      level: finalLevel,
      currentStreak,
      longestStreak,
      lastActivityDate: args.activityDate,
      updatedAt: Date.now(),
    });

    return { totalXP: finalXP, level: finalLevel, leveledUp, milestoneXP };
  },
});

/** Unlock an achievement for the current user (idempotent). */
export const unlockAchievement = internalMutation({
  args: {
    userId: v.id("userProfile"),
    achievementId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("achievement")
      .withIndex("by_user_achievement", (q) =>
        q.eq("userId", args.userId).eq("achievementId", args.achievementId),
      )
      .unique();

    if (existing) return existing._id;

    return ctx.db.insert("achievement", {
      userId: args.userId,
      achievementId: args.achievementId,
      unlockedAt: Date.now(),
    });
  },
});
