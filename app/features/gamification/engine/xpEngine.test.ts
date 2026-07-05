import {
  calculateLevel,
  calculateXPReward,
  xpForLevel,
  xpProgressInLevel,
  xpToNextLevel,
} from "./xpEngine";

describe("xpForLevel", () => {
  it("returns 0 for level 1", () => {
    expect(xpForLevel(1)).toBe(0);
  });

  it("returns 100 for level 2", () => {
    expect(xpForLevel(2)).toBe(100);
  });

  it("returns 300 for level 3", () => {
    expect(xpForLevel(3)).toBe(300);
  });

  it("returns 600 for level 4", () => {
    expect(xpForLevel(4)).toBe(600);
  });

  it("gap increases by 100 per level", () => {
    for (let n = 2; n <= 10; n++) {
      expect(xpForLevel(n + 1) - xpForLevel(n)).toBe(100 * n);
    }
  });
});

describe("calculateLevel", () => {
  it("returns 1 for 0 XP", () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it("returns 1 just below level 2 threshold", () => {
    expect(calculateLevel(99)).toBe(1);
  });

  it("returns 2 at exact level 2 threshold", () => {
    expect(calculateLevel(100)).toBe(2);
  });

  it("returns 2 just below level 3 threshold", () => {
    expect(calculateLevel(299)).toBe(2);
  });

  it("returns 3 at exact level 3 threshold", () => {
    expect(calculateLevel(300)).toBe(3);
  });

  it("returns 4 at exact level 4 threshold", () => {
    expect(calculateLevel(600)).toBe(4);
  });

  it("returns 1 for negative XP (edge case)", () => {
    expect(calculateLevel(-50)).toBe(1);
  });

  it("is consistent with xpForLevel", () => {
    for (let level = 1; level <= 10; level++) {
      expect(calculateLevel(xpForLevel(level))).toBe(level);
    }
  });
});

describe("xpToNextLevel", () => {
  it("returns 100 at 0 XP (level 1 → 2)", () => {
    expect(xpToNextLevel(0)).toBe(100);
  });

  it("returns 50 when halfway through level 1", () => {
    expect(xpToNextLevel(50)).toBe(50);
  });

  it("returns 200 exactly at level 2 (level 2 → 3 needs 200)", () => {
    expect(xpToNextLevel(100)).toBe(200);
  });

  it("returns 1 when one XP away from next level", () => {
    expect(xpToNextLevel(99)).toBe(1);
  });
});

describe("xpProgressInLevel", () => {
  it("correctly reports level 1 at 50 XP", () => {
    const progress = xpProgressInLevel(50);
    expect(progress.level).toBe(1);
    expect(progress.currentInLevel).toBe(50);
    expect(progress.requiredInLevel).toBe(100);
    expect(progress.percentage).toBe(50);
  });

  it("correctly reports level 2 at 150 XP", () => {
    const progress = xpProgressInLevel(150);
    expect(progress.level).toBe(2);
    expect(progress.currentInLevel).toBe(50); // 150 - 100
    expect(progress.requiredInLevel).toBe(200); // 300 - 100
    expect(progress.percentage).toBe(25);
  });

  it("reports 0% at the start of a level", () => {
    const progress = xpProgressInLevel(xpForLevel(3)); // exactly level 3
    expect(progress.level).toBe(3);
    expect(progress.currentInLevel).toBe(0);
    expect(progress.percentage).toBe(0);
  });
});

describe("calculateXPReward", () => {
  it("returns correct XP for sleep_log", () => {
    expect(calculateXPReward("sleep_log")).toBe(15);
  });

  it("sleep_log_with_notes awards bonus XP", () => {
    expect(calculateXPReward("sleep_log_with_notes")).toBeGreaterThan(
      calculateXPReward("sleep_log"),
    );
  });

  it("returns correct XP for mood_log", () => {
    expect(calculateXPReward("mood_log")).toBe(10);
  });

  it("mood_log_with_trigger awards more XP than base mood_log", () => {
    expect(calculateXPReward("mood_log_with_trigger")).toBeGreaterThan(
      calculateXPReward("mood_log"),
    );
  });

  it("habit_complete returns 20 XP", () => {
    expect(calculateXPReward("habit_complete")).toBe(20);
  });

  it("habit_streak_30 returns more XP than habit_streak_7", () => {
    expect(calculateXPReward("habit_streak_30")).toBeGreaterThan(
      calculateXPReward("habit_streak_7"),
    );
  });
});
