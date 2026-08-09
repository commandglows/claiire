import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppDesignTokens } from '@/constants/AppDesignTokens';
import { AppIcon, type AppIconName } from "@/components/AppIcon";

type InterventionStat = {
  interventionId: string;
  uses: number;
  successRate: number | null;
  mastered: boolean;
  advanced: boolean;
};

const INTERVENTION_NAMES: Record<string, { icon: AppIconName; name: string }> = {
  "cold-water": { icon: "droplet", name: "Eau froide" },
  walk: { icon: "footprints", name: "Marche" },
  distraction: { icon: "gamepad", name: "Diversion" },
  call: { icon: "phone", name: "Appel" },
  write: { icon: "pen", name: "Écriture" },
  breathe: { icon: "wind", name: "Respiration" },
};

/**
 * Shows the user's most effective intervention — their "Signature Move" (PRD 9.5).
 * Only displays if they have at least one intervention with 3+ uses and a success rate.
 */
export function SignatureMove() {
  const stats = (useQuery(api.interventions.getStats, {}) ?? []) as InterventionStat[];

  // Find best intervention with enough data
  const qualified = stats
    .filter((s) => s.uses >= 3 && s.successRate !== null && s.successRate > 0)
    .sort((a, b) => (b.successRate ?? 0) - (a.successRate ?? 0));

  if (qualified.length === 0) return null;

  const best = qualified[0];
  const info = INTERVENTION_NAMES[best.interventionId] ?? {
    icon: "target" as const,
    name: best.interventionId.replace("custom_", ""),
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badgeRow}><AppIcon name="zap" color={AppDesignTokens.colors.warning} size={AppDesignTokens.icons.sizeXs} /><Text style={styles.badge}>SIGNATURE MOVE</Text></View>
      </View>
      <View style={styles.content}>
        <AppIcon name={info.icon} color={AppDesignTokens.colors.warning} size={AppDesignTokens.icons.sizeLg} />
        <View style={styles.info}>
          <Text style={styles.name}>{info.name}</Text>
          <Text style={styles.stats}>
            {Math.round((best.successRate ?? 0) * 100)}% efficacité · {best.uses}x utilisé
            {best.mastered ? " · ⭐ Maîtrisé" : best.advanced ? " · 🔥 Avancé" : ""}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v14,
    padding: AppDesignTokens.layout.v14,
    gap: AppDesignTokens.layout.v8,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.warning40,
  },
  header: { flexDirection: "row" },
  badge: {
    color: AppDesignTokens.colors.warning,
    fontSize: AppDesignTokens.layout.v10,
    fontWeight: "800",
    letterSpacing: AppDesignTokens.layout.v1,
    textTransform: "uppercase",
  },
  content: { flexDirection: "row", alignItems: "center", gap: AppDesignTokens.layout.v12 },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: AppDesignTokens.layout.v4 },
  info: { flex: 1, gap: AppDesignTokens.layout.v2 },
  name: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v16, fontWeight: "700" },
  stats: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v12 },
});
