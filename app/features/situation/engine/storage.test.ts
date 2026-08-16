jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import * as SecureStore from "expo-secure-store";

import { buildSituationState } from "../scoring";
import {
  deleteSituation,
  loadSituation,
  saveSituation,
  SITUATION_STORAGE_KEY_V1,
  SITUATION_STORAGE_KEY_V2,
  SITUATION_STORAGE_KEY_V2_PREVIOUS,
} from "../storage";
import type { SituationAnswer, SituationState, SituationStateV1 } from "../types";

const secureStore = SecureStore as jest.Mocked<typeof SecureStore>;
const oldTimestamp = "2026-08-16T10:00:00.000Z";
const newTimestamp = "2026-08-16T11:00:00.000Z";

function legacyState(
  answers: Record<string, SituationAnswer> = { A1: "yes", A2: "device", P5: ["unknown"] },
  timestamp = oldTimestamp,
): SituationStateV1 {
  const current = buildSituationState(answers, null, timestamp);
  return {
    version: 1,
    status: current.status,
    interactionGate: current.interactionGate,
    updatedAt: current.updatedAt,
    safeContextConfirmedAt: current.safeContextConfirmedAt,
    storagePreference: current.storagePreference,
    answers: current.answers,
    dimensions: current.dimensions,
    criticalEventHistory: current.criticalEventHistory,
  };
}

function currentState(timestamp = oldTimestamp): SituationState {
  return buildSituationState({
    A1: "yes",
    A2: "device",
    S3: ["none"],
    I3: "yes",
    P5: ["protect-dependant", "regain-autonomy"],
    P6: "seek-rights-info",
    N1: ["trusted-person"],
    N2: ["french"],
    N3: ["easy-read"],
    N4: "metropolitan-france",
    N5: "free-only",
    N6: "within-days",
    N7: ["phone"],
    N8: ["in-app-only", "morning"],
  }, null, timestamp);
}

function clone(state: SituationState): SituationState {
  return JSON.parse(JSON.stringify(state)) as SituationState;
}

describe("situation storage", () => {
  const stored = new Map<string, string>();

  beforeEach(() => {
    jest.resetAllMocks();
    stored.clear();
    secureStore.getItemAsync.mockImplementation(async (key) => stored.get(key) ?? null);
    secureStore.setItemAsync.mockImplementation(async (key, value) => { stored.set(key, value); });
    secureStore.deleteItemAsync.mockImplementation(async (key) => { stored.delete(key); });
  });

  it("loads valid v1 as an in-memory v2 migration without writing", async () => {
    stored.set(SITUATION_STORAGE_KEY_V1, JSON.stringify(legacyState()));

    const result = await loadSituation();

    expect(result.status).toBe("migrated");
    expect(result.state?.version).toBe(2);
    expect(result.state?.needProfile.sourceSituationVersion).toBe(1);
    expect(Object.keys(result.state ?? {}).sort()).toEqual([
      "answers",
      "criticalEventHistory",
      "dimensions",
      "interactionGate",
      "needProfile",
      "safeContextConfirmedAt",
      "status",
      "storagePreference",
      "updatedAt",
      "version",
    ]);
    expect(secureStore.setItemAsync).not.toHaveBeenCalled();
    expect(stored.has(SITUATION_STORAGE_KEY_V2)).toBe(false);
  });

  it.each([
    ["extra root field", (state: SituationStateV1) => { Object.assign(state, { note: "arbitrary" }); }],
    ["privacy answer", (state: SituationStateV1) => { state.answers.A1 = "unsure"; }],
    ["non-completed status", (state: SituationStateV1) => { state.status = "partial"; }],
    ["missing safe timestamp", (state: SituationStateV1) => { state.safeContextConfirmedAt = null; }],
    ["mismatched safe timestamp", (state: SituationStateV1) => { state.safeContextConfirmedAt = newTimestamp; }],
    ["mismatched storage preference", (state: SituationStateV1) => { state.storagePreference = "session"; }],
    ["mismatched dimension", (state: SituationStateV1) => { state.dimensions.DIG.score = 4; }],
    ["invalid update timestamp", (state: SituationStateV1) => { state.updatedAt = "not-a-timestamp"; }],
  ])("rejects non-canonical legacy v1 content: %s", async (_label, mutate) => {
    const invalid = JSON.parse(JSON.stringify(legacyState())) as SituationStateV1;
    mutate(invalid);
    stored.set(SITUATION_STORAGE_KEY_V1, JSON.stringify(invalid));

    await expect(loadSituation()).resolves.toEqual({ state: null, status: "invalid" });
  });

  it("rejects invalid, future or incoherent legacy critical events", async () => {
    const critical = legacyState({ A1: "yes", A2: "device", S3: ["death-threat"] });
    const mutations: Array<(state: SituationStateV1) => void> = [
      (state) => { state.criticalEventHistory[0].code = "arbitrary"; },
      (state) => { state.criticalEventHistory[0].id = "arbitrary"; },
      (state) => {
        state.criticalEventHistory[0].observedAt = newTimestamp;
        state.criticalEventHistory[0].id = `${newTimestamp}:death-threat`;
      },
      (state) => { state.criticalEventHistory = []; },
    ];

    for (const mutate of mutations) {
      const invalid = JSON.parse(JSON.stringify(critical)) as SituationStateV1;
      mutate(invalid);
      stored.set(SITUATION_STORAGE_KEY_V1, JSON.stringify(invalid));
      await expect(loadSituation()).resolves.toEqual({ state: null, status: "invalid" });
    }
  });

  it("loads only a canonical current state", async () => {
    const current = currentState();
    stored.set(SITUATION_STORAGE_KEY_V2, JSON.stringify(current));

    await expect(loadSituation()).resolves.toEqual({ state: current, status: "loaded" });
  });

  it.each(["{bad-json", JSON.stringify({ version: 99 })])("fails closed for malformed or unknown state: %s", async (payload) => {
    stored.set(SITUATION_STORAGE_KEY_V2, payload);
    await expect(loadSituation()).resolves.toEqual({ state: null, status: "invalid" });
  });

  it.each([
    ["state extra field", (state: SituationState) => { Object.assign(state, { note: "arbitrary" }); }],
    ["unknown answer id", (state: SituationState) => { state.answers.X99 = "arbitrary"; }],
    ["unknown answer value", (state: SituationState) => { state.answers.I3 = "diagnosis"; }],
    ["contradictory exclusive answer", (state: SituationState) => { state.answers.N1 = ["none-now", "trusted-person"]; }],
    ["dimension evidence id", (state: SituationState) => { state.dimensions.DIG.evidenceQuestionIds = ["X99"]; }],
    ["dimension extra field", (state: SituationState) => { Object.assign(state.dimensions.DIG, { note: "arbitrary" }); }],
    ["dimension score mismatch", (state: SituationState) => { state.dimensions.DIG.score = 4; }],
    ["profile source version", (state: SituationState) => { state.needProfile.sourceSituationVersion = 1; }],
    ["profile source id", (state: SituationState) => { state.needProfile.sourceQuestionIds.push("X99"); }],
    ["profile label", (state: SituationState) => { state.needProfile.categories[0].label = "Texte stocké arbitraire"; }],
    ["profile explanation", (state: SituationState) => { state.needProfile.categories[0].explanation = "Texte stocké arbitraire"; }],
    ["profile reason code", (state: SituationState) => { state.needProfile.categories[0].reasonCodes = ["UNKNOWN_REASON" as never]; }],
    ["profile evidence id", (state: SituationState) => { state.needProfile.categories[0].evidenceQuestionIds = ["N8"]; }],
    ["profile category order", (state: SituationState) => { state.needProfile.categories.reverse(); }],
    ["duplicate profile category", (state: SituationState) => { state.needProfile.categories[1] = state.needProfile.categories[0]; }],
    ["orientation reason code", (state: SituationState) => { if (state.needProfile.orientation) state.needProfile.orientation.reasonCodes = ["UNKNOWN_REASON" as never]; }],
    ["orientation evidence id", (state: SituationState) => { if (state.needProfile.orientation) state.needProfile.orientation.evidenceQuestionIds = ["A1"]; }],
    ["derived timestamp", (state: SituationState) => { state.needProfile.derivedAt = newTimestamp; }],
    ["ignored id order", (state: SituationState) => { state.needProfile.ignoredCategoryIds = [state.needProfile.categories[1].id, state.needProfile.categories[0].id]; }],
  ])("rejects non-canonical v2 content: %s", async (_label, mutate) => {
    const invalid = clone(currentState());
    mutate(invalid);
    stored.set(SITUATION_STORAGE_KEY_V2, JSON.stringify(invalid));

    await expect(loadSituation()).resolves.toEqual({ state: null, status: "invalid" });
  });

  it("rejects malformed critical-event vocabulary, identity, order and answer coherence", async () => {
    const critical = buildSituationState({ A1: "yes", A2: "device", S3: ["death-threat"] }, null, oldTimestamp);
    const mutations: Array<(state: SituationState) => void> = [
      (state) => { state.criticalEventHistory[0].code = "arbitrary-code"; },
      (state) => { state.criticalEventHistory[0].id = "arbitrary-id"; },
      (state) => { Object.assign(state.criticalEventHistory[0], { note: "arbitrary" }); },
      (state) => { state.criticalEventHistory.push({ ...state.criticalEventHistory[0] }); },
      (state) => { state.criticalEventHistory[0].sourceQuestionId = "I3"; },
      (state) => {
        state.criticalEventHistory[0].observedAt = newTimestamp;
        state.criticalEventHistory[0].id = `${newTimestamp}:death-threat`;
      },
      (state) => { state.criticalEventHistory = []; },
    ];

    for (const mutate of mutations) {
      const invalid = clone(critical);
      mutate(invalid);
      stored.set(SITUATION_STORAGE_KEY_V2, JSON.stringify(invalid));
      await expect(loadSituation()).resolves.toEqual({ state: null, status: "invalid" });
    }

    const outOfOrder = clone(critical);
    outOfOrder.criticalEventHistory.push({
      id: "2026-08-16T09:00:00.000Z:weapon",
      code: "weapon",
      observedAt: "2026-08-16T09:00:00.000Z",
      sourceQuestionId: "S3",
    });
    stored.set(SITUATION_STORAGE_KEY_V2, JSON.stringify(outOfOrder));
    await expect(loadSituation()).resolves.toEqual({ state: null, status: "invalid" });
  });

  it("reports storage read failure without exposing raw content", async () => {
    secureStore.getItemAsync.mockRejectedValueOnce(new Error("read failure"));
    await expect(loadSituation()).resolves.toEqual({ state: null, status: "storage-error" });
  });

  it("commits v2 only after verified staging and removes the legacy authority", async () => {
    const current = currentState();
    stored.set(SITUATION_STORAGE_KEY_V1, JSON.stringify(legacyState()));

    await saveSituation(current);

    expect(JSON.parse(stored.get(SITUATION_STORAGE_KEY_V2) ?? "{}").version).toBe(2);
    expect(stored.has(SITUATION_STORAGE_KEY_V1)).toBe(false);
    expect(stored.has(SITUATION_STORAGE_KEY_V2_PREVIOUS)).toBe(false);
  });

  it("keeps the previous v2 authoritative after a staged write reports failure, without rollback", async () => {
    const previous = currentState(oldTimestamp);
    const next = currentState(newTimestamp);
    stored.set(SITUATION_STORAGE_KEY_V2, JSON.stringify(previous));
    secureStore.setItemAsync.mockImplementation(async (key, value) => {
      stored.set(key, value);
      if (key === SITUATION_STORAGE_KEY_V2 && value.includes(newTimestamp)) throw new Error("write failed after side effect");
    });

    await expect(saveSituation(next)).rejects.toThrow("write failed after side effect");

    secureStore.setItemAsync.mockImplementation(async (key, value) => { stored.set(key, value); });
    await expect(loadSituation()).resolves.toEqual({ state: previous, status: "loaded" });
    expect(stored.get(SITUATION_STORAGE_KEY_V2)).toBe(JSON.stringify(next));
    expect(stored.get(SITUATION_STORAGE_KEY_V2_PREVIOUS)).toBe(JSON.stringify(previous));
  });

  it("keeps an empty previous state authoritative when the first save fails after writing v2", async () => {
    const next = currentState(newTimestamp);
    secureStore.setItemAsync.mockImplementation(async (key, value) => {
      stored.set(key, value);
      if (key === SITUATION_STORAGE_KEY_V2) throw new Error("write failed after side effect");
    });

    await expect(saveSituation(next)).rejects.toThrow("write failed after side effect");
    await expect(loadSituation()).resolves.toEqual({ state: null, status: "empty" });
  });

  it("keeps the old state authoritative when the commit delete fails", async () => {
    const previous = currentState(oldTimestamp);
    const next = currentState(newTimestamp);
    stored.set(SITUATION_STORAGE_KEY_V2, JSON.stringify(previous));
    secureStore.deleteItemAsync.mockImplementation(async (key) => {
      if (key === SITUATION_STORAGE_KEY_V2_PREVIOUS) throw new Error("commit delete failed");
      stored.delete(key);
    });

    await expect(saveSituation(next)).rejects.toThrow("SITUATION_STORAGE_COMMIT_FAILED");
    await expect(loadSituation()).resolves.toEqual({ state: previous, status: "loaded" });
  });

  it("accepts a commit delete that throws only after the authority was removed", async () => {
    const previous = currentState(oldTimestamp);
    const next = currentState(newTimestamp);
    stored.set(SITUATION_STORAGE_KEY_V2, JSON.stringify(previous));
    secureStore.deleteItemAsync.mockImplementation(async (key) => {
      stored.delete(key);
      if (key === SITUATION_STORAGE_KEY_V2_PREVIOUS) throw new Error("transport failed after delete");
    });

    await expect(saveSituation(next)).resolves.toBeUndefined();
    await expect(loadSituation()).resolves.toEqual({ state: next, status: "loaded" });
  });

  it("reports an uncertain commit and reloads the old state when delete had no effect and verification fails", async () => {
    const previous = currentState(oldTimestamp);
    const next = currentState(newTimestamp);
    stored.set(SITUATION_STORAGE_KEY_V2, JSON.stringify(previous));
    let verificationFailed = false;
    secureStore.deleteItemAsync.mockImplementation(async (key) => {
      if (key === SITUATION_STORAGE_KEY_V2_PREVIOUS) {
        throw new Error("delete transport failure");
      }
      stored.delete(key);
    });
    secureStore.getItemAsync.mockImplementation(async (key) => {
      if (!verificationFailed && key === SITUATION_STORAGE_KEY_V2_PREVIOUS && secureStore.deleteItemAsync.mock.calls.length > 0) {
        verificationFailed = true;
        throw new Error("verification unavailable");
      }
      return stored.get(key) ?? null;
    });

    await expect(saveSituation(next)).rejects.toThrow("SITUATION_STORAGE_COMMIT_UNCERTAIN");
    secureStore.getItemAsync.mockImplementation(async (key) => stored.get(key) ?? null);
    await expect(loadSituation()).resolves.toEqual({ state: previous, status: "loaded" });
  });

  it("reports an uncertain commit and honestly reloads the new state when delete took effect before verification failed", async () => {
    const previous = currentState(oldTimestamp);
    const next = currentState(newTimestamp);
    stored.set(SITUATION_STORAGE_KEY_V2, JSON.stringify(previous));
    let verificationFailed = false;
    secureStore.deleteItemAsync.mockImplementation(async (key) => {
      stored.delete(key);
      if (key === SITUATION_STORAGE_KEY_V2_PREVIOUS) throw new Error("delete transport failure after side effect");
    });
    secureStore.getItemAsync.mockImplementation(async (key) => {
      if (!verificationFailed && key === SITUATION_STORAGE_KEY_V2_PREVIOUS && secureStore.deleteItemAsync.mock.calls.length > 0) {
        verificationFailed = true;
        throw new Error("verification unavailable");
      }
      return stored.get(key) ?? null;
    });

    await expect(saveSituation(next)).rejects.toThrow("SITUATION_STORAGE_COMMIT_UNCERTAIN");
    secureStore.getItemAsync.mockImplementation(async (key) => stored.get(key) ?? null);
    await expect(loadSituation()).resolves.toEqual({ state: next, status: "loaded" });
  });

  it("recovers a failed staged save on retry and then commits the replacement", async () => {
    const previous = currentState(oldTimestamp);
    const next = currentState(newTimestamp);
    stored.set(SITUATION_STORAGE_KEY_V2_PREVIOUS, JSON.stringify(previous));
    stored.set(SITUATION_STORAGE_KEY_V2, JSON.stringify(next));

    await saveSituation(next);

    await expect(loadSituation()).resolves.toEqual({ state: next, status: "loaded" });
    expect(stored.has(SITUATION_STORAGE_KEY_V2_PREVIOUS)).toBe(false);
  });

  it("deletes non-authoritative snapshots first and keeps the prior state on their failure", async () => {
    const previous = currentState(oldTimestamp);
    const staged = currentState(newTimestamp);
    stored.set(SITUATION_STORAGE_KEY_V2_PREVIOUS, JSON.stringify(previous));
    stored.set(SITUATION_STORAGE_KEY_V2, JSON.stringify(staged));
    secureStore.deleteItemAsync.mockImplementation(async (key) => {
      if (key === SITUATION_STORAGE_KEY_V2) throw new Error("staged delete failed");
      stored.delete(key);
    });

    await expect(deleteSituation()).rejects.toThrow("staged delete failed");
    await expect(loadSituation()).resolves.toEqual({ state: previous, status: "loaded" });
  });

  it("keeps the current authority on a failed authoritative delete", async () => {
    const previous = currentState();
    stored.set(SITUATION_STORAGE_KEY_V2, JSON.stringify(previous));
    secureStore.deleteItemAsync.mockImplementation(async (key) => {
      if (key === SITUATION_STORAGE_KEY_V2) throw new Error("authority delete failed");
      stored.delete(key);
    });

    await expect(deleteSituation()).rejects.toThrow("SITUATION_STORAGE_COMMIT_FAILED");
    await expect(loadSituation()).resolves.toEqual({ state: previous, status: "loaded" });
  });

  it("clears legacy, current and previous keys after verified deletion", async () => {
    stored.set(SITUATION_STORAGE_KEY_V2_PREVIOUS, JSON.stringify(currentState()));
    stored.set(SITUATION_STORAGE_KEY_V1, JSON.stringify(legacyState()));
    stored.set(SITUATION_STORAGE_KEY_V2, JSON.stringify(currentState(newTimestamp)));

    await deleteSituation();

    expect(stored.size).toBe(0);
    await expect(loadSituation()).resolves.toEqual({ state: null, status: "empty" });
  });
});
