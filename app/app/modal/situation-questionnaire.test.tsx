jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
    canDismiss: () => false,
    dismissAll: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock("@/features/situation/storage", () => ({
  loadSituation: jest.fn(async () => ({ state: null, status: "empty" })),
  saveSituation: jest.fn(async () => undefined),
  deleteSituation: jest.fn(async () => undefined),
}));

import { act, fireEvent, render, waitFor } from "@testing-library/react-native";

import { buildSituationState } from "@/features/situation/scoring";
import { useSituationStore } from "@/features/situation/store";

import SituationQuestionnaireScreen from "./situation-questionnaire";

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

describe("SituationQuestionnaireScreen", () => {
  beforeEach(resetStore);

  it("renders the privacy interruption before any candidate summary", async () => {
    const screen = render(<SituationQuestionnaireScreen />);
    fireEvent.press(screen.getByLabelText("Non"));

    await waitFor(() => expect(screen.getByText("Ce n'est peut-être pas le bon moment.")).toBeTruthy());
    expect(useSituationStore.getState().draft).toEqual({});
    expect(useSituationStore.getState().candidate).toBeNull();
    expect(screen.queryByText("Ce que j'ai compris")).toBeNull();
  });

  it("shows the needs-first candidate before confirmation", async () => {
    const screen = render(<SituationQuestionnaireScreen />);
    const candidate = buildSituationState({ A1: "yes", A2: "session", N1: ["trusted-person"], P6: "talk-trusted-person" }, null, "2026-08-16T10:00:00.000Z");

    act(() => {
      useSituationStore.setState({ candidate, stage: "review", mode: "initial" });
    });

    await waitFor(() => expect(screen.getByText("Ce que j'ai compris")).toBeTruthy());
    expect(screen.getByText("Ce qui compte maintenant")).toBeTruthy();
    expect(screen.getByText("Parler à une personne fiable")).toBeTruthy();
    expect(screen.getByLabelText("Confirmer ma situation")).toBeTruthy();
  });
});
