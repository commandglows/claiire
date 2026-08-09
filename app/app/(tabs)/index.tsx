import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStats } from "@/features/gamification/hooks/useGamification";
import { useLevelUp } from "@/features/gamification/hooks/useLevelUp";
import { useHabits } from "@/features/tracking/hooks/useHabits";
import { useInsights } from "@/features/analytics/hooks/useInsights";
import { useCompanion } from "@/features/companion/hooks/useCompanion";
import { CompanionAvatar } from "@/features/companion/components/CompanionAvatar";
import { QuickLogBar } from "@/features/tracking/components/QuickLogBar";
import { DailyCombo } from "@/features/gamification/components/DailyCombo";
import { useMode } from "@/features/mode";
import type { Id } from "@/convex/_generated/dataModel";
import { AppDesignTokens } from '@/constants/AppDesignTokens';
import { AppIcon } from "@/components/AppIcon";

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "Bonne nuit";
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

type HabitItem = {
  _id: Id<"habitDefinition">;
  name: string;
  icon?: string;
  xpReward: number;
};

export default function AccueilScreen() {
  const router = useRouter();
  const { user } = useUser();
  const stats = useUserStats();
  const profile = useQuery(api.users.getCurrentUser, {});
  const { habits, completedCount, totalCount, completeHabit, isCompletedToday } = useHabits();
  const { warnings, hasCrisisAlert } = useInsights();
  const { companionId, personality } = useCompanion();
  const { vocab } = useMode();
  useLevelUp();
  const activeAlerts = (useQuery(api.predictions.getActiveAlerts, {}) ?? []) as {
    _id: Id<"predictionAlert">;
    message: string;
    confidence: number;
    patternType: string;
  }[];
  const respondToAlert = useMutation(api.predictions.respondToAlert);
  const routines = (useQuery(api.routines.getMyRoutines, {}) ?? []) as {
    _id: Id<"routine">;
    name: string;
    type: "morning" | "night";
    actions: { id: string; label: string; icon: string }[];
  }[];
  const todayCompletions = (useQuery(api.routines.getTodayCompletions, {}) ?? []) as {
    routineId: Id<"routine">;
  }[];
  const completedRoutineIds = new Set(todayCompletions.map((c) => c.routineId));

  // Show morning routine before noon, night after 18h
  const hour = new Date().getHours();
  const pendingRoutine = routines.find(
    (r) =>
      !completedRoutineIds.has(r._id) &&
      ((r.type === "morning" && hour < 12) || (r.type === "night" && hour >= 18)),
  );

  useEffect(() => {
    if (profile && !profile.onboardingCompleted) {
      router.replace("/(auth)/onboarding");
    }
  }, [profile, router]);

  const displayName = user?.firstName ?? user?.username ?? "Guerrier";
  const level = stats?.level ?? 1;
  const progress = stats?.progress;
  const streak = stats?.currentStreak ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header + companion */}
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{getTimeGreeting()}, {displayName}</Text>
            {hasCrisisAlert ? (
              <Text style={styles.subtitleAlert}>{vocab.homeCrisisSubtitle}</Text>
            ) : streak >= 3 ? (
              <Text style={styles.subtitle}>{streak} jours d'affilée, continue !</Text>
            ) : (
              <Text style={styles.subtitle}>{vocab.homeSubtitle}</Text>
            )}
          </View>
          {companionId && personality && (
            <CompanionAvatar
              companionId={companionId}
              emotion={hasCrisisAlert ? "sad" : streak >= 7 ? "excited" : "idle"}
              size={52}
            />
          )}
        </View>

        {/* XP bar */}
        <View style={styles.levelRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>{level}</Text>
          </View>
          <View style={styles.xpSection}>
            <View style={styles.xpBar}>
              <View
                style={[styles.xpBarFill, { width: `${progress?.percentage ?? 0}%` }]}
              />
            </View>
            <View style={styles.xpMeta}>
              <Text style={styles.xpLabel}>
                {progress ? `${progress.currentInLevel} / ${progress.requiredInLevel} XP` : "0 / 100 XP"}
              </Text>
              {streak > 0 && (
                <Text style={styles.streakBadge}>🔥 {streak}j</Text>
              )}
            </View>
          </View>
        </View>

        {/* Daily combo */}
        <DailyCombo />

        {/* Routine prompt */}
        {pendingRoutine && (
          <TouchableOpacity
            style={styles.routinePrompt}
            onPress={() => router.push("/modal/routine" as never)}
          >
            <Text style={styles.routineEmoji}>
              {pendingRoutine.type === "morning" ? "🌅" : "🌙"}
            </Text>
            <View style={styles.routinePromptInfo}>
              <Text style={styles.routinePromptTitle}>{pendingRoutine.name}</Text>
              <Text style={styles.routinePromptSub}>
                {pendingRoutine.actions.length} actions · Tap pour commencer
              </Text>
            </View>
            <Text style={styles.routineArrow}>›</Text>
          </TouchableOpacity>
        )}
        {routines.length === 0 && (
          <TouchableOpacity
            style={styles.routinePromptEmpty}
            onPress={() => router.push("/modal/routine" as never)}
          >
            <Text style={styles.routinePromptEmptyText}>
              + Crée ta routine {hour < 12 ? "matin" : "soir"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Prediction alert (Attack Alert — PRD 9.7) */}
        {activeAlerts.length > 0 && (
          <View style={styles.predictionBanner}>
            <AppIcon name="zap" color={AppDesignTokens.colors.accentSoft} size={AppDesignTokens.icons.sizeSm} />
            <View style={styles.predictionContent}>
              <Text style={styles.predictionText}>{activeAlerts[0].message}</Text>
              <Text style={styles.predictionConfidence}>
                confiance {Math.round(activeAlerts[0].confidence * 100)}%
              </Text>
            </View>
            <View style={styles.predictionActions}>
              <TouchableOpacity
                style={styles.predictionAct}
                onPress={async () => {
                  await respondToAlert({ alertId: activeAlerts[0]._id, action: "acted" });
                  router.push("/modal/crisis-support" as never);
                }}
              >
                <Text style={styles.predictionActText}>Préparer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.predictionDismiss}
                onPress={() => respondToAlert({ alertId: activeAlerts[0]._id, action: "dismissed" })}
              >
                <Text style={styles.predictionDismissText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Alert banner */}
        {warnings.length > 0 && (
          <TouchableOpacity
            style={styles.alertBanner}
            onPress={() => router.push("/(tabs)/progres" as never)}
          >
            <AppIcon name={warnings[0].icon} color={AppDesignTokens.colors.warning} size={AppDesignTokens.icons.sizeSm} />
            <Text style={styles.alertText} numberOfLines={2}>
              {warnings[0].message}
            </Text>
            <Text style={styles.alertArrow}>›</Text>
          </TouchableOpacity>
        )}

        {/* Quick log */}
        <Text style={styles.sectionTitle}>{vocab.homeQuickLog}</Text>
        <QuickLogBar />

        {/* Today's habits */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{vocab.homeMissions}</Text>
          {totalCount > 0 && (
            <Text style={styles.habitBadge}>{completedCount}/{totalCount}</Text>
          )}
        </View>

        {habits.length === 0 ? (
          <TouchableOpacity
            style={styles.emptyHabits}
            onPress={() => router.push("/modal/log-habit" as never)}
          >
            <Text style={styles.emptyText}>+ Crée ta première mission</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.habitsList}>
            {(habits as HabitItem[]).slice(0, 4).map((habit) => {
              const done = isCompletedToday(habit._id);
              return (
                <TouchableOpacity
                  key={habit._id}
                  style={[styles.habitChip, done && styles.habitChipDone]}
                  onPress={() => !done && completeHabit(habit._id)}
                  disabled={done}
                >
                  <AppIcon name={habit.icon ?? "zap"} color={AppDesignTokens.colors.accentSoft} size={AppDesignTokens.icons.sizeSm} />
                  <Text style={[styles.habitChipName, done && styles.habitChipNameDone]}>
                    {habit.name}
                  </Text>
                  {done ? (
                    <Text style={styles.habitCheck}>✓</Text>
                  ) : (
                    <Text style={styles.habitXP}>+{habit.xpReward}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
            {habits.length > 4 && (
              <TouchableOpacity onPress={() => router.push("/(tabs)/journal" as never)}>
                <Text style={styles.seeAll}>Voir toutes les missions ›</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppDesignTokens.colors.background },
  content: { padding: AppDesignTokens.layout.v20, gap: AppDesignTokens.layout.v14, paddingBottom: AppDesignTokens.layout.v32 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { flex: 1, gap: AppDesignTokens.layout.v4 },
  greeting: { fontSize: AppDesignTokens.layout.v22, fontWeight: "bold", color: AppDesignTokens.colors.text },
  subtitle: { fontSize: AppDesignTokens.layout.v13, color: AppDesignTokens.colors.textMuted },
  subtitleAlert: { fontSize: AppDesignTokens.layout.v13, color: AppDesignTokens.colors.warning },
  levelRow: { flexDirection: "row", alignItems: "center", gap: AppDesignTokens.layout.v12 },
  levelBadge: {
    width: AppDesignTokens.layout.v44,
    height: AppDesignTokens.layout.v44,
    borderRadius: AppDesignTokens.layout.v22,
    backgroundColor: AppDesignTokens.colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  levelNumber: { fontSize: AppDesignTokens.layout.v18, fontWeight: "bold", color: AppDesignTokens.colors.text },
  xpSection: { flex: 1, gap: AppDesignTokens.layout.v4 },
  xpBar: {
    height: AppDesignTokens.layout.v8,
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v4,
    overflow: "hidden",
  },
  xpBarFill: { height: "100%", backgroundColor: AppDesignTokens.colors.accent, borderRadius: AppDesignTokens.layout.v4 },
  xpMeta: { flexDirection: "row", justifyContent: "space-between" },
  xpLabel: { fontSize: AppDesignTokens.layout.v12, color: AppDesignTokens.colors.textSubtle },
  streakBadge: { fontSize: AppDesignTokens.layout.v12, color: AppDesignTokens.colors.warning, fontWeight: "600" },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppDesignTokens.colors.surfaceSecondary,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v12,
    gap: AppDesignTokens.layout.v10,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.warning40,
  },
  alertIcon: { fontSize: AppDesignTokens.layout.v20 },
  alertText: { flex: 1, color: AppDesignTokens.colors.warning, fontSize: AppDesignTokens.layout.v13, lineHeight: AppDesignTokens.layout.v18 },
  alertArrow: { color: AppDesignTokens.colors.warning, fontSize: AppDesignTokens.layout.v18 },
  sectionTitle: { fontSize: AppDesignTokens.layout.v15, fontWeight: "600", color: AppDesignTokens.colors.text },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  habitBadge: {
    backgroundColor: AppDesignTokens.colors.accent,
    color: AppDesignTokens.colors.text,
    fontSize: AppDesignTokens.layout.v11,
    fontWeight: "700",
    paddingHorizontal: AppDesignTokens.layout.v8,
    paddingVertical: AppDesignTokens.layout.v2,
    borderRadius: AppDesignTokens.layout.v8,
  },
  emptyHabits: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.accent,
    borderStyle: "dashed",
  },
  emptyText: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v14, fontWeight: "500" },
  habitsList: { gap: AppDesignTokens.layout.v6 },
  habitChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    paddingVertical: AppDesignTokens.layout.v12,
    paddingHorizontal: AppDesignTokens.layout.v14,
    gap: AppDesignTokens.layout.v10,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  habitChipDone: { borderColor: AppDesignTokens.colors.success, opacity: 0.65 },
  habitChipIcon: { fontSize: AppDesignTokens.layout.v20 },
  habitChipName: { flex: 1, color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v14, fontWeight: "500" },
  habitChipNameDone: { color: AppDesignTokens.colors.textMuted, textDecorationLine: "line-through" },
  habitCheck: { color: AppDesignTokens.colors.success, fontSize: AppDesignTokens.layout.v16, fontWeight: "700" },
  habitXP: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v12, fontWeight: "600" },
  seeAll: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v13, fontWeight: "500", textAlign: "center", paddingTop: AppDesignTokens.layout.v4 },
  routinePrompt: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v14,
    gap: AppDesignTokens.layout.v12,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.accent40,
  },
  routineEmoji: { fontSize: AppDesignTokens.layout.v28 },
  routinePromptInfo: { flex: 1, gap: AppDesignTokens.layout.v2 },
  routinePromptTitle: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v14, fontWeight: "600" },
  routinePromptSub: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v12 },
  routineArrow: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v20 },
  routinePromptEmpty: {
    borderRadius: AppDesignTokens.layout.v12,
    paddingVertical: AppDesignTokens.layout.v12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.accent,
    borderStyle: "dashed",
  },
  routinePromptEmptyText: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v13, fontWeight: "500" },
  predictionBanner: {
    backgroundColor: AppDesignTokens.colors.surfaceTertiary,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v12,
    gap: AppDesignTokens.layout.v8,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.accent80,
  },
  predictionIcon: { fontSize: AppDesignTokens.layout.v20 },
  predictionContent: { gap: AppDesignTokens.layout.v2 },
  predictionText: { color: AppDesignTokens.colors.accentSoft, fontSize: AppDesignTokens.layout.v13, fontWeight: "600", lineHeight: AppDesignTokens.layout.v18 },
  predictionConfidence: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v11, fontWeight: "500" },
  predictionActions: { flexDirection: "row", gap: AppDesignTokens.layout.v8, marginTop: AppDesignTokens.layout.v4 },
  predictionAct: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v8,
    paddingVertical: AppDesignTokens.layout.v7,
    paddingHorizontal: AppDesignTokens.layout.v14,
  },
  predictionActText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v12, fontWeight: "700" },
  predictionDismiss: {
    backgroundColor: AppDesignTokens.colors.border,
    borderRadius: AppDesignTokens.layout.v8,
    paddingVertical: AppDesignTokens.layout.v7,
    paddingHorizontal: AppDesignTokens.layout.v14,
  },
  predictionDismissText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v12, fontWeight: "600" },
});
