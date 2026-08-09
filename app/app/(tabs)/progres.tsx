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
import { AppDesignTokens } from '@/constants/AppDesignTokens';
import { AppIcon } from "@/components/AppIcon";

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
  danger: AppDesignTokens.colors.danger,
  warning: AppDesignTokens.colors.warning,
  positive: AppDesignTokens.colors.success,
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
            color={AppDesignTokens.colors.warning}
            invertColor
          />
        )}
        {trends?.sleep && (
          <MiniChart
            title="Sommeil (14j)"
            data={trends.sleep as { label: string; value: number | null }[]}
            maxValue={12}
            unit="h"
            color={AppDesignTokens.colors.accentAlt}
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
                    <View style={styles.insightIcon}>
                      <AppIcon name={insight.icon} color={AppDesignTokens.colors.warning} size={AppDesignTokens.icons.sizeMd} />
                    </View>
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
  container: { flex: 1, backgroundColor: AppDesignTokens.colors.background },
  content: { padding: AppDesignTokens.layout.v20, gap: AppDesignTokens.layout.v16 },
  title: { fontSize: AppDesignTokens.layout.v24, fontWeight: "bold", color: AppDesignTokens.colors.text },
  subtitle: { fontSize: AppDesignTokens.layout.v14, color: AppDesignTokens.colors.textMuted, marginTop: AppDesignTokens.layout.vMinus8 },
  levelBadge: {
    alignSelf: "center",
    width: AppDesignTokens.layout.v80,
    height: AppDesignTokens.layout.v80,
    borderRadius: AppDesignTokens.layout.v40,
    backgroundColor: AppDesignTokens.colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: AppDesignTokens.layout.v4,
  },
  levelNumber: { fontSize: AppDesignTokens.layout.v32, fontWeight: "bold", color: AppDesignTokens.colors.text },
  levelLabel: {
    fontSize: AppDesignTokens.layout.v11,
    color: AppDesignTokens.colors.mutedText,
    textTransform: "uppercase",
    letterSpacing: AppDesignTokens.layout.v1,
  },
  xpSection: { gap: AppDesignTokens.layout.v6 },
  xpRow: { flexDirection: "row", justifyContent: "space-between" },
  xpText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v12 },
  xpBar: {
    height: AppDesignTokens.layout.v8,
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v4,
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v4,
  },
  xpNext: { color: AppDesignTokens.colors.textSubtle, fontSize: AppDesignTokens.layout.v12, textAlign: "center" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: AppDesignTokens.layout.v12 },
  statCard: {
    width: "47%",
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  statCardHighlight: { borderColor: AppDesignTokens.colors.accent },
  statValue: { fontSize: AppDesignTokens.layout.v28, fontWeight: "bold", color: AppDesignTokens.colors.accent },
  statValueHighlight: { color: AppDesignTokens.colors.accentSoft },
  statLabel: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v12, textAlign: "center", marginTop: AppDesignTokens.layout.v4 },
  statSub: { color: AppDesignTokens.colors.textSubtle, fontSize: AppDesignTokens.layout.v11 },
  sectionTitle: { fontSize: AppDesignTokens.layout.v16, fontWeight: "600", color: AppDesignTokens.colors.text },
  placeholder: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
    borderStyle: "dashed",
  },
  placeholderText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v14 },
  placeholderSub: {
    color: AppDesignTokens.colors.textSubtle,
    fontSize: AppDesignTokens.layout.v12,
    marginTop: AppDesignTokens.layout.v4,
    textAlign: "center",
  },
  logList: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
    overflow: "hidden",
  },
  logItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: AppDesignTokens.layout.v14,
    borderBottomWidth: 1,
    borderBottomColor: AppDesignTokens.colors.border,
  },
  logType: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v14 },
  logRight: { alignItems: "flex-end", gap: AppDesignTokens.layout.v2 },
  logXP: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v13, fontWeight: "600" },
  logDate: { color: AppDesignTokens.colors.textSubtle, fontSize: AppDesignTokens.layout.v11 },
  insightsList: { gap: AppDesignTokens.layout.v8 },
  insightCard: {
    flexDirection: "row",
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v14,
    gap: AppDesignTokens.layout.v12,
    alignItems: "center",
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  insightIcon: { alignItems: "center", justifyContent: "center" },
  insightContent: { flex: 1, gap: AppDesignTokens.layout.v2 },
  insightMessage: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v13, lineHeight: AppDesignTokens.layout.v18 },
  insightConfidence: { fontSize: AppDesignTokens.layout.v11, fontWeight: "600" },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  recapButton: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v10,
    paddingVertical: AppDesignTokens.layout.v8,
    paddingHorizontal: AppDesignTokens.layout.v14,
  },
  recapButtonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v13, fontWeight: "700" },
  triggersCard: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
    overflow: "hidden",
  },
  triggerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: AppDesignTokens.layout.v12,
    gap: AppDesignTokens.layout.v10,
    borderBottomWidth: 1,
    borderBottomColor: AppDesignTokens.colors.border,
  },
  triggerRank: { color: AppDesignTokens.colors.textSubtle, fontSize: AppDesignTokens.layout.v13, fontWeight: "700", width: AppDesignTokens.layout.v20, textAlign: "center" },
  triggerText: { flex: 1, color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v14, textTransform: "capitalize" },
  triggerMeta: { flexDirection: "row", alignItems: "center", gap: AppDesignTokens.layout.v6 },
  triggerCount: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v13, fontWeight: "600" },
  triggerCrisis: { fontSize: AppDesignTokens.layout.v14 },
});
