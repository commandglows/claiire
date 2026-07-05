import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users synced from Clerk via webhook
  userProfile: defineTable({
    clerkId: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    companionId: v.optional(v.union(
      v.literal("lumo"),
      v.literal("papillon"),
      v.literal("etoile"),
    )),
    onboardingCompleted: v.boolean(),
    subscriptionTier: v.union(v.literal("free"), v.literal("premium")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"]),

  // Wellness logs: sleep, mood, meals, habits, crisis events
  wellnessLog: defineTable({
    userId: v.id("userProfile"),
    type: v.union(
      v.literal("sleep"),
      v.literal("mood"),
      v.literal("meal"),
      v.literal("habit"),
      v.literal("crisis"),
    ),
    // Typed per log kind — validated in mutations
    data: v.any(),
    xpAwarded: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "type"])
    .index("by_user_date", ["userId", "createdAt"]),

  // Gamification state (XP, level, streaks)
  userStats: defineTable({
    userId: v.id("userProfile"),
    totalXP: v.number(),
    level: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActivityDate: v.optional(v.string()), // "YYYY-MM-DD"
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // Unlocked achievements / badges
  achievement: defineTable({
    userId: v.id("userProfile"),
    achievementId: v.string(),
    unlockedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_achievement", ["userId", "achievementId"]),

  // Companion conversation history
  // Content encrypted client-side before storage (AD-8g)
  companionMessage: defineTable({
    userId: v.id("userProfile"),
    companionId: v.string(),
    role: v.union(v.literal("user"), v.literal("companion")),
    content: v.string(),
    sessionId: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_session", ["userId", "sessionId"]),

  // User-defined habits (Daily Missions)
  habitDefinition: defineTable({
    userId: v.id("userProfile"),
    name: v.string(),
    icon: v.optional(v.string()),
    missionType: v.optional(v.union(
      v.literal("defense"),   // 🛡️ Avoid addictions
      v.literal("offense"),   // ⚔️ Positive behaviors
      v.literal("support"),   // 💊 Medications, therapy
      v.literal("training"),  // 🏃 Exercise, meditation
    )),
    targetFrequency: v.union(v.literal("daily"), v.literal("weekly")),
    difficulty: v.union(
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard"),
    ),
    xpReward: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_active", ["userId", "isActive"]),

  // Daily habit completion log (one row per habit per day)
  habitCompletion: defineTable({
    userId: v.id("userProfile"),
    habitId: v.id("habitDefinition"),
    date: v.string(), // "YYYY-MM-DD"
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"])
    .index("by_user_habit", ["userId", "habitId"])
    .index("by_user_habit_date", ["userId", "habitId", "date"]),

  // Discovery calendar — tracks which features have been revealed (AD-12e)
  discoveryMilestone: defineTable({
    userId: v.id("userProfile"),
    milestoneId: v.string(),
    unlockedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_milestone", ["userId", "milestoneId"]),

  // Custom interventions created by users (PRD 9.5)
  customIntervention: defineTable({
    userId: v.id("userProfile"),
    name: v.string(),
    icon: v.string(),
    description: v.string(),
    durationSeconds: v.optional(v.number()),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_active", ["userId", "isActive"]),

  // Intervention usage log (tracks which interventions work for each user)
  interventionLog: defineTable({
    userId: v.id("userProfile"),
    interventionId: v.string(),
    crisisLogId: v.optional(v.id("wellnessLog")),
    worked: v.optional(v.boolean()), // null = not rated yet
    xpAwarded: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_intervention", ["userId", "interventionId"]),

  // Routines — morning/night (PRD 9.10)
  routine: defineTable({
    userId: v.id("userProfile"),
    name: v.string(),
    type: v.union(v.literal("morning"), v.literal("night")),
    actions: v.array(v.object({
      id: v.string(),
      label: v.string(),
      icon: v.string(),
      durationSeconds: v.optional(v.number()),
    })),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "type"]),

  // Routine completion log (one per routine execution)
  routineCompletion: defineTable({
    userId: v.id("userProfile"),
    routineId: v.id("routine"),
    completedActions: v.array(v.string()), // action ids completed
    totalActions: v.number(),
    xpAwarded: v.number(),
    completedAt: v.number(),
    date: v.string(), // "YYYY-MM-DD"
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"])
    .index("by_user_routine", ["userId", "routineId"]),

  // Predictive alerts (Attack Alerts — PRD 9.7)
  predictionAlert: defineTable({
    userId: v.id("userProfile"),
    patternType: v.string(),
    confidence: v.number(),
    message: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("dismissed"),
      v.literal("acted"),
    ),
    createdAt: v.number(),
    respondedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"]),

  // AI-detected patterns (computed by Convex scheduled jobs — FR5)
  userPattern: defineTable({
    userId: v.id("userProfile"),
    patternType: v.string(),
    confidence: v.number(), // 0-1, must be >0.85 to trigger alert (AD-7)
    data: v.any(),
    detectedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_pattern", ["userId", "patternType"]),
});
