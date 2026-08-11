import { create } from "zustand";
import { buildSituationState } from "./scoring";
import { getUpdateQuestionIds, SITUATION_QUESTIONS } from "./questionnaire";
import { deleteSituation, loadSituation, saveSituation } from "./storage";
import type {
  SituationAnswer,
  SituationChange,
  SituationQuestionnaireMode,
  SituationQuestionnaireStage,
  SituationState,
} from "./types";

type SituationStore = {
  hydrated: boolean;
  situation: SituationState | null;
  draft: Record<string, SituationAnswer>;
  candidate: SituationState | null;
  mode: SituationQuestionnaireMode;
  stage: SituationQuestionnaireStage;
  questionIds: string[];
  updateChanges: SituationChange[];
  currentIndex: number;
  hydrate: () => Promise<void>;
  begin: (mode: SituationQuestionnaireMode) => void;
  answer: (questionId: string, answer: SituationAnswer) => void;
  showChangeSelection: () => void;
  configureUpdate: (changes: SituationChange[]) => void;
  prepareReview: () => void;
  next: () => void;
  back: () => void;
  confirm: () => Promise<void>;
  discardDraft: () => void;
  clear: () => Promise<void>;
};

export const useSituationStore = create<SituationStore>((set, get) => ({
  hydrated: false,
  situation: null,
  draft: {},
  candidate: null,
  mode: "initial",
  stage: "questions",
  questionIds: SITUATION_QUESTIONS.map((question) => question.id),
  updateChanges: [],
  currentIndex: 0,
  hydrate: async () => {
    const situation = await loadSituation();
    set({ situation, hydrated: true });
  },
  begin: (mode) => {
    const situation = get().situation;
    set({
      mode,
      stage: "questions",
      draft: mode === "update" ? { ...(situation?.answers ?? {}) } : {},
      candidate: null,
      questionIds: mode === "update" ? ["A1"] : SITUATION_QUESTIONS.map((question) => question.id),
      updateChanges: [],
      currentIndex: 0,
    });
  },
  answer: (questionId, answer) => set((state) => ({ draft: { ...state.draft, [questionId]: answer }, candidate: null })),
  showChangeSelection: () => set({ stage: "changes" }),
  configureUpdate: (changes) => set({
    updateChanges: changes,
    questionIds: getUpdateQuestionIds(changes),
    currentIndex: 1,
    stage: "questions",
    candidate: null,
  }),
  prepareReview: () => {
    const candidate = buildSituationState(get().draft, get().situation);
    set({ candidate, stage: "review" });
  },
  next: () => set((state) => ({ currentIndex: state.currentIndex + 1 })),
  back: () => set((state) => {
    if (state.stage === "review") return { stage: "questions", currentIndex: Math.max(0, state.questionIds.length - 1) };
    if (state.stage === "changes") return { stage: "questions", currentIndex: 0 };
    if (state.mode === "update" && state.currentIndex === 1) return { stage: "changes" };
    return { currentIndex: Math.max(0, state.currentIndex - 1) };
  }),
  confirm: async () => {
    const nextState = get().candidate;
    if (!nextState) return;
    if (nextState.storagePreference === "device") {
      await saveSituation(nextState);
    } else {
      await deleteSituation();
    }
    set({ situation: nextState, draft: {}, candidate: null, currentIndex: 0, stage: "questions", updateChanges: [] });
  },
  discardDraft: () => set({ draft: {}, candidate: null, currentIndex: 0, stage: "questions", updateChanges: [] }),
  clear: async () => {
    await deleteSituation();
    set({ situation: null, draft: {}, candidate: null, currentIndex: 0, stage: "questions", updateChanges: [] });
  },
}));
