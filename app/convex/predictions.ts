import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
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
 * Get active prediction alerts for the current user.
 * Only returns alerts that are still active (not dismissed/acted).
 */
export const getActiveAlerts = query({
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
      .query("predictionAlert")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", user._id).eq("status", "active"),
      )
      .collect();
  },
});

/**
 * Respond to a prediction alert.
 * "acted" = user prepares (opens interventions) → +10 XP
 * "dismissed" = user says they're fine → logged for confidence tracking
 */
export const respondToAlert = mutation({
  args: {
    alertId: v.id("predictionAlert"),
    action: v.union(v.literal("acted"), v.literal("dismissed")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx as Parameters<typeof getAuthUser>[0]);

    const alert = await ctx.db.get(args.alertId);
    if (!alert || alert.userId !== user._id) {
      throw new ConvexError("ALERT_NOT_FOUND");
    }
    if (alert.status !== "active") return { xpAwarded: 0 };

    await ctx.db.patch(args.alertId, {
      status: args.action,
      respondedAt: Date.now(),
    });

    // +10 XP for acting on a prediction (PRD 9.7)
    const xpAwarded = args.action === "acted" ? 10 : 0;
    if (xpAwarded > 0) {
      await ctx.runMutation(internal.gamification.awardXP, {
        userId: user._id,
        xp: xpAwarded,
        activityDate: todayISO(),
      });
    }

    return { xpAwarded };
  },
});

/**
 * Generate prediction alerts based on detected patterns.
 * Called from analyzeUserPatterns after pattern detection.
 * Rules (PRD 9.7):
 * - Only fire at >85% confidence (AD-7)
 * - Max 1 alert per 4 hours (throttle)
 * - Quiet hours: 22h-08h (checked client-side)
 */
export const generateAlerts = internalMutation({
  args: { userId: v.id("userProfile") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const fourHoursAgo = now - 4 * 3_600_000;

    // Throttle: check last alert time
    const recentAlerts = await ctx.db
      .query("predictionAlert")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gte(q.field("createdAt"), fourHoursAgo))
      .collect();

    if (recentAlerts.length > 0) return null;

    // Get high-confidence patterns
    const patterns = await ctx.db
      .query("userPattern")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const alertablePatterns = patterns.filter((p) => p.confidence >= 0.85);
    if (alertablePatterns.length === 0) return null;

    // Pick highest confidence pattern
    const top = alertablePatterns.sort((a, b) => b.confidence - a.confidence)[0];
    const data = top.data as { message?: string };

    const MESSAGE_MAP: Record<string, string> = {
      crisis_alert: "Attention — tes données montrent un risque élevé. Prépare ton arsenal.",
      mood_trend_down: "Ton intensité émotionnelle monte. Tu veux activer une défense ?",
      sleep_mood_link: "Mauvais sommeil détecté — prépare-toi, le lendemain peut être dur.",
    };

    const message = MESSAGE_MAP[top.patternType] ?? data.message ?? "Alerte prédictive active.";

    const alertId = await ctx.db.insert("predictionAlert", {
      userId: args.userId,
      patternType: top.patternType,
      confidence: top.confidence,
      message,
      status: "active",
      createdAt: now,
    });

    return alertId;
  },
});
