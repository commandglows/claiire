import { useCallback, useEffect, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AppDesignTokens } from "@/constants/AppDesignTokens";
import { CRITICAL_S3_VALUES, DIMENSION_LABELS, DIMENSION_ORDER, getSituationQuestion, UPDATE_CHANGE_OPTIONS } from "@/features/situation/questionnaire";
import { useSituationStore } from "@/features/situation/store";
import type { SituationChange } from "@/features/situation/types";

export default function SituationQuestionnaireScreen() {
  const router = useRouter();
  const {
    situation,
    draft,
    candidate,
    mode,
    stage,
    questionIds,
    currentIndex,
    begin,
    answer,
    showChangeSelection,
    configureUpdate,
    prepareReview,
    back,
    next,
    confirm,
    discardDraft,
  } = useSituationStore();
  const [saving, setSaving] = useState(false);
  const [selectedChanges, setSelectedChanges] = useState<SituationChange[]>([]);
  const [interruption, setInterruption] = useState<"privacy" | "danger" | "critical" | null>(null);
  const question = getSituationQuestion(questionIds[currentIndex]);

  const exitToNeutral = useCallback(() => {
    discardDraft();
    if (router.canDismiss()) router.dismissAll();
    router.replace("/(tabs)/index" as never);
  }, [discardDraft, router]);

  useEffect(() => {
    begin(situation ? "update" : "initial");
    return () => discardDraft();
  }, [begin, discardDraft]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      exitToNeutral();
      return true;
    });
    return () => subscription.remove();
  }, [exitToNeutral]);

  async function handleConfirm() {
    setSaving(true);
    try {
      await confirm();
      router.replace("/modal/situation" as never);
    } finally {
      setSaving(false);
    }
  }

  if (interruption) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.safetyPause}>
          <Text style={styles.eyebrow}>{interruption === "privacy" ? "TA CONFIDENTIALITÉ D'ABORD" : "ON S'ARRÊTE ICI"}</Text>
          <Text style={styles.title}>{interruption === "privacy" ? "Ce n'est peut-être pas le bon moment." : "Ta sécurité passe avant le questionnaire."}</Text>
          <Text style={styles.body}>{interruption === "privacy" ? "Claiire ne va pas afficher les questions sensibles ni enregistrer cette réponse. Reviens quand tu peux consulter l'écran tranquillement." : "Si tu peux le faire sans te mettre davantage en danger, tu peux contacter une personne ou un service d'aide. Rien de ce nouveau brouillon n'a été enregistré."}</Text>
          <TouchableOpacity style={styles.primary} onPress={exitToNeutral} accessibilityRole="button" accessibilityLabel="Quitter le questionnaire"><Text style={styles.primaryText}>Quitter</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondary} onPress={() => { discardDraft(); router.replace("/modal/situation-help" as never); }} accessibilityRole="button" accessibilityLabel="Voir les options d'aide humaine"><Text style={styles.secondaryText}>Voir une aide humaine</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (stage === "changes") {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.navButton} onPress={back} accessibilityRole="button" accessibilityLabel="Revenir à l'étape précédente"><Text style={styles.navText}>Retour</Text></TouchableOpacity>
          </View>
          <Text style={styles.eyebrow}>MISE À JOUR CIBLÉE</Text>
          <Text style={styles.question}>Qu'est-ce qui a changé depuis la dernière fois ?</Text>
          <Text style={styles.helper}>Choisis tout ce qui correspond. Les questions utiles seront regroupées sans doublon.</Text>
          <View style={styles.options}>
            {UPDATE_CHANGE_OPTIONS.map((option) => {
              const value = option.value as SituationChange;
              const active = selectedChanges.includes(value);
              return (
                <TouchableOpacity
                  key={value}
                  style={[styles.option, active && styles.optionActive]}
                  onPress={() => setSelectedChanges((current) => value === "review-all"
                    ? (active ? [] : ["review-all"])
                    : [...current.filter((item) => item !== "review-all" && item !== value), ...(active ? [] : [value])])}
                  accessibilityRole="checkbox"
                  accessibilityLabel={option.label}
                  accessibilityState={{ checked: active }}
                >
                  <View style={[styles.radio, active && styles.radioActive]} />
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity disabled={selectedChanges.length === 0} style={[styles.primary, selectedChanges.length === 0 && styles.disabled]} onPress={() => configureUpdate(selectedChanges)} accessibilityRole="button" accessibilityLabel="Continuer avec les changements sélectionnés" accessibilityState={{ disabled: selectedChanges.length === 0 }}>
            <Text style={styles.primaryText}>Continuer</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (stage === "review" && candidate) {
    const changes = DIMENSION_ORDER.filter((dimension) => situation?.dimensions[dimension].score !== candidate.dimensions[dimension].score);
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.eyebrow}>AVANT D'ENREGISTRER</Text>
          <Text style={styles.title}>{mode === "update" ? "Avant et maintenant" : "C'est bien ta situation aujourd'hui ?"}</Text>
          <Text style={styles.body}>Rien n'est encore enregistré. Vérifie les repères qui vont changer.</Text>
          <View style={styles.comparisonList}>
            {(mode === "initial" ? DIMENSION_ORDER : changes).map((dimension) => (
              <View key={dimension} style={styles.comparisonCard}>
                <Text style={styles.comparisonLabel}>{DIMENSION_LABELS[dimension]}</Text>
                <View style={styles.comparisonValues}>
                  <View><Text style={styles.comparisonCaption}>Avant</Text><Text style={styles.comparisonScore}>{situation?.dimensions[dimension].score ?? "—"}</Text></View>
                  <Text style={styles.comparisonArrow}>→</Text>
                  <View><Text style={styles.comparisonCaption}>Maintenant</Text><Text style={styles.comparisonScore}>{candidate.dimensions[dimension].score ?? "—"}</Text></View>
                </View>
              </View>
            ))}
            {mode === "update" && changes.length === 0 ? <Text style={styles.helper}>Tes réponses ne modifient aucun score pour le moment.</Text> : null}
          </View>
          <TouchableOpacity disabled={saving} style={styles.primary} onPress={() => void handleConfirm()} accessibilityRole="button" accessibilityLabel={mode === "update" ? "Confirmer cette mise à jour" : "Confirmer ma situation"} accessibilityState={{ disabled: saving, busy: saving }}><Text style={styles.primaryText}>{saving ? "Enregistrement…" : mode === "update" ? "Confirmer cette mise à jour" : "Confirmer ma situation"}</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondary} onPress={back} accessibilityRole="button" accessibilityLabel="Revenir à la dernière question"><Text style={styles.secondaryText}>Revenir à la dernière question</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!question) return null;

  const selected = draft[question.id];
  const hasAnswer = Array.isArray(selected) ? selected.length > 0 : typeof selected === "string";

  function choose(value: string) {
    if (question.id === "A1" && value !== "yes") {
      discardDraft();
      setInterruption("privacy");
      return;
    }
    if (question.id === "S1" && (value === "yes" || value === "maybe")) {
      discardDraft();
      setInterruption("danger");
      return;
    }
    if (question.id === "S3" && CRITICAL_S3_VALUES.has(value)) {
      discardDraft();
      setInterruption("critical");
      return;
    }
    if (!question.multiple) {
      answer(question.id, value);
      return;
    }
    const current = Array.isArray(selected) ? selected : [];
    if (value === "none" || value === "skip") {
      answer(question.id, [value]);
      return;
    }
    const withoutExclusive = current.filter((item) => item !== "none" && item !== "skip");
    answer(question.id, withoutExclusive.includes(value) ? withoutExclusive.filter((item) => item !== value) : [...withoutExclusive, value]);
  }

  function handleNext() {
    if (mode === "update" && question.id === "A1" && questionIds.length === 1) {
      showChangeSelection();
      return;
    }
    if (currentIndex === questionIds.length - 1) {
      prepareReview();
      return;
    }
    useSituationStore.getState().next();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.navButton} onPress={() => { if (currentIndex === 0) exitToNeutral(); else back(); }} accessibilityRole="button" accessibilityLabel={currentIndex === 0 ? "Fermer le questionnaire" : "Revenir à la question précédente"}><Text style={styles.navText}>{currentIndex === 0 ? "Fermer" : "Retour"}</Text></TouchableOpacity>
          <Text style={styles.progress} accessibilityLabel={`Question ${currentIndex + 1} sur ${questionIds.length}`}>{currentIndex + 1} / {questionIds.length}</Text>
        </View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { flex: currentIndex + 1 }]} /><View style={{ flex: Math.max(0, questionIds.length - currentIndex - 1) }} /></View>
        <Text style={styles.eyebrow}>{question.phase.toUpperCase()}</Text>
        <Text style={styles.question}>{question.prompt}</Text>
        {question.helper ? <Text style={styles.helper}>{question.helper}</Text> : null}
        <View style={styles.options}>
          {question.options.map((option) => {
            const active = Array.isArray(selected) ? selected.includes(option.value) : selected === option.value;
            return (
              <TouchableOpacity key={option.value} style={[styles.option, active && styles.optionActive]} onPress={() => choose(option.value)} accessibilityRole={question.multiple ? "checkbox" : "radio"} accessibilityLabel={option.label} accessibilityState={{ checked: active }}>
                <View style={[styles.radio, active && styles.radioActive]} />
                <Text style={[styles.optionText, active && styles.optionTextActive]}>{option.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity disabled={!hasAnswer} style={[styles.primary, !hasAnswer && styles.disabled]} onPress={handleNext} accessibilityRole="button" accessibilityLabel={currentIndex === questionIds.length - 1 && !(mode === "update" && question.id === "A1") ? "Voir mon résumé" : "Continuer"} accessibilityState={{ disabled: !hasAnswer }}><Text style={styles.primaryText}>{currentIndex === questionIds.length - 1 && !(mode === "update" && question.id === "A1") ? "Voir mon résumé" : "Continuer"}</Text></TouchableOpacity>
        {question.id !== "A1" ? <TouchableOpacity style={styles.skip} onPress={next} accessibilityRole="button" accessibilityLabel="Ignorer cette question"><Text style={styles.skipText}>Ignorer cette question</Text></TouchableOpacity> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const T = AppDesignTokens;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.background },
  content: { padding: T.layout.v20, paddingBottom: T.layout.v40, gap: T.layout.v16 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  navButton: { minWidth: T.layout.v64, minHeight: T.layout.v44, justifyContent: "center" },
  navText: { color: T.colors.textMuted, fontSize: T.layout.v14, fontWeight: T.typography.medium },
  progress: { color: T.colors.textSubtle, fontSize: T.layout.v13 },
  progressTrack: { height: T.layout.v4, borderRadius: T.layout.v2, backgroundColor: T.colors.surfaceMuted, flexDirection: "row", overflow: "hidden" },
  progressFill: { backgroundColor: T.colors.accentSoft },
  eyebrow: { color: T.colors.accentSoft, fontSize: T.layout.v12, fontWeight: T.typography.bold, letterSpacing: T.layout.v1, marginTop: T.layout.v16 },
  question: { color: T.colors.text, fontSize: T.layout.v24, lineHeight: T.layout.v32, fontWeight: T.typography.bold },
  helper: { color: T.colors.textMuted, fontSize: T.layout.v14, lineHeight: T.layout.v20 },
  options: { gap: T.layout.v10 },
  option: { minHeight: T.layout.v52, flexDirection: "row", alignItems: "center", gap: T.layout.v12, padding: T.layout.v14, borderRadius: T.layout.v14, backgroundColor: T.colors.surface, borderWidth: T.layout.v1, borderColor: T.colors.border },
  optionActive: { backgroundColor: T.colors.surfaceAccent, borderColor: T.colors.accentSoft },
  radio: { width: T.layout.v20, height: T.layout.v20, borderRadius: T.layout.v10, borderWidth: T.layout.v2, borderColor: T.colors.borderSoft },
  radioActive: { borderWidth: T.layout.v6, borderColor: T.colors.accentSoft },
  optionText: { flex: 1, color: T.colors.textMuted, fontSize: T.layout.v15, lineHeight: T.layout.v20 },
  optionTextActive: { color: T.colors.text, fontWeight: T.typography.semibold },
  primary: { minHeight: T.layout.v52, borderRadius: T.layout.v14, backgroundColor: T.colors.accent, alignItems: "center", justifyContent: "center", paddingHorizontal: T.layout.v16, marginTop: T.layout.v8 },
  primaryText: { color: T.colors.text, fontSize: T.layout.v16, fontWeight: T.typography.bold, textAlign: "center" },
  disabled: { opacity: T.layout.v0p4 },
  skip: { minHeight: T.layout.v44, alignItems: "center", justifyContent: "center" },
  skipText: { color: T.colors.textSubtle, fontSize: T.layout.v14 },
  safetyPause: { flex: 1, justifyContent: "center", padding: T.layout.v24, gap: T.layout.v16 },
  title: { color: T.colors.text, fontSize: T.layout.v28, lineHeight: T.layout.v36, fontWeight: T.typography.heavy },
  body: { color: T.colors.textMuted, fontSize: T.layout.v16, lineHeight: T.layout.v24 },
  secondary: { minHeight: T.layout.v48, borderRadius: T.layout.v14, borderWidth: T.layout.v1, borderColor: T.colors.borderSoft, alignItems: "center", justifyContent: "center" },
  secondaryText: { color: T.colors.text, fontSize: T.layout.v15, fontWeight: T.typography.semibold },
  comparisonList: { gap: T.layout.v10 },
  comparisonCard: { backgroundColor: T.colors.surface, borderRadius: T.layout.v14, padding: T.layout.v14, borderWidth: T.layout.v1, borderColor: T.colors.border },
  comparisonLabel: { color: T.colors.textMuted, fontSize: T.layout.v13, marginBottom: T.layout.v10 },
  comparisonValues: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  comparisonCaption: { color: T.colors.textSubtle, fontSize: T.layout.v12 },
  comparisonScore: { color: T.colors.text, fontSize: T.layout.v24, fontWeight: T.typography.heavy },
  comparisonArrow: { color: T.colors.accentSoft, fontSize: T.layout.v22 },
});
