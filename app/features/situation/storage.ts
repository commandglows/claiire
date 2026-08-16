import * as SecureStore from "expo-secure-store";

import { buildNeedProfile } from "./needProfile";
import { CRITICAL_S3_VALUES, SITUATION_QUESTIONS } from "./questionnaire";
import { buildSituationState } from "./scoring";
import type {
  CriticalEvent,
  DimensionState,
  NeedCategoryId,
  NeedProfileV1,
  SituationAnswer,
  SituationDimension,
  SituationLoadResult,
  SituationQuestion,
  SituationState,
  SituationStateV1,
} from "./types";

export const SITUATION_STORAGE_KEY_V1 = "claiire.situation.v1";
export const SITUATION_STORAGE_KEY_V2 = "claiire.situation.v2";
export const SITUATION_STORAGE_KEY_V2_PREVIOUS = "claiire.situation.v2.previous";

const EMPTY_AUTHORITY_MARKER = JSON.stringify({ kind: "empty", protocol: 1 });
const DIMENSIONS: SituationDimension[] = ["SAF", "CTL", "REC", "REL", "CHG", "CON", "SUP", "AGY", "DIG", "DEP", "IMP"];
const QUESTIONS_BY_ID = new Map<string, SituationQuestion>(SITUATION_QUESTIONS.map((question) => [question.id, question]));
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
const CATEGORY_IDS = new Set<NeedCategoryId>(CATEGORY_ORDER);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, keys: string[]): boolean {
  const actualKeys = Object.keys(value);
  return actualKeys.length === keys.length && actualKeys.every((key) => keys.includes(key));
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function hasUniqueValues(values: string[]): boolean {
  return new Set(values).size === values.length;
}

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString() === value;
}

function isAnswerForQuestion(value: unknown, question: SituationQuestion): value is SituationAnswer {
  const allowedValues = new Set(question.options.map((option) => option.value));
  if (!question.multiple) return typeof value === "string" && allowedValues.has(value);
  if (!isStringArray(value) || !hasUniqueValues(value) || !value.every((item) => allowedValues.has(item))) return false;
  const selectedExclusive = value.filter((item) => question.exclusiveValues?.includes(item));
  return selectedExclusive.length === 0 || (selectedExclusive.length === 1 && value.length === 1);
}

function isAnswers(value: unknown): value is Record<string, SituationAnswer> {
  if (!isRecord(value)) return false;
  return Object.entries(value).every(([questionId, answer]) => {
    const question = QUESTIONS_BY_ID.get(questionId);
    return question !== undefined && isAnswerForQuestion(answer, question);
  });
}

function isDimensionState(value: unknown): value is DimensionState {
  if (!isRecord(value)) return false;
  const validScore = value.score === null || (typeof value.score === "number" && Number.isInteger(value.score) && value.score >= 0 && value.score <= 4);
  return hasExactKeys(value, ["score", "confidence", "assessedAt", "source", "evidenceQuestionIds"])
    && validScore
    && (value.confidence === "low" || value.confidence === "medium" || value.confidence === "high")
    && (value.assessedAt === null || isIsoTimestamp(value.assessedAt))
    && value.source === "user-explicit"
    && isStringArray(value.evidenceQuestionIds)
    && hasUniqueValues(value.evidenceQuestionIds)
    && value.evidenceQuestionIds.every((questionId) => QUESTIONS_BY_ID.has(questionId));
}

function isDimensions(value: unknown): value is Record<SituationDimension, DimensionState> {
  return isRecord(value)
    && Object.keys(value).length === DIMENSIONS.length
    && DIMENSIONS.every((dimension) => isDimensionState(value[dimension]));
}

function isCriticalEvent(value: unknown): value is CriticalEvent {
  return isRecord(value)
    && hasExactKeys(value, ["id", "code", "observedAt", "sourceQuestionId"])
    && typeof value.code === "string"
    && CRITICAL_S3_VALUES.has(value.code)
    && isIsoTimestamp(value.observedAt)
    && value.sourceQuestionId === "S3"
    && value.id === `${value.observedAt}:${value.code}`;
}

function isCriticalEventHistory(value: unknown): value is CriticalEvent[] {
  if (!Array.isArray(value) || !value.every(isCriticalEvent)) return false;
  const ids = value.map((event) => event.id);
  if (!hasUniqueValues(ids)) return false;
  return value.every((event, index) => index === 0 || value[index - 1].observedAt <= event.observedAt);
}

function isNeedProfileShape(value: unknown): value is NeedProfileV1 {
  if (!isRecord(value)
    || value.version !== 1
    || !isIsoTimestamp(value.derivedAt)
    || value.sourceSituationVersion !== 2
    || !isStringArray(value.sourceQuestionIds)
    || !hasUniqueValues(value.sourceQuestionIds)
    || !value.sourceQuestionIds.every((questionId) => QUESTIONS_BY_ID.has(questionId))
    || !isStringArray(value.requestedNeeds)
    || !isStringArray(value.userPriorities)
    || typeof value.selectedNextStep !== "string"
    || !isStringArray(value.preferredSupportTypes)
    || !isRecord(value.preferences)
    || !Array.isArray(value.categories)
    || value.categories.length > 3
    || !isStringArray(value.ignoredCategoryIds)
    || !hasUniqueValues(value.ignoredCategoryIds)
    || !value.ignoredCategoryIds.every((id) => CATEGORY_IDS.has(id as NeedCategoryId))) return false;

  if (value.orientation !== null && (!isRecord(value.orientation)
    || (value.orientation.level !== "urgent" && value.orientation.level !== "specialized" && value.orientation.level !== "nonUrgent")
    || !isStringArray(value.orientation.reasonCodes)
    || !hasUniqueValues(value.orientation.reasonCodes)
    || !isStringArray(value.orientation.evidenceQuestionIds)
    || !hasUniqueValues(value.orientation.evidenceQuestionIds)
    || !value.orientation.evidenceQuestionIds.every((questionId) => QUESTIONS_BY_ID.has(questionId)))) return false;

  return value.categories.every((category) => isRecord(category)
    && typeof category.id === "string"
    && CATEGORY_IDS.has(category.id as NeedCategoryId)
    && typeof category.label === "string"
    && typeof category.explanation === "string"
    && isStringArray(category.reasonCodes)
    && hasUniqueValues(category.reasonCodes)
    && isStringArray(category.evidenceQuestionIds)
    && hasUniqueValues(category.evidenceQuestionIds)
    && category.evidenceQuestionIds.every((questionId) => QUESTIONS_BY_ID.has(questionId)));
}

function sameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

type ValidatedSituationStateBase = Record<string, unknown> & {
  updatedAt: string;
  safeContextConfirmedAt: string | null;
  storagePreference: "device" | "session" | "unknown";
  answers: Record<string, SituationAnswer>;
  dimensions: Record<SituationDimension, DimensionState>;
  criticalEventHistory: CriticalEvent[];
};

function isSituationStateBase(value: Record<string, unknown>): value is ValidatedSituationStateBase {
  return (value.status === "partial" || value.status === "completed" || value.status === "needs-private-recheck")
    && value.interactionGate === "solo"
    && isIsoTimestamp(value.updatedAt)
    && (value.safeContextConfirmedAt === null || isIsoTimestamp(value.safeContextConfirmedAt))
    && (value.storagePreference === "device" || value.storagePreference === "session" || value.storagePreference === "unknown")
    && isAnswers(value.answers)
    && isDimensions(value.dimensions)
    && isCriticalEventHistory(value.criticalEventHistory);
}

function hasCanonicalConfirmedBase(value: ValidatedSituationStateBase): boolean {
  if (value.answers.A1 !== "yes"
    || value.status !== "completed"
    || value.safeContextConfirmedAt === null
    || value.criticalEventHistory.some((event) => event.observedAt > value.updatedAt)) return false;

  const criticalAnswerCodes = Array.isArray(value.answers.S3)
    ? value.answers.S3.filter((answer) => CRITICAL_S3_VALUES.has(answer))
    : [];
  if (criticalAnswerCodes.some((code) => !value.criticalEventHistory.some((event) => event.code === code))) return false;

  const expectedState = buildSituationState(value.answers, null, value.updatedAt);
  return sameValue(value.dimensions, expectedState.dimensions)
    && value.storagePreference === expectedState.storagePreference
    && value.safeContextConfirmedAt === expectedState.safeContextConfirmedAt;
}

export function isSituationStateV1(value: unknown): value is SituationStateV1 {
  return isRecord(value)
    && hasExactKeys(value, ["version", "status", "interactionGate", "updatedAt", "safeContextConfirmedAt", "storagePreference", "answers", "dimensions", "criticalEventHistory"])
    && value.version === 1
    && isSituationStateBase(value)
    && hasCanonicalConfirmedBase(value);
}

export function isSituationStateV2(value: unknown): value is SituationState {
  if (!isRecord(value)
    || !hasExactKeys(value, ["version", "status", "interactionGate", "updatedAt", "safeContextConfirmedAt", "storagePreference", "answers", "dimensions", "criticalEventHistory", "needProfile"])
    || value.version !== 2
    || !isSituationStateBase(value)) return false;

  if (!isNeedProfileShape(value.needProfile)
    || value.needProfile.derivedAt !== value.updatedAt
    || !hasCanonicalConfirmedBase(value)) return false;

  const canonicalWithoutIgnored = buildNeedProfile({
    answers: value.answers,
    criticalEventHistory: value.criticalEventHistory,
    derivedAt: value.updatedAt,
    sourceSituationVersion: 2,
  });
  const requestedIgnoredIds = new Set(value.needProfile.ignoredCategoryIds);
  const canonicalIgnoredIds = canonicalWithoutIgnored.categories
    .filter((category) => requestedIgnoredIds.has(category.id))
    .map((category) => category.id);
  if (!sameValue(value.needProfile.ignoredCategoryIds, canonicalIgnoredIds)) return false;

  const canonicalProfile = buildNeedProfile({
    answers: value.answers,
    criticalEventHistory: value.criticalEventHistory,
    derivedAt: value.updatedAt,
    sourceSituationVersion: 2,
    ignoredCategoryIds: canonicalIgnoredIds,
  });
  return sameValue(value.needProfile, canonicalProfile);
}

export function migrateSituationV1(state: SituationStateV1): SituationState {
  return {
    version: 2,
    status: state.status,
    interactionGate: state.interactionGate,
    updatedAt: state.updatedAt,
    safeContextConfirmedAt: state.safeContextConfirmedAt,
    storagePreference: state.storagePreference,
    answers: state.answers,
    dimensions: state.dimensions,
    criticalEventHistory: state.criticalEventHistory,
    needProfile: buildNeedProfile({
      answers: state.answers,
      criticalEventHistory: state.criticalEventHistory,
      derivedAt: state.updatedAt,
      sourceSituationVersion: 1,
    }),
  };
}

function parseStoredValue(value: string): unknown {
  return JSON.parse(value) as unknown;
}

function parseCurrentState(value: string): SituationState | null {
  const parsed = parseStoredValue(value);
  return isSituationStateV2(parsed) ? parsed : null;
}

async function readAllKeys(): Promise<{ previous: string | null; legacy: string | null; current: string | null }> {
  const [previous, legacy, current] = await Promise.all([
    SecureStore.getItemAsync(SITUATION_STORAGE_KEY_V2_PREVIOUS),
    SecureStore.getItemAsync(SITUATION_STORAGE_KEY_V1),
    SecureStore.getItemAsync(SITUATION_STORAGE_KEY_V2),
  ]);
  return { previous, legacy, current };
}

export async function loadSituation(): Promise<SituationLoadResult> {
  try {
    const { previous, legacy, current } = await readAllKeys();
    if (previous !== null) {
      if (previous === EMPTY_AUTHORITY_MARKER) return { state: null, status: "empty" };
      const state = parseCurrentState(previous);
      return state ? { state, status: "loaded" } : { state: null, status: "invalid" };
    }
    if (legacy !== null) {
      const parsed = parseStoredValue(legacy);
      return isSituationStateV1(parsed)
        ? { state: migrateSituationV1(parsed), status: "migrated" }
        : { state: null, status: "invalid" };
    }
    if (current === null) return { state: null, status: "empty" };
    const state = parseCurrentState(current);
    return state ? { state, status: "loaded" } : { state: null, status: "invalid" };
  } catch (error) {
    return error instanceof SyntaxError
      ? { state: null, status: "invalid" }
      : { state: null, status: "storage-error" };
  }
}

async function writeAndVerify(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value);
  const stored = await SecureStore.getItemAsync(key);
  if (stored !== value) throw new Error("SITUATION_STORAGE_WRITE_NOT_VERIFIED");
}

async function deleteAndVerifyCommit(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    let stillStored: string | null;
    try {
      stillStored = await SecureStore.getItemAsync(key);
    } catch {
      throw new Error("SITUATION_STORAGE_COMMIT_UNCERTAIN");
    }
    if (stillStored === null) return;
    throw new Error("SITUATION_STORAGE_COMMIT_FAILED");
  }
  let stillStored: string | null;
  try {
    stillStored = await SecureStore.getItemAsync(key);
  } catch {
    // A resolved delete is treated as committed when verification is unavailable;
    // only a verified retained authority is reported as an error.
    return;
  }
  if (stillStored !== null) throw new Error("SITUATION_STORAGE_COMMIT_NOT_VERIFIED");
}

export async function saveSituation(state: SituationState): Promise<void> {
  if (!isSituationStateV2(state)) throw new Error("SITUATION_STORAGE_INVALID_STATE");
  const { previous, legacy, current } = await readAllKeys();

  let authorityKey: string | null = null;
  if (previous !== null) {
    authorityKey = SITUATION_STORAGE_KEY_V2_PREVIOUS;
  } else if (legacy !== null) {
    authorityKey = SITUATION_STORAGE_KEY_V1;
  } else {
    const previousAuthority = current ?? EMPTY_AUTHORITY_MARKER;
    await writeAndVerify(SITUATION_STORAGE_KEY_V2_PREVIOUS, previousAuthority);
    authorityKey = SITUATION_STORAGE_KEY_V2_PREVIOUS;
  }

  await writeAndVerify(SITUATION_STORAGE_KEY_V2, JSON.stringify(state));

  if (authorityKey === SITUATION_STORAGE_KEY_V2_PREVIOUS && legacy !== null) {
    await SecureStore.deleteItemAsync(SITUATION_STORAGE_KEY_V1);
  }
  await deleteAndVerifyCommit(authorityKey);
}

export async function deleteSituation(): Promise<void> {
  const { previous, legacy, current } = await readAllKeys();
  const authorityKey = previous !== null
    ? SITUATION_STORAGE_KEY_V2_PREVIOUS
    : legacy !== null
      ? SITUATION_STORAGE_KEY_V1
      : current !== null
        ? SITUATION_STORAGE_KEY_V2
        : null;
  if (authorityKey === null) return;

  for (const key of [SITUATION_STORAGE_KEY_V1, SITUATION_STORAGE_KEY_V2]) {
    if (key !== authorityKey) await SecureStore.deleteItemAsync(key);
  }
  await deleteAndVerifyCommit(authorityKey);
}
