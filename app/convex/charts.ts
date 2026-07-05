import { query } from "./_generated/server";

const DAY_MS = 86_400_000;

function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

/**
 * Get daily averages for mood intensity and sleep hours over the last N days.
 */
export const getDailyTrends = query({
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
    const fourteenDaysAgo = now - 14 * DAY_MS;

    const logs = await ctx.db
      .query("wellnessLog")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .filter((q) => q.gte(q.field("createdAt"), fourteenDaysAgo))
      .collect();

    // Build day-by-day data
    const days: string[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * DAY_MS);
      days.push(dayKey(d.getTime()));
    }

    const moodByDay = new Map<string, number[]>();
    const sleepByDay = new Map<string, number[]>();

    for (const log of logs) {
      const day = dayKey(log.createdAt);
      const data = log.data as Record<string, unknown>;

      if (log.type === "mood" && typeof data.intensity === "number") {
        if (!moodByDay.has(day)) moodByDay.set(day, []);
        moodByDay.get(day)!.push(data.intensity as number);
      }

      if (log.type === "sleep" && typeof data.hoursSlept === "number") {
        if (!sleepByDay.has(day)) sleepByDay.set(day, []);
        sleepByDay.get(day)!.push(data.hoursSlept as number);
      }
    }

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const mood = days.map((day) => ({
      day,
      label: day.slice(8), // "DD"
      value: moodByDay.has(day) ? Math.round(avg(moodByDay.get(day)!) * 10) / 10 : null,
    }));

    const sleep = days.map((day) => ({
      day,
      label: day.slice(8),
      value: sleepByDay.has(day) ? Math.round(avg(sleepByDay.get(day)!) * 10) / 10 : null,
    }));

    return { mood, sleep };
  },
});

/**
 * Crisis heatmap: count crises by day-of-week × time-of-day (4h blocks).
 * Returns a 7×6 grid (Mon-Sun × 0-4, 4-8, 8-12, 12-16, 16-20, 20-24).
 * Uses last 90 days of data.
 */
export const getCrisisHeatmap = query({
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
    const ninetyDaysAgo = now - 90 * DAY_MS;

    const logs = await ctx.db
      .query("wellnessLog")
      .withIndex("by_user_type", (q) =>
        q.eq("userId", user._id).eq("type", "crisis"),
      )
      .filter((q) => q.gte(q.field("createdAt"), ninetyDaysAgo))
      .collect();

    // 7 days × 6 time blocks
    const grid: number[][] = Array.from({ length: 7 }, () =>
      Array.from({ length: 6 }, () => 0),
    );

    for (const log of logs) {
      const date = new Date(log.createdAt);
      const dayOfWeek = (date.getDay() + 6) % 7; // Mon=0, Sun=6
      const hour = date.getHours();
      const block = Math.floor(hour / 4); // 0-5
      grid[dayOfWeek][block]++;
    }

    const max = Math.max(1, ...grid.flat());

    return {
      grid,
      max,
      totalCrises: logs.length,
      days: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      blocks: ["0-4h", "4-8h", "8-12h", "12-16h", "16-20h", "20-24h"],
    };
  },
});
