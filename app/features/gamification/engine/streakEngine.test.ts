import {
  calculateStreak,
  getStreakStatus,
  isStreakActive,
  streakMilestoneBonus,
} from "./streakEngine";

describe("calculateStreak", () => {
  it("returns 0 for empty array", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it("returns 1 for a single date", () => {
    expect(calculateStreak(["2026-03-07"])).toBe(1);
  });

  it("returns correct streak for consecutive days", () => {
    expect(
      calculateStreak(["2026-03-05", "2026-03-06", "2026-03-07"]),
    ).toBe(3);
  });

  it("breaks at a gap and counts from the end", () => {
    // Gap between 01 and 03 — streak from the end is 2 (06 + 07)
    expect(
      calculateStreak([
        "2026-03-01",
        "2026-03-03",
        "2026-03-06",
        "2026-03-07",
      ]),
    ).toBe(2);
  });

  it("deduplicates duplicate dates", () => {
    expect(
      calculateStreak(["2026-03-06", "2026-03-06", "2026-03-07"]),
    ).toBe(2);
  });

  it("handles unsorted input", () => {
    expect(
      calculateStreak(["2026-03-07", "2026-03-05", "2026-03-06"]),
    ).toBe(3);
  });

  it("returns 1 when only the most recent date is isolated", () => {
    expect(
      calculateStreak(["2026-03-01", "2026-03-05"]),
    ).toBe(1);
  });
});

describe("isStreakActive", () => {
  it("is active when last activity was today", () => {
    expect(isStreakActive("2026-03-07", "2026-03-07")).toBe(true);
  });

  it("is active when last activity was yesterday", () => {
    expect(isStreakActive("2026-03-06", "2026-03-07")).toBe(true);
  });

  it("is NOT active when last activity was 2 days ago", () => {
    expect(isStreakActive("2026-03-05", "2026-03-07")).toBe(false);
  });

  it("is NOT active when last activity was a week ago", () => {
    expect(isStreakActive("2026-02-28", "2026-03-07")).toBe(false);
  });
});

describe("streakMilestoneBonus", () => {
  it("returns 0 for streak of 1", () => {
    expect(streakMilestoneBonus(1)).toBe(0);
  });

  it("returns 25 for streak of 3", () => {
    expect(streakMilestoneBonus(3)).toBe(25);
  });

  it("returns 100 for streak of 7", () => {
    expect(streakMilestoneBonus(7)).toBe(100);
  });

  it("returns 500 for streak of 30", () => {
    expect(streakMilestoneBonus(30)).toBe(500);
  });

  it("returns 0 for non-milestone streaks", () => {
    expect(streakMilestoneBonus(5)).toBe(0);
    expect(streakMilestoneBonus(15)).toBe(0);
  });
});

describe("getStreakStatus", () => {
  const TODAY = "2026-03-07";

  it("returns inactive streak for empty dates", () => {
    const status = getStreakStatus([], TODAY);
    expect(status.currentStreak).toBe(0);
    expect(status.isActive).toBe(false);
  });

  it("returns active streak when last date is today", () => {
    const dates = ["2026-03-05", "2026-03-06", "2026-03-07"];
    const status = getStreakStatus(dates, TODAY);
    expect(status.currentStreak).toBe(3);
    expect(status.isActive).toBe(true);
  });

  it("returns inactive streak when last date was 2+ days ago", () => {
    const dates = ["2026-03-01", "2026-03-02", "2026-03-03"];
    const status = getStreakStatus(dates, TODAY);
    expect(status.currentStreak).toBe(0);
    expect(status.isActive).toBe(false);
  });

  it("includes milestone bonus XP at streak 7", () => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date("2026-03-01");
      d.setDate(d.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
    const status = getStreakStatus(dates, TODAY);
    expect(status.bonusXP).toBe(100);
  });
});
