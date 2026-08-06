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
        <View style={{ width: 60 }} />
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppDesignTokens.colors.surface,
  },
  cancelText: { color: AppDesignTokens.colors.textMuted, fontSize: 16, width: 60 },
  title: { color: AppDesignTokens.colors.text, fontSize: 17, fontWeight: "600" },
  content: { padding: 20, gap: 12 },
  error: {
    color: AppDesignTokens.colors.dangerSoft,
    fontSize: 14,
    textAlign: "center",
    backgroundColor: AppDesignTokens.colors.surfaceMuted,
    padding: 12,
    borderRadius: 8,
  },
  sectionLabel: { color: AppDesignTokens.colors.textMuted, fontSize: 13, fontWeight: "500", marginTop: 8 },
  hoursValue: {
    color: AppDesignTokens.colors.text,
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
  },
  hoursRow: { gap: 8, paddingVertical: 4 },
  hourChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: AppDesignTokens.colors.surface,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  hourChipActive: { backgroundColor: AppDesignTokens.colors.accent, borderColor: AppDesignTokens.colors.accent },
  hourChipText: { color: AppDesignTokens.colors.textMuted, fontSize: 13 },
  hourChipTextActive: { color: AppDesignTokens.colors.text },
  qualityRow: { flexDirection: "row", gap: 8 },
  qualityButton: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  qualityButtonActive: { backgroundColor: AppDesignTokens.colors.accent, borderColor: AppDesignTokens.colors.accent },
  qualityEmoji: { fontSize: 24 },
  qualityText: { color: AppDesignTokens.colors.textMuted, fontSize: 12 },
  qualityTextActive: { color: AppDesignTokens.colors.text },
  qualityLabel: { color: AppDesignTokens.colors.accent, fontSize: 13, textAlign: "center" },
  notesInput: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: 12,
    padding: 14,
    color: AppDesignTokens.colors.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitText: { color: AppDesignTokens.colors.text, fontSize: 16, fontWeight: "600" },
  successContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  successEmoji: { fontSize: 64 },
  successTitle: { color: AppDesignTokens.colors.text, fontSize: 22, fontWeight: "bold" },
  xpBadge: {
    color: AppDesignTokens.colors.accent,
    fontSize: 36,
    fontWeight: "bold",
  },
  xpLabel: { color: AppDesignTokens.colors.textMuted, fontSize: 14 },
  doneButton: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginTop: 16,
  },
  doneButtonText: { color: AppDesignTokens.colors.text, fontSize: 16, fontWeight: "600" },
});
