jest.mock("expo-router", () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

jest.mock("@/features/situation/storage", () => ({
  loadSituation: jest.fn(async () => ({ state: null, status: "empty" })),
  saveSituation: jest.fn(async () => undefined),
  deleteSituation: jest.fn(async () => undefined),
}));

import { fireEvent, render } from "@testing-library/react-native";

import { buildSituationState } from "@/features/situation/scoring";
import { useSituationStore } from "@/features/situation/store";

import SituationScreen from "./situation";

describe("SituationScreen privacy and restitution", () => {
  beforeEach(() => {
    useSituationStore.setState({
      hydrated: true,
      loadStatus: "loaded",
      lastError: null,
      migrationPending: false,
      situation: buildSituationState({ A1: "yes", A2: "session", N1: ["legal-rights"] }, null, "2026-08-16T10:00:00.000Z"),
      draft: {},
      touchedQuestionIds: [],
      candidate: null,
      interruption: null,
      confirming: false,
    });
  });

  it("keeps sensitive summary hidden until privacy is reconfirmed", () => {
    const screen = render(<SituationScreen />);

    expect(screen.getByText("Avant d'afficher tes réponses")).toBeTruthy();
    expect(screen.queryByText("Informations sur les droits")).toBeNull();
    fireEvent.press(screen.getByLabelText("Oui, je peux consulter cet écran tranquillement"));
    expect(screen.getByText("Informations sur les droits")).toBeTruthy();
  });
});
