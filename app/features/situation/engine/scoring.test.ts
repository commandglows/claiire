import { buildSituationState } from "../scoring";

describe("buildSituationState", () => {
  const time = "2026-08-16T10:00:00.000Z";

  it("builds SituationState v2 and the need profile from one confirmed answer set", () => {
    const state = buildSituationState({
      A1: "yes",
      A2: "device",
      I3: "yes",
      P5: ["find-human-help"],
      P6: "open-help-options",
    }, null, time);

    expect(state.version).toBe(2);
    expect(state.updatedAt).toBe(time);
    expect(state.needProfile.categories.map(({ id }) => id)).toEqual(["health-psychological", "violence-specialist"]);
    expect(state.needProfile.orientation?.level).toBe("specialized");
  });

  it("keeps confirmed critical history append-only across a calmer update", () => {
    const previous = buildSituationState({ A1: "yes", A2: "device", S3: ["death-threat"] }, null, time);
    const calmer = buildSituationState({ A1: "yes", A2: "device", S1: "no", S3: ["none"], P5: ["understand"] }, previous, "2026-08-16T11:00:00.000Z");

    expect(calmer.criticalEventHistory).toEqual(previous.criticalEventHistory);
    expect(calmer.needProfile.orientation?.level).toBe("urgent");
    expect(calmer.needProfile.categories[0].id).toBe("immediate-safety");
  });

  it("does not turn unknown dimensions into zero", () => {
    const state = buildSituationState({ A1: "yes", A2: "session", I2: "unknown", P4: "unknown" }, null, time);
    expect(state.dimensions.IMP.score).toBeNull();
    expect(state.dimensions.AGY.score).toBeNull();
  });
});
