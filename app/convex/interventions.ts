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

/**
 * Log that a user used an intervention. Awards XP immediately.
 * Called from crisis-support modal when user taps "Utiliser".
 */
export const logUse = mutation({
  args: {
    interventionId: v.string(),
    crisisLogId: v.optional(v.id("wellnessLog")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx as Parameters<typeof getAuthUser>[0]);
    const xpAwarded = 30; // PRD: Complete intervention = +30

    const logId = await ctx.db.insert("interventionLog", {
      userId: user._id,
      interventionId: args.interventionId,
      crisisLogId: args.crisisLogId,
      worked: undefined,
      xpAwarded,
      createdAt: Date.now(),
    });

    await ctx.runMutation(internal.gamification.awardXP, {
      userId: user._id,
      xp: xpAwarded,
      activityDate: todayISO(),
    });

    // Check mastery achievements
    await ctx.runMutation(internal.achievements.checkMilestones, {
      userId: user._id,
    });

    return { logId, xpAwarded };
  },
});

/**
 * Rate whether an intervention worked. Awards +10 bonus XP if marked as worked.
 */
export const rateIntervention = mutation({
  args: {
    logId: v.id("interventionLog"),
    worked: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx as Parameters<typeof getAuthUser>[0]);

    const log = await ctx.db.get(args.logId);
    if (!log || log.userId !== user._id) {
      throw new ConvexError("LOG_NOT_FOUND");
    }

    // Only rate once
    if (log.worked !== undefined) return { bonusXP: 0 };

    await ctx.db.patch(args.logId, { worked: args.worked });

    const bonusXP = args.worked ? 10 : 0;
    if (bonusXP > 0) {
      await ctx.runMutation(internal.gamification.awardXP, {
        userId: user._id,
        xp: bonusXP,
        activityDate: todayISO(),
      });
    }

    return { bonusXP };
  },
});

/**
 * Create a custom intervention.
 */
export const createCustom = mutation({
  args: {
    name: v.string(),
    icon: v.string(),
    description: v.string(),
    durationSeconds: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx as Parameters<typeof getAuthUser>[0]);

    return ctx.db.insert("customIntervention", {
      userId: user._id,
      name: args.name,
      icon: args.icon,
      description: args.description,
      durationSeconds: args.durationSeconds,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

/**
 * Get user's custom interventions.
 */
export const getCustomInterventions = query({
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
      .query("customIntervention")
      .withIndex("by_user_active", (q) =>
        q.eq("userId", user._id).eq("isActive", true),
      )
      .collect();
  },
});

/**
 * Delete (deactivate) a custom intervention.
 */
export const removeCustom = mutation({
  args: { id: v.id("customIntervention") },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx as Parameters<typeof getAuthUser>[0]);
    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== user._id) {
      throw new ConvexError("NOT_FOUND");
    }
    await ctx.db.patch(args.id, { isActive: false });
  },
});

/**
 * Get intervention stats for the current user.
 * Returns per-intervention: total uses, success count, success rate, mastered status.
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    const logs = await ctx.db
      .query("interventionLog")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Group by interventionId
    const statsMap = new Map<
      string,
      { uses: number; worked: number; rated: number }
    >();

    for (const log of logs) {
      const existing = statsMap.get(log.interventionId) ?? {
        uses: 0,
        worked: 0,
        rated: 0,
      };
      existing.uses++;
      if (log.worked !== undefined) {
        existing.rated++;
        if (log.worked) existing.worked++;
      }
      statsMap.set(log.interventionId, existing);
    }

    return Array.from(statsMap.entries()).map(([id, s]) => ({
      interventionId: id,
      uses: s.uses,
      successRate: s.rated > 0 ? s.worked / s.rated : null,
      mastered: s.uses >= 10,
      advanced: s.uses >= 5,
    }));
  },
});
