import { query } from "./_generated/server";

/**
 * Get today's activity summary: which log types have been completed.
 */
export const getTodayActivity = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDay = today.getTime();
    const endOfDay = startOfDay + 86_400_000;

    const logs = await ctx.db
      .query("wellnessLog")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .filter((q) =>
        q.and(
          q.gte(q.field("createdAt"), startOfDay),
          q.lt(q.field("createdAt"), endOfDay),
        ),
      )
      .collect();

    const types = new Set(logs.map((l) => l.type));
    const totalXP = logs.reduce((s, l) => s + l.xpAwarded, 0);

    return {
      sleep: types.has("sleep"),
      mood: types.has("mood"),
      habit: types.has("habit"),
      crisis: types.has("crisis"),
      comboComplete: types.has("sleep") && types.has("mood") && types.has("habit"),
      logCount: logs.length,
      totalXP,
    };
  },
});
