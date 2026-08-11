import {
  getBreathingPhase,
  isRelationshipReflectionAction,
  RELATIONSHIP_REFLECTION_ACTIONS,
} from "./relationshipReflection";

describe("relationship reflection routine", () => {
  it("keeps the five guided steps in their safety-first order", () => {
    expect(RELATIONSHIP_REFLECTION_ACTIONS.map((action) => action.id)).toEqual([
      "relationship-reflection-arrival",
      "relationship-reflection-breathing",
      "relationship-reflection-journal",
      "relationship-reflection-visualization",
      "relationship-reflection-next-step",
    ]);
  });

  it("alternates a gentle five-second inhale and exhale without holds", () => {
    expect(getBreathingPhase(0)).toBe("inhale");
    expect(getBreathingPhase(4)).toBe("inhale");
    expect(getBreathingPhase(5)).toBe("exhale");
    expect(getBreathingPhase(9)).toBe("exhale");
    expect(getBreathingPhase(10)).toBe("inhale");
  });

  it("only identifies the dedicated guided actions", () => {
    expect(isRelationshipReflectionAction("relationship-reflection-journal")).toBe(true);
    expect(isRelationshipReflectionAction("journal")).toBe(false);
  });
});
