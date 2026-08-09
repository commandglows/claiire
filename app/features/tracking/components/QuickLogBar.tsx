import { AppDesignTokens } from '@/constants/AppDesignTokens';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { AppIcon, type AppIconName } from "@/components/AppIcon";

type QuickAction = {
  icon: AppIconName;
  label: string;
  route: string;
  color: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: "moon",
    label: "Sommeil",
    route: "/modal/log-sleep",
    color: AppDesignTokens.colors.accentAlt,
  },
  {
    icon: "target",
    label: "Humeur",
    route: "/modal/log-mood",
    color: AppDesignTokens.colors.accentSoft,
  },
  {
    icon: "swords",
    label: "Crise",
    route: "/modal/crisis-support",
    color: AppDesignTokens.colors.danger,
  },
  {
    icon: "trophy",
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
          <AppIcon name={action.icon} color={action.color} size={AppDesignTokens.icons.sizeMd} />
          <Text style={styles.label}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: AppDesignTokens.layout.v8,
  },
  button: {
    flex: 1,
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    paddingVertical: AppDesignTokens.layout.v12,
    alignItems: "center",
    gap: AppDesignTokens.layout.v4,
    borderWidth: 1,
  },
  label: {
    color: AppDesignTokens.colors.neutralBorder,
    fontSize: AppDesignTokens.layout.v11,
    fontWeight: "500",
  },
});
