import { useState } from "react";
import { AppDesignTokens } from '@/constants/AppDesignTokens';
import { AppIcon } from "@/components/AppIcon";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useHabits } from "@/features/tracking/hooks/useHabits";
import { useMode } from "@/features/mode";
import type { Id } from "@/convex/_generated/dataModel";

const DIFFICULTY_COLORS = {
  easy: AppDesignTokens.colors.success,
  medium: AppDesignTokens.colors.warning,
  hard: AppDesignTokens.colors.danger,
} as const;

type MissionType = "defense" | "offense" | "support" | "training";

const MISSION_TYPE_BADGE: Record<MissionType, { emoji: string; label: string }> = {
  defense: { emoji: "🛡️", label: "Défense" },
  offense: { emoji: "⚔️", label: "Attaque" },
  support: { emoji: "💊", label: "Support" },
  training: { emoji: "🏃", label: "Entraînement" },
};

type Habit = {
  _id: Id<"habitDefinition">;
  name: string;
  icon?: string;
  missionType?: MissionType;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  targetFrequency: "daily" | "weekly";
};

function HabitRow({
  habit,
  completed,
  streak,
  onComplete,
}: {
  habit: Habit;
  completed: boolean;
  streak: number;
  onComplete: () => void;
}) {
  const color = DIFFICULTY_COLORS[habit.difficulty];

  return (
    <View style={[styles.habitRow, completed && styles.habitRowDone]}>
      <View style={styles.habitIcon}>
        <AppIcon name={habit.icon ?? "zap"} color={AppDesignTokens.colors.accentSoft} size={AppDesignTokens.icons.sizeMd} />
      </View>
      <View style={styles.habitInfo}>
        <Text style={[styles.habitName, completed && styles.habitNameDone]}>
          {habit.name}
        </Text>
        <View style={styles.habitMeta}>
          <Text style={[styles.habitXP, { color }]}>+{habit.xpReward} XP</Text>
          {habit.missionType && (
            <Text style={styles.missionBadge}>
              {MISSION_TYPE_BADGE[habit.missionType].emoji}
            </Text>
          )}
          {streak > 0 && (
            <Text style={styles.habitStreak}>🔥 {streak}j</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={[styles.checkButton, completed && styles.checkButtonDone]}
        onPress={onComplete}
        disabled={completed}
      >
        <Text style={styles.checkButtonText}>{completed ? "✓" : "Faire"}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function JournalScreen() {
  const router = useRouter();
  const { habits, completedCount, totalCount, completeHabit, isCompletedToday } =
    useHabits();
  const { vocab } = useMode();
  const streaks = (useQuery(api.habits.getAllHabitStreaks, {}) ?? {}) as Record<string, number>;
  const [justCompleted, setJustCompleted] = useState<Set<string>>(new Set());

  async function handleComplete(habitId: Id<"habitDefinition">) {
    try {
      await completeHabit(habitId);
      setJustCompleted((prev) => new Set([...prev, habitId]));
    } catch {
      // silently ignore (e.g. already done)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>{vocab.journalTitle}</Text>
            <Text style={styles.subtitle}>{vocab.journalSubtitle}</Text>
          </View>
          <TouchableOpacity
            style={styles.calendarButton}
            onPress={() => router.push("/modal/calendar" as never)}
          >
            <Text style={styles.calendarButtonText}>📅</Text>
          </TouchableOpacity>
        </View>

        {/* Quick stats */}
        {totalCount > 0 && (
          <View style={styles.quickStats}>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{completedCount}/{totalCount}</Text>
              <Text style={styles.quickStatLabel}>Aujourd'hui</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>
                {Object.values(streaks).filter((s) => s > 0).length}
              </Text>
              <Text style={styles.quickStatLabel}>En série</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStatItem}>
              <Text style={[styles.quickStatValue, { color: AppDesignTokens.colors.warning }]}>
                {Math.max(0, ...Object.values(streaks))}j
              </Text>
              <Text style={styles.quickStatLabel}>Meilleure</Text>
            </View>
          </View>
        )}

        {/* Quick log row */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => router.push("/modal/log-sleep" as never)}
          >
            <Text style={styles.quickEmoji}>😴</Text>
            <Text style={styles.quickLabel}>Sommeil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => router.push("/modal/log-mood" as never)}
          >
            <Text style={styles.quickEmoji}>🎯</Text>
            <Text style={styles.quickLabel}>Humeur</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => router.push("/modal/crisis-support" as never)}
          >
            <Text style={styles.quickEmoji}>⚔️</Text>
            <Text style={styles.quickLabel}>Crise</Text>
          </TouchableOpacity>
        </View>

        {/* Habits section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{vocab.journalHabitsTitle}</Text>
          {totalCount > 0 && (
            <Text style={styles.sectionBadge}>
              {completedCount}/{totalCount}
            </Text>
          )}
        </View>

        {habits.length === 0 ? (
          <View style={styles.emptyHabits}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyText}>{vocab.journalEmptyHabits}</Text>
            <Text style={styles.emptySub}>
              {vocab.journalEmptyHabitsSub}
            </Text>
          </View>
        ) : (
          <View style={styles.habitsList}>
            {(habits as Habit[]).map((habit) => (
              <HabitRow
                key={habit._id}
                habit={habit}
                completed={
                  isCompletedToday(habit._id) || justCompleted.has(habit._id)
                }
                streak={streaks[habit._id] ?? 0}
                onComplete={() => handleComplete(habit._id)}
              />
            ))}
          </View>
        )}

        {/* Add habit button */}
        <TouchableOpacity
          style={styles.addHabitButton}
          onPress={() => router.push("/modal/log-habit" as never)}
        >
          <Text style={styles.addHabitText}>{vocab.journalNewHabit}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppDesignTokens.colors.background },
  scroll: { flex: 1 },
  content: { padding: AppDesignTokens.layout.v20, gap: AppDesignTokens.layout.v16, paddingBottom: AppDesignTokens.layout.v32 },
  title: { fontSize: AppDesignTokens.layout.v24, fontWeight: "bold", color: AppDesignTokens.colors.text },
  subtitle: { fontSize: AppDesignTokens.layout.v14, color: AppDesignTokens.colors.textMuted, marginTop: AppDesignTokens.layout.vMinus8 },
  quickRow: { flexDirection: "row", gap: AppDesignTokens.layout.v10 },
  quickButton: {
    flex: 1,
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    paddingVertical: AppDesignTokens.layout.v16,
    alignItems: "center",
    gap: AppDesignTokens.layout.v6,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  quickEmoji: { fontSize: AppDesignTokens.layout.v26 },
  quickLabel: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v12, fontWeight: "500" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: AppDesignTokens.layout.v16, fontWeight: "600", color: AppDesignTokens.colors.text },
  sectionBadge: {
    backgroundColor: AppDesignTokens.colors.accent,
    color: AppDesignTokens.colors.text,
    fontSize: AppDesignTokens.layout.v12,
    fontWeight: "700",
    paddingHorizontal: AppDesignTokens.layout.v10,
    paddingVertical: AppDesignTokens.layout.v3,
    borderRadius: AppDesignTokens.layout.v10,
  },
  habitsList: { gap: AppDesignTokens.layout.v8 },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v14,
    padding: AppDesignTokens.layout.v14,
    gap: AppDesignTokens.layout.v12,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  habitRowDone: { borderColor: AppDesignTokens.colors.success, opacity: 0.7 },
  habitIcon: { width: AppDesignTokens.layout.v32, alignItems: "center", justifyContent: "center" },
  habitInfo: { flex: 1, gap: AppDesignTokens.layout.v2 },
  habitName: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v15, fontWeight: "500" },
  habitNameDone: { color: AppDesignTokens.colors.textMuted, textDecorationLine: "line-through" },
  habitMeta: { flexDirection: "row", alignItems: "center", gap: AppDesignTokens.layout.v8 },
  habitXP: { fontSize: AppDesignTokens.layout.v12, fontWeight: "600" },
  missionBadge: { fontSize: AppDesignTokens.layout.v12 },
  habitStreak: { color: AppDesignTokens.colors.warning, fontSize: AppDesignTokens.layout.v11, fontWeight: "600" },
  checkButton: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v8,
    paddingVertical: AppDesignTokens.layout.v7,
    paddingHorizontal: AppDesignTokens.layout.v14,
  },
  checkButtonDone: { backgroundColor: AppDesignTokens.colors.success },
  checkButtonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v13, fontWeight: "700" },
  emptyHabits: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v14,
    padding: AppDesignTokens.layout.v32,
    alignItems: "center",
    gap: AppDesignTokens.layout.v8,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
    borderStyle: "dashed",
  },
  emptyEmoji: { fontSize: AppDesignTokens.layout.v40 },
  emptyText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v15, fontWeight: "500" },
  emptySub: { color: AppDesignTokens.colors.textSubtle, fontSize: AppDesignTokens.layout.v12, textAlign: "center" },
  addHabitButton: {
    borderRadius: AppDesignTokens.layout.v14,
    paddingVertical: AppDesignTokens.layout.v14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: AppDesignTokens.colors.accent,
    borderStyle: "dashed",
  },
  addHabitText: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v15, fontWeight: "600" },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  calendarButton: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v10,
    width: AppDesignTokens.layout.v40,
    height: AppDesignTokens.layout.v40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  calendarButtonText: { fontSize: AppDesignTokens.layout.v18 },
  quickStats: {
    flexDirection: "row",
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    paddingVertical: AppDesignTokens.layout.v12,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
    justifyContent: "space-around",
    alignItems: "center",
  },
  quickStatItem: { alignItems: "center", gap: AppDesignTokens.layout.v2 },
  quickStatValue: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v18, fontWeight: "800" },
  quickStatLabel: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v10, textTransform: "uppercase", letterSpacing: AppDesignTokens.layout.v0p5 },
  quickStatDivider: { width: AppDesignTokens.layout.v1, height: AppDesignTokens.layout.v24, backgroundColor: AppDesignTokens.colors.border },
});
