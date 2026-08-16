import { create } from "zustand";

import { buildSituationState } from "./scoring";
import { getInitialQuestionIds, getUpdateQuestionIds } from "./questionnaire";
import { deleteSituation, loadSituation, saveSituation } from "./storage";
import type {
  NeedCategoryId,
  SituationAnswer,
  SituationChange,
  SituationLoadStatus,
  SituationQuestionnaireMode,
  SituationQuestionnaireStage,
  SituationState,
} from "./types";
import { CRITICAL_S3_VALUES } from "./questionnaire";

export type SafetyInterruption = "privacy" | "danger" | "critical";
export type SituationOperationError = "load" | "save" | "delete" | null;

function detectSafetyInterruption(questionId: string, answer: SituationAnswer): SafetyInterruption | null {
  if (questionId === "A1" && answer !== "yes") return "privacy";
  if (questionId === "S1" && (answer === "yes" || answer === "maybe")) return "danger";
  if (questionId === "S3" && Array.isArray(answer) && answer.some((value) => CRITICAL_S3_VALUES.has(value))) return "critical";
  return null;
}

type SituationStore = {
  hydrated: boolean;
  loadStatus: SituationLoadStatus;
  lastError: SituationOperationError;
  migrationPending: boolean;
  confirming: boolean;
  situation: SituationState | null;
  draft: Record<string, SituationAnswer>;
  touchedQuestionIds: string[];
  candidate: SituationState | null;
  interruption: SafetyInterruption | null;
  mode: SituationQuestionnaireMode;
  stage: SituationQuestionnaireStage;
  questionIds: string[];
  updateChanges: SituationChange[];
  currentIndex: number;
  hydrate: () => Promise<void>;
  begin: (mode: SituationQuestionnaireMode) => void;
  answer: (questionId: string, answer: SituationAnswer) => SafetyInterruption | null;
  showChangeSelection: () => void;
  configureUpdate: (changes: SituationChange[]) => void;
  prepareReview: () => boolean;
  next: () => void;
  back: () => void;
  confirm: () => Promise<boolean>;
  useSessionOnlyCandidate: () => void;
  setCategoryIgnored: (categoryId: NeedCategoryId, ignored: boolean) => Promise<boolean>;
  discardDraft: () => void;
  clear: () => Promise<boolean>;
};

function questionnaireIds(
  mode: SituationQuestionnaireMode,
  changes: SituationChange[],
  draft: Record<string, SituationAnswer>,
): string[] {
  if (mode === "initial") return getInitialQuestionIds(draft);
  if (changes.length === 0) return ["A1"];
  return getUpdateQuestionIds(changes, draft);
}

export const useSituationStore = create<SituationStore>((set, get) => ({
  hydrated: false,
  loadStatus: "empty",
  lastError: null,
  migrationPending: false,
  confirming: false,
  situation: null,
  draft: {},
  touchedQuestionIds: [],
  candidate: null,
  interruption: null,
  mode: "initial",
  stage: "questions",
  questionIds: getInitialQuestionIds(),
  updateChanges: [],
  currentIndex: 0,
  hydrate: async () => {
    const result = await loadSituation();
    set({
      situation: result.state,
      loadStatus: result.status,
      lastError: result.status === "invalid" || result.status === "storage-error" ? "load" : null,
      migrationPending: result.status === "migrated",
      hydrated: true,
    });
  },
  begin: (mode) => {
    const situation = get().situation;
    const draft = mode === "update" ? { ...(situation?.answers ?? {}) } : {};
    set({
      mode,
      stage: "questions",
      draft,
      touchedQuestionIds: [],
      candidate: null,
      interruption: null,
      questionIds: questionnaireIds(mode, [], draft),
      updateChanges: [],
      currentIndex: 0,
      lastError: null,
    });
  },
  answer: (questionId, selectedAnswer) => {
    const interruption = detectSafetyInterruption(questionId, selectedAnswer);
    if (interruption) {
      set({ draft: {}, touchedQuestionIds: [], candidate: null, interruption, currentIndex: 0, stage: "questions" });
      return interruption;
    }
    const current = get();
    const draft = { ...current.draft, [questionId]: selectedAnswer };
    const questionIds = questionnaireIds(current.mode, current.updateChanges, draft);
    set({ draft, touchedQuestionIds: [...new Set([...current.touchedQuestionIds, questionId])], candidate: null, questionIds, interruption: null });
    return null;
  },
  showChangeSelection: () => set({ stage: "changes" }),
  configureUpdate: (changes) => {
    const draft = get().draft;
    set({
      updateChanges: changes,
      questionIds: getUpdateQuestionIds(changes, draft),
      currentIndex: 1,
      stage: "questions",
      candidate: null,
    });
  },
  prepareReview: () => {
    const current = get();
    for (const questionId of current.touchedQuestionIds) {
      const selectedAnswer = current.draft[questionId];
      if (selectedAnswer === undefined) continue;
      const interruption = detectSafetyInterruption(questionId, selectedAnswer);
      if (interruption) {
        set({ draft: {}, touchedQuestionIds: [], candidate: null, interruption, currentIndex: 0, stage: "questions" });
        return false;
      }
    }
    const candidate = buildSituationState(current.draft, current.situation);
    set({ candidate, stage: "review", interruption: null });
    return true;
  },
  next: () => set((state) => ({ currentIndex: Math.min(state.currentIndex + 1, Math.max(0, state.questionIds.length - 1)) })),
  back: () => set((state) => {
    if (state.stage === "review") return { stage: "questions", currentIndex: Math.max(0, state.questionIds.length - 1) };
    if (state.stage === "changes") return { stage: "questions", currentIndex: 0 };
    if (state.mode === "update" && state.currentIndex === 1) return { stage: "changes" };
    return { currentIndex: Math.max(0, state.currentIndex - 1) };
  }),
  confirm: async () => {
    const current = get();
    if (!current.candidate || current.confirming) return false;
    const nextState = current.candidate;
    set({ confirming: true, lastError: null });
    try {
      if (nextState.storagePreference === "device") await saveSituation(nextState);
      else await deleteSituation();
      set({
        situation: nextState,
        draft: {},
        touchedQuestionIds: [],
        candidate: null,
        currentIndex: 0,
        stage: "questions",
        updateChanges: [],
        confirming: false,
        migrationPending: false,
        loadStatus: "loaded",
      });
      return true;
    } catch {
      set({ confirming: false, lastError: "save" });
      return false;
    }
  },
  useSessionOnlyCandidate: () => set((state) => state.candidate ? {
    candidate: { ...state.candidate, storagePreference: "session" },
    draft: { ...state.draft, A2: "session" },
    lastError: null,
  } : {}),
  setCategoryIgnored: async (categoryId, ignored) => {
    const current = get().situation;
    if (!current || !current.needProfile.categories.some((category) => category.id === categoryId)) return false;
    const ignoredIds = new Set(current.needProfile.ignoredCategoryIds);
    if (ignored) ignoredIds.add(categoryId);
    else ignoredIds.delete(categoryId);
    const nextState: SituationState = {
      ...current,
      needProfile: { ...current.needProfile, ignoredCategoryIds: [...ignoredIds] },
    };
    try {
      if (nextState.storagePreference === "device") await saveSituation(nextState);
      else await deleteSituation();
      set({ situation: nextState, lastError: null });
      return true;
    } catch {
      set({ lastError: "save" });
      return false;
    }
  },
  discardDraft: () => set({ draft: {}, touchedQuestionIds: [], candidate: null, interruption: null, currentIndex: 0, stage: "questions", updateChanges: [] }),
  clear: async () => {
    try {
      await deleteSituation();
      set({
        situation: null,
        draft: {},
        touchedQuestionIds: [],
        candidate: null,
        interruption: null,
        currentIndex: 0,
        stage: "questions",
        updateChanges: [],
        lastError: null,
        migrationPending: false,
        loadStatus: "empty",
      });
      return true;
    } catch {
      set({ lastError: "delete" });
      return false;
    }
  },
}));
