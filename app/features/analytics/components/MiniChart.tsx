import { StyleSheet, Text, View } from "react-native";
import { AppDesignTokens } from '@/constants/AppDesignTokens';

type DataPoint = {
  label: string;
  value: number | null;
};

type MiniChartProps = {
  title: string;
  data: DataPoint[];
  maxValue: number;
  unit: string;
  color: string;
  invertColor?: boolean; // high = bad (mood intensity)
};

export function MiniChart({
  title,
  data,
  maxValue,
  unit,
  color,
  invertColor,
}: MiniChartProps) {
  const values = data.map((d) => d.value).filter((v): v is number => v !== null);
  if (values.length === 0) return null;

  const avg = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
  const chartHeight = 80;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.avg, { color }]}>
          moy. {avg}{unit}
        </Text>
      </View>
      <View style={styles.chart}>
        {data.map((point, i) => {
          const ratio = point.value !== null ? point.value / maxValue : 0;
          const barHeight = Math.max(ratio * chartHeight, 2);
          const barColor =
            point.value === null
              ? AppDesignTokens.colors.surface
              : invertColor
              ? AppDesignTokens.colors.warning
              : color;

          return (
            <View key={i} style={styles.barColumn}>
              <View style={[styles.barContainer, { height: chartHeight }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: point.value !== null ? barColor : AppDesignTokens.colors.surface,
                      borderRadius: 3,
                    },
                  ]}
                />
              </View>
              {i % 2 === 0 && (
                <Text style={styles.label}>{point.label}</Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: AppDesignTokens.colors.text, fontSize: 14, fontWeight: "600" },
  avg: { fontSize: 13, fontWeight: "600" },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  barContainer: {
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },
  bar: {
    width: "70%",
    minWidth: 4,
  },
  label: {
    fontSize: 9,
    color: AppDesignTokens.colors.textSubtle,
  },
});
