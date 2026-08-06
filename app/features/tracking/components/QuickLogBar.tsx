import { AppDesignTokens } from '@/constants/AppDesignTokens';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

type QuickAction = {
  emoji: string;
  label: string;
  route: string;
  color: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    emoji: "😴",
    label: "Sommeil",
    route: "/modal/log-sleep",
    color: AppDesignTokens.colors.accentAlt,
  },
  {
    emoji: "🎯",
    label: "Humeur",
    route: "/modal/log-mood",
    color: AppDesignTokens.colors.accentSoft,
  },
  {
    emoji: "⚔️",
    label: "Crise",
    route: "/modal/crisis-support",
    color: AppDesignTokens.colors.danger,
  },
  {
    emoji: "🏆",
    label: "Mission",
    route: "/modal/log-habit",
    color: AppDesignTokens.colors.success,
  },
];

export type QuickLogBarProps = {
  exclude?: Array<"sleep" | "mood" | "crisis" | "habit">;
};

export function QuickLogBar({ exclude = [] }: QuickLogBarProps) {
  const router = useRouter();

  const excludeMap: Record<string, string> = {
    sleep: "Sommeil",
    mood: "Humeur",
    crisis: "Crise",
    habit: "Mission",
  };
  const excluded = new Set(exclude.map((k) => excludeMap[k]));
  const actions = QUICK_ACTIONS.filter((a) => !excluded.has(a.label));

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.label}
          style={[styles.button, { borderColor: action.color }]}
          onPress={() => router.push(action.route as never)}
          activeOpacity={0.7}
        >
          <Text style={styles.emoji}>{action.emoji}</Text>
          <Text style={styles.label}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
  },
  emoji: {
    fontSize: 22,
  },
  label: {
    color: AppDesignTokens.colors.neutralBorder,
    fontSize: 11,
    fontWeight: "500",
  },
});
