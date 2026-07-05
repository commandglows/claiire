import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type InterventionStat = {
  interventionId: string;
  uses: number;
  successRate: number | null;
  mastered: boolean;
  advanced: boolean;
};

const INTERVENTION_NAMES: Record<string, { emoji: string; name: string }> = {
  "cold-water": { emoji: "💧", name: "Eau froide" },
  walk: { emoji: "🚶", name: "Marche" },
  distraction: { emoji: "🎮", name: "Diversion" },
  call: { emoji: "📞", name: "Appel" },
  write: { emoji: "✏️", name: "Écriture" },
  breathe: { emoji: "🧘", name: "Respiration" },
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
    emoji: "🎯",
    name: best.interventionId.replace("custom_", ""),
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>⚡ SIGNATURE MOVE</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.emoji}>{info.emoji}</Text>
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
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "#f59f0040",
  },
  header: { flexDirection: "row" },
  badge: {
    color: "#f59f00",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  content: { flexDirection: "row", alignItems: "center", gap: 12 },
  emoji: { fontSize: 32 },
  info: { flex: 1, gap: 2 },
  name: { color: "#fff", fontSize: 16, fontWeight: "700" },
  stats: { color: "#888", fontSize: 12 },
});
