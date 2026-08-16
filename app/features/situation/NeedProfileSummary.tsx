import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppDesignTokens } from "@/constants/AppDesignTokens";

import { getSituationQuestion } from "./questionnaire";
import type { NeedCategoryId, NeedProfileV1, NextStep, SituationAnswer, UserPriority } from "./types";

type NeedProfileSummaryProps = {
  profile: NeedProfileV1;
  onCorrect?: () => void;
  onHelp?: () => void;
  onIgnore?: (categoryId: NeedCategoryId) => void;
  onRestore?: (categoryId: NeedCategoryId) => void;
  answers?: Record<string, SituationAnswer>;
  previousAnswers?: Record<string, SituationAnswer>;
  sourceQuestionIds?: string[];
  onCorrectSource?: (questionId: string) => void;
};

const CONFIRMABLE_SOURCE_IDS = ["I3", "P5", "P6", "N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8"] as const;

const PRIORITY_LABELS: Record<UserPriority, string> = {
  understand: "Mieux comprendre",
  "reduce-risk-stay": "Réduire les risques sans partir",
  "regain-autonomy": "Retrouver de l'autonomie",
  "communicate-if-safe": "Communiquer seulement si c'est sans danger",
  "protect-dependant": "Protéger une personne dépendante",
  "prepare-distance": "Préparer une prise de distance",
  "prepare-separation": "Préparer une séparation",
  "after-separation": "Faire face à l'après-séparation",
  "find-human-help": "Trouver une aide humaine",
};

const NEXT_STEP_LABELS: Record<NextStep, string> = {
  "observe-understand": "Observer et mieux comprendre",
  "open-help-options": "Voir les options d'aide",
  "talk-trusted-person": "Parler à une personne fiable",
  "prepare-small-safety-step": "Préparer une petite action de sécurité",
  "seek-health-help": "Chercher une aide de santé",
  "seek-rights-info": "Chercher des informations sur tes droits",
  "seek-practical-help": "Chercher une aide pratique",
  "prepare-distance": "Préparer une prise de distance",
  "prepare-separation": "Préparer une séparation",
  none: "Aucun maintenant — c'est un choix valable",
  unknown: "Pas de prochain pas choisi pour le moment",
};

const ORIENTATION_LABELS = {
  urgent: "Une priorité immédiate a été indiquée",
  specialized: "Des catégories d'aide spécialisée peuvent correspondre à tes choix",
  nonUrgent: "Des options simples peuvent correspondre à tes choix",
} as const;

const PREFERENCE_LABELS: Record<string, string> = {
  french: "Aide en français",
  "another-language": "Aide dans une autre langue",
  "interpreter-help": "Interprétariat souhaité",
  "no-preference": "Pas de préférence de format ou de langue",
  "easy-read": "Explications faciles à lire",
  "screen-reader": "Compatibilité lecteur d'écran",
  hearing: "Adaptation auditive",
  vision: "Adaptation visuelle",
  mobility: "Accessibilité physique",
  "attention-memory": "Soutien pour l'attention ou la mémoire",
  communication: "Adaptation de communication",
  "metropolitan-france": "France métropolitaine",
  "overseas-france": "France d'outre-mer",
  "europe-outside-france": "Europe hors France",
  "outside-europe": "Hors Europe",
  "remote-only": "À distance uniquement",
  "free-only": "Gratuit uniquement",
  capped: "Budget limité",
  flexible: "Disponibilité ou coût flexible",
  immediate: "Disponibilité sans attendre souhaitée",
  "within-days": "Disponibilité dans les prochains jours souhaitée",
  phone: "Téléphone",
  "text-chat": "Messages ou chat",
  video: "Visio",
  "in-person": "En personne",
  "written-information": "Informations écrites",
  "in-app-only": "Contact dans l'app uniquement",
  "phone-call": "Appel téléphonique",
  "text-message": "Message texte",
  email: "E-mail",
  "no-safe-channel": "Aucun canal ne paraît sûr",
  morning: "Le matin",
  afternoon: "L'après-midi",
  evening: "Le soir",
};

function preferenceSummaries(profile: NeedProfileV1): string[] {
  const preferences = profile.preferences;
  const values = [
    ...preferences.languagePreferences,
    ...preferences.accessibilityNeeds,
    ...(preferences.territory === "unknown" ? [] : [preferences.territory]),
    ...(preferences.cost === "unknown" ? [] : [preferences.cost]),
    ...(preferences.availability === "unknown" ? [] : [preferences.availability]),
    ...preferences.modalities,
    ...preferences.safeContactChannels,
    ...preferences.safeContactWindows,
  ];
  return [...new Set(values)].map((value) => PREFERENCE_LABELS[value] ?? value);
}

function answerLabel(questionId: string, answer: SituationAnswer | undefined): string {
  if (answer === undefined || (Array.isArray(answer) && answer.length === 0)) return "Non renseigné";
  const question = getSituationQuestion(questionId);
  if (!question) return "Valeur non reconnue";
  const values = Array.isArray(answer) ? answer : [answer];
  const labels = values.map((value) => question.options.find((option) => option.value === value)?.label);
  return labels.every((label): label is string => label !== undefined) ? labels.join(" · ") : "Valeur non reconnue";
}

function sameAnswer(left: SituationAnswer | undefined, right: SituationAnswer | undefined): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function NeedProfileSummary({
  profile,
  onCorrect,
  onHelp,
  onIgnore,
  onRestore,
  answers,
  previousAnswers,
  sourceQuestionIds,
  onCorrectSource,
}: NeedProfileSummaryProps) {
  const [expanded, setExpanded] = useState<NeedCategoryId[]>([]);
  const ignored = new Set(profile.ignoredCategoryIds);
  const activeCategories = profile.categories.filter((category) => !ignored.has(category.id));
  const ignoredCategories = profile.categories.filter((category) => ignored.has(category.id));
  const practicalPreferences = preferenceSummaries(profile);
  const sourceFilter = sourceQuestionIds ? new Set(sourceQuestionIds) : null;
  const reviewedSources = answers
    ? CONFIRMABLE_SOURCE_IDS.filter((questionId) => profile.sourceQuestionIds.includes(questionId)
      && answers[questionId] !== undefined
      && (!sourceFilter || sourceFilter.has(questionId)))
    : [];

  function toggleReason(categoryId: NeedCategoryId) {
    setExpanded((current) => current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.section} accessibilityRole="summary">
        <Text style={styles.sectionTitle}>Ce que j'ai compris</Text>
        <Text style={styles.body}>
          {profile.sourceQuestionIds.length > 0
            ? `Ce résumé utilise ${profile.sourceQuestionIds.length} réponse${profile.sourceQuestionIds.length > 1 ? "s" : ""} que tu as confirmée${profile.sourceQuestionIds.length > 1 ? "s" : ""}.`
            : "Tu n'as pas besoin d'ajouter d'autres informations pour consulter les ressources."}
        </Text>
        {profile.orientation ? <Text style={styles.orientation}>{ORIENTATION_LABELS[profile.orientation.level]}</Text> : (
          <Text style={styles.body}>Claiire ne conclut aucune orientation avec les informations disponibles. Cela ne veut pas dire qu'il n'y a aucun besoin.</Text>
        )}
      </View>

      {answers ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Réponses à confirmer</Text>
          {reviewedSources.length > 0 ? reviewedSources.map((questionId) => {
            const question = getSituationQuestion(questionId);
            if (!question) return null;
            const currentAnswer = answers[questionId];
            const changed = previousAnswers !== undefined && !sameAnswer(previousAnswers[questionId], currentAnswer);
            return (
              <View key={questionId} style={styles.sourceCard}>
                <Text style={styles.sourceQuestion}>{question.prompt}</Text>
                {changed ? (
                  <View style={styles.sourceComparison}>
                    <Text style={styles.sourceValue}><Text style={styles.sourceCaption}>Avant : </Text>{answerLabel(questionId, previousAnswers?.[questionId])}</Text>
                    <Text style={styles.sourceValue}><Text style={styles.sourceCaption}>Maintenant : </Text>{answerLabel(questionId, currentAnswer)}</Text>
                  </View>
                ) : (
                  <Text style={styles.sourceValue}><Text style={styles.sourceCaption}>Maintenant : </Text>{answerLabel(questionId, currentAnswer)}</Text>
                )}
                {onCorrectSource ? (
                  <TouchableOpacity
                    style={styles.textAction}
                    onPress={() => onCorrectSource(questionId)}
                    accessibilityRole="button"
                    accessibilityLabel={`Corriger la réponse à la question ${questionId}`}
                  >
                    <Text style={styles.actionText}>Corriger cette réponse</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            );
          }) : (
            <Text style={styles.body}>Aucune réponse de besoin ou de préférence n'a été modifiée dans cette mise à jour.</Text>
          )}
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ce qui compte maintenant</Text>
        {profile.userPriorities.length > 0 ? profile.userPriorities.map((priority) => (
          <Text key={priority} style={styles.listItem}>• {PRIORITY_LABELS[priority]}</Text>
        )) : <Text style={styles.body}>Aucune priorité n'est imposée.</Text>}
        <Text style={styles.nextStep}>Prochain pas : {NEXT_STEP_LABELS[profile.selectedNextStep]}</Text>
        {practicalPreferences.length > 0 ? (
          <View style={styles.preferenceList}>
            <Text style={styles.preferenceTitle}>Ce qui peut faciliter une aide</Text>
            {practicalPreferences.map((preference) => <Text key={preference} style={styles.listItem}>• {preference}</Text>)}
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Options d'aide à considérer</Text>
        {activeCategories.length === 0 ? (
          <Text style={styles.body}>Aucune catégorie n'est affichée pour le moment. Tu peux quand même consulter l'aide humaine, corriger tes réponses ou ne rien faire maintenant.</Text>
        ) : activeCategories.map((category) => {
          const reasonVisible = expanded.includes(category.id);
          return (
            <View key={category.id} style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>{category.label}</Text>
              <Text style={styles.body}>{category.explanation}</Text>
              <TouchableOpacity
                style={styles.textAction}
                onPress={() => toggleReason(category.id)}
                accessibilityRole="button"
                accessibilityLabel={`${reasonVisible ? "Masquer" : "Voir"} pourquoi ${category.label} est proposée`}
                accessibilityState={{ expanded: reasonVisible }}
              >
                <Text style={styles.actionText}>{reasonVisible ? "Masquer pourquoi" : "Pourquoi ?"}</Text>
              </TouchableOpacity>
              {reasonVisible ? (
                <Text style={styles.reason}>D'après tes réponses confirmées aux questions {category.evidenceQuestionIds.join(", ")}.</Text>
              ) : null}
              {onIgnore ? (
                <TouchableOpacity
                  style={styles.textAction}
                  onPress={() => onIgnore(category.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Ignorer la catégorie ${category.label}`}
                >
                  <Text style={styles.mutedActionText}>Ignorer cette catégorie</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          );
        })}
      </View>

      {ignoredCategories.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catégories ignorées</Text>
          {ignoredCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.restoreButton}
              onPress={() => onRestore?.(category.id)}
              accessibilityRole="button"
              accessibilityLabel={`Restaurer la catégorie ${category.label}`}
            >
              <Text style={styles.actionText}>Restaurer : {category.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      {onCorrect ? (
        <TouchableOpacity style={styles.secondaryButton} onPress={onCorrect} accessibilityRole="button" accessibilityLabel="Corriger mes réponses">
          <Text style={styles.secondaryText}>Corriger mes réponses</Text>
        </TouchableOpacity>
      ) : null}
      {onHelp ? (
        <TouchableOpacity style={styles.secondaryButton} onPress={onHelp} accessibilityRole="button" accessibilityLabel="Obtenir une aide humaine">
          <Text style={styles.secondaryText}>Obtenir une aide humaine</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const T = AppDesignTokens;
const styles = StyleSheet.create({
  container: { gap: T.layout.v14 },
  section: { backgroundColor: T.colors.surface, borderRadius: T.layout.v14, padding: T.layout.v16, gap: T.layout.v8, borderWidth: T.layout.v1, borderColor: T.colors.border },
  sectionTitle: { color: T.colors.text, fontSize: T.layout.v20, fontWeight: T.typography.bold },
  body: { color: T.colors.textMuted, fontSize: T.layout.v15, lineHeight: T.layout.v22 },
  orientation: { color: T.colors.accentSoft2, fontSize: T.layout.v15, lineHeight: T.layout.v22, fontWeight: T.typography.semibold },
  listItem: { color: T.colors.textMuted, fontSize: T.layout.v15, lineHeight: T.layout.v22 },
  nextStep: { color: T.colors.text, fontSize: T.layout.v15, lineHeight: T.layout.v22, fontWeight: T.typography.semibold, marginTop: T.layout.v4 },
  preferenceList: { gap: T.layout.v4, marginTop: T.layout.v8 },
  preferenceTitle: { color: T.colors.text, fontSize: T.layout.v15, lineHeight: T.layout.v22, fontWeight: T.typography.semibold },
  categoryCard: { backgroundColor: T.colors.surfaceMutedAlt, borderRadius: T.layout.v12, padding: T.layout.v14, gap: T.layout.v8, borderWidth: T.layout.v1, borderColor: T.colors.border },
  categoryTitle: { color: T.colors.text, fontSize: T.layout.v17, lineHeight: T.layout.v24, fontWeight: T.typography.bold },
  textAction: { minHeight: T.layout.v44, justifyContent: "center", alignSelf: "flex-start" },
  actionText: { color: T.colors.accentSoft2, fontSize: T.layout.v14, fontWeight: T.typography.semibold },
  mutedActionText: { color: T.colors.textMuted, fontSize: T.layout.v14, fontWeight: T.typography.medium },
  reason: { color: T.colors.textSubtle, fontSize: T.layout.v13, lineHeight: T.layout.v20 },
  sourceCard: { backgroundColor: T.colors.surfaceMutedAlt, borderRadius: T.layout.v12, padding: T.layout.v14, gap: T.layout.v8, borderWidth: T.layout.v1, borderColor: T.colors.border },
  sourceQuestion: { color: T.colors.text, fontSize: T.layout.v15, lineHeight: T.layout.v22, fontWeight: T.typography.semibold },
  sourceComparison: { gap: T.layout.v4 },
  sourceCaption: { color: T.colors.textSubtle, fontWeight: T.typography.medium },
  sourceValue: { color: T.colors.textMuted, fontSize: T.layout.v14, lineHeight: T.layout.v20 },
  restoreButton: { minHeight: T.layout.v44, justifyContent: "center" },
  secondaryButton: { minHeight: T.layout.v48, borderRadius: T.layout.v14, borderWidth: T.layout.v1, borderColor: T.colors.borderSoft, alignItems: "center", justifyContent: "center", paddingHorizontal: T.layout.v16 },
  secondaryText: { color: T.colors.text, fontSize: T.layout.v15, fontWeight: T.typography.semibold, textAlign: "center" },
});
