export type SituationDimension =
  | "SAF"
  | "CTL"
  | "REC"
  | "REL"
  | "CHG"
  | "CON"
  | "SUP"
  | "AGY"
  | "DIG"
  | "DEP"
  | "IMP";

export type SituationScore = 0 | 1 | 2 | 3 | 4 | null;
export type SituationAnswer = string | string[];
export type SituationQuestionnaireMode = "initial" | "update";
export type SituationQuestionnaireStage = "questions" | "changes" | "review";
export type SituationChange =
  | "event"
  | "worsened"
  | "calmer"
  | "relationship"
  | "constraints"
  | "support"
  | "understanding"
  | "intention"
  | "review-all";

export type DimensionState = {
  score: SituationScore;
  confidence: "low" | "medium" | "high";
  assessedAt: string | null;
  source: "user-explicit";
  evidenceQuestionIds: string[];
};

export type CriticalEvent = {
  id: string;
  code: string;
  observedAt: string;
  sourceQuestionId: string;
};

export type NeedCategoryId =
  | "immediate-safety"
  | "health-psychological"
  | "dependant-support"
  | "violence-specialist"
  | "legal-rights"
  | "social-practical"
  | "trusted-person"
  | "self-understanding";

export type RequestedNeed = Exclude<NeedCategoryId, "immediate-safety">;
export type OrientationLevel = "urgent" | "specialized" | "nonUrgent";

export type UserPriority =
  | "understand"
  | "reduce-risk-stay"
  | "regain-autonomy"
  | "communicate-if-safe"
  | "protect-dependant"
  | "prepare-distance"
  | "prepare-separation"
  | "after-separation"
  | "find-human-help";

export type NextStep =
  | "observe-understand"
  | "open-help-options"
  | "talk-trusted-person"
  | "prepare-small-safety-step"
  | "seek-health-help"
  | "seek-rights-info"
  | "seek-practical-help"
  | "prepare-distance"
  | "prepare-separation"
  | "none"
  | "unknown";

export type LanguagePreference = "french" | "another-language" | "interpreter-help" | "no-preference";
export type AccessibilityNeed =
  | "easy-read"
  | "screen-reader"
  | "hearing"
  | "vision"
  | "mobility"
  | "attention-memory"
  | "communication";
export type TerritoryPreference =
  | "metropolitan-france"
  | "overseas-france"
  | "europe-outside-france"
  | "outside-europe"
  | "remote-only"
  | "unknown";
export type CostPreference = "free-only" | "capped" | "flexible" | "unknown";
export type AvailabilityPreference = "immediate" | "within-days" | "flexible" | "unknown";
export type SupportModality = "phone" | "text-chat" | "video" | "in-person" | "written-information" | "no-preference";
export type SafeContactChannel = "in-app-only" | "phone-call" | "text-message" | "email" | "no-safe-channel";
export type SafeContactWindow = "morning" | "afternoon" | "evening";

export type NeedReasonCode =
  | "PREVIOUS_CRITICAL_EVENT"
  | "HEALTH_HELP_MAYBE"
  | "HEALTH_HELP_YES"
  | "HEALTH_HELP_WITHOUT_WAITING"
  | "PRIORITY_UNDERSTAND"
  | "PRIORITY_REDUCE_RISK_STAY"
  | "PRIORITY_REGAIN_AUTONOMY"
  | "PRIORITY_COMMUNICATE_IF_SAFE"
  | "PRIORITY_PROTECT_DEPENDANT"
  | "PRIORITY_PREPARE_DISTANCE"
  | "PRIORITY_PREPARE_SEPARATION"
  | "PRIORITY_AFTER_SEPARATION"
  | "PRIORITY_FIND_HUMAN_HELP"
  | "NEXT_STEP_OBSERVE_UNDERSTAND"
  | "NEXT_STEP_OPEN_HELP_OPTIONS"
  | "NEXT_STEP_TRUSTED_PERSON"
  | "NEXT_STEP_SMALL_SAFETY_STEP"
  | "NEXT_STEP_HEALTH_HELP"
  | "NEXT_STEP_RIGHTS_INFO"
  | "NEXT_STEP_PRACTICAL_HELP"
  | "NEXT_STEP_PREPARE_DISTANCE"
  | "NEXT_STEP_PREPARE_SEPARATION"
  | "REQUESTED_SUPPORT_TYPE";

export type ExplainedOrientation = {
  level: OrientationLevel;
  reasonCodes: NeedReasonCode[];
  evidenceQuestionIds: string[];
};

export type NeedCategory = {
  id: NeedCategoryId;
  label: string;
  explanation: string;
  reasonCodes: NeedReasonCode[];
  evidenceQuestionIds: string[];
};

export type NeedProfileV1 = {
  version: 1;
  derivedAt: string;
  sourceSituationVersion: 1 | 2;
  sourceQuestionIds: string[];
  requestedNeeds: RequestedNeed[];
  userPriorities: UserPriority[];
  selectedNextStep: NextStep;
  preferredSupportTypes: RequestedNeed[];
  preferences: {
    languagePreferences: LanguagePreference[];
    accessibilityNeeds: AccessibilityNeed[];
    territory: TerritoryPreference;
    cost: CostPreference;
    availability: AvailabilityPreference;
    modalities: SupportModality[];
    safeContactChannels: SafeContactChannel[];
    safeContactWindows: SafeContactWindow[];
  };
  orientation: ExplainedOrientation | null;
  categories: NeedCategory[];
  ignoredCategoryIds: NeedCategoryId[];
};

type SituationStateBase = {
  status: "partial" | "completed" | "needs-private-recheck";
  interactionGate: "solo";
  updatedAt: string;
  safeContextConfirmedAt: string | null;
  storagePreference: "device" | "session" | "unknown";
  answers: Record<string, SituationAnswer>;
  dimensions: Record<SituationDimension, DimensionState>;
  criticalEventHistory: CriticalEvent[];
};

export type SituationStateV1 = SituationStateBase & {
  version: 1;
};

export type SituationState = SituationStateBase & {
  version: 2;
  needProfile: NeedProfileV1;
};

export type SituationLoadStatus = "empty" | "loaded" | "migrated" | "invalid" | "storage-error";

export type SituationLoadResult = {
  state: SituationState | null;
  status: SituationLoadStatus;
};

export type QuestionOption = {
  value: string;
  label: string;
};

export type SituationQuestion = {
  id: string;
  phase: string;
  prompt: string;
  helper?: string;
  multiple?: boolean;
  exclusiveValues?: string[];
  options: QuestionOption[];
};
