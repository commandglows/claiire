import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

async function getAuthUser(ctx: {
  auth: { getUserIdentity: () => Promise<{ subject: string } | null> };
  db: {
    query: (table: string) => {
      withIndex: (name: string, fn: (q: { eq: (f: string, v: unknown) => unknown }) => unknown) => {
        unique: () => Promise<{ _id: Id<"userProfile">; [key: string]: unknown } | null>;
      };
    };
  };
}) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("NOT_AUTHENTICATED");

  const user = await ctx.db
    .query("userProfile")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
  if (!user) throw new ConvexError("USER_NOT_FOUND");

  return user;
}

export const logSleep = mutation({
  args: {
    hoursSlept: v.number(),
    quality: v.number(), // 1–5
    bedtime: v.optional(v.string()),
    wakeTime: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx as Parameters<typeof getAuthUser>[0]);

    const xpAwarded = 15 + (args.notes ? 5 : 0);

    const logId = await ctx.db.insert("wellnessLog", {
      userId: user._id,
      type: "sleep",
      data: {
        hoursSlept: args.hoursSlept,
        quality: args.quality,
        bedtime: args.bedtime,
        wakeTime: args.wakeTime,
        notes: args.notes,
      },
      xpAwarded,
      createdAt: Date.now(),
    });

    await ctx.runMutation(internal.gamification.awardXP, {
      userId: user._id,
      xp: xpAwarded,
      activityDate: todayISO(),
    });

    // Trigger pattern analysis + achievement checks (fire-and-forget)
    await ctx.runMutation(internal.analytics.analyzeUserPatterns, { userId: user._id });
    await ctx.runMutation(internal.achievements.checkDailyCombo, { userId: user._id, activityDate: todayISO() });
    await ctx.runMutation(internal.achievements.checkMilestones, { userId: user._id });

    return { logId, xpAwarded };
  },
});

export const logMood = mutation({
  args: {
    intensity: v.number(), // 1–10
    emotion: v.union(
      v.literal("anger"),
      v.literal("anxiety"),
      v.literal("sadness"),
      v.literal("neutral"),
      v.literal("happy"),
      v.literal("excited"),
    ),
    trigger: v.optional(v.string()),
    context: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx as Parameters<typeof getAuthUser>[0]);

    const xpAwarded =
      10 +
      (args.trigger ? 5 : 0) +
      (args.notes ? 5 : 0);

    const logId = await ctx.db.insert("wellnessLog", {
      userId: user._id,
      type: "mood",
      data: {
        intensity: args.intensity,
        emotion: args.emotion,
        trigger: args.trigger,
        context: args.context,
        notes: args.notes,
      },
      xpAwarded,
      createdAt: Date.now(),
    });

    await ctx.runMutation(internal.gamification.awardXP, {
      userId: user._id,
      xp: xpAwarded,
      activityDate: todayISO(),
    });

    await ctx.runMutation(internal.analytics.analyzeUserPatterns, {
      userId: user._id,
    });

    return { logId, xpAwarded };
  },
});

export const logCrisis = mutation({
  args: {
    intensity: v.number(), // 1–10 ("damage taken")
    trigger: v.optional(v.string()),
    context: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx as Parameters<typeof getAuthUser>[0]);

    const xpAwarded =
      10 +
      (args.trigger ? 5 : 0) +
      (args.notes ? 5 : 0);

    const logId = await ctx.db.insert("wellnessLog", {
      userId: user._id,
      type: "crisis",
      data: {
        intensity: args.intensity,
        trigger: args.trigger,
        context: args.context,
        notes: args.notes,
      },
      xpAwarded,
      createdAt: Date.now(),
    });

    await ctx.runMutation(internal.gamification.awardXP, {
      userId: user._id,
      xp: xpAwarded,
      activityDate: todayISO(),
    });

    await ctx.runMutation(internal.analytics.analyzeUserPatterns, {
      userId: user._id,
    });

    return { logId, xpAwarded };
  },
});

export const getRecentLogs = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    return ctx.db
      .query("wellnessLog")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit ?? 20);
  },
});
