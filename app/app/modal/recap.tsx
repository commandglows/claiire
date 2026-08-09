import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMode } from "@/features/mode";
import { AppDesignTokens } from '@/constants/AppDesignTokens';

type WeekData = {
  xp: number;
  totalLogs: number;
  activeDays: number;
  moodAvg: number | null;
  sleepAvg: number | null;
  crises: number;
  habits: number;
};

function CompareStat({
  label,
  thisVal,
  lastVal,
  unit,
  lowerIsBetter,
}: {
  label: string;
  thisVal: number | null;
  lastVal: number | null;
  unit?: string;
  lowerIsBetter?: boolean;
}) {
  if (thisVal === null && lastVal === null) return null;

  const current = thisVal ?? 0;
  const previous = lastVal ?? 0;
  const diff = current - previous;
  const improved = lowerIsBetter ? diff < 0 : diff > 0;
  const same = diff === 0;

  const arrow = same ? "=" : improved ? "↑" : "↓";
  const arrowColor = same ? AppDesignTokens.colors.textMuted : improved ? AppDesignTokens.colors.success : AppDesignTokens.colors.danger;

  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statRight}>
        <Text style={styles.statValue}>
          {current}{unit ?? ""}
        </Text>
        {lastVal !== null && (
          <Text style={[styles.statDiff, { color: arrowColor }]}>
            {arrow} {Math.abs(diff)}{unit ?? ""}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function RecapModal() {
  const router = useRouter();
  const recap = useQuery(api.recap.getWeeklyRecap, {});
  const { vocab } = useMode();

  if (!recap) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { thisWeek, lastWeek } = recap;

  // Generate a verdict
  const xpDiff = thisWeek.xp - lastWeek.xp;
  const moodImproved =
    thisWeek.moodAvg !== null &&
    lastWeek.moodAvg !== null &&
    thisWeek.moodAvg < lastWeek.moodAvg;
  const moreActive = thisWeek.activeDays > lastWeek.activeDays;
  const lessCrises = thisWeek.crises < lastWeek.crises;

  let verdictEmoji = "📊";
  let verdictText = "Semaine stable.";

  const positives = [xpDiff > 0, moodImproved, moreActive, lessCrises].filter(Boolean).length;
  if (positives >= 3) {
    verdictEmoji = "🌟";
    verdictText = "Semaine exceptionnelle ! Continue comme ça.";
  } else if (positives >= 2) {
    verdictEmoji = "💪";
    verdictText = "Bonne semaine, la tendance est positive.";
  } else if (positives === 1) {
    verdictEmoji = "🌱";
    verdictText = "Des hauts et des bas. Chaque jour compte.";
  } else if (thisWeek.totalLogs === 0) {
    verdictEmoji = "😴";
    verdictText = "Pas d'activité cette semaine. On reprend ?";
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Récap de la semaine</Text>
        <View style={{ width: AppDesignTokens.layout.v32 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Verdict */}
        <View style={styles.verdictCard}>
          <Text style={styles.verdictEmoji}>{verdictEmoji}</Text>
          <Text style={styles.verdictText}>{verdictText}</Text>
          <Text style={styles.verdictWeek}>Semaine du {recap.weekOf}</Text>
        </View>

        {/* XP highlight */}
        <View style={styles.xpCard}>
          <Text style={styles.xpValue}>+{thisWeek.xp}</Text>
          <Text style={styles.xpLabel}>{vocab.xpLabel} cette semaine</Text>
          {lastWeek.xp > 0 && (
            <Text style={[styles.xpDiff, { color: xpDiff >= 0 ? AppDesignTokens.colors.success : AppDesignTokens.colors.danger }]}>
              {xpDiff >= 0 ? "+" : ""}{xpDiff} vs semaine dernière
            </Text>
          )}
        </View>

        {/* Detailed stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Détails</Text>
          <CompareStat
            label="Jours actifs"
            thisVal={thisWeek.activeDays}
            lastVal={lastWeek.activeDays}
            unit="/7"
          />
          <CompareStat
            label="Rapports"
            thisVal={thisWeek.totalLogs}
            lastVal={lastWeek.totalLogs}
          />
          <CompareStat
            label="Habitudes"
            thisVal={thisWeek.habits}
            lastVal={lastWeek.habits}
          />
          <CompareStat
            label="Sommeil moyen"
            thisVal={thisWeek.sleepAvg}
            lastVal={lastWeek.sleepAvg}
            unit="h"
          />
          <CompareStat
            label="Intensité humeur"
            thisVal={thisWeek.moodAvg}
            lastVal={lastWeek.moodAvg}
            unit="/10"
            lowerIsBetter
          />
          <CompareStat
            label="Crises"
            thisVal={thisWeek.crises}
            lastVal={lastWeek.crises}
            lowerIsBetter
          />
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
          <Text style={styles.doneButtonText}>Compris !</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppDesignTokens.colors.background },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v15 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: AppDesignTokens.layout.v20,
    paddingVertical: AppDesignTokens.layout.v12,
  },
  closeText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v18, padding: AppDesignTokens.layout.v4 },
  headerTitle: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v17, fontWeight: "700" },
  scroll: { flex: 1 },
  content: { padding: AppDesignTokens.layout.v20, gap: AppDesignTokens.layout.v16, paddingBottom: AppDesignTokens.layout.v40 },
  verdictCard: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v16,
    padding: AppDesignTokens.layout.v24,
    alignItems: "center",
    gap: AppDesignTokens.layout.v8,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  verdictEmoji: { fontSize: AppDesignTokens.layout.v56 },
  verdictText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v16, fontWeight: "600", textAlign: "center" },
  verdictWeek: { color: AppDesignTokens.colors.textSubtle, fontSize: AppDesignTokens.layout.v12 },
  xpCard: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v14,
    padding: AppDesignTokens.layout.v20,
    alignItems: "center",
    gap: AppDesignTokens.layout.v4,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.accent40,
  },
  xpValue: { fontSize: AppDesignTokens.layout.v42, fontWeight: "bold", color: AppDesignTokens.colors.accent },
  xpLabel: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v14 },
  xpDiff: { fontSize: AppDesignTokens.layout.v13, fontWeight: "600" },
  statsCard: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v14,
    padding: AppDesignTokens.layout.v16,
    gap: AppDesignTokens.layout.v12,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  statsTitle: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v15, fontWeight: "600", marginBottom: AppDesignTokens.layout.v4 },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v14 },
  statRight: { flexDirection: "row", alignItems: "center", gap: AppDesignTokens.layout.v8 },
  statValue: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v15, fontWeight: "600" },
  statDiff: { fontSize: AppDesignTokens.layout.v12, fontWeight: "600" },
  doneButton: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v14,
    paddingVertical: AppDesignTokens.layout.v16,
    alignItems: "center",
  },
  doneButtonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v16, fontWeight: "700" },
});
