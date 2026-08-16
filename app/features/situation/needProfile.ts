import type {
  AccessibilityNeed,
  AvailabilityPreference,
  CostPreference,
  CriticalEvent,
  LanguagePreference,
  NeedCategory,
  NeedCategoryId,
  NeedProfileV1,
  NeedReasonCode,
  NextStep,
  RequestedNeed,
  SafeContactChannel,
  SafeContactWindow,
  SituationAnswer,
  SupportModality,
  TerritoryPreference,
  UserPriority,
} from "./types";

const CATEGORY_ORDER: NeedCategoryId[] = [
  "immediate-safety",
  "health-psychological",
  "dependant-support",
  "violence-specialist",
  "legal-rights",
  "social-practical",
  "trusted-person",
  "self-understanding",
];

const CATEGORY_COPY: Record<NeedCategoryId, Pick<NeedCategory, "label" | "explanation">> = {
  "immediate-safety": {
    label: "Options de sécurité immédiate",
    explanation: "Un événement critique déjà confirmé reste prioritaire. Tu peux consulter les ressources sans poursuivre le questionnaire.",
  },
  "health-psychological": {
    label: "Aide médicale ou psychologique",
    explanation: "Tu as indiqué vouloir pouvoir considérer une aide pour ta santé physique ou psychologique.",
  },
  "dependant-support": {
    label: "Soutien pour une personne dépendante",
    explanation: "Tu as indiqué qu'un enfant ou une personne dépendante devait être pris en compte.",
  },
  "violence-specialist": {
    label: "Aide spécialisée dans les violences",
    explanation: "Une aide spécialisée peut présenter des options adaptées sans décider à ta place.",
  },
  "legal-rights": {
    label: "Informations sur les droits",
    explanation: "Tu as indiqué vouloir mieux comprendre tes droits ou les démarches possibles.",
  },
  "social-practical": {
    label: "Aide sociale ou pratique",
    explanation: "Tu as indiqué avoir besoin d'options concrètes autour de tes contraintes ou de ton autonomie.",
  },
  "trusted-person": {
    label: "Parler à une personne fiable",
    explanation: "Tu as indiqué qu'un échange avec une personne de confiance pourrait être un prochain pas.",
  },
  "self-understanding": {
    label: "Mieux comprendre ce que tu vis",
    explanation: "Tu as indiqué vouloir organiser les faits et mieux comprendre ce qui compte pour toi.",
  },
};

const REQUESTED_NEEDS = new Set<RequestedNeed>([
  "violence-specialist",
  "health-psychological",
  "legal-rights",
  "social-practical",
  "dependant-support",
  "trusted-person",
  "self-understanding",
]);
const USER_PRIORITIES = new Set<UserPriority>([
  "understand",
  "reduce-risk-stay",
  "regain-autonomy",
  "communicate-if-safe",
  "protect-dependant",
  "prepare-distance",
  "prepare-separation",
  "after-separation",
  "find-human-help",
]);
const NEXT_STEPS = new Set<Exclude<NextStep, "none" | "unknown">>([
  "observe-understand",
  "open-help-options",
  "talk-trusted-person",
  "prepare-small-safety-step",
  "seek-health-help",
  "seek-rights-info",
  "seek-practical-help",
  "prepare-distance",
  "prepare-separation",
]);
const LANGUAGE_PREFERENCES = new Set<LanguagePreference>(["french", "another-language", "interpreter-help", "no-preference"]);
const ACCESSIBILITY_NEEDS = new Set<AccessibilityNeed>(["easy-read", "screen-reader", "hearing", "vision", "mobility", "attention-memory", "communication"]);
const TERRITORIES = new Set<TerritoryPreference>(["metropolitan-france", "overseas-france", "europe-outside-france", "outside-europe", "remote-only", "unknown"]);
const COSTS = new Set<CostPreference>(["free-only", "capped", "flexible", "unknown"]);
const MODALITIES = new Set<SupportModality>(["phone", "text-chat", "video", "in-person", "written-information", "no-preference"]);
const CONTACT_CHANNELS = new Set<SafeContactChannel>(["in-app-only", "phone-call", "text-message", "email", "no-safe-channel"]);
const CONTACT_WINDOWS = new Set<SafeContactWindow>(["morning", "afternoon", "evening"]);

type CategoryEvidence = {
  reasonCodes: NeedReasonCode[];
  evidenceQuestionIds: string[];
};

export type BuildNeedProfileInput = {
  answers: Record<string, SituationAnswer>;
  criticalEventHistory: CriticalEvent[];
  derivedAt: string;
  sourceSituationVersion: 1 | 2;
  ignoredCategoryIds?: NeedCategoryId[];
};

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function selectedValues(answer: SituationAnswer | undefined, exclusiveValues: string[]): string[] {
  if (!Array.isArray(answer)) return [];
  const selectedExclusive = answer.filter((value) => exclusiveValues.includes(value));
  if (selectedExclusive.length > 1 || (selectedExclusive.length === 1 && answer.length > 1)) return [];
  return selectedExclusive.length === 1 ? selectedExclusive : unique(answer);
}

function addEvidence(
  evidenceByCategory: Map<NeedCategoryId, CategoryEvidence>,
  categoryId: NeedCategoryId,
  questionId: string,
  reasonCode: NeedReasonCode,
) {
  const current = evidenceByCategory.get(categoryId) ?? { reasonCodes: [], evidenceQuestionIds: [] };
  evidenceByCategory.set(categoryId, {
    reasonCodes: unique([...current.reasonCodes, reasonCode]),
    evidenceQuestionIds: unique([...current.evidenceQuestionIds, questionId]),
  });
}

const PRIORITY_MAPPINGS: Record<UserPriority, Array<[NeedCategoryId, NeedReasonCode]>> = {
  understand: [["self-understanding", "PRIORITY_UNDERSTAND"]],
  "reduce-risk-stay": [["violence-specialist", "PRIORITY_REDUCE_RISK_STAY"]],
  "regain-autonomy": [["social-practical", "PRIORITY_REGAIN_AUTONOMY"]],
  "communicate-if-safe": [["violence-specialist", "PRIORITY_COMMUNICATE_IF_SAFE"]],
  "protect-dependant": [["dependant-support", "PRIORITY_PROTECT_DEPENDANT"], ["violence-specialist", "PRIORITY_PROTECT_DEPENDANT"]],
  "prepare-distance": [["violence-specialist", "PRIORITY_PREPARE_DISTANCE"]],
  "prepare-separation": [["violence-specialist", "PRIORITY_PREPARE_SEPARATION"]],
  "after-separation": [["violence-specialist", "PRIORITY_AFTER_SEPARATION"]],
  "find-human-help": [["violence-specialist", "PRIORITY_FIND_HUMAN_HELP"]],
};

const NEXT_STEP_MAPPINGS: Partial<Record<Exclude<NextStep, "none" | "unknown">, [NeedCategoryId, NeedReasonCode]>> = {
  "observe-understand": ["self-understanding", "NEXT_STEP_OBSERVE_UNDERSTAND"],
  "open-help-options": ["violence-specialist", "NEXT_STEP_OPEN_HELP_OPTIONS"],
  "talk-trusted-person": ["trusted-person", "NEXT_STEP_TRUSTED_PERSON"],
  "prepare-small-safety-step": ["violence-specialist", "NEXT_STEP_SMALL_SAFETY_STEP"],
  "seek-health-help": ["health-psychological", "NEXT_STEP_HEALTH_HELP"],
  "seek-rights-info": ["legal-rights", "NEXT_STEP_RIGHTS_INFO"],
  "seek-practical-help": ["social-practical", "NEXT_STEP_PRACTICAL_HELP"],
  "prepare-distance": ["violence-specialist", "NEXT_STEP_PREPARE_DISTANCE"],
  "prepare-separation": ["violence-specialist", "NEXT_STEP_PREPARE_SEPARATION"],
};

function deriveNextStep(answer: SituationAnswer | undefined): NextStep {
  if (answer === "none-now") return "none";
  if (typeof answer === "string" && NEXT_STEPS.has(answer as Exclude<NextStep, "none" | "unknown">)) return answer as NextStep;
  return "unknown";
}

export function buildNeedProfile({
  answers,
  criticalEventHistory,
  derivedAt,
  sourceSituationVersion,
  ignoredCategoryIds = [],
}: BuildNeedProfileInput): NeedProfileV1 {
  const evidenceByCategory = new Map<NeedCategoryId, CategoryEvidence>();

  for (const event of criticalEventHistory) {
    addEvidence(evidenceByCategory, "immediate-safety", event.sourceQuestionId, "PREVIOUS_CRITICAL_EVENT");
  }

  if (answers.I3 === "maybe") addEvidence(evidenceByCategory, "health-psychological", "I3", "HEALTH_HELP_MAYBE");
  if (answers.I3 === "yes") addEvidence(evidenceByCategory, "health-psychological", "I3", "HEALTH_HELP_YES");
  if (answers.I3 === "without-waiting") addEvidence(evidenceByCategory, "health-psychological", "I3", "HEALTH_HELP_WITHOUT_WAITING");

  const userPriorities = selectedValues(answers.P5, ["unknown"]).filter((value): value is UserPriority => USER_PRIORITIES.has(value as UserPriority));
  for (const priority of userPriorities) {
    for (const [categoryId, reasonCode] of PRIORITY_MAPPINGS[priority]) addEvidence(evidenceByCategory, categoryId, "P5", reasonCode);
  }

  const selectedNextStep = deriveNextStep(answers.P6);
  if (selectedNextStep !== "none" && selectedNextStep !== "unknown") {
    const mapping = NEXT_STEP_MAPPINGS[selectedNextStep];
    if (mapping) addEvidence(evidenceByCategory, mapping[0], "P6", mapping[1]);
  }

  const requestedNeeds = selectedValues(answers.N1, ["none-now", "unknown"])
    .filter((value): value is RequestedNeed => REQUESTED_NEEDS.has(value as RequestedNeed));
  for (const requestedNeed of requestedNeeds) addEvidence(evidenceByCategory, requestedNeed, "N1", "REQUESTED_SUPPORT_TYPE");

  const categories = CATEGORY_ORDER
    .filter((categoryId) => evidenceByCategory.has(categoryId))
    .slice(0, 3)
    .map((categoryId): NeedCategory => ({
      id: categoryId,
      ...CATEGORY_COPY[categoryId],
      ...evidenceByCategory.get(categoryId)!,
    }));

  const categoryIds = new Set(categories.map((category) => category.id));
  const retainedIgnoredIds = unique(ignoredCategoryIds).filter((categoryId) => categoryIds.has(categoryId));
  const specializedIds = new Set<NeedCategoryId>(["health-psychological", "dependant-support", "violence-specialist", "legal-rights", "social-practical"]);
  const urgentEvidence = criticalEventHistory.length > 0 || answers.I3 === "without-waiting";
  const orientationCategories = categories.filter((category) => category.id !== "immediate-safety");
  const orientation = urgentEvidence
    ? {
      level: "urgent" as const,
      reasonCodes: unique([
        ...(criticalEventHistory.length > 0 ? ["PREVIOUS_CRITICAL_EVENT" as const] : []),
        ...(answers.I3 === "without-waiting" ? ["HEALTH_HELP_WITHOUT_WAITING" as const] : []),
      ]),
      evidenceQuestionIds: unique([
        ...criticalEventHistory.map((event) => event.sourceQuestionId),
        ...(answers.I3 === "without-waiting" ? ["I3"] : []),
      ]),
    }
    : orientationCategories.some((category) => specializedIds.has(category.id))
      ? {
        level: "specialized" as const,
        reasonCodes: unique(orientationCategories.filter((category) => specializedIds.has(category.id)).flatMap((category) => category.reasonCodes)),
        evidenceQuestionIds: unique(orientationCategories.filter((category) => specializedIds.has(category.id)).flatMap((category) => category.evidenceQuestionIds)),
      }
      : orientationCategories.length > 0
        ? {
          level: "nonUrgent" as const,
          reasonCodes: unique(orientationCategories.flatMap((category) => category.reasonCodes)),
          evidenceQuestionIds: unique(orientationCategories.flatMap((category) => category.evidenceQuestionIds)),
        }
        : null;

  const n2 = selectedValues(answers.N2, ["no-preference", "unknown"]);
  const n3 = selectedValues(answers.N3, ["none", "skip"]);
  const n7 = selectedValues(answers.N7, ["no-preference", "unknown"]);
  const n8 = selectedValues(answers.N8, ["no-safe-channel", "unknown"]);
  const territory = typeof answers.N4 === "string" && TERRITORIES.has(answers.N4 as TerritoryPreference) ? answers.N4 as TerritoryPreference : "unknown";
  const cost = typeof answers.N5 === "string" && COSTS.has(answers.N5 as CostPreference) ? answers.N5 as CostPreference : "unknown";
  const availability: AvailabilityPreference = answers.N6 === "without-waiting"
    ? "immediate"
    : answers.N6 === "within-days" || answers.N6 === "flexible"
      ? answers.N6
      : "unknown";

  return {
    version: 1,
    derivedAt,
    sourceSituationVersion,
    sourceQuestionIds: Object.keys(answers).sort(),
    requestedNeeds,
    userPriorities,
    selectedNextStep,
    preferredSupportTypes: requestedNeeds,
    preferences: {
      languagePreferences: n2.filter((value): value is LanguagePreference => LANGUAGE_PREFERENCES.has(value as LanguagePreference)),
      accessibilityNeeds: n3.filter((value): value is AccessibilityNeed => ACCESSIBILITY_NEEDS.has(value as AccessibilityNeed)),
      territory,
      cost,
      availability,
      modalities: n7.filter((value): value is SupportModality => MODALITIES.has(value as SupportModality)),
      safeContactChannels: n8.filter((value): value is SafeContactChannel => CONTACT_CHANNELS.has(value as SafeContactChannel)),
      safeContactWindows: n8.filter((value): value is SafeContactWindow => CONTACT_WINDOWS.has(value as SafeContactWindow)),
    },
    orientation,
    categories,
    ignoredCategoryIds: retainedIgnoredIds,
  };
}
