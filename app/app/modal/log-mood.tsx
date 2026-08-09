import { useState } from "react";
import { AppDesignTokens } from '@/constants/AppDesignTokens';
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
        <View style={{ width: AppDesignTokens.layout.v60 }} />
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
          placeholderTextColor={AppDesignTokens.colors.textSubtle}
          value={trigger}
          onChangeText={setTrigger}
        />

        <Text style={styles.sectionLabel}>Débrief (notes · +5 XP)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Contexte, pensées, observations..."
          placeholderTextColor={AppDesignTokens.colors.textSubtle}
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
            <ActivityIndicator color={AppDesignTokens.colors.text} />
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
  container: { flex: 1, backgroundColor: AppDesignTokens.colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: AppDesignTokens.layout.v20,
    paddingVertical: AppDesignTokens.layout.v12,
    borderBottomWidth: 1,
    borderBottomColor: AppDesignTokens.colors.surface,
  },
  cancelText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v16, width: AppDesignTokens.layout.v60 },
  title: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v17, fontWeight: "600" },
  content: { padding: AppDesignTokens.layout.v20, gap: AppDesignTokens.layout.v12 },
  error: {
    color: AppDesignTokens.colors.dangerSoft,
    fontSize: AppDesignTokens.layout.v14,
    textAlign: "center",
    backgroundColor: AppDesignTokens.colors.surfaceMuted,
    padding: AppDesignTokens.layout.v12,
    borderRadius: AppDesignTokens.layout.v8,
  },
  sectionLabel: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v13, fontWeight: "500", marginTop: AppDesignTokens.layout.v8 },
  emotionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: AppDesignTokens.layout.v8,
  },
  emotionButton: {
    width: "30%",
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v12,
    alignItems: "center",
    gap: AppDesignTokens.layout.v4,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  emotionButtonActive: {
    backgroundColor: AppDesignTokens.colors.panel,
    borderColor: AppDesignTokens.colors.accent,
  },
  emotionEmoji: { fontSize: AppDesignTokens.layout.v28 },
  emotionLabel: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v11 },
  emotionLabelActive: { color: AppDesignTokens.colors.text },
  intensityRow: {
    flexDirection: "row",
    gap: AppDesignTokens.layout.v6,
  },
  intensityButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  intensityButtonActive: { backgroundColor: AppDesignTokens.colors.accent, borderColor: AppDesignTokens.colors.accent },
  intensityLow: { backgroundColor: AppDesignTokens.colors.success, borderColor: AppDesignTokens.colors.success },
  intensityHigh: { backgroundColor: AppDesignTokens.colors.dangerAlt, borderColor: AppDesignTokens.colors.dangerAlt },
  intensityText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v12, fontWeight: "600" },
  intensityTextActive: { color: AppDesignTokens.colors.text },
  input: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v14,
    color: AppDesignTokens.colors.text,
    fontSize: AppDesignTokens.layout.v15,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  notesInput: {
    minHeight: AppDesignTokens.layout.v80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v16,
    alignItems: "center",
    marginTop: AppDesignTokens.layout.v8,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v16, fontWeight: "600" },
  successContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v24,
  },
  successEmoji: { fontSize: AppDesignTokens.layout.v64 },
  successTitle: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v22, fontWeight: "bold" },
  successSub: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v14, textAlign: "center" },
  xpBadge: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v36, fontWeight: "bold" },
  doneButton: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v12,
    paddingHorizontal: AppDesignTokens.layout.v32,
    paddingVertical: AppDesignTokens.layout.v14,
    marginTop: AppDesignTokens.layout.v16,
  },
  doneButtonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v16, fontWeight: "600" },
});
