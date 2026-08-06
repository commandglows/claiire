import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMode } from "@/features/mode";
import { AppDesignTokens } from '@/constants/AppDesignTokens';

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];
const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

type DayActivity = {
  day: number;
  types: string[];
  xp: number;
  count: number;
  combo: boolean;
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month - 1, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

export default function CalendarModal() {
  const router = useRouter();
  const { colors } = useMode();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const activity = useQuery(api.calendar.getMonthActivity, { year, month }) ?? [];
  const activityMap = new Map(
    (activity as DayActivity[]).map((a) => [a.day, a]),
  );

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const today = now.getFullYear() === year && now.getMonth() + 1 === month ? now.getDate() : null;

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
    setSelectedDay(null);
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
    setSelectedDay(null);
  }

  const selectedActivity = selectedDay ? activityMap.get(selectedDay) : null;

  // Build calendar grid
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendrier</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Month navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
            <Text style={styles.navText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {MONTH_NAMES[month - 1]} {year}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
            <Text style={styles.navText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Weekday headers */}
        <View style={styles.weekRow}>
          {WEEKDAYS.map((d, i) => (
            <View key={i} style={styles.weekCell}>
              <Text style={styles.weekText}>{d}</Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.grid}>
          {cells.map((day, i) => {
            if (day === null) {
              return <View key={`e${i}`} style={styles.dayCell} />;
            }

            const act = activityMap.get(day);
            const isToday = day === today;
            const isSelected = day === selectedDay;
            const hasCombo = act?.combo;
            const hasActivity = !!act;

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayCell,
                  isToday && styles.dayCellToday,
                  isSelected && { borderColor: colors.accent },
                ]}
                onPress={() => setSelectedDay(day === selectedDay ? null : day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    isToday && { color: colors.accent, fontWeight: "700" },
                    !hasActivity && styles.dayTextEmpty,
                  ]}
                >
                  {day}
                </Text>
                {hasCombo ? (
                  <View style={[styles.dot, styles.dotCombo]} />
                ) : hasActivity ? (
                  <View style={[styles.dot, { backgroundColor: colors.accent }]} />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
            <Text style={styles.legendText}>Activité</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.dotCombo]} />
            <Text style={styles.legendText}>Combo</Text>
          </View>
        </View>

        {/* Selected day detail */}
        {selectedDay && (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>
              {selectedDay} {MONTH_NAMES[month - 1]}
            </Text>
            {selectedActivity ? (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Logs</Text>
                  <Text style={styles.detailValue}>{selectedActivity.count}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>XP gagné</Text>
                  <Text style={[styles.detailValue, { color: colors.accent }]}>
                    +{selectedActivity.xp}
                  </Text>
                </View>
                <View style={styles.detailTypes}>
                  {selectedActivity.types.map((t: string) => (
                    <View key={t} style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>{t}</Text>
                    </View>
                  ))}
                </View>
                {selectedActivity.combo && (
                  <Text style={styles.comboText}>🔥 Combo du jour !</Text>
                )}
              </>
            ) : (
              <Text style={styles.detailEmpty}>Aucune activité ce jour</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppDesignTokens.colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeText: { color: AppDesignTokens.colors.textMuted, fontSize: 18, padding: 4 },
  headerTitle: { color: AppDesignTokens.colors.text, fontSize: 17, fontWeight: "700" },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  monthNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: { padding: 8 },
  navText: { color: AppDesignTokens.colors.text, fontSize: 24, fontWeight: "300" },
  monthTitle: { color: AppDesignTokens.colors.text, fontSize: 18, fontWeight: "700" },
  weekRow: { flexDirection: "row" },
  weekCell: { flex: 1, alignItems: "center", paddingVertical: 8 },
  weekText: { color: AppDesignTokens.colors.textSubtle, fontSize: 12, fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderWidth: 1.5,
    borderColor: "transparent",
    borderRadius: 10,
  },
  dayCellToday: { backgroundColor: AppDesignTokens.colors.surface, borderRadius: 10 },
  dayText: { color: AppDesignTokens.colors.neutralBorder, fontSize: 14 },
  dayTextEmpty: { color: AppDesignTokens.colors.neutralDark },
  dot: { width: 5, height: 5, borderRadius: 3 },
  dotCombo: { backgroundColor: AppDesignTokens.colors.warning },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: AppDesignTokens.colors.textMuted, fontSize: 12 },
  detailCard: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  detailTitle: { color: AppDesignTokens.colors.text, fontSize: 16, fontWeight: "600" },
  detailRow: { flexDirection: "row", justifyContent: "space-between" },
  detailLabel: { color: AppDesignTokens.colors.textMuted, fontSize: 14 },
  detailValue: { color: AppDesignTokens.colors.text, fontSize: 14, fontWeight: "600" },
  detailTypes: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  typeBadge: {
    backgroundColor: AppDesignTokens.colors.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeBadgeText: { color: AppDesignTokens.colors.textMuted, fontSize: 12, textTransform: "capitalize" },
  detailEmpty: { color: AppDesignTokens.colors.textSubtle, fontSize: 14 },
  comboText: { color: AppDesignTokens.colors.warning, fontSize: 14, fontWeight: "600" },
});
