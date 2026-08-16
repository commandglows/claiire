import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { AppDesignTokens } from "@/constants/AppDesignTokens";
import { NeedProfileSummary } from "@/features/situation/NeedProfileSummary";
import { DIMENSION_LABELS, DIMENSION_ORDER } from "@/features/situation/questionnaire";
import { scoreMeaning } from "@/features/situation/scoring";
import { useSituationStore } from "@/features/situation/store";
import type { NeedCategoryId } from "@/features/situation/types";

export default function SituationScreen() {
  const router = useRouter();
  const { hydrated, loadStatus, migrationPending, situation, hydrate, clear, setCategoryIgnored } = useSituationStore();
  const [privateContextConfirmed, setPrivateContextConfirmed] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrate, hydrated]);

  function handleClear() {
    Alert.alert("Effacer mes réponses", "Les deux copies locales, actuelle et ancienne, seront supprimées de cet appareil.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Effacer",
        style: "destructive",
        onPress: () => {
          void clear().then((deleted) => {
            if (!deleted) Alert.alert("Suppression non confirmée", "Claiire n'a pas pu confirmer la suppression. Tu peux réessayer sans perdre l'état affiché.");
          });
        },
      },
    ]);
  }

  function updateIgnoredCategory(categoryId: NeedCategoryId, ignored: boolean) {
    void setCategoryIgnored(categoryId, ignored).then((saved) => {
      if (!saved) Alert.alert("Modification non enregistrée", "La version précédente reste inchangée. Tu peux réessayer ou quitter sans exposer tes réponses.");
    });
  }

  const hasLoadFailure = loadStatus === "invalid" || loadStatus === "storage-error";
  const canRevealSituation = situation !== null && privateContextConfirmed;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.close} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Fermer">
            <AppIcon name="close" color={T.colors.textMuted} size={T.icons.sizeMd} />
          </TouchableOpacity>
          <Text style={styles.eyebrow}>REPÈRES PERSONNELS</Text>
          <Text style={styles.title}>Ma situation</Text>
          <Text style={styles.intro}>Un repère privé et modifiable pour organiser ce que tu observes. Ce n'est ni un diagnostic, ni une mesure certaine du danger.</Text>
        </View>

        {hasLoadFailure ? (
          <View style={styles.emptyCard} accessibilityRole="alert">
            <Text style={styles.cardTitle}>Tes réponses ne peuvent pas être affichées pour le moment</Text>
            <Text style={styles.body}>Claiire masque le contenu local au lieu de deviner son état. Tu peux réessayer, recommencer ou demander l'effacement.</Text>
            <TouchableOpacity style={styles.secondary} onPress={() => void hydrate()} accessibilityRole="button" accessibilityLabel="Réessayer de charger mes réponses">
              <Text style={styles.secondaryText}>Réessayer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear} accessibilityRole="button" accessibilityLabel="Effacer les données locales illisibles">
              <Text style={styles.clearText}>Effacer et recommencer</Text>
            </TouchableOpacity>
          </View>
        ) : situation && !privateContextConfirmed ? (
          <View style={styles.emptyCard}>
            <Text style={styles.cardTitle}>Avant d'afficher tes réponses</Text>
            <Text style={styles.body}>Peux-tu consulter cet écran tranquillement, sans que cette personne voie ton écran ou tes réponses ?</Text>
            <TouchableOpacity style={styles.primary} onPress={() => setPrivateContextConfirmed(true)} accessibilityRole="button" accessibilityLabel="Oui, je peux consulter cet écran tranquillement">
              <Text style={styles.primaryText}>Oui, je peux consulter tranquillement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondary} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Quitter sans afficher mes réponses">
              <Text style={styles.secondaryText}>Pas maintenant</Text>
            </TouchableOpacity>
          </View>
        ) : !situation ? (
          <View style={styles.emptyCard}>
            <Text style={styles.cardTitle}>Commencer là où tu en es</Text>
            <Text style={styles.body}>Tu peux ignorer une question, arrêter, ne rien conserver et accéder aux ressources sans terminer.</Text>
          </View>
        ) : null}

        {canRevealSituation ? (
          <>
            {migrationPending ? (
              <View style={styles.notice} accessibilityRole="alert">
                <Text style={styles.body}>Ton état précédent a été préparé en mémoire. Il ne sera converti au nouveau format qu'après ta prochaine confirmation.</Text>
              </View>
            ) : null}
            <NeedProfileSummary
              profile={situation.needProfile}
              onCorrect={() => router.push("/modal/situation-questionnaire" as never)}
              onHelp={() => router.push("/modal/situation-help" as never)}
              onIgnore={(categoryId) => updateIgnoredCategory(categoryId, true)}
              onRestore={(categoryId) => updateIgnoredCategory(categoryId, false)}
            />
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setShowDimensions((visible) => !visible)}
              accessibilityRole="button"
              accessibilityLabel={`${showDimensions ? "Masquer" : "Afficher"} les repères détaillés`}
              accessibilityState={{ expanded: showDimensions }}
            >
              <Text style={styles.secondaryText}>{showDimensions ? "Masquer les repères détaillés" : "Voir les repères détaillés"}</Text>
            </TouchableOpacity>
            {showDimensions ? (
              <View style={styles.grid}>
                {DIMENSION_ORDER.map((dimension) => {
                  const value = situation.dimensions[dimension];
                  return (
                    <View style={styles.dimensionCard} key={dimension}>
                      <Text style={styles.dimensionLabel}>{DIMENSION_LABELS[dimension]}</Text>
                      <Text style={styles.score}>{value.score === null ? "Non précisé" : `${value.score}/4`}</Text>
                      <Text style={styles.meaning}>{scoreMeaning(value.score)}</Text>
                    </View>
                  );
                })}
              </View>
            ) : null}
            <TouchableOpacity style={styles.clearButton} onPress={handleClear} accessibilityRole="button" accessibilityLabel="Effacer mes réponses">
              <Text style={styles.clearText}>Effacer mes réponses</Text>
            </TouchableOpacity>
          </>
        ) : null}

        {!situation && !hasLoadFailure ? (
          <TouchableOpacity style={styles.primary} onPress={() => router.push("/modal/situation-questionnaire" as never)} accessibilityRole="button" accessibilityLabel="Commencer le questionnaire">
            <Text style={styles.primaryText}>Commencer le questionnaire</Text>
          </TouchableOpacity>
        ) : null}
        {!canRevealSituation ? (
          <TouchableOpacity style={styles.help} onPress={() => router.push("/modal/situation-help" as never)} accessibilityRole="button" accessibilityLabel="Obtenir une aide humaine">
            <Text style={styles.helpText}>Obtenir une aide humaine</Text>
          </TouchableOpacity>
        ) : null}
        <Text style={styles.privacy}>Les réponses de Ma situation restent dans la frontière locale choisie et ne sont jamais transmises à une autre personne par ce parcours.</Text>
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
  eyebrow: { color: T.colors.accentSoft, fontSize: T.layout.v12, fontWeight: T.typography.bold, letterSpacing: T.layout.v1 },
  title: { color: T.colors.text, fontSize: T.layout.v32, fontWeight: T.typography.heavy },
  intro: { color: T.colors.textMuted, fontSize: T.layout.v15, lineHeight: T.layout.v22 },
  emptyCard: { backgroundColor: T.colors.surfaceAccent, borderRadius: T.layout.v16, padding: T.layout.v20, gap: T.layout.v12, borderWidth: T.layout.v1, borderColor: T.colors.accentMuted },
  notice: { backgroundColor: T.colors.surfaceMutedAlt, borderRadius: T.layout.v14, padding: T.layout.v16, borderWidth: T.layout.v1, borderColor: T.colors.border },
  cardTitle: { color: T.colors.text, fontSize: T.layout.v20, fontWeight: T.typography.bold },
  body: { color: T.colors.textMuted, fontSize: T.layout.v15, lineHeight: T.layout.v22 },
  grid: { gap: T.layout.v10 },
  dimensionCard: { backgroundColor: T.colors.surface, borderRadius: T.layout.v14, padding: T.layout.v16, borderWidth: T.layout.v1, borderColor: T.colors.border },
  dimensionLabel: { color: T.colors.textMuted, fontSize: T.layout.v13 },
  score: { color: T.colors.text, fontSize: T.layout.v20, fontWeight: T.typography.bold, marginTop: T.layout.v4 },
  meaning: { color: T.colors.accentSoft2, fontSize: T.layout.v13, marginTop: T.layout.v2 },
  primary: { minHeight: T.layout.v52, borderRadius: T.layout.v14, backgroundColor: T.colors.accent, alignItems: "center", justifyContent: "center", paddingHorizontal: T.layout.v16 },
  primaryText: { color: T.colors.text, fontSize: T.layout.v16, fontWeight: T.typography.bold, textAlign: "center" },
  secondary: { minHeight: T.layout.v48, borderRadius: T.layout.v14, borderWidth: T.layout.v1, borderColor: T.colors.borderSoft, alignItems: "center", justifyContent: "center", paddingHorizontal: T.layout.v16 },
  secondaryText: { color: T.colors.text, fontSize: T.layout.v15, fontWeight: T.typography.semibold, textAlign: "center" },
  help: { minHeight: T.layout.v48, borderRadius: T.layout.v14, borderWidth: T.layout.v1, borderColor: T.colors.borderSoft, alignItems: "center", justifyContent: "center" },
  helpText: { color: T.colors.text, fontSize: T.layout.v15, fontWeight: T.typography.semibold },
  clearButton: { minHeight: T.layout.v48, alignItems: "center", justifyContent: "center" },
  clearText: { color: T.colors.dangerSoft, fontSize: T.layout.v14, fontWeight: T.typography.medium },
  privacy: { color: T.colors.textSubtle, fontSize: T.layout.v12, lineHeight: T.layout.v18, textAlign: "center" },
});
