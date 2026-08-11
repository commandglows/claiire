import type {
  CriticalEvent,
  DimensionState,
  SituationAnswer,
  SituationDimension,
  SituationScore,
  SituationState,
} from "./types";
import { CRITICAL_S3_VALUES } from "./questionnaire";

const DIMENSIONS: SituationDimension[] = ["SAF", "CTL", "REC", "REL", "CHG", "CON", "SUP", "AGY", "DIG", "DEP", "IMP"];

function emptyDimension(): DimensionState {
  return { score: null, confidence: "low", assessedAt: null, source: "user-explicit", evidenceQuestionIds: [] };
}

function ordinal(value: SituationAnswer | undefined): SituationScore {
  if (typeof value !== "string" || value === "unknown") return null;
  const parsed = Number(value);
  return parsed >= 0 && parsed <= 4 ? (parsed as SituationScore) : null;
}

function setDimension(
  dimensions: Record<SituationDimension, DimensionState>,
  dimension: SituationDimension,
  score: SituationScore,
  questionId: string,
  assessedAt: string,
) {
  if (score === null) return;
  const current = dimensions[dimension].score;
  if (current === null || score >= current) {
    dimensions[dimension] = { score, confidence: "high", assessedAt, source: "user-explicit", evidenceQuestionIds: [questionId] };
  }
}

export function buildSituationState(
  answers: Record<string, SituationAnswer>,
  previous?: SituationState | null,
): SituationState {
  const now = new Date().toISOString();
  const dimensions = Object.fromEntries(DIMENSIONS.map((key) => [key, emptyDimension()])) as Record<SituationDimension, DimensionState>;

  const privacy = answers.A1;
  setDimension(dimensions, "DIG", privacy === "yes" ? 0 : privacy === "unsure" ? 2 : privacy === "no" ? 4 : null, "A1", now);
  setDimension(dimensions, "SAF", answers.S1 === "no" ? 0 : answers.S1 === "maybe" ? 3 : answers.S1 === "yes" ? 4 : null, "S1", now);
  setDimension(dimensions, "SAF", answers.S2 === "no" ? 0 : answers.S2 === "little" ? 2 : answers.S2 === "clearly" ? 3 : null, "S2", now);

  const selectedCritical = Array.isArray(answers.S3) ? answers.S3.filter((value) => CRITICAL_S3_VALUES.has(value)) : [];
  if (selectedCritical.length > 0) setDimension(dimensions, "SAF", 4, "S3", now);
  if (selectedCritical.includes("dependent-threat")) setDimension(dimensions, "DEP", 4, "S3", now);
  if (selectedCritical.includes("injury")) setDimension(dimensions, "IMP", 4, "S3", now);

  setDimension(dimensions, "CTL", ordinal(answers.F3), "F3", now);
  setDimension(dimensions, "DEP", ordinal(answers.C1), "C1", now);
  setDimension(dimensions, "CON", ordinal(answers.C3), "C3", now);
  const constraintScore = ordinal(answers.C3);
  const agencyScore = ordinal(answers.P4);
  setDimension(dimensions, "AGY", agencyScore ?? (constraintScore === null ? null : ((4 - constraintScore) as SituationScore)), agencyScore === null ? "C3" : "P4", now);
  setDimension(dimensions, "SUP", answers.C4 === "unsafe" ? 0 : ordinal(answers.C4), "C4", now);
  setDimension(dimensions, "SUP", ordinal(answers.C5), "C5", now);
  setDimension(dimensions, "IMP", ordinal(answers.I2), "I2", now);
  setDimension(dimensions, "REC", ordinal(answers.P1), "P1", now);
  setDimension(dimensions, "REL", ordinal(answers.P2), "P2", now);
  setDimension(dimensions, "CHG", ordinal(answers.P3), "P3", now);

  const previousCritical = new Set(
    Array.isArray(previous?.answers.S3) ? previous.answers.S3 : [],
  );
  const additions: CriticalEvent[] = selectedCritical
    .filter((code) => !previousCritical.has(code))
    .map((code) => ({ id: `${now}:${code}`, code, observedAt: now, sourceQuestionId: "S3" }));

  return {
    version: 1,
    status: privacy === "yes" ? "completed" : "needs-private-recheck",
    interactionGate: "solo",
    updatedAt: now,
    safeContextConfirmedAt: privacy === "yes" ? now : null,
    storagePreference: answers.A2 === "device" ? "device" : answers.A2 === "session" ? "session" : "unknown",
    answers,
    dimensions,
    criticalEventHistory: [...(previous?.criticalEventHistory ?? []), ...additions],
  };
}

export function scoreMeaning(score: SituationScore): string {
  if (score === null) return "À préciser";
  return ["Aucun signal rapporté", "À observer", "À regarder", "Important actuellement", "Prioritaire actuellement"][score];
}
