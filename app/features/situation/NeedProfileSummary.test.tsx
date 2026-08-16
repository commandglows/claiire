import { fireEvent, render } from "@testing-library/react-native";

import { buildNeedProfile } from "./needProfile";
import { NeedProfileSummary } from "./NeedProfileSummary";

const derivedAt = "2026-08-16T10:00:00.000Z";

describe("NeedProfileSummary", () => {
  it("renders an honest partial state and keeps correction and help reachable", () => {
    const profile = buildNeedProfile({ answers: { A1: "yes", P6: "none-now" }, criticalEventHistory: [], derivedAt, sourceSituationVersion: 2 });
    const correct = jest.fn();
    const help = jest.fn();
    const screen = render(<NeedProfileSummary profile={profile} onCorrect={correct} onHelp={help} />);

    expect(screen.getByText("Ce que j'ai compris")).toBeTruthy();
    expect(screen.getByText("Ce qui compte maintenant")).toBeTruthy();
    expect(screen.getByText(/Cela ne veut pas dire qu'il n'y a aucun besoin/)).toBeTruthy();
    expect(screen.getByText(/Aucun maintenant/)).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Corriger mes réponses"));
    fireEvent.press(screen.getByLabelText("Obtenir une aide humaine"));
    expect(correct).toHaveBeenCalledTimes(1);
    expect(help).toHaveBeenCalledTimes(1);
  });

  it("explains, ignores and restores categories with accessible states", () => {
    const profile = buildNeedProfile({ answers: { N1: ["legal-rights"] }, criticalEventHistory: [], derivedAt, sourceSituationVersion: 2 });
    const ignore = jest.fn();
    const screen = render(<NeedProfileSummary profile={profile} onIgnore={ignore} />);

    fireEvent.press(screen.getByLabelText("Voir pourquoi Informations sur les droits est proposée"));
    expect(screen.getByText(/N1/)).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Ignorer la catégorie Informations sur les droits"));
    expect(ignore).toHaveBeenCalledWith("legal-rights");

    const ignoredProfile = { ...profile, ignoredCategoryIds: ["legal-rights" as const] };
    const restore = jest.fn();
    screen.rerender(<NeedProfileSummary profile={ignoredProfile} onRestore={restore} />);
    fireEvent.press(screen.getByLabelText("Restaurer la catégorie Informations sur les droits"));
    expect(restore).toHaveBeenCalledWith("legal-rights");
  });

  it("recaps canonical source values, shows changed before and now, and corrects a targeted source", () => {
    const answers = {
      I3: "yes",
      P5: ["understand"],
      P6: "talk-trusted-person",
      N1: ["legal-rights"],
      N8: ["in-app-only", "morning"],
    };
    const previousAnswers = { ...answers, I3: "maybe", N8: ["email"] };
    const profile = buildNeedProfile({ answers, criticalEventHistory: [], derivedAt, sourceSituationVersion: 2 });
    const correctSource = jest.fn();
    const screen = render(
      <NeedProfileSummary
        profile={profile}
        answers={answers}
        previousAnswers={previousAnswers}
        sourceQuestionIds={["I3", "P5", "P6", "N1", "N8"]}
        onCorrectSource={correctSource}
      />,
    );

    expect(screen.getByText("Réponses à confirmer")).toBeTruthy();
    expect(screen.getByText(/Avant : Peut-être/)).toBeTruthy();
    expect(screen.getByText(/Maintenant : Oui/)).toBeTruthy();
    expect(screen.getAllByText(/Mieux comprendre/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Parler à une personne fiable/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Des informations juridiques/)).toBeTruthy();
    expect(screen.getByText(/Maintenant : Dans l'app uniquement · Le matin/)).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Corriger la réponse à la question N8"));
    expect(correctSource).toHaveBeenCalledWith("N8");
  });
});
