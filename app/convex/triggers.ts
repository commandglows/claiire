import { query } from "./_generated/server";

/**
 * Get the most common triggers from mood and crisis logs.
 * Extracts trigger strings, normalizes, and counts occurrences.
 */
export const getTopTriggers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    // Get mood and crisis logs
    const logs = await ctx.db
      .query("wellnessLog")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const triggerLogs = logs.filter(
      (l) => l.type === "mood" || l.type === "crisis",
    );

    // Count triggers
    const counts = new Map<string, { count: number; lastSeen: number; types: Set<string> }>();

    for (const log of triggerLogs) {
      const data = log.data as { trigger?: string };
      if (!data.trigger || data.trigger.trim().length === 0) continue;

      const trigger = data.trigger.trim().toLowerCase();
      const existing = counts.get(trigger);

      if (existing) {
        existing.count++;
        existing.lastSeen = Math.max(existing.lastSeen, log.createdAt);
        existing.types.add(log.type);
      } else {
        counts.set(trigger, {
          count: 1,
          lastSeen: log.createdAt,
          types: new Set([log.type]),
        });
      }
    }

    // Sort by count desc, take top 10
    return Array.from(counts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([trigger, data]) => ({
        trigger,
        count: data.count,
        lastSeen: data.lastSeen,
        types: Array.from(data.types),
      }));
  },
});
