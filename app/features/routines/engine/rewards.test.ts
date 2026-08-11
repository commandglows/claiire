import { getRoutineRewards } from "./rewards";

describe("routine completion rewards", () => {
  it("never gamifies a relationship reflection routine", () => {
    expect(
      getRoutineRewards(
        [
          "relationship-reflection-arrival",
          "relationship-reflection-journal",
        ],
        2,
      ),
    ).toEqual({ actionXP: 0, bonusXP: 0, xpAwarded: 0 });
  });

  it("preserves rewards for an ordinary completed routine", () => {
    expect(getRoutineRewards(["water", "walk"], 2)).toEqual({
      actionXP: 20,
      bonusXP: 20,
      xpAwarded: 40,
    });
  });

  it("does not award a completion bonus to an incomplete routine", () => {
    expect(getRoutineRewards(["water", "walk"], 1)).toEqual({
      actionXP: 10,
      bonusXP: 0,
      xpAwarded: 10,
    });
  });
});
