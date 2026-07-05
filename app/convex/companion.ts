import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUser, getAuthUserOrNull } from "./lib";

/** Save a companion message (fire-and-forget from client). */
export const saveMessage = mutation({
  args: {
    companionId: v.string(),
    role: v.union(v.literal("user"), v.literal("companion")),
    content: v.string(),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    return ctx.db.insert("companionMessage", {
      userId: user._id,
      companionId: args.companionId,
      role: args.role,
      content: args.content,
      sessionId: args.sessionId,
      createdAt: Date.now(),
    });
  },
});

/** Load messages for a specific session, ordered oldest-first. */
export const getSessionMessages = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthUserOrNull(ctx);
    if (!user) return [];

    return ctx.db
      .query("companionMessage")
      .withIndex("by_user_session", (q) =>
        q.eq("userId", user._id).eq("sessionId", args.sessionId),
      )
      .order("asc")
      .collect();
  },
});

/**
 * Get contextual data for the companion to generate relevant messages.
 * Returns streak, recent patterns, last log type, habits status, etc.
 */
export const getCompanionContext = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUserOrNull(ctx);
    if (!user) return null;

    const now = Date.now();
    const today = new Date().toISOString().slice(0, 10);
    const DAY_MS = 86_400_000;

    // Get stats
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    // Recent logs (last 3 days)
    const recentLogs = await ctx.db
      .query("wellnessLog")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .filter((q) => q.gte(q.field("createdAt"), now - 3 * DAY_MS))
      .collect();

    // Active patterns
    const patterns = await ctx.db
      .query("userPattern")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Today's habit completions
    const todayHabits = await ctx.db
      .query("habitCompletion")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id).eq("date", today))
      .collect();

    // Total active habits
    const activeHabits = await ctx.db
      .query("habitDefinition")
      .withIndex("by_user_active", (q) => q.eq("userId", user._id).eq("isActive", true))
      .collect();

    // Last crisis
    const crisisLogs = recentLogs.filter((l) => l.type === "crisis");
    const lastCrisis = crisisLogs.length > 0
      ? crisisLogs.sort((a, b) => b.createdAt - a.createdAt)[0]
      : null;

    // Today's log count
    const todayStart = new Date(today).getTime();
    const todayLogs = recentLogs.filter((l) => l.createdAt >= todayStart);

    const hour = new Date().getHours();

    return {
      level: stats?.level ?? 1,
      totalXP: stats?.totalXP ?? 0,
      currentStreak: stats?.currentStreak ?? 0,
      longestStreak: stats?.longestStreak ?? 0,
      todayLogCount: todayLogs.length,
      todayHabitsDone: todayHabits.length,
      totalActiveHabits: activeHabits.length,
      hasLoggedToday: todayLogs.length > 0,
      recentCrisis: lastCrisis ? {
        hoursAgo: Math.round((now - lastCrisis.createdAt) / 3_600_000),
        intensity: (lastCrisis.data as { intensity?: number })?.intensity ?? 0,
      } : null,
      activePatterns: patterns.map((p) => ({
        type: p.patternType,
        confidence: p.confidence,
      })),
      hour,
    };
  },
});

/** Get the most recent sessions (for history view). */
export const getRecentSessions = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getAuthUserOrNull(ctx);
    if (!user) return [];

    const messages = await ctx.db
      .query("companionMessage")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit ?? 50);

    // Group by sessionId, keep most recent message per session
    const sessions = new Map<string, { sessionId: string; lastMessage: string; createdAt: number }>();
    for (const msg of messages) {
      if (!sessions.has(msg.sessionId)) {
        sessions.set(msg.sessionId, {
          sessionId: msg.sessionId,
          lastMessage: msg.content,
          createdAt: msg.createdAt,
        });
      }
    }

    return [...sessions.values()].sort((a, b) => b.createdAt - a.createdAt);
  },
});
