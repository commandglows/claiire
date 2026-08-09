import { useState } from "react";
import { AppDesignTokens } from '@/constants/AppDesignTokens';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useHabits } from "@/features/tracking/hooks/useHabits";
import { AppIcon, type AppIconName } from "@/components/AppIcon";

const ICONS: AppIconName[] = ["zap", "dumbbell", "brain", "person", "book", "flower", "droplet", "salad", "moon", "target", "pen", "music"];

const DIFFICULTIES = [
  { id: "easy" as const, label: "Facile", color: AppDesignTokens.colors.success, xp: 10 },
  { id: "medium" as const, label: "Moyen", color: AppDesignTokens.colors.warning, xp: 20 },
  { id: "hard" as const, label: "Difficile", color: AppDesignTokens.colors.danger, xp: 35 },
];

const MISSION_TYPES = [
  { id: "defense" as const, icon: "shield" as const, label: "Défense", desc: "Éviter les addictions" },
  { id: "offense" as const, icon: "swords" as const, label: "Attaque", desc: "Comportements positifs" },
  { id: "support" as const, icon: "heart" as const, label: "Support", desc: "Médicaments, suivi" },
  { id: "training" as const, icon: "person" as const, label: "Entraînement", desc: "Exercice, méditation" },
] as const;

type MissionType = "defense" | "offense" | "support" | "training";

const FREQUENCIES = [
  { id: "daily" as const, label: "Quotidienne" },
  { id: "weekly" as const, label: "Hebdomadaire" },
];

export default function LogHabitModal() {
  const router = useRouter();
  const { createHabit } = useHabits();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState<AppIconName>("zap");
  const [missionType, setMissionType] = useState<MissionType>("offense");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState(false);

  async function handleCreate() {
    if (!name.trim()) {
      setError("Donne un nom à ton habitude.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createHabit({ name: name.trim(), icon, missionType, difficulty, targetFrequency: frequency });
      setCreated(true);
    } catch {
      setError("Erreur lors de la création. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  if (created) {
    const diff = DIFFICULTIES.find((d) => d.id === difficulty)!;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successScreen}>
          <AppIcon name={icon} color={AppDesignTokens.colors.accentSoft} size={AppDesignTokens.icons.sizeHero} />
          <Text style={styles.successTitle}>Habitude créée !</Text>
          <Text style={styles.successName}>{name}</Text>
          <View style={[styles.xpBadge, { backgroundColor: diff.color + "30", borderColor: diff.color }]}>
            <Text style={[styles.xpBadgeText, { color: diff.color }]}>
              +{diff.xp} XP par complétion
            </Text>
          </View>
          <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
            <Text style={styles.doneButtonText}>Super !</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Fermer">
          <AppIcon name="close" color={AppDesignTokens.colors.textMuted} size={AppDesignTokens.icons.sizeSm} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle habitude</Text>
        <View style={{ width: AppDesignTokens.layout.v32 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Icon picker */}
        <Text style={styles.label}>Icône</Text>
        <View style={styles.iconGrid}>
          {ICONS.map((ic) => (
            <TouchableOpacity
              key={ic}
              style={[styles.iconButton, icon === ic && styles.iconButtonActive]}
              onPress={() => setIcon(ic)}
            >
              <AppIcon name={ic} color={icon === ic ? AppDesignTokens.colors.accentSoft : AppDesignTokens.colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Name */}
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Méditer 10 minutes"
          placeholderTextColor={AppDesignTokens.colors.textSubtle}
          value={name}
          onChangeText={setName}
          maxLength={60}
        />

        {/* Mission type */}
        <Text style={styles.label}>Type de mission</Text>
        <View style={styles.typeGrid}>
          {MISSION_TYPES.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.typeChip, missionType === t.id && styles.typeChipActive]}
              onPress={() => setMissionType(t.id)}
            >
              <AppIcon name={t.icon} color={missionType === t.id ? AppDesignTokens.colors.accentSoft : AppDesignTokens.colors.textMuted} size={AppDesignTokens.icons.sizeSm} />
              <Text style={[styles.typeLabel, missionType === t.id && styles.typeLabelActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Frequency */}
        <Text style={styles.label}>Fréquence</Text>
        <View style={styles.row}>
          {FREQUENCIES.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.chip, frequency === f.id && styles.chipActive]}
              onPress={() => setFrequency(f.id)}
            >
              <Text style={[styles.chipText, frequency === f.id && styles.chipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Difficulty */}
        <Text style={styles.label}>Difficulté</Text>
        <View style={styles.diffRow}>
          {DIFFICULTIES.map((d) => (
            <TouchableOpacity
              key={d.id}
              style={[
                styles.diffChip,
                { borderColor: d.color },
                difficulty === d.id && { backgroundColor: d.color },
              ]}
              onPress={() => setDifficulty(d.id)}
            >
              <Text style={[styles.diffLabel, { color: difficulty === d.id ? AppDesignTokens.colors.text : d.color }]}>
                {d.label}
              </Text>
              <Text style={[styles.diffXP, { color: difficulty === d.id ? AppDesignTokens.colors.text : d.color, opacity: 0.8 }]}>
                +{d.xp} XP
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? "Création..." : "Créer l'habitude"}
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: AppDesignTokens.layout.v20,
    paddingVertical: AppDesignTokens.layout.v12,
  },
  headerTitle: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v17, fontWeight: "700" },
  scroll: { flex: 1 },
  content: { padding: AppDesignTokens.layout.v20, gap: AppDesignTokens.layout.v12, paddingBottom: AppDesignTokens.layout.v40 },
  label: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v13, fontWeight: "600", textTransform: "uppercase", letterSpacing: AppDesignTokens.layout.v0p5 },
  iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: AppDesignTokens.layout.v8 },
  iconButton: {
    width: AppDesignTokens.layout.v48,
    height: AppDesignTokens.layout.v48,
    borderRadius: AppDesignTokens.layout.v12,
    backgroundColor: AppDesignTokens.colors.surface,
    borderWidth: 1.5,
    borderColor: AppDesignTokens.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonActive: { borderColor: AppDesignTokens.colors.accent, backgroundColor: AppDesignTokens.colors.accentMuted },
  input: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
    color: AppDesignTokens.colors.text,
    fontSize: AppDesignTokens.layout.v16,
    paddingHorizontal: AppDesignTokens.layout.v16,
    paddingVertical: AppDesignTokens.layout.v14,
  },
  row: { flexDirection: "row", gap: AppDesignTokens.layout.v10 },
  chip: {
    flex: 1,
    paddingVertical: AppDesignTokens.layout.v12,
    borderRadius: AppDesignTokens.layout.v12,
    backgroundColor: AppDesignTokens.colors.surface,
    borderWidth: 1.5,
    borderColor: AppDesignTokens.colors.border,
    alignItems: "center",
  },
  chipActive: { borderColor: AppDesignTokens.colors.accent, backgroundColor: AppDesignTokens.colors.accentMuted },
  chipText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v14, fontWeight: "500" },
  chipTextActive: { color: AppDesignTokens.colors.text, fontWeight: "700" },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: AppDesignTokens.layout.v8 },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: AppDesignTokens.layout.v6,
    paddingVertical: AppDesignTokens.layout.v10,
    paddingHorizontal: AppDesignTokens.layout.v14,
    borderRadius: AppDesignTokens.layout.v12,
    backgroundColor: AppDesignTokens.colors.surface,
    borderWidth: 1.5,
    borderColor: AppDesignTokens.colors.border,
  },
  typeChipActive: { borderColor: AppDesignTokens.colors.accent, backgroundColor: AppDesignTokens.colors.accentMuted },
  typeLabel: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v13, fontWeight: "500" },
  typeLabelActive: { color: AppDesignTokens.colors.text, fontWeight: "700" },
  diffRow: { flexDirection: "row", gap: AppDesignTokens.layout.v8 },
  diffChip: {
    flex: 1,
    paddingVertical: AppDesignTokens.layout.v12,
    borderRadius: AppDesignTokens.layout.v12,
    backgroundColor: "transparent",
    borderWidth: 1.5,
    alignItems: "center",
    gap: AppDesignTokens.layout.v2,
  },
  diffLabel: { fontSize: AppDesignTokens.layout.v13, fontWeight: "700" },
  diffXP: { fontSize: AppDesignTokens.layout.v11 },
  error: { color: AppDesignTokens.colors.dangerSoft, fontSize: AppDesignTokens.layout.v14, textAlign: "center" },
  createButton: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v14,
    paddingVertical: AppDesignTokens.layout.v16,
    alignItems: "center",
    marginTop: AppDesignTokens.layout.v8,
  },
  createButtonDisabled: { opacity: 0.5 },
  createButtonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v16, fontWeight: "700" },
  // Success screen
  successScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: AppDesignTokens.layout.v16,
    padding: AppDesignTokens.layout.v32,
  },
  successTitle: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v24, fontWeight: "bold" },
  successName: { color: AppDesignTokens.colors.neutralSoft, fontSize: AppDesignTokens.layout.v16 },
  xpBadge: {
    borderRadius: AppDesignTokens.layout.v20,
    paddingHorizontal: AppDesignTokens.layout.v20,
    paddingVertical: AppDesignTokens.layout.v8,
    borderWidth: 1.5,
  },
  xpBadgeText: { fontSize: AppDesignTokens.layout.v15, fontWeight: "700" },
  doneButton: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v14,
    paddingVertical: AppDesignTokens.layout.v14,
    paddingHorizontal: AppDesignTokens.layout.v48,
    marginTop: AppDesignTokens.layout.v8,
  },
  doneButtonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v16, fontWeight: "700" },
});
