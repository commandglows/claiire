import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTracking } from "@/features/tracking/hooks/useTracking";
import { MOOD_EMOTIONS, type MoodEmotion } from "@/features/tracking/types";

export default function LogMoodModal() {
  const router = useRouter();
  const { logMood } = useTracking();

  const [emotion, setEmotion] = useState<MoodEmotion | null>(null);
  const [intensity, setIntensity] = useState(0);
  const [trigger, setTrigger] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const xpPreview =
    10 + (trigger.trim() ? 5 : 0) + (notes.trim() ? 5 : 0);

  async function handleSubmit() {
    if (!emotion) {
      setError("Choisis une émotion");
      return;
    }
    if (intensity === 0) {
      setError("Évalue l'intensité (dégâts subis)");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await logMood({
        intensity,
        emotion,
        trigger: trigger.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setXpEarned(result.xpAwarded);
    } catch {
      setError("Erreur lors de l'enregistrement. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  if (xpEarned !== null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContent}>
          <Text style={styles.successEmoji}>
            {MOOD_EMOTIONS.find((e) => e.id === emotion)?.emoji ?? "🎯"}
          </Text>
          <Text style={styles.successTitle}>Défaite enregistrée !</Text>
          <Text style={styles.successSub}>
            L'ennemi a frappé. Intelligence recueillie.
          </Text>
          <Text style={styles.xpBadge}>+{xpEarned} XP</Text>
          <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
            <Text style={styles.doneButtonText}>Retour au combat</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Rapport d'Humeur</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.sectionLabel}>Type d'attaque (émotion)</Text>
        <View style={styles.emotionGrid}>
          {MOOD_EMOTIONS.map((e) => (
            <TouchableOpacity
              key={e.id}
              style={[
                styles.emotionButton,
                emotion === e.id && styles.emotionButtonActive,
              ]}
              onPress={() => setEmotion(e.id)}
            >
              <Text style={styles.emotionEmoji}>{e.emoji}</Text>
              <Text
                style={[
                  styles.emotionLabel,
                  emotion === e.id && styles.emotionLabelActive,
                ]}
              >
                {e.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>
          Dégâts subis (intensité : {intensity > 0 ? intensity : "—"}/10)
        </Text>
        <View style={styles.intensityRow}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <TouchableOpacity
              key={n}
              style={[
                styles.intensityButton,
                intensity === n && styles.intensityButtonActive,
                n <= 3 && intensity === n && styles.intensityLow,
                n >= 7 && intensity === n && styles.intensityHigh,
              ]}
              onPress={() => setIntensity(n)}
            >
              <Text
                style={[
                  styles.intensityText,
                  intensity === n && styles.intensityTextActive,
                ]}
              >
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>
          Arme ennemie (déclencheur · +5 XP)
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: stress au travail, dispute, fatigue..."
          placeholderTextColor="#555"
          value={trigger}
          onChangeText={setTrigger}
        />

        <Text style={styles.sectionLabel}>Débrief (notes · +5 XP)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Contexte, pensées, observations..."
          placeholderTextColor="#555"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>
              Enregistrer (+{xpPreview} XP)
            </Text>
          )}
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
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a2e",
  },
  cancelText: { color: "#888", fontSize: 16, width: 60 },
  title: { color: "#fff", fontSize: 17, fontWeight: "600" },
  content: { padding: 20, gap: 12 },
  error: {
    color: "#ff6b6b",
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "#2a1a1a",
    padding: 12,
    borderRadius: 8,
  },
  sectionLabel: { color: "#888", fontSize: 13, fontWeight: "500", marginTop: 8 },
  emotionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emotionButton: {
    width: "30%",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  emotionButtonActive: {
    backgroundColor: "#3d2f7a",
    borderColor: "#6c47ff",
  },
  emotionEmoji: { fontSize: 28 },
  emotionLabel: { color: "#888", fontSize: 11 },
  emotionLabelActive: { color: "#fff" },
  intensityRow: {
    flexDirection: "row",
    gap: 6,
  },
  intensityButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  intensityButtonActive: { backgroundColor: "#6c47ff", borderColor: "#6c47ff" },
  intensityLow: { backgroundColor: "#2f9e44", borderColor: "#2f9e44" },
  intensityHigh: { backgroundColor: "#c92a2a", borderColor: "#c92a2a" },
  intensityText: { color: "#888", fontSize: 12, fontWeight: "600" },
  intensityTextActive: { color: "#fff" },
  input: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#6c47ff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  successContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  successEmoji: { fontSize: 64 },
  successTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  successSub: { color: "#888", fontSize: 14, textAlign: "center" },
  xpBadge: { color: "#6c47ff", fontSize: 36, fontWeight: "bold" },
  doneButton: {
    backgroundColor: "#6c47ff",
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginTop: 16,
  },
  doneButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
