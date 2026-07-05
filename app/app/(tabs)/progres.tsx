import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUserStats } from "@/features/gamification/hooks/useGamification";
import { useRecentLogs } from "@/features/tracking/hooks/useTracking";
import { useInsights } from "@/features/analytics/hooks/useInsights";
import { useMode } from "@/features/mode";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MiniChart } from "@/features/analytics/components/MiniChart";
import { CrisisHeatmap } from "@/features/analytics/components/CrisisHeatmap";
import { BattleHistory } from "@/features/analytics/components/BattleHistory";

type StatCardProps = {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
};

function StatCard({ label, value, sub, highlight }: StatCardProps) {
  return (
    <View style={[styles.statCard, highlight && styles.statCardHighlight]}>
      <Text style={[styles.statValue, highlight && styles.statValueHighlight]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

const SEVERITY_COLORS = {
  danger: "#e03131",
  warning: "#f59f00",
  positive: "#2f9e44",
} as const;

export default function ProgresScreen() {
  const router = useRouter();
  const stats = useUserStats();
  const recentLogs = useRecentLogs();
  const { insights } = useInsights();
  const { vocab } = useMode();
  const triggers = useQuery(api.triggers.getTopTriggers, {}) ?? [];
  const trends = useQuery(api.charts.getDailyTrends, {});

  const level = stats?.level ?? 1;
  const progress = stats?.progress;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>{vocab.progressTitle}</Text>
            <Text style={styles.subtitle}>{vocab.progressSubtitle}</Text>
          </View>
          <TouchableOpacity
            style={styles.recapButton}
            onPress={() => router.push("/modal/recap" as never)}
          >
            <Text style={styles.recapButtonText}>Récap</Text>
          </TouchableOpacity>
        </View>

        {/* Level badge */}
        <View style={styles.levelBadge}>
          <Text style={styles.levelNumber}>{level}</Text>
          <Text style={styles.levelLabel}>Niveau</Text>
        </View>

        {/* XP progress */}
        <View style={styles.xpSection}>
          <View style={styles.xpRow}>
            <Text style={styles.xpText}>
              {progress?.currentInLevel ?? 0} XP
            </Text>
            <Text style={styles.xpText}>
              {progress?.requiredInLevel ?? 100} XP
            </Text>
          </View>
          <View style={styles.xpBar}>
            <View
              style={[
                styles.xpBarFill,
                { width: `${progress?.percentage ?? 0}%` },
              ]}
            />
          </View>
          <Text style={styles.xpNext}>
            {progress?.xpToNext ?? 100} XP pour le niveau {level + 1}
          </Text>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCard
            label="XP total"
            value={String(stats?.totalXP ?? 0)}
            highlight
          />
          <StatCard
            label="Séquence actuelle"
            value={String(stats?.currentStreak ?? 0)}
            sub="jours"
          />
          <StatCard
            label="Record"
            value={String(stats?.longestStreak ?? 0)}
            sub="jours"
          />
          <StatCard
            label="Rapports"
            value={String(recentLogs?.length ?? 0)}
            sub="ce mois"
          />
        </View>

        {/* Charts */}
        {trends?.mood && (
          <MiniChart
            title="Humeur (14j)"
            data={trends.mood as { label: string; value: number | null }[]}
            maxValue={10}
            unit="/10"
            color="#f59f00"
            invertColor
          />
        )}
        {trends?.sleep && (
          <MiniChart
            title="Sommeil (14j)"
            data={trends.sleep as { label: string; value: number | null }[]}
            maxValue={12}
            unit="h"
            color="#3b82f6"
          />
        )}

        {/* Crisis Heatmap */}
        <CrisisHeatmap />

        {/* Insights */}
        {insights.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Insights</Text>
            <View style={styles.insightsList}>
              {insights.map((insight) => {
                const color = SEVERITY_COLORS[insight.severity];
                return (
                  <View
                    key={insight._id}
                    style={[styles.insightCard, { borderLeftColor: color }]}
                  >
                    <Text style={styles.insightIcon}>{insight.icon}</Text>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightMessage}>{insight.message}</Text>
                      <Text style={[styles.insightConfidence, { color }]}>
                        confiance {Math.round(insight.confidence * 100)}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Triggers */}
        {triggers.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Tes déclencheurs</Text>
            <View style={styles.triggersCard}>
              {(triggers as { trigger: string; count: number; types: string[] }[]).map((t, i) => (
                <View key={t.trigger} style={styles.triggerRow}>
                  <Text style={styles.triggerRank}>{i + 1}</Text>
                  <Text style={styles.triggerText}>{t.trigger}</Text>
                  <View style={styles.triggerMeta}>
                    <Text style={styles.triggerCount}>{t.count}x</Text>
                    {t.types.includes("crisis") && (
                      <Text style={styles.triggerCrisis}>⚔️</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Battle History */}
        <BattleHistory />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#888", marginTop: -8 },
  levelBadge: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6c47ff",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  levelNumber: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  levelLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  xpSection: { gap: 6 },
  xpRow: { flexDirection: "row", justifyContent: "space-between" },
  xpText: { color: "#888", fontSize: 12 },
  xpBar: {
    height: 8,
    backgroundColor: "#1a1a2e",
    borderRadius: 4,
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: "#6c47ff",
    borderRadius: 4,
  },
  xpNext: { color: "#555", fontSize: 12, textAlign: "center" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: {
    width: "47%",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  statCardHighlight: { borderColor: "#6c47ff" },
  statValue: { fontSize: 28, fontWeight: "bold", color: "#6c47ff" },
  statValueHighlight: { color: "#a78bfa" },
  statLabel: { color: "#888", fontSize: 12, textAlign: "center", marginTop: 4 },
  statSub: { color: "#555", fontSize: 11 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#fff" },
  placeholder: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a4a",
    borderStyle: "dashed",
  },
  placeholderText: { color: "#888", fontSize: 14 },
  placeholderSub: {
    color: "#555",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  logList: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a4a",
    overflow: "hidden",
  },
  logItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a4a",
  },
  logType: { color: "#fff", fontSize: 14 },
  logRight: { alignItems: "flex-end", gap: 2 },
  logXP: { color: "#6c47ff", fontSize: 13, fontWeight: "600" },
  logDate: { color: "#555", fontSize: 11 },
  insightsList: { gap: 8 },
  insightCard: {
    flexDirection: "row",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    alignItems: "center",
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  insightIcon: { fontSize: 24 },
  insightContent: { flex: 1, gap: 2 },
  insightMessage: { color: "#fff", fontSize: 13, lineHeight: 18 },
  insightConfidence: { fontSize: 11, fontWeight: "600" },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  recapButton: {
    backgroundColor: "#6c47ff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  recapButtonText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  triggersCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a4a",
    overflow: "hidden",
  },
  triggerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a4a",
  },
  triggerRank: { color: "#555", fontSize: 13, fontWeight: "700", width: 20, textAlign: "center" },
  triggerText: { flex: 1, color: "#fff", fontSize: 14, textTransform: "capitalize" },
  triggerMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  triggerCount: { color: "#6c47ff", fontSize: 13, fontWeight: "600" },
  triggerCrisis: { fontSize: 14 },
});
