import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMode } from "@/features/mode";
import { AppDesignTokens } from '@/constants/AppDesignTokens';
import { AppIcon, type AppIconName } from "@/components/AppIcon";

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

const TYPE_CONFIG: Record<string, { icon: AppIconName; warrior: string; zen: string; isVictory: boolean }> = {
  sleep: { icon: "moon", warrior: "Rapport sommeil", zen: "Sommeil", isVictory: true },
  mood: { icon: "target", warrior: "Rapport humeur", zen: "Humeur", isVictory: true },
  habit: { icon: "zap", warrior: "Mission accomplie", zen: "Habitude", isVictory: true },
  crisis: { icon: "swords", warrior: "Bataille", zen: "Moment difficile", isVictory: false },
  meal: { icon: "utensils", warrior: "Ravitaillement", zen: "Repas", isVictory: true },
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
              icon: "notebook" as const,
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
                    <AppIcon name={config.icon} color={config.isVictory ? AppDesignTokens.colors.success : AppDesignTokens.colors.danger} size={AppDesignTokens.icons.sizeSm} />
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
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v14,
    padding: AppDesignTokens.layout.v16,
    gap: AppDesignTokens.layout.v10,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  header: { gap: AppDesignTokens.layout.v4 },
  title: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v15, fontWeight: "600" },
  statsRow: { flexDirection: "row", gap: AppDesignTokens.layout.v12 },
  statVictory: { color: AppDesignTokens.colors.success, fontSize: AppDesignTokens.layout.v12, fontWeight: "600" },
  statBattle: { color: AppDesignTokens.colors.danger, fontSize: AppDesignTokens.layout.v12, fontWeight: "600" },
  filterRow: { flexDirection: "row", gap: AppDesignTokens.layout.v6 },
  filterChip: {
    paddingVertical: AppDesignTokens.layout.v5,
    paddingHorizontal: AppDesignTokens.layout.v12,
    borderRadius: AppDesignTokens.layout.v8,
    backgroundColor: AppDesignTokens.colors.surfaceMutedAlt,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  filterChipActive: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderColor: AppDesignTokens.colors.accent,
  },
  filterText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v12, fontWeight: "500" },
  filterTextActive: { color: AppDesignTokens.colors.text, fontWeight: "700" },
  dayHeader: {
    color: AppDesignTokens.colors.textSubtle,
    fontSize: AppDesignTokens.layout.v11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: AppDesignTokens.layout.v0p5,
    paddingTop: AppDesignTokens.layout.v8,
    paddingBottom: AppDesignTokens.layout.v4,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: AppDesignTokens.layout.v4,
    minHeight: AppDesignTokens.layout.v40,
  },
  dot: {
    width: AppDesignTokens.layout.v8,
    height: AppDesignTokens.layout.v8,
    borderRadius: AppDesignTokens.layout.v4,
    marginTop: AppDesignTokens.layout.v6,
    zIndex: AppDesignTokens.layout.v1,
  },
  dotVictory: { backgroundColor: AppDesignTokens.colors.success },
  dotBattle: { backgroundColor: AppDesignTokens.colors.danger },
  line: {
    position: "absolute",
    left: AppDesignTokens.layout.v7,
    top: AppDesignTokens.layout.v14,
    bottom: AppDesignTokens.layout.vMinus8,
    width: AppDesignTokens.layout.v1,
    backgroundColor: AppDesignTokens.colors.border,
  },
  itemContent: { flex: 1, paddingLeft: AppDesignTokens.layout.v12, paddingBottom: AppDesignTokens.layout.v8 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: AppDesignTokens.layout.v8 },
  itemLabel: { flex: 1, color: AppDesignTokens.colors.neutralBorder, fontSize: AppDesignTokens.layout.v13, fontWeight: "500" },
  itemXP: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v12, fontWeight: "700" },
  itemXPBattle: { color: AppDesignTokens.colors.warning },
  itemTime: { color: AppDesignTokens.colors.textSubtle, fontSize: AppDesignTokens.layout.v11, paddingLeft: AppDesignTokens.layout.v24 },
  emptyText: { color: AppDesignTokens.colors.textSubtle, fontSize: AppDesignTokens.layout.v13, textAlign: "center", paddingVertical: AppDesignTokens.layout.v12 },
});
