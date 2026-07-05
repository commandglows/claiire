import { useState } from "react";
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
  easy: "#2f9e44",
  medium: "#f59f00",
  hard: "#e03131",
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
      <Text style={styles.habitIcon}>{habit.icon ?? "⚡"}</Text>
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
              <Text style={[styles.quickStatValue, { color: "#f59f00" }]}>
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
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#888", marginTop: -8 },
  quickRow: { flexDirection: "row", gap: 10 },
  quickButton: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  quickEmoji: { fontSize: 26 },
  quickLabel: { color: "#fff", fontSize: 12, fontWeight: "500" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#fff" },
  sectionBadge: {
    backgroundColor: "#6c47ff",
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  habitsList: { gap: 8 },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  habitRowDone: { borderColor: "#2f9e44", opacity: 0.7 },
  habitIcon: { fontSize: 26, width: 32, textAlign: "center" },
  habitInfo: { flex: 1, gap: 2 },
  habitName: { color: "#fff", fontSize: 15, fontWeight: "500" },
  habitNameDone: { color: "#888", textDecorationLine: "line-through" },
  habitMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  habitXP: { fontSize: 12, fontWeight: "600" },
  missionBadge: { fontSize: 12 },
  habitStreak: { color: "#f59f00", fontSize: 11, fontWeight: "600" },
  checkButton: {
    backgroundColor: "#6c47ff",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  checkButtonDone: { backgroundColor: "#2f9e44" },
  checkButtonText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  emptyHabits: {
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    padding: 32,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#2a2a4a",
    borderStyle: "dashed",
  },
  emptyEmoji: { fontSize: 40 },
  emptyText: { color: "#888", fontSize: 15, fontWeight: "500" },
  emptySub: { color: "#555", fontSize: 12, textAlign: "center" },
  addHabitButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#6c47ff",
    borderStyle: "dashed",
  },
  addHabitText: { color: "#6c47ff", fontSize: 15, fontWeight: "600" },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  calendarButton: {
    backgroundColor: "#1a1a2e",
    borderRadius: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  calendarButtonText: { fontSize: 18 },
  quickStats: {
    flexDirection: "row",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#2a2a4a",
    justifyContent: "space-around",
    alignItems: "center",
  },
  quickStatItem: { alignItems: "center", gap: 2 },
  quickStatValue: { color: "#fff", fontSize: 18, fontWeight: "800" },
  quickStatLabel: { color: "#888", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 },
  quickStatDivider: { width: 1, height: 24, backgroundColor: "#2a2a4a" },
});
