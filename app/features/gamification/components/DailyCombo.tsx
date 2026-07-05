import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMode } from "@/features/mode";

type StepProps = {
  icon: string;
  label: string;
  done: boolean;
  accent: string;
};

function ComboStep({ icon, label, done, accent }: StepProps) {
  return (
    <View style={[styles.step, done && { borderColor: accent }]}>
      <Text style={[styles.stepIcon, !done && styles.stepIconDim]}>{icon}</Text>
      <Text style={[styles.stepLabel, done && { color: accent }]}>{label}</Text>
      {done && <Text style={[styles.stepCheck, { color: accent }]}>✓</Text>}
    </View>
  );
}

export function DailyCombo() {
  const activity = useQuery(api.daily.getTodayActivity, {});
  const { vocab, colors } = useMode();

  if (!activity) return null;

  const steps = [
    { icon: "😴", label: vocab.logSleep, done: activity.sleep },
    { icon: "🎯", label: vocab.logMood, done: activity.mood },
    { icon: "⚡", label: vocab.logHabit, done: activity.habit },
  ];

  const completed = steps.filter((s) => s.done).length;

  if (activity.comboComplete) {
    return (
      <View style={[styles.comboDone, { borderColor: colors.accent }]}>
        <Text style={styles.comboDoneEmoji}>🔥</Text>
        <View style={styles.comboDoneText}>
          <Text style={[styles.comboDoneTitle, { color: colors.accent }]}>
            Combo du jour !
          </Text>
          <Text style={styles.comboDoneSub}>+50 XP bonus gagné</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Combo du jour</Text>
        <Text style={[styles.counter, { color: colors.accent }]}>
          {completed}/3
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${(completed / 3) * 100}%`, backgroundColor: colors.accent },
          ]}
        />
      </View>
      <View style={styles.steps}>
        {steps.map((s) => (
          <ComboStep key={s.label} {...s} accent={colors.accent} />
        ))}
      </View>
      <Text style={styles.hint}>
        +50 XP quand les 3 sont faits
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 14, fontWeight: "600" },
  counter: { fontSize: 13, fontWeight: "700" },
  progressBar: {
    height: 6,
    backgroundColor: "#0f0f1a",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 3 },
  steps: { flexDirection: "row", gap: 8 },
  step: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0f0f1a",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  stepIcon: { fontSize: 16 },
  stepIconDim: { opacity: 0.4 },
  stepLabel: { fontSize: 11, color: "#555", flex: 1 },
  stepCheck: { fontSize: 13, fontWeight: "700" },
  hint: { color: "#444", fontSize: 11, textAlign: "center" },
  comboDone: {
    flexDirection: "row",
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    padding: 16,
    gap: 12,
    alignItems: "center",
    borderWidth: 1.5,
  },
  comboDoneEmoji: { fontSize: 32 },
  comboDoneText: { gap: 2 },
  comboDoneTitle: { fontSize: 16, fontWeight: "700" },
  comboDoneSub: { color: "#888", fontSize: 12 },
});
