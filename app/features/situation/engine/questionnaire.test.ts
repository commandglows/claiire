import {
  getInitialQuestionIds,
  getSituationQuestion,
  getUpdateQuestionIds,
  normalizeMultipleAnswer,
  SITUATION_QUESTIONS,
} from "../questionnaire";

describe("situation questionnaire registry", () => {
  it("has unique question and option identifiers", () => {
    const ids = SITUATION_QUESTIONS.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const question of SITUATION_QUESTIONS) {
      const optionIds = question.options.map((option) => option.value);
      expect(new Set(optionIds).size).toBe(optionIds.length);
    }
  });

  it("preserves the exact V1 need question values", () => {
    expect(getSituationQuestion("I3")?.options.map(({ value }) => value)).toEqual(["no", "maybe", "yes", "without-waiting", "unknown"]);
    expect(getSituationQuestion("P5")?.options.map(({ value }) => value)).toEqual([
      "understand", "reduce-risk-stay", "regain-autonomy", "communicate-if-safe", "protect-dependant", "prepare-distance", "prepare-separation", "after-separation", "find-human-help", "unknown",
    ]);
    expect(getSituationQuestion("P6")?.options.map(({ value }) => value)).toEqual([
      "none-now", "observe-understand", "open-help-options", "talk-trusted-person", "prepare-small-safety-step", "seek-health-help", "seek-rights-info", "seek-practical-help", "prepare-distance", "prepare-separation", "unknown",
    ]);
    expect(SITUATION_QUESTIONS.filter(({ id }) => /^N[1-8]$/.test(id))).toHaveLength(8);
  });

  it("asks N1 but branches to N2-N8 only from confirmed support intent", () => {
    const base = getInitialQuestionIds();
    expect(base).toContain("N1");
    expect(base).not.toContain("N2");
    expect(getInitialQuestionIds({ I3: "maybe" })).toEqual(SITUATION_QUESTIONS.map(({ id }) => id));
    expect(getInitialQuestionIds({ P5: ["find-human-help"] })).toContain("N8");
    expect(getInitialQuestionIds({ N1: ["trusted-person"] })).toContain("N8");
    expect(getInitialQuestionIds({ N1: ["none-now"] })).not.toContain("N2");
  });

  it.each([
    ["event", ["I3"]],
    ["worsened", ["I3"]],
    ["constraints", ["P5", "P6", "N3", "N7"]],
    ["support", ["I3", "P5", "N1", "N8"]],
    ["understanding", ["P5", "P6", "N1"]],
    ["intention", ["I3", "P5", "P6", "N1", "N8"]],
  ] as const)("adds governed questions for %s updates", (change, expected) => {
    const ids = getUpdateQuestionIds([change]);
    expect(ids[0]).toBe("A1");
    for (const id of expected) expect(ids).toContain(id);
    const s1 = ids.indexOf("S1");
    const s3 = ids.indexOf("S3");
    const n2 = ids.indexOf("N2");
    if (s1 >= 0 && n2 >= 0) expect(s1).toBeLessThan(n2);
    if (s3 >= 0 && n2 >= 0) expect(s3).toBeLessThan(n2);
  });

  it("uses the initial branch rule for review-all", () => {
    expect(getUpdateQuestionIds(["review-all"])).not.toContain("N2");
    expect(getUpdateQuestionIds(["review-all"], { I3: "yes" })).toContain("N8");
  });

  it("normalizes exclusive answers without contradictory combinations", () => {
    expect(normalizeMultipleAnswer("N1", ["trusted-person"], "none-now")).toEqual(["none-now"]);
    expect(normalizeMultipleAnswer("N1", ["none-now"], "trusted-person")).toEqual(["trusted-person"]);
    expect(normalizeMultipleAnswer("N2", ["french"], "unknown")).toEqual(["unknown"]);
    expect(normalizeMultipleAnswer("N3", ["none"], "screen-reader")).toEqual(["screen-reader"]);
  });

  it("collects no free text, address, precise location or contact coordinate", () => {
    for (const question of SITUATION_QUESTIONS) {
      expect(question.options.length).toBeGreaterThan(0);
      expect(question).not.toHaveProperty("freeText");
    }
    const serializedOptions = JSON.stringify(SITUATION_QUESTIONS.flatMap((question) => question.options));
    expect(serializedOptions).not.toMatch(/GPS|adresse exacte|numéro de téléphone|e-mail personnel/i);
  });
});
