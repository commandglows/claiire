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

const actionSchema = v.object({
  id: v.string(),
  label: v.string(),
  icon: v.string(),
  durationSeconds: v.optional(v.number()),
});

/**
 * Create a new routine (morning or night).
 */
export const create = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("morning"), v.literal("night")),
    actions: v.array(actionSchema),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx as Parameters<typeof getAuthUser>[0]);

    return ctx.db.insert("routine", {
      userId: user._id,
      name: args.name,
      type: args.type,
      actions: args.actions,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

/**
 * Get user's routines.
 */
export const getMyRoutines = query({
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
      .query("routine")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

/**
 * Check if a routine was completed today.
 */
export const getTodayCompletions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    const today = todayISO();
    return ctx.db
      .query("routineCompletion")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id).eq("date", today))
      .collect();
  },
});

/**
 * Log routine completion. Awards XP per completed action + bonus for full completion.
 * PRD: XP for routine + individual action completion.
 */
export const complete = mutation({
  args: {
    routineId: v.id("routine"),
    completedActions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx as Parameters<typeof getAuthUser>[0]);

    const routine = await ctx.db.get(args.routineId);
    if (!routine || routine.userId !== user._id) {
      throw new ConvexError("ROUTINE_NOT_FOUND");
    }

    const totalActions = routine.actions.length;
    const completedCount = args.completedActions.length;

    // XP: 10 per action + 20 bonus if all completed
    const actionXP = completedCount * 10;
    const bonusXP = completedCount === totalActions ? 20 : 0;
    const xpAwarded = actionXP + bonusXP;

    const today = todayISO();

    await ctx.db.insert("routineCompletion", {
      userId: user._id,
      routineId: args.routineId,
      completedActions: args.completedActions,
      totalActions,
      xpAwarded,
      completedAt: Date.now(),
      date: today,
    });

    await ctx.runMutation(internal.gamification.awardXP, {
      userId: user._id,
      xp: xpAwarded,
      activityDate: today,
    });

    await ctx.runMutation(internal.achievements.checkMilestones, {
      userId: user._id,
    });

    return { xpAwarded, completedCount, totalActions, bonusXP };
  },
});

/**
 * Delete (deactivate) a routine.
 */
export const remove = mutation({
  args: { routineId: v.id("routine") },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx as Parameters<typeof getAuthUser>[0]);
    const routine = await ctx.db.get(args.routineId);
    if (!routine || routine.userId !== user._id) {
      throw new ConvexError("ROUTINE_NOT_FOUND");
    }
    await ctx.db.patch(args.routineId, { isActive: false });
  },
});
