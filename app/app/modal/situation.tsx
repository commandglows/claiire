import { useEffect } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AppDesignTokens } from "@/constants/AppDesignTokens";
import { DIMENSION_LABELS, DIMENSION_ORDER } from "@/features/situation/questionnaire";
import { scoreMeaning } from "@/features/situation/scoring";
import { useSituationStore } from "@/features/situation/store";

export default function SituationScreen() {
  const router = useRouter();
  const { hydrated, situation, hydrate, clear } = useSituationStore();

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrate, hydrated]);

  function handleClear() {
    Alert.alert("Effacer mes réponses", "Ces réponses seront supprimées de cet appareil.", [
      { text: "Annuler", style: "cancel" },
      { text: "Effacer", style: "destructive", onPress: () => void clear() },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.close} onPress={() => router.back()} accessibilityLabel="Fermer">
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.eyebrow}>ÉTAT PERSONNEL</Text>
          <Text style={styles.title}>Ma situation</Text>
          <Text style={styles.intro}>Un repère privé pour organiser ce que tu observes. Ce n'est ni un diagnostic, ni une mesure certaine du danger.</Text>
        </View>

        {!situation ? (
          <View style={styles.emptyCard}>
            <Text style={styles.cardTitle}>Commencer là où tu en es</Text>
            <Text style={styles.body}>Environ 5 minutes. Tu peux ignorer une question, arrêter et choisir de ne rien conserver.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {DIMENSION_ORDER.map((dimension) => {
              const value = situation.dimensions[dimension];
              return (
                <View style={styles.dimensionCard} key={dimension}>
                  <Text style={styles.dimensionLabel}>{DIMENSION_LABELS[dimension]}</Text>
                  <Text style={styles.score}>{value.score === null ? "—" : `${value.score}/4`}</Text>
                  <Text style={styles.meaning}>{scoreMeaning(value.score)}</Text>
                </View>
              );
            })}
          </View>
        )}

        <TouchableOpacity style={styles.primary} onPress={() => router.push("/modal/situation-questionnaire" as never)}>
          <Text style={styles.primaryText}>{situation ? "Mettre à jour ma situation" : "Commencer le questionnaire"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.help} onPress={() => router.push("/modal/situation-help" as never)}>
          <Text style={styles.helpText}>Obtenir une aide humaine</Text>
        </TouchableOpacity>
        {situation ? (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>Effacer mes réponses</Text>
          </TouchableOpacity>
        ) : null}
        <Text style={styles.privacy}>Les réponses conservées restent chiffrées sur cet appareil et ne sont jamais partagées avec l'autre personne.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const T = AppDesignTokens;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.background },
  content: { padding: T.layout.v20, paddingBottom: T.layout.v40, gap: T.layout.v16 },
  header: { gap: T.layout.v8, paddingTop: T.layout.v8 },
  close: { width: T.layout.v44, height: T.layout.v44, alignItems: "center", justifyContent: "center", alignSelf: "flex-end" },
  closeText: { color: T.colors.textMuted, fontSize: T.layout.v32 },
  eyebrow: { color: T.colors.accentSoft, fontSize: T.layout.v12, fontWeight: T.typography.bold, letterSpacing: T.layout.v1 },
  title: { color: T.colors.text, fontSize: T.layout.v32, fontWeight: T.typography.heavy },
  intro: { color: T.colors.textMuted, fontSize: T.layout.v15, lineHeight: T.layout.v22 },
  emptyCard: { backgroundColor: T.colors.surfaceAccent, borderRadius: T.layout.v16, padding: T.layout.v20, gap: T.layout.v8, borderWidth: T.layout.v1, borderColor: T.colors.accentMuted },
  cardTitle: { color: T.colors.text, fontSize: T.layout.v20, fontWeight: T.typography.bold },
  body: { color: T.colors.textMuted, fontSize: T.layout.v15, lineHeight: T.layout.v22 },
  grid: { gap: T.layout.v10 },
  dimensionCard: { backgroundColor: T.colors.surface, borderRadius: T.layout.v14, padding: T.layout.v16, borderWidth: T.layout.v1, borderColor: T.colors.border },
  dimensionLabel: { color: T.colors.textMuted, fontSize: T.layout.v13 },
  score: { color: T.colors.text, fontSize: T.layout.v28, fontWeight: T.typography.heavy, marginTop: T.layout.v4 },
  meaning: { color: T.colors.accentSoft2, fontSize: T.layout.v13, marginTop: T.layout.v2 },
  primary: { minHeight: T.layout.v52, borderRadius: T.layout.v14, backgroundColor: T.colors.accent, alignItems: "center", justifyContent: "center", paddingHorizontal: T.layout.v16 },
  primaryText: { color: T.colors.text, fontSize: T.layout.v16, fontWeight: T.typography.bold, textAlign: "center" },
  help: { minHeight: T.layout.v48, borderRadius: T.layout.v14, borderWidth: T.layout.v1, borderColor: T.colors.borderSoft, alignItems: "center", justifyContent: "center" },
  helpText: { color: T.colors.text, fontSize: T.layout.v15, fontWeight: T.typography.semibold },
  clearButton: { minHeight: T.layout.v48, alignItems: "center", justifyContent: "center" },
  clearText: { color: T.colors.dangerSoft, fontSize: T.layout.v14, fontWeight: T.typography.medium },
  privacy: { color: T.colors.textSubtle, fontSize: T.layout.v12, lineHeight: T.layout.v18, textAlign: "center" },
});
