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

const HOURS = Array.from({ length: 25 }, (_, i) => i * 0.5); // 0 to 12
const QUALITY_LABELS = ["", "Très mauvais", "Mauvais", "Moyen", "Bon", "Excellent"];

export default function LogSleepModal() {
  const router = useRouter();
  const { logSleep } = useTracking();

  const [hoursSlept, setHoursSlept] = useState(7);
  const [quality, setQuality] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (quality === 0) {
      setError("Évalue la qualité de ton sommeil");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await logSleep({
        hoursSlept,
        quality,
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
          <Text style={styles.successEmoji}>😴</Text>
          <Text style={styles.successTitle}>Rapport enregistré !</Text>
          <Text style={styles.xpBadge}>+{xpEarned} XP</Text>
          <Text style={styles.xpLabel}>Intel de combat recueilli</Text>
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
        <Text style={styles.title}>Rapport de Sommeil</Text>
        <View style={{ width: AppDesignTokens.layout.v60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.sectionLabel}>Heures de sommeil</Text>
        <Text style={styles.hoursValue}>{hoursSlept}h</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hoursRow}
        >
          {HOURS.map((h) => (
            <TouchableOpacity
              key={h}
              style={[styles.hourChip, hoursSlept === h && styles.hourChipActive]}
              onPress={() => setHoursSlept(h)}
            >
              <Text
                style={[
                  styles.hourChipText,
                  hoursSlept === h && styles.hourChipTextActive,
                ]}
              >
                {h % 1 === 0 ? `${h}h` : `${h}h`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionLabel}>Qualité du sommeil</Text>
        <View style={styles.qualityRow}>
          {[1, 2, 3, 4, 5].map((q) => (
            <TouchableOpacity
              key={q}
              style={[styles.qualityButton, quality === q && styles.qualityButtonActive]}
              onPress={() => setQuality(q)}
            >
              <Text style={styles.qualityEmoji}>
                {["😫", "😞", "😐", "😊", "🌟"][q - 1]}
              </Text>
              <Text
                style={[
                  styles.qualityText,
                  quality === q && styles.qualityTextActive,
                ]}
              >
                {q}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {quality > 0 && (
          <Text style={styles.qualityLabel}>{QUALITY_LABELS[quality]}</Text>
        )}

        <Text style={styles.sectionLabel}>Notes (optionnel · +5 XP)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Rêves, perturbations, contexte..."
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
              Enregistrer (+{15 + (notes.trim() ? 5 : 0)} XP)
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
  hoursValue: {
    color: AppDesignTokens.colors.text,
    fontSize: AppDesignTokens.layout.v48,
    fontWeight: "bold",
    textAlign: "center",
  },
  hoursRow: { gap: AppDesignTokens.layout.v8, paddingVertical: AppDesignTokens.layout.v4 },
  hourChip: {
    paddingHorizontal: AppDesignTokens.layout.v12,
    paddingVertical: AppDesignTokens.layout.v6,
    borderRadius: AppDesignTokens.layout.v20,
    backgroundColor: AppDesignTokens.colors.surface,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  hourChipActive: { backgroundColor: AppDesignTokens.colors.accent, borderColor: AppDesignTokens.colors.accent },
  hourChipText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v13 },
  hourChipTextActive: { color: AppDesignTokens.colors.text },
  qualityRow: { flexDirection: "row", gap: AppDesignTokens.layout.v8 },
  qualityButton: {
    flex: 1,
    alignItems: "center",
    gap: AppDesignTokens.layout.v4,
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v12,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  qualityButtonActive: { backgroundColor: AppDesignTokens.colors.accent, borderColor: AppDesignTokens.colors.accent },
  qualityEmoji: { fontSize: AppDesignTokens.layout.v24 },
  qualityText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v12 },
  qualityTextActive: { color: AppDesignTokens.colors.text },
  qualityLabel: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v13, textAlign: "center" },
  notesInput: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v14,
    color: AppDesignTokens.colors.text,
    fontSize: AppDesignTokens.layout.v15,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
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
  xpBadge: {
    color: AppDesignTokens.colors.accent,
    fontSize: AppDesignTokens.layout.v36,
    fontWeight: "bold",
  },
  xpLabel: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v14 },
  doneButton: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v12,
    paddingHorizontal: AppDesignTokens.layout.v32,
    paddingVertical: AppDesignTokens.layout.v14,
    marginTop: AppDesignTokens.layout.v16,
  },
  doneButtonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v16, fontWeight: "600" },
});
