import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

// Get the currently authenticated user's profile
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});

// Upsert user from Clerk — called by webhook on user creation/update
export const upsertFromClerk = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        displayName: args.displayName,
        avatarUrl: args.avatarUrl,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    const userId = await ctx.db.insert("userProfile", {
      clerkId: args.clerkId,
      email: args.email,
      displayName: args.displayName,
      avatarUrl: args.avatarUrl,
      onboardingCompleted: false,
      subscriptionTier: "free",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Initialize gamification stats for new user
    await ctx.db.insert("userStats", {
      userId,
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      updatedAt: Date.now(),
    });

    return userId;
  },
});

// Mark onboarding as complete and set chosen companion
export const completeOnboarding = mutation({
  args: {
    companionId: v.union(
      v.literal("lumo"),
      v.literal("papillon"),
      v.literal("etoile"),
    ),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("NOT_AUTHENTICATED");

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new ConvexError("USER_NOT_FOUND");

    await ctx.db.patch(user._id, {
      companionId: args.companionId,
      displayName: args.displayName ?? user.displayName,
      onboardingCompleted: true,
      updatedAt: Date.now(),
    });

    // Achievement: first companion chosen
    await ctx.runMutation(internal.gamification.unlockAchievement, {
      userId: user._id,
      achievementId: "first_companion",
    });

    return user._id;
  },
});

// GDPR cascade deletion — removes ALL user data across ALL tables (AD-6)
export const deleteAllUserData = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("NOT_AUTHENTICATED");

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new ConvexError("USER_NOT_FOUND");

    // Every table with a userId field — order doesn't matter
    const tableNames = [
      "wellnessLog",
      "userStats",
      "achievement",
      "companionMessage",
      "habitDefinition",
      "habitCompletion",
      "userPattern",
    ] as const;

    let totalDeleted = 0;
    for (const table of tableNames) {
      const records = await ctx.db
        .query(table)
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
      for (const record of records) {
        await ctx.db.delete(record._id);
      }
      totalDeleted += records.length;
    }

    // Delete the user profile itself
    await ctx.db.delete(user._id);

    return { deleted: totalDeleted + 1 };
  },
});

// GDPR data export — returns all user data as a structured object (AD-6)
export const exportAllUserData = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return null;

    const wellnessLogs = await ctx.db
      .query("wellnessLog")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    const achievements = await ctx.db
      .query("achievement")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const messages = await ctx.db
      .query("companionMessage")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const habits = await ctx.db
      .query("habitDefinition")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const completions = await ctx.db
      .query("habitCompletion")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const patterns = await ctx.db
      .query("userPattern")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return {
      exportedAt: new Date().toISOString(),
      profile: {
        email: user.email,
        displayName: user.displayName,
        companionId: user.companionId,
        subscriptionTier: user.subscriptionTier,
        createdAt: new Date(user.createdAt).toISOString(),
      },
      stats,
      wellnessLogs: wellnessLogs.map((l) => ({
        type: l.type,
        data: l.data,
        xpAwarded: l.xpAwarded,
        createdAt: new Date(l.createdAt).toISOString(),
      })),
      achievements: achievements.map((a) => ({
        achievementId: a.achievementId,
        unlockedAt: new Date(a.unlockedAt).toISOString(),
      })),
      habits: habits.map((h) => ({
        name: h.name,
        icon: h.icon,
        difficulty: h.difficulty,
        targetFrequency: h.targetFrequency,
        isActive: h.isActive,
        createdAt: new Date(h.createdAt).toISOString(),
      })),
      habitCompletions: completions.map((c) => ({
        date: c.date,
        createdAt: new Date(c.createdAt).toISOString(),
      })),
      companionMessages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        sessionId: m.sessionId,
        createdAt: new Date(m.createdAt).toISOString(),
      })),
      patterns: patterns.map((p) => ({
        patternType: p.patternType,
        confidence: p.confidence,
        detectedAt: new Date(p.detectedAt).toISOString(),
      })),
    };
  },
});
