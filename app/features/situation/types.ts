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

export type SituationState = {
  version: 1;
  status: "partial" | "completed" | "needs-private-recheck";
  interactionGate: "solo";
  updatedAt: string;
  safeContextConfirmedAt: string | null;
  storagePreference: "device" | "session" | "unknown";
  answers: Record<string, SituationAnswer>;
  dimensions: Record<SituationDimension, DimensionState>;
  criticalEventHistory: CriticalEvent[];
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
  options: QuestionOption[];
};
