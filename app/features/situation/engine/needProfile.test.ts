import { buildNeedProfile } from "../needProfile";
import type { CriticalEvent, SituationAnswer } from "../types";

const derivedAt = "2026-08-16T10:00:00.000Z";

function build(answers: Record<string, SituationAnswer>, criticalEventHistory: CriticalEvent[] = []) {
  return buildNeedProfile({ answers, criticalEventHistory, derivedAt, sourceSituationVersion: 2 });
}

describe("buildNeedProfile", () => {
  it("keeps missing optional evidence unknown without reassuring defaults", () => {
    const profile = build({ A1: "yes" });

    expect(profile.orientation).toBeNull();
    expect(profile.categories).toEqual([]);
    expect(profile.selectedNextStep).toBe("unknown");
    expect(profile.preferences).toEqual({
      languagePreferences: [],
      accessibilityNeeds: [],
      territory: "unknown",
      cost: "unknown",
      availability: "unknown",
      modalities: [],
      safeContactChannels: [],
      safeContactWindows: [],
    });
  });

  it.each([
    [{ I3: "yes" }, "health-psychological", "specialized"],
    [{ P5: ["understand"] }, "self-understanding", "nonUrgent"],
    [{ P5: ["regain-autonomy"] }, "social-practical", "specialized"],
    [{ P5: ["protect-dependant"] }, "dependant-support", "specialized"],
    [{ P6: "open-help-options" }, "violence-specialist", "specialized"],
    [{ P6: "talk-trusted-person" }, "trusted-person", "nonUrgent"],
    [{ P6: "seek-rights-info" }, "legal-rights", "specialized"],
    [{ N1: ["social-practical"] }, "social-practical", "specialized"],
  ] as const)("maps %p to %s with %s orientation", (answers, categoryId, level) => {
    const profile = build(answers as Record<string, SituationAnswer>);
    expect(profile.categories[0].id).toBe(categoryId);
    expect(profile.orientation?.level).toBe(level);
    expect(profile.categories[0].evidenceQuestionIds).toHaveLength(1);
  });

  it("treats without-waiting as stated urgent preference without diagnosis", () => {
    const profile = build({ I3: "without-waiting" });

    expect(profile.orientation).toEqual({
      level: "urgent",
      reasonCodes: ["HEALTH_HELP_WITHOUT_WAITING"],
      evidenceQuestionIds: ["I3"],
    });
    expect(profile.categories[0].id).toBe("health-psychological");
  });

  it("puts confirmed critical history first and never compensates it", () => {
    const history: CriticalEvent[] = [{ id: "event-1", code: "death-threat", observedAt: derivedAt, sourceQuestionId: "S3" }];
    const profile = build({ P5: ["understand"], P6: "talk-trusted-person" }, history);

    expect(profile.orientation?.level).toBe("urgent");
    expect(profile.categories.map((category) => category.id)).toEqual(["immediate-safety", "trusted-person", "self-understanding"]);
    expect(profile.orientation?.evidenceQuestionIds).toEqual(["S3"]);
  });

  it("deduplicates, applies stable precedence and caps categories at three", () => {
    const profile = build({
      I3: "yes",
      P5: ["protect-dependant", "reduce-risk-stay", "regain-autonomy"],
      P6: "seek-rights-info",
      N1: ["trusted-person", "self-understanding"],
    });

    expect(profile.categories.map((category) => category.id)).toEqual([
      "health-psychological",
      "dependant-support",
      "violence-specialist",
    ]);
  });

  it("preserves none-now without creating a category", () => {
    const profile = build({ P6: "none-now", N1: ["none-now"] });

    expect(profile.selectedNextStep).toBe("none");
    expect(profile.categories).toEqual([]);
    expect(profile.orientation).toBeNull();
  });

  it("preserves meaningful exclusive preferences without treating unknown as a preference", () => {
    const profile = build({ N2: ["no-preference"], N7: ["no-preference"], N8: ["no-safe-channel"] });
    expect(profile.preferences.languagePreferences).toEqual(["no-preference"]);
    expect(profile.preferences.modalities).toEqual(["no-preference"]);
    expect(profile.preferences.safeContactChannels).toEqual(["no-safe-channel"]);

    const unknown = build({ N2: ["unknown"], N7: ["unknown"], N8: ["unknown"] });
    expect(unknown.preferences.languagePreferences).toEqual([]);
    expect(unknown.preferences.modalities).toEqual([]);
    expect(unknown.preferences.safeContactChannels).toEqual([]);
  });

  it("rejects contradictory exclusive multi-select values", () => {
    const profile = build({ N1: ["none-now", "violence-specialist"], P5: ["unknown", "find-human-help"] });

    expect(profile.requestedNeeds).toEqual([]);
    expect(profile.userPriorities).toEqual([]);
    expect(profile.categories).toEqual([]);
  });

  it("keeps only ignored category ids that still exist", () => {
    const profile = buildNeedProfile({
      answers: { N1: ["trusted-person"] },
      criticalEventHistory: [],
      derivedAt,
      sourceSituationVersion: 2,
      ignoredCategoryIds: ["trusted-person", "legal-rights"],
    });

    expect(profile.ignoredCategoryIds).toEqual(["trusted-person"]);
  });

  it("is deterministic for identical inputs and injected time", () => {
    const input = { N1: ["legal-rights", "health-psychological"], N8: ["in-app-only", "morning"] };
    expect(build(input)).toEqual(build(input));
  });
});
