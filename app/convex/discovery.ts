import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

/**
 * Discovery Calendar (AD-12e, AD-13c)
 *
 * Config-driven, NOT time-based. Features are revealed when user
 * completes specific actions. Each milestone fires once.
 *
 * Milestones and their triggers:
 * - first_log: user logs anything → reveals War Room concept
 * - first_crisis: user logs a crisis → reveals interventions/arsenal
 * - day_3: 3+ days of activity → reveals analytics/insights
 * - first_habit_streak: 3-day habit streak → reveals routines
 * - day_7: 7+ days of activity → reveals pattern detection
 * - first_prediction: pattern confidence >85% → reveals predictions
 * - level_5: reaches level 5 → reveals companion customization
 */

export type MilestoneDef = {
  id: string;
  companionMessage: string;
  featureHint: string;
  emoji: string;
};

export const MILESTONES: MilestoneDef[] = [
  {
    id: "first_log",
    companionMessage: "Premier rapport enregistré ! Tu viens de poser ta première brique. Continue comme ça.",
    featureHint: "Tu peux voir tous tes progrès dans l'onglet Progrès.",
    emoji: "📝",
  },
  {
    id: "first_crisis",
    companionMessage: "Tu as eu le courage de logger un moment difficile. C'est déjà une victoire. J'ai quelque chose qui peut t'aider...",
    featureHint: "Ton Arsenal est prêt — des techniques pour contre-attaquer.",
    emoji: "🛡️",
  },
  {
    id: "day_3",
    companionMessage: "3 jours d'activité ! J'ai quelque chose à te montrer...",
    featureHint: "Tes statistiques commencent à raconter une histoire. Explore tes insights.",
    emoji: "📊",
  },
  {
    id: "first_habit_streak",
    companionMessage: "3 jours de suite sur tes missions ! Tu prends le rythme. Et si on structurait ça ?",
    featureHint: "Les Routines sont disponibles — matin et soir, guidées par ton compagnon.",
    emoji: "🌅",
  },
  {
    id: "day_7",
    companionMessage: "Une semaine entière ! J'ai assez de données pour détecter des patterns...",
    featureHint: "Le moteur d'intelligence analyse tes habitudes et détecte des tendances.",
    emoji: "🧠",
  },
  {
    id: "first_prediction",
    companionMessage: "J'ai détecté quelque chose d'important dans tes données. Je peux maintenant te prévenir AVANT les moments difficiles.",
    featureHint: "Les alertes prédictives sont actives. Je te préviendrai à l'avance.",
    emoji: "⚡",
  },
  {
    id: "level_5",
    companionMessage: "Niveau 5 ! Tu as prouvé ta détermination. De nouvelles options s'ouvrent à toi.",
    featureHint: "Personnalise ton expérience dans les réglages.",
    emoji: "⬆️",
  },
  {
    id: "all_types_logged",
    companionMessage: "Tu as exploré tous les types de logs. Tu maîtrises tes outils maintenant.",
    featureHint: "Le récap hebdomadaire te donne une vue d'ensemble complète.",
    emoji: "🏆",
  },
];

/**
 * Get all unlocked milestones for the current user.
 */
export const getUnlocked = query({
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
      .query("discoveryMilestone")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

/**
 * Get pending (not yet shown) discovery milestones.
 * Called from the companion screen to show reveal messages.
 */
export const getPendingDiscoveries = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    // Get existing milestones
    const existing = await ctx.db
      .query("discoveryMilestone")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    const existingIds = new Set(existing.map((m) => m.milestoneId));

    // Get user stats
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    // Get log types used
    const logs = await ctx.db
      .query("wellnessLog")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const logTypes = new Set(logs.map((l) => l.type));
    const uniqueDays = new Set(
      logs.map((l) => new Date(l.createdAt).toISOString().slice(0, 10)),
    );
    const hasCrisis = logTypes.has("crisis");
    const level = stats?.level ?? 1;
    const streak = stats?.currentStreak ?? 0;

    // Check patterns
    const patterns = await ctx.db
      .query("userPattern")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    const hasHighConfidence = patterns.some((p) => p.confidence >= 0.85);

    // Determine which milestones should be unlocked
    const pending: string[] = [];

    if (logs.length >= 1 && !existingIds.has("first_log")) {
      pending.push("first_log");
    }
    if (hasCrisis && !existingIds.has("first_crisis")) {
      pending.push("first_crisis");
    }
    if (uniqueDays.size >= 3 && !existingIds.has("day_3")) {
      pending.push("day_3");
    }
    if (streak >= 3 && !existingIds.has("first_habit_streak")) {
      pending.push("first_habit_streak");
    }
    if (uniqueDays.size >= 7 && !existingIds.has("day_7")) {
      pending.push("day_7");
    }
    if (hasHighConfidence && !existingIds.has("first_prediction")) {
      pending.push("first_prediction");
    }
    if (level >= 5 && !existingIds.has("level_5")) {
      pending.push("level_5");
    }
    if (
      logTypes.has("sleep") &&
      logTypes.has("mood") &&
      logTypes.has("habit") &&
      logTypes.has("crisis") &&
      !existingIds.has("all_types_logged")
    ) {
      pending.push("all_types_logged");
    }

    return pending;
  },
});

/**
 * Mark a milestone as unlocked. Called after companion shows the message.
 */
export const markDiscovered = internalMutation({
  args: {
    userId: v.id("userProfile"),
    milestoneId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("discoveryMilestone")
      .withIndex("by_user_milestone", (q) =>
        q.eq("userId", args.userId).eq("milestoneId", args.milestoneId),
      )
      .unique();

    if (existing) return existing._id;

    return ctx.db.insert("discoveryMilestone", {
      userId: args.userId,
      milestoneId: args.milestoneId,
      unlockedAt: Date.now(),
    });
  },
});

/**
 * Public mutation for client to acknowledge a discovery.
 */
export const acknowledge = mutation({
  args: {
    milestoneId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("NOT_AUTHENTICATED");

    const user = await ctx.db
      .query("userProfile")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new ConvexError("USER_NOT_FOUND");

    return ctx.runMutation(internal.discovery.markDiscovered, {
      userId: user._id,
      milestoneId: args.milestoneId,
    });
  },
});

import { internal } from "./_generated/api";
