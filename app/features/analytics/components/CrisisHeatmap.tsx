import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMode } from "@/features/mode";
import { AppDesignTokens } from '@/constants/AppDesignTokens';

type HeatmapData = {
  grid: number[][];
  max: number;
  totalCrises: number;
  days: string[];
  blocks: string[];
};

function getHeatColor(value: number, max: number): string {
  if (value === 0) return AppDesignTokens.colors.surfaceMutedAlt;
  const intensity = value / max;
  if (intensity <= 0.25) return AppDesignTokens.colors.surfaceMutedAlt;
  if (intensity <= 0.5) return AppDesignTokens.colors.borderSoft;
  if (intensity <= 0.75) return AppDesignTokens.colors.warning40;
  return AppDesignTokens.colors.danger;
}

export function CrisisHeatmap() {
  const data = useQuery(api.charts.getCrisisHeatmap, {}) as HeatmapData | null;
  const { mode } = useMode();

  if (!data || data.totalCrises === 0) return null;

  const CELL_SIZE = 36;

  // Find the hottest cell
  let hotDay = 0;
  let hotBlock = 0;
  let hotValue = 0;
  for (let d = 0; d < 7; d++) {
    for (let b = 0; b < 6; b++) {
      if (data.grid[d][b] > hotValue) {
        hotValue = data.grid[d][b];
        hotDay = d;
        hotBlock = b;
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === "warrior" ? "Carte des attaques" : "Moments difficiles"}
      </Text>
      <Text style={styles.subtitle}>
        {data.totalCrises} crises · 90 derniers jours
      </Text>

      {/* Grid */}
      <View style={styles.grid}>
        {/* Time block headers */}
        <View style={styles.headerRow}>
          <View style={{ width: 32 }} />
          {data.blocks.map((block) => (
            <Text key={block} style={[styles.blockLabel, { width: CELL_SIZE }]}>
              {block.split("-")[0]}h
            </Text>
          ))}
        </View>

        {/* Day rows */}
        {data.days.map((day, dayIdx) => (
          <View key={day} style={styles.row}>
            <Text style={styles.dayLabel}>{day}</Text>
            {data.grid[dayIdx].map((count, blockIdx) => (
              <View
                key={`${dayIdx}-${blockIdx}`}
                style={[
                  styles.cell,
                  {
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: getHeatColor(count, data.max),
                  },
                ]}
              >
                {count > 0 && (
                  <Text style={styles.cellText}>{count}</Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendLabel}>Moins</Text>
        {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
          <View
            key={intensity}
            style={[
              styles.legendCell,
              { backgroundColor: getHeatColor(intensity * data.max || 0, data.max) },
            ]}
          />
        ))}
        <Text style={styles.legendLabel}>Plus</Text>
      </View>

      {/* Insight */}
      {hotValue > 1 && (
        <View style={styles.insight}>
          <Text style={styles.insightText}>
            ⚠️ Point chaud : {data.days[hotDay]} {data.blocks[hotBlock]} ({hotValue} crises)
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  title: { color: AppDesignTokens.colors.text, fontSize: 15, fontWeight: "600" },
  subtitle: { color: AppDesignTokens.colors.textMuted, fontSize: 12, marginTop: -4 },
  grid: { gap: 2 },
  headerRow: { flexDirection: "row", marginBottom: 2 },
  blockLabel: { color: AppDesignTokens.colors.textSubtle, fontSize: 9, textAlign: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: 2 },
  dayLabel: { color: AppDesignTokens.colors.textMuted, fontSize: 10, width: 30, textAlign: "right", paddingRight: 4 },
  cell: {
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: { color: AppDesignTokens.colors.text, fontSize: 10, fontWeight: "600" },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 4,
  },
  legendLabel: { color: AppDesignTokens.colors.textSubtle, fontSize: 10 },
  legendCell: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  insight: {
    backgroundColor: AppDesignTokens.colors.surfaceSecondary,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.warning40,
  },
  insightText: { color: AppDesignTokens.colors.warning, fontSize: 12, fontWeight: "500" },
});
