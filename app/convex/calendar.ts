import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Get activity summary for each day of a given month.
 */
export const getMonthActivity = query({
  args: {
    year: v.number(),
    month: v.number(), // 1-12
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    const startOfMonth = new Date(args.year, args.month - 1, 1).getTime();
    const endOfMonth = new Date(args.year, args.month, 1).getTime();

    const logs = await ctx.db
      .query("wellnessLog")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .filter((q) =>
        q.and(
          q.gte(q.field("createdAt"), startOfMonth),
          q.lt(q.field("createdAt"), endOfMonth),
        ),
      )
      .collect();

    // Group by day
    const byDay = new Map<number, { types: Set<string>; xp: number; count: number }>();

    for (const log of logs) {
      const day = new Date(log.createdAt).getDate();
      const existing = byDay.get(day);
      if (existing) {
        existing.types.add(log.type);
        existing.xp += log.xpAwarded;
        existing.count++;
      } else {
        byDay.set(day, { types: new Set([log.type]), xp: log.xpAwarded, count: 1 });
      }
    }

    return Array.from(byDay.entries()).map(([day, data]) => ({
      day,
      types: Array.from(data.types),
      xp: data.xp,
      count: data.count,
      combo: data.types.has("sleep") && data.types.has("mood") && data.types.has("habit"),
    }));
  },
});
