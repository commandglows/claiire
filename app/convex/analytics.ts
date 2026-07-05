import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

/**
 * Store detected patterns (called from tracking mutations after logging).
 * Upserts: one row per userId + patternType.
 */
export const upsertPattern = internalMutation({
  args: {
    userId: v.id("userProfile"),
    patternType: v.string(),
    confidence: v.number(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userPattern")
      .withIndex("by_user_pattern", (q) =>
        q.eq("userId", args.userId).eq("patternType", args.patternType),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        confidence: args.confidence,
        data: args.data,
        detectedAt: Date.now(),
      });
      return existing._id;
    }

    return ctx.db.insert("userPattern", {
      userId: args.userId,
      patternType: args.patternType,
      confidence: args.confidence,
      data: args.data,
      detectedAt: Date.now(),
    });
  },
});

/**
 * Remove a pattern that is no longer detected.
 */
export const removePattern = internalMutation({
  args: {
    userId: v.id("userProfile"),
    patternType: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userPattern")
      .withIndex("by_user_pattern", (q) =>
        q.eq("userId", args.userId).eq("patternType", args.patternType),
      )
      .unique();

    if (existing) await ctx.db.delete(existing._id);
  },
});

/**
 * Run pattern detection for a user.
 * Fetches last 30 days of logs, computes patterns, and upserts results.
 */
export const analyzeUserPatterns = internalMutation({
  args: { userId: v.id("userProfile") },
  handler: async (ctx, args) => {
    const thirtyDaysAgo = Date.now() - 30 * 86_400_000;

    const logs = await ctx.db
      .query("wellnessLog")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gte(q.field("createdAt"), thirtyDaysAgo))
      .collect();

    // Pattern detection logic (server-side mirror of patternEngine.ts)
    const now = Date.now();
    const DAY_MS = 86_400_000;
    const ALL_TYPES = [
      "sleep_mood_link",
      "crisis_alert",
      "mood_trend_down",
      "mood_improving",
      "habit_consistency",
    ];

    type SimpleLog = { type: string; data: Record<string, unknown>; createdAt: number };
    const typedLogs: SimpleLog[] = logs.map((l) => ({
      type: l.type,
      data: l.data as Record<string, unknown>,
      createdAt: l.createdAt,
    }));

    const detected: { patternType: string; confidence: number; data: Record<string, unknown> }[] = [];

    // Crisis alert
    const recentCrises = typedLogs.filter((l) => l.type === "crisis" && l.createdAt >= now - 7 * DAY_MS);
    if (recentCrises.length >= 3) {
      detected.push({
        patternType: "crisis_alert",
        confidence: Math.min(recentCrises.length / 7, 1),
        data: {
          crisisCount: recentCrises.length,
          window: 7,
          message: `${recentCrises.length} crises cette semaine.`,
        },
      });
    }

    // Mood trend
    const moodLogs = typedLogs.filter((l) => l.type === "mood");
    if (moodLogs.length >= 5) {
      const recent = moodLogs.filter((l) => l.createdAt >= now - 7 * DAY_MS);
      const previous = moodLogs.filter(
        (l) => l.createdAt >= now - 14 * DAY_MS && l.createdAt < now - 7 * DAY_MS,
      );
      if (recent.length >= 2 && previous.length >= 2) {
        const avg = (arr: SimpleLog[]) =>
          arr.reduce((s, l) => s + ((l.data.intensity as number) ?? 5), 0) / arr.length;
        const diff = avg(recent) - avg(previous);
        if (diff > 1) {
          detected.push({
            patternType: "mood_trend_down",
            confidence: Math.min(diff / 5, 1),
            data: { message: "Intensité émotionnelle en hausse." },
          });
        } else if (diff < -1) {
          detected.push({
            patternType: "mood_improving",
            confidence: Math.min(Math.abs(diff) / 5, 1),
            data: { message: "Ton humeur s'améliore." },
          });
        }
      }
    }

    // Habit consistency
    const habitLogs = typedLogs.filter((l) => l.type === "habit" && l.createdAt >= now - 7 * DAY_MS);
    const habitDays = new Set(habitLogs.map((l) => new Date(l.createdAt).toISOString().slice(0, 10)));
    if (habitDays.size >= 5) {
      detected.push({
        patternType: "habit_consistency",
        confidence: habitDays.size / 7,
        data: { activeDays: habitDays.size, message: `Habitudes ${habitDays.size}j/7.` },
      });
    }

    // Sleep-mood link
    const sleepLogs = typedLogs.filter((l) => l.type === "sleep");
    if (sleepLogs.length >= 3 && moodLogs.length >= 3) {
      const poorSleep = sleepLogs.filter(
        (l) => (l.data.hoursSlept as number) <= 5 || (l.data.quality as number) <= 2,
      );
      if (poorSleep.length > 0) {
        let corr = 0;
        for (const s of poorSleep) {
          const badMood = moodLogs.find(
            (m) =>
              m.createdAt > s.createdAt &&
              m.createdAt - s.createdAt < DAY_MS &&
              (["anger", "anxiety", "sadness"].includes(m.data.emotion as string) ||
                (m.data.intensity as number) >= 7),
          );
          if (badMood) corr++;
        }
        const conf = corr / poorSleep.length;
        if (conf >= 0.5) {
          detected.push({
            patternType: "sleep_mood_link",
            confidence: conf,
            data: { message: "Sommeil → humeur corrélés." },
          });
        }
      }
    }

    // Upsert detected, remove stale
    for (const p of detected) {
      await ctx.runMutation(internal.analytics.upsertPattern, {
        userId: args.userId,
        patternType: p.patternType,
        confidence: p.confidence,
        data: p.data,
      });
    }

    const detectedTypes = new Set(detected.map((p) => p.patternType));
    for (const type of ALL_TYPES) {
      if (!detectedTypes.has(type)) {
        await ctx.runMutation(internal.analytics.removePattern, {
          userId: args.userId,
          patternType: type,
        });
      }
    }

    // Generate predictive alerts if high-confidence patterns detected (PRD 9.7)
    await ctx.runMutation(internal.predictions.generateAlerts, {
      userId: args.userId,
    });

    return detected;
  },
});

// Need internal import for self-referencing
import { internal } from "./_generated/api";

/**
 * Get all detected patterns for the current user.
 */
export const getInsights = query({
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
      .query("userPattern")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});
