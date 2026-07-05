import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMode } from "@/features/mode";

type LogEntry = {
  _id: string;
  type: string;
  xpAwarded: number;
  createdAt: number;
  data: Record<string, unknown>;
};

const FILTER_OPTIONS = ["all", "7d", "30d", "90d"] as const;
type Filter = (typeof FILTER_OPTIONS)[number];

const FILTER_LABELS: Record<Filter, string> = {
  all: "Tout",
  "7d": "7j",
  "30d": "30j",
  "90d": "90j",
};

const TYPE_CONFIG: Record<string, { emoji: string; warrior: string; zen: string; isVictory: boolean }> = {
  sleep: { emoji: "😴", warrior: "Rapport sommeil", zen: "Sommeil", isVictory: true },
  mood: { emoji: "🎯", warrior: "Rapport humeur", zen: "Humeur", isVictory: true },
  habit: { emoji: "⚡", warrior: "Mission accomplie", zen: "Habitude", isVictory: true },
  crisis: { emoji: "⚔️", warrior: "Bataille", zen: "Moment difficile", isVictory: false },
  meal: { emoji: "🍽️", warrior: "Ravitaillement", zen: "Repas", isVictory: true },
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) +
    " · " +
    d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function BattleHistory() {
  const { mode } = useMode();
  const logs = useQuery(api.tracking.getRecentLogs, { limit: 100 }) as LogEntry[] | undefined;
  const [filter, setFilter] = useState<Filter>("30d");

  if (!logs || logs.length === 0) return null;

  const isWarrior = mode === "warrior";
  const now = Date.now();
  const DAY_MS = 86_400_000;

  const filterMs: Record<Filter, number> = {
    all: 0,
    "7d": now - 7 * DAY_MS,
    "30d": now - 30 * DAY_MS,
    "90d": now - 90 * DAY_MS,
  };

  const filtered = filter === "all"
    ? logs
    : logs.filter((l) => l.createdAt >= filterMs[filter]);

  // Group by date
  const grouped = new Map<string, LogEntry[]>();
  for (const log of filtered) {
    const day = new Date(log.createdAt).toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    if (!grouped.has(day)) grouped.set(day, []);
    grouped.get(day)!.push(log);
  }

  const victories = filtered.filter((l) => TYPE_CONFIG[l.type]?.isVictory !== false).length;
  const battles = filtered.filter((l) => l.type === "crisis").length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isWarrior ? "Historique de guerre" : "Historique"}
        </Text>
        <View style={styles.statsRow}>
          <Text style={styles.statVictory}>{victories} victoires</Text>
          {battles > 0 && <Text style={styles.statBattle}>{battles} batailles</Text>}
        </View>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTER_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.filterChip, filter === opt && styles.filterChipActive]}
            onPress={() => setFilter(opt)}
          >
            <Text style={[styles.filterText, filter === opt && styles.filterTextActive]}>
              {FILTER_LABELS[opt]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timeline */}
      {Array.from(grouped.entries()).map(([day, dayLogs]) => (
        <View key={day}>
          <Text style={styles.dayHeader}>{day}</Text>
          {dayLogs.map((log) => {
            const config = TYPE_CONFIG[log.type] ?? {
              emoji: "📝",
              warrior: log.type,
              zen: log.type,
              isVictory: true,
            };
            return (
              <View key={log._id} style={styles.timelineItem}>
                <View style={[styles.dot, config.isVictory ? styles.dotVictory : styles.dotBattle]} />
                <View style={styles.line} />
                <View style={styles.itemContent}>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemEmoji}>{config.emoji}</Text>
                    <Text style={styles.itemLabel}>
                      {isWarrior ? config.warrior : config.zen}
                    </Text>
                    <Text style={[styles.itemXP, !config.isVictory && styles.itemXPBattle]}>
                      +{log.xpAwarded}
                    </Text>
                  </View>
                  <Text style={styles.itemTime}>{formatTime(log.createdAt)}</Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}

      {filtered.length === 0 && (
        <Text style={styles.emptyText}>Aucune activité sur cette période</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  header: { gap: 4 },
  title: { color: "#fff", fontSize: 15, fontWeight: "600" },
  statsRow: { flexDirection: "row", gap: 12 },
  statVictory: { color: "#2f9e44", fontSize: 12, fontWeight: "600" },
  statBattle: { color: "#e03131", fontSize: 12, fontWeight: "600" },
  filterRow: { flexDirection: "row", gap: 6 },
  filterChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#13131f",
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  filterChipActive: { backgroundColor: "#6c47ff", borderColor: "#6c47ff" },
  filterText: { color: "#888", fontSize: 12, fontWeight: "500" },
  filterTextActive: { color: "#fff", fontWeight: "700" },
  dayHeader: {
    color: "#555",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingTop: 8,
    paddingBottom: 4,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: 4,
    minHeight: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    zIndex: 1,
  },
  dotVictory: { backgroundColor: "#2f9e44" },
  dotBattle: { backgroundColor: "#e03131" },
  line: {
    position: "absolute",
    left: 7,
    top: 14,
    bottom: -8,
    width: 1,
    backgroundColor: "#2a2a4a",
  },
  itemContent: { flex: 1, paddingLeft: 12, paddingBottom: 8 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  itemEmoji: { fontSize: 16 },
  itemLabel: { flex: 1, color: "#ccc", fontSize: 13, fontWeight: "500" },
  itemXP: { color: "#6c47ff", fontSize: 12, fontWeight: "700" },
  itemXPBattle: { color: "#f59f00" },
  itemTime: { color: "#555", fontSize: 11, paddingLeft: 24 },
  emptyText: { color: "#555", fontSize: 13, textAlign: "center", paddingVertical: 12 },
});
