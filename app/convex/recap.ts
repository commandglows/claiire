import { query } from "./_generated/server";

const DAY_MS = 86_400_000;

function startOfWeek(now: number): number {
  const d = new Date(now);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? 6 : day - 1; // Monday = start
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diff);
  return d.getTime();
}

export const getWeeklyRecap = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return null;

    const now = Date.now();
    const thisWeekStart = startOfWeek(now);
    const lastWeekStart = thisWeekStart - 7 * DAY_MS;

    // Get all logs for both weeks
    const allLogs = await ctx.db
      .query("wellnessLog")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .filter((q) => q.gte(q.field("createdAt"), lastWeekStart))
      .collect();

    const thisWeek = allLogs.filter((l) => l.createdAt >= thisWeekStart);
    const lastWeek = allLogs.filter(
      (l) => l.createdAt >= lastWeekStart && l.createdAt < thisWeekStart,
    );

    // XP
    const thisXP = thisWeek.reduce((s, l) => s + l.xpAwarded, 0);
    const lastXP = lastWeek.reduce((s, l) => s + l.xpAwarded, 0);

    // Log counts by type
    function countByType(logs: typeof allLogs) {
      const counts: Record<string, number> = {};
      for (const l of logs) {
        counts[l.type] = (counts[l.type] ?? 0) + 1;
      }
      return counts;
    }

    const thisCounts = countByType(thisWeek);
    const lastCounts = countByType(lastWeek);

    // Mood average
    const moodLogs = (logs: typeof allLogs) =>
      logs.filter((l) => l.type === "mood");
    const avgMood = (logs: typeof allLogs) => {
      const moods = moodLogs(logs);
      if (moods.length === 0) return null;
      return (
        moods.reduce(
          (s, l) => s + ((l.data as { intensity?: number }).intensity ?? 5),
          0,
        ) / moods.length
      );
    };

    const thisMoodAvg = avgMood(thisWeek);
    const lastMoodAvg = avgMood(lastWeek);

    // Active days (unique days with at least one log)
    const uniqueDays = (logs: typeof allLogs) =>
      new Set(logs.map((l) => new Date(l.createdAt).toISOString().slice(0, 10)))
        .size;

    const thisActiveDays = uniqueDays(thisWeek);
    const lastActiveDays = uniqueDays(lastWeek);

    // Sleep average
    const sleepLogs = (logs: typeof allLogs) =>
      logs.filter((l) => l.type === "sleep");
    const avgSleep = (logs: typeof allLogs) => {
      const sleeps = sleepLogs(logs);
      if (sleeps.length === 0) return null;
      return (
        sleeps.reduce(
          (s, l) => s + ((l.data as { hoursSlept?: number }).hoursSlept ?? 0),
          0,
        ) / sleeps.length
      );
    };

    const thisSleepAvg = avgSleep(thisWeek);
    const lastSleepAvg = avgSleep(lastWeek);

    // Crisis count
    const thisCrises = thisCounts["crisis"] ?? 0;
    const lastCrises = lastCounts["crisis"] ?? 0;

    // Habit completions
    const thisHabits = thisCounts["habit"] ?? 0;
    const lastHabits = lastCounts["habit"] ?? 0;

    return {
      weekOf: new Date(thisWeekStart).toISOString().slice(0, 10),
      thisWeek: {
        xp: thisXP,
        totalLogs: thisWeek.length,
        activeDays: thisActiveDays,
        moodAvg: thisMoodAvg ? Math.round(thisMoodAvg * 10) / 10 : null,
        sleepAvg: thisSleepAvg ? Math.round(thisSleepAvg * 10) / 10 : null,
        crises: thisCrises,
        habits: thisHabits,
      },
      lastWeek: {
        xp: lastXP,
        totalLogs: lastWeek.length,
        activeDays: lastActiveDays,
        moodAvg: lastMoodAvg ? Math.round(lastMoodAvg * 10) / 10 : null,
        sleepAvg: lastSleepAvg ? Math.round(lastSleepAvg * 10) / 10 : null,
        crises: lastCrises,
        habits: lastHabits,
      },
    };
  },
});
