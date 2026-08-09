import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMode } from "@/features/mode";
import { AppDesignTokens } from '@/constants/AppDesignTokens';
import { AppIcon } from "@/components/AppIcon";

type StepProps = {
  icon: string;
  label: string;
  done: boolean;
  accent: string;
};

function ComboStep({ icon, label, done, accent }: StepProps) {
  return (
    <View style={[styles.step, done && { borderColor: accent }]}>
      <View style={!done && styles.stepIconDim}>
        <AppIcon name={icon} color={done ? accent : AppDesignTokens.colors.textSubtle} size={AppDesignTokens.icons.sizeXs} />
      </View>
      <Text style={[styles.stepLabel, done && { color: accent }]}>{label}</Text>
      {done && <AppIcon name="check" color={accent} size={AppDesignTokens.icons.sizeXs} />}
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
        <AppIcon name="flame" color={colors.accent} size={AppDesignTokens.icons.sizeLg} />
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
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v14,
    padding: AppDesignTokens.layout.v14,
    gap: AppDesignTokens.layout.v10,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v14, fontWeight: "600" },
  counter: { fontSize: AppDesignTokens.layout.v13, fontWeight: "700" },
  progressBar: {
    height: AppDesignTokens.layout.v6,
    backgroundColor: AppDesignTokens.colors.background,
    borderRadius: AppDesignTokens.layout.v3,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: AppDesignTokens.layout.v3 },
  steps: { flexDirection: "row", gap: AppDesignTokens.layout.v8 },
  step: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: AppDesignTokens.layout.v6,
    backgroundColor: AppDesignTokens.colors.background,
    borderRadius: AppDesignTokens.layout.v10,
    paddingVertical: AppDesignTokens.layout.v8,
    paddingHorizontal: AppDesignTokens.layout.v10,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  stepIconDim: { opacity: 0.4 },
  stepLabel: { fontSize: AppDesignTokens.layout.v11, color: AppDesignTokens.colors.textSubtle, flex: 1 },
  hint: { color: AppDesignTokens.colors.neutralDark, fontSize: AppDesignTokens.layout.v11, textAlign: "center" },
  comboDone: {
    flexDirection: "row",
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v14,
    padding: AppDesignTokens.layout.v16,
    gap: AppDesignTokens.layout.v12,
    alignItems: "center",
    borderWidth: 1.5,
  },
  comboDoneText: { gap: AppDesignTokens.layout.v2 },
  comboDoneTitle: { fontSize: AppDesignTokens.layout.v16, fontWeight: "700" },
  comboDoneSub: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v12 },
});
