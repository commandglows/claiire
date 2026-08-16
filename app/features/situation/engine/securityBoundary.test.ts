declare const __dirname: string;
declare function require(id: string): Record<string, (...args: string[]) => string>;

const { readFileSync } = require("fs");
const { resolve } = require("path");

import { buildNeedProfile } from "../needProfile";

const productionFiles = [
  "../needProfile.ts",
  "../questionnaire.ts",
  "../scoring.ts",
  "../storage.ts",
  "../store.ts",
  "../NeedProfileSummary.tsx",
  "../../../app/modal/situation.tsx",
  "../../../app/modal/situation-questionnaire.tsx",
];

describe("situation local-only boundary", () => {
  it("imports no backend, telemetry, notification or network adapter", () => {
    for (const relativePath of productionFiles) {
      const source = readFileSync(resolve(__dirname, relativePath), "utf8");
      expect(source).not.toMatch(/from\s+["'][^"']*(convex|analytics|tracking|notifications)[^"']*["']/i);
      expect(source).not.toMatch(/\b(fetch|XMLHttpRequest|useMutation|useQuery)\s*\(/);
    }
  });

  it("derives profiles without network or sensitive console output", () => {
    const originalFetch = globalThis.fetch;
    const fetchSpy = jest.fn();
    Object.defineProperty(globalThis, "fetch", { configurable: true, writable: true, value: fetchSpy });
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);

    try {
      buildNeedProfile({
        answers: { A1: "yes", N1: ["health-psychological"], N8: ["in-app-only"] },
        criticalEventHistory: [],
        derivedAt: "2026-08-16T10:00:00.000Z",
        sourceSituationVersion: 2,
      });
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(consoleSpy).not.toHaveBeenCalled();
    } finally {
      consoleSpy.mockRestore();
      Object.defineProperty(globalThis, "fetch", { configurable: true, writable: true, value: originalFetch });
    }
  });

  it("opens the help route without situation payload", () => {
    const dashboard = readFileSync(resolve(__dirname, "../../../app/modal/situation.tsx"), "utf8");
    const questionnaire = readFileSync(resolve(__dirname, "../../../app/modal/situation-questionnaire.tsx"), "utf8");
    expect(dashboard).toContain('router.push("/modal/situation-help" as never)');
    expect(questionnaire).toContain('router.push("/modal/situation-help" as never)');
    expect(`${dashboard}\n${questionnaire}`).not.toMatch(/situation-help[^\n]*(params|profile|answers|candidate)/i);
  });

  it("keeps review values canonical and correction targeted to a governed source", () => {
    const summary = readFileSync(resolve(__dirname, "../NeedProfileSummary.tsx"), "utf8");
    const questionnaire = readFileSync(resolve(__dirname, "../../../app/modal/situation-questionnaire.tsx"), "utf8");

    for (const questionId of ["I3", "P5", "P6", "N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8"]) {
      expect(summary).toContain(`"${questionId}"`);
    }
    expect(summary).toContain('question.options.find((option) => option.value === value)?.label');
    expect(summary).toContain('return "Valeur non reconnue"');
    expect(summary).toContain("Avant : ");
    expect(summary).toContain("Maintenant : ");
    expect(questionnaire).toContain("questionIds.indexOf(questionId)");
    expect(questionnaire).toContain('useSituationStore.setState({ stage: "questions", currentIndex: targetIndex, candidate: null })');
    expect(questionnaire).toContain("onCorrectSource={correctSource}");
  });
});
