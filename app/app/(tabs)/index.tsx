import { useUser } from "@clerk/expo";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
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
            <Text style={styles.predictionIcon}>⚡</Text>
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
            <Text style={styles.alertIcon}>{warnings[0].icon}</Text>
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
                  <Text style={styles.habitChipIcon}>{habit.icon ?? "⚡"}</Text>
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
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  content: { padding: 20, gap: 14, paddingBottom: 32 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { flex: 1, gap: 4 },
  greeting: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 13, color: "#888" },
  subtitleAlert: { fontSize: 13, color: "#f59f00" },
  levelRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  levelBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#6c47ff",
    alignItems: "center",
    justifyContent: "center",
  },
  levelNumber: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  xpSection: { flex: 1, gap: 4 },
  xpBar: {
    height: 8,
    backgroundColor: "#1a1a2e",
    borderRadius: 4,
    overflow: "hidden",
  },
  xpBarFill: { height: "100%", backgroundColor: "#6c47ff", borderRadius: 4 },
  xpMeta: { flexDirection: "row", justifyContent: "space-between" },
  xpLabel: { fontSize: 12, color: "#555" },
  streakBadge: { fontSize: 12, color: "#f59f00", fontWeight: "600" },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a1a0a",
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#f59f0040",
  },
  alertIcon: { fontSize: 20 },
  alertText: { flex: 1, color: "#f59f00", fontSize: 13, lineHeight: 18 },
  alertArrow: { color: "#f59f00", fontSize: 18 },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: "#fff" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  habitBadge: {
    backgroundColor: "#6c47ff",
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  emptyHabits: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderStyle: "dashed",
  },
  emptyText: { color: "#6c47ff", fontSize: 14, fontWeight: "500" },
  habitsList: { gap: 6 },
  habitChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  habitChipDone: { borderColor: "#2f9e44", opacity: 0.65 },
  habitChipIcon: { fontSize: 20 },
  habitChipName: { flex: 1, color: "#fff", fontSize: 14, fontWeight: "500" },
  habitChipNameDone: { color: "#888", textDecorationLine: "line-through" },
  habitCheck: { color: "#2f9e44", fontSize: 16, fontWeight: "700" },
  habitXP: { color: "#6c47ff", fontSize: 12, fontWeight: "600" },
  seeAll: { color: "#6c47ff", fontSize: 13, fontWeight: "500", textAlign: "center", paddingTop: 4 },
  routinePrompt: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#6c47ff40",
  },
  routineEmoji: { fontSize: 28 },
  routinePromptInfo: { flex: 1, gap: 2 },
  routinePromptTitle: { color: "#fff", fontSize: 14, fontWeight: "600" },
  routinePromptSub: { color: "#888", fontSize: 12 },
  routineArrow: { color: "#6c47ff", fontSize: 20 },
  routinePromptEmpty: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderStyle: "dashed",
  },
  routinePromptEmptyText: { color: "#6c47ff", fontSize: 13, fontWeight: "500" },
  predictionBanner: {
    backgroundColor: "#1a0a2a",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#6c47ff80",
  },
  predictionIcon: { fontSize: 20 },
  predictionContent: { gap: 2 },
  predictionText: { color: "#a78bfa", fontSize: 13, fontWeight: "600", lineHeight: 18 },
  predictionConfidence: { color: "#6c47ff", fontSize: 11, fontWeight: "500" },
  predictionActions: { flexDirection: "row", gap: 8, marginTop: 4 },
  predictionAct: {
    backgroundColor: "#6c47ff",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  predictionActText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  predictionDismiss: {
    backgroundColor: "#2a2a4a",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  predictionDismissText: { color: "#888", fontSize: 12, fontWeight: "600" },
});
