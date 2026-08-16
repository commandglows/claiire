jest.mock("../storage", () => ({
  loadSituation: jest.fn(),
  saveSituation: jest.fn(),
  deleteSituation: jest.fn(),
}));

import { buildSituationState } from "../scoring";
import { deleteSituation, loadSituation, saveSituation } from "../storage";
import { useSituationStore } from "../store";
import type { SituationAnswer } from "../types";

const mockedLoad = loadSituation as jest.MockedFunction<typeof loadSituation>;
const mockedSave = saveSituation as jest.MockedFunction<typeof saveSituation>;
const mockedDelete = deleteSituation as jest.MockedFunction<typeof deleteSituation>;
const time = "2026-08-16T10:00:00.000Z";

function previousState() {
  return buildSituationState({ A1: "yes", A2: "device", P5: ["understand"] }, null, time);
}

function resetStore() {
  useSituationStore.setState({
    hydrated: true,
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
    questionIds: ["A1"],
    updateChanges: [],
    currentIndex: 0,
  });
}

describe("situation store safety and confirmation", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedLoad.mockResolvedValue({ state: null, status: "empty" });
    mockedSave.mockResolvedValue();
    mockedDelete.mockResolvedValue();
    resetStore();
  });

  it.each([
    ["A1", "no", "privacy"],
    ["S1", "maybe", "danger"],
    ["S3", ["death-threat"], "critical"],
  ] as const)("interrupts %s before draft or persistence", (questionId, answer, expected) => {
    const previous = previousState();
    useSituationStore.setState({ situation: previous, draft: { A1: "yes", A2: "device" }, touchedQuestionIds: [] });

    const selectedAnswer: SituationAnswer = typeof answer === "string" ? answer : Array.from(answer);
    const interruption = useSituationStore.getState().answer(questionId, selectedAnswer);

    expect(interruption).toBe(expected);
    expect(useSituationStore.getState().draft).toEqual({});
    expect(useSituationStore.getState().situation).toBe(previous);
    expect(mockedSave).not.toHaveBeenCalled();
    expect(mockedDelete).not.toHaveBeenCalled();
  });

  it("keeps the draft and candidate memory-only until confirmation", async () => {
    const store = useSituationStore.getState();
    store.begin("initial");
    store.answer("A1", "yes");
    store.answer("A2", "device");
    store.answer("N1", ["trusted-person"]);

    expect(store.prepareReview()).toBe(true);
    expect(mockedSave).not.toHaveBeenCalled();
    expect(useSituationStore.getState().situation).toBeNull();

    await expect(useSituationStore.getState().confirm()).resolves.toBe(true);
    expect(mockedSave).toHaveBeenCalledTimes(1);
    expect(useSituationStore.getState().situation?.needProfile.categories[0].id).toBe("trusted-person");
  });

  it("keeps previous critical history visible without treating it as a new interruption", () => {
    const previous = buildSituationState({ A1: "yes", A2: "device", S3: ["death-threat"] }, null, time);
    useSituationStore.setState({ situation: previous });
    const store = useSituationStore.getState();
    store.begin("update");
    expect(store.answer("A1", "yes")).toBeNull();
    store.configureUpdate(["understanding"]);
    store.answer("P5", ["understand"]);

    expect(store.prepareReview()).toBe(true);
    expect(useSituationStore.getState().interruption).toBeNull();
    expect(useSituationStore.getState().candidate?.needProfile.orientation?.level).toBe("urgent");
  });

  it("deduplicates rapid repeated confirmations", async () => {
    let releaseSave: (() => void) | undefined;
    mockedSave.mockImplementation(() => new Promise<void>((resolve) => { releaseSave = resolve; }));
    useSituationStore.setState({ candidate: previousState() });

    const first = useSituationStore.getState().confirm();
    const second = useSituationStore.getState().confirm();

    await expect(second).resolves.toBe(false);
    expect(mockedSave).toHaveBeenCalledTimes(1);
    releaseSave?.();
    await expect(first).resolves.toBe(true);
  });

  it("preserves previous confirmed state and candidate when save fails", async () => {
    const previous = previousState();
    const candidate = buildSituationState({ ...previous.answers, N1: ["legal-rights"] }, previous, "2026-08-16T11:00:00.000Z");
    mockedSave.mockRejectedValueOnce(new Error("save failure"));
    useSituationStore.setState({ situation: previous, candidate, draft: candidate.answers, touchedQuestionIds: [] });

    await expect(useSituationStore.getState().confirm()).resolves.toBe(false);
    expect(useSituationStore.getState().situation).toBe(previous);
    expect(useSituationStore.getState().candidate).toBe(candidate);
    expect(useSituationStore.getState().lastError).toBe("save");
  });

  it("does not claim success or replace memory after an uncertain storage commit", async () => {
    const previous = previousState();
    const candidate = buildSituationState({ ...previous.answers, N1: ["legal-rights"] }, previous, "2026-08-16T11:00:00.000Z");
    mockedSave.mockRejectedValueOnce(new Error("SITUATION_STORAGE_COMMIT_UNCERTAIN"));
    useSituationStore.setState({ situation: previous, candidate, draft: candidate.answers, touchedQuestionIds: [] });

    await expect(useSituationStore.getState().confirm()).resolves.toBe(false);
    expect(useSituationStore.getState().situation).toBe(previous);
    expect(useSituationStore.getState().candidate).toBe(candidate);
    expect(useSituationStore.getState().lastError).toBe("save");
  });

  it("uses dual-key deletion for session-only confirmation", async () => {
    const candidate = { ...previousState(), storagePreference: "session" as const };
    useSituationStore.setState({ candidate });

    await expect(useSituationStore.getState().confirm()).resolves.toBe(true);
    expect(mockedDelete).toHaveBeenCalledTimes(1);
    expect(mockedSave).not.toHaveBeenCalled();
    expect(useSituationStore.getState().situation).toEqual(candidate);
  });

  it("does not claim erase success when deletion fails", async () => {
    const previous = previousState();
    mockedDelete.mockRejectedValueOnce(new Error("delete failure"));
    useSituationStore.setState({ situation: previous });

    await expect(useSituationStore.getState().clear()).resolves.toBe(false);
    expect(useSituationStore.getState().situation).toBe(previous);
    expect(useSituationStore.getState().lastError).toBe("delete");
  });

  it("ignores and restores a stable category without changing help or safety", async () => {
    const previous = buildSituationState({ A1: "yes", A2: "device", N1: ["trusted-person"] }, null, time);
    useSituationStore.setState({ situation: previous });

    await expect(useSituationStore.getState().setCategoryIgnored("trusted-person", true)).resolves.toBe(true);
    expect(useSituationStore.getState().situation?.needProfile.ignoredCategoryIds).toEqual(["trusted-person"]);
    await expect(useSituationStore.getState().setCategoryIgnored("trusted-person", false)).resolves.toBe(true);
    expect(useSituationStore.getState().situation?.needProfile.ignoredCategoryIds).toEqual([]);
  });
});
