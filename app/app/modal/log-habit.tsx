import { useState } from "react";
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

const ICONS = ["⚡", "💪", "🧠", "🏃", "📚", "🧘", "💧", "🥗", "😴", "🎯", "✍️", "🎵"];

const DIFFICULTIES = [
  { id: "easy" as const, label: "Facile", color: "#2f9e44", xp: 10 },
  { id: "medium" as const, label: "Moyen", color: "#f59f00", xp: 20 },
  { id: "hard" as const, label: "Difficile", color: "#e03131", xp: 35 },
];

const MISSION_TYPES = [
  { id: "defense" as const, emoji: "🛡️", label: "Défense", desc: "Éviter les addictions" },
  { id: "offense" as const, emoji: "⚔️", label: "Attaque", desc: "Comportements positifs" },
  { id: "support" as const, emoji: "💊", label: "Support", desc: "Médicaments, suivi" },
  { id: "training" as const, emoji: "🏃", label: "Entraînement", desc: "Exercice, méditation" },
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
  const [icon, setIcon] = useState("⚡");
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
          <Text style={styles.successEmoji}>{icon}</Text>
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
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle habitude</Text>
        <View style={{ width: 32 }} />
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
              <Text style={styles.iconText}>{ic}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Name */}
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Méditer 10 minutes"
          placeholderTextColor="#555"
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
              <Text style={styles.typeEmoji}>{t.emoji}</Text>
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
              <Text style={[styles.diffLabel, { color: difficulty === d.id ? "#fff" : d.color }]}>
                {d.label}
              </Text>
              <Text style={[styles.diffXP, { color: difficulty === d.id ? "#fff" : d.color, opacity: 0.8 }]}>
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
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeText: { color: "#888", fontSize: 18, padding: 4 },
  headerTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  label: { color: "#888", fontSize: 13, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#1a1a2e",
    borderWidth: 1.5,
    borderColor: "#2a2a4a",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonActive: { borderColor: "#6c47ff", backgroundColor: "#2d1f6e" },
  iconText: { fontSize: 22 },
  input: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a4a",
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  row: { flexDirection: "row", gap: 10 },
  chip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1a1a2e",
    borderWidth: 1.5,
    borderColor: "#2a2a4a",
    alignItems: "center",
  },
  chipActive: { borderColor: "#6c47ff", backgroundColor: "#2d1f6e" },
  chipText: { color: "#888", fontSize: 14, fontWeight: "500" },
  chipTextActive: { color: "#fff", fontWeight: "700" },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#1a1a2e",
    borderWidth: 1.5,
    borderColor: "#2a2a4a",
  },
  typeChipActive: { borderColor: "#6c47ff", backgroundColor: "#2d1f6e" },
  typeEmoji: { fontSize: 18 },
  typeLabel: { color: "#888", fontSize: 13, fontWeight: "500" },
  typeLabelActive: { color: "#fff", fontWeight: "700" },
  diffRow: { flexDirection: "row", gap: 8 },
  diffChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "transparent",
    borderWidth: 1.5,
    alignItems: "center",
    gap: 2,
  },
  diffLabel: { fontSize: 13, fontWeight: "700" },
  diffXP: { fontSize: 11 },
  error: { color: "#ff6b6b", fontSize: 14, textAlign: "center" },
  createButton: {
    backgroundColor: "#6c47ff",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  createButtonDisabled: { opacity: 0.5 },
  createButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  // Success screen
  successScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 32,
  },
  successEmoji: { fontSize: 72 },
  successTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  successName: { color: "#aaa", fontSize: 16 },
  xpBadge: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1.5,
  },
  xpBadgeText: { fontSize: 15, fontWeight: "700" },
  doneButton: {
    backgroundColor: "#6c47ff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 48,
    marginTop: 8,
  },
  doneButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
