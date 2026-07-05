import { detectPatterns, type LogEntry } from "./patternEngine";

const DAY_MS = 86_400_000;
const NOW = new Date("2026-03-07T12:00:00Z").getTime();

function makeLog(type: LogEntry["type"], data: Record<string, unknown>, daysAgo: number): LogEntry {
  return { type, data, createdAt: NOW - daysAgo * DAY_MS + Math.random() * 1000 };
}

describe("patternEngine", () => {
  describe("sleep_mood_link", () => {
    it("detects when poor sleep correlates with bad mood", () => {
      const logs: LogEntry[] = [
        // 3 nights of poor sleep, each followed by bad mood
        makeLog("sleep", { hoursSlept: 4, quality: 2 }, 6),
        makeLog("mood", { emotion: "anxiety", intensity: 8 }, 5.5),
        makeLog("sleep", { hoursSlept: 3, quality: 1 }, 4),
        makeLog("mood", { emotion: "anger", intensity: 9 }, 3.5),
        makeLog("sleep", { hoursSlept: 5, quality: 2 }, 2),
        makeLog("mood", { emotion: "sadness", intensity: 7 }, 1.5),
        // Need at least 3 mood logs total
        makeLog("mood", { emotion: "neutral", intensity: 4 }, 0.5),
      ];

      const patterns = detectPatterns(logs, NOW);
      const sleepMood = patterns.find((p) => p.patternType === "sleep_mood_link");
      expect(sleepMood).toBeDefined();
      expect(sleepMood!.confidence).toBeGreaterThanOrEqual(0.5);
      expect(sleepMood!.data.correlatedBadMoods).toBe(3);
    });

    it("returns null with insufficient data", () => {
      const logs: LogEntry[] = [
        makeLog("sleep", { hoursSlept: 4, quality: 2 }, 2),
        makeLog("mood", { emotion: "anxiety", intensity: 8 }, 1),
      ];
      const patterns = detectPatterns(logs, NOW);
      expect(patterns.find((p) => p.patternType === "sleep_mood_link")).toBeUndefined();
    });

    it("returns null when sleep is fine", () => {
      const logs: LogEntry[] = [
        makeLog("sleep", { hoursSlept: 8, quality: 4 }, 6),
        makeLog("sleep", { hoursSlept: 7, quality: 5 }, 4),
        makeLog("sleep", { hoursSlept: 7.5, quality: 4 }, 2),
        makeLog("mood", { emotion: "happy", intensity: 3 }, 5),
        makeLog("mood", { emotion: "neutral", intensity: 4 }, 3),
        makeLog("mood", { emotion: "happy", intensity: 2 }, 1),
      ];
      const patterns = detectPatterns(logs, NOW);
      expect(patterns.find((p) => p.patternType === "sleep_mood_link")).toBeUndefined();
    });
  });

  describe("crisis_alert", () => {
    it("triggers on 3+ crises in 7 days", () => {
      const logs: LogEntry[] = [
        makeLog("crisis", { intensity: 8 }, 1),
        makeLog("crisis", { intensity: 7 }, 3),
        makeLog("crisis", { intensity: 6 }, 5),
      ];
      const patterns = detectPatterns(logs, NOW);
      const crisis = patterns.find((p) => p.patternType === "crisis_alert");
      expect(crisis).toBeDefined();
      expect(crisis!.data.crisisCount).toBe(3);
    });

    it("does not trigger on 2 crises", () => {
      const logs: LogEntry[] = [
        makeLog("crisis", { intensity: 8 }, 1),
        makeLog("crisis", { intensity: 7 }, 3),
      ];
      const patterns = detectPatterns(logs, NOW);
      expect(patterns.find((p) => p.patternType === "crisis_alert")).toBeUndefined();
    });

    it("ignores crises older than 7 days", () => {
      const logs: LogEntry[] = [
        makeLog("crisis", { intensity: 8 }, 10),
        makeLog("crisis", { intensity: 7 }, 9),
        makeLog("crisis", { intensity: 6 }, 8),
      ];
      const patterns = detectPatterns(logs, NOW);
      expect(patterns.find((p) => p.patternType === "crisis_alert")).toBeUndefined();
    });
  });

  describe("mood_trend", () => {
    it("detects worsening mood (rising intensity)", () => {
      const logs: LogEntry[] = [
        // Previous week: low intensity (good)
        makeLog("mood", { emotion: "neutral", intensity: 3 }, 12),
        makeLog("mood", { emotion: "neutral", intensity: 3 }, 10),
        makeLog("mood", { emotion: "happy", intensity: 2 }, 9),
        // Recent week: high intensity (bad)
        makeLog("mood", { emotion: "anxiety", intensity: 7 }, 3),
        makeLog("mood", { emotion: "anger", intensity: 8 }, 1),
      ];
      const patterns = detectPatterns(logs, NOW);
      const trend = patterns.find((p) => p.patternType === "mood_trend_down");
      expect(trend).toBeDefined();
      expect(trend!.confidence).toBeGreaterThan(0);
    });

    it("detects improving mood (falling intensity)", () => {
      const logs: LogEntry[] = [
        // Previous week: high intensity
        makeLog("mood", { emotion: "anxiety", intensity: 8 }, 12),
        makeLog("mood", { emotion: "anxiety", intensity: 8 }, 10),
        makeLog("mood", { emotion: "anger", intensity: 7 }, 9),
        // Recent week: low intensity
        makeLog("mood", { emotion: "happy", intensity: 3 }, 3),
        makeLog("mood", { emotion: "happy", intensity: 2 }, 1),
      ];
      const patterns = detectPatterns(logs, NOW);
      const trend = patterns.find((p) => p.patternType === "mood_improving");
      expect(trend).toBeDefined();
    });

    it("returns null with stable mood", () => {
      const logs: LogEntry[] = [
        makeLog("mood", { emotion: "neutral", intensity: 5 }, 12),
        makeLog("mood", { emotion: "neutral", intensity: 5 }, 10),
        makeLog("mood", { emotion: "neutral", intensity: 5 }, 9),
        makeLog("mood", { emotion: "neutral", intensity: 5 }, 3),
        makeLog("mood", { emotion: "neutral", intensity: 5 }, 1),
      ];
      const patterns = detectPatterns(logs, NOW);
      expect(patterns.find((p) => p.patternType === "mood_trend_down")).toBeUndefined();
      expect(patterns.find((p) => p.patternType === "mood_improving")).toBeUndefined();
    });
  });

  describe("habit_consistency", () => {
    it("detects 5+ days of habits in 7 days", () => {
      const logs: LogEntry[] = [
        makeLog("habit", { habitName: "Méditer" }, 0),
        makeLog("habit", { habitName: "Méditer" }, 1),
        makeLog("habit", { habitName: "Méditer" }, 2),
        makeLog("habit", { habitName: "Méditer" }, 3),
        makeLog("habit", { habitName: "Méditer" }, 4),
      ];
      const patterns = detectPatterns(logs, NOW);
      const habit = patterns.find((p) => p.patternType === "habit_consistency");
      expect(habit).toBeDefined();
      expect(habit!.data.activeDays).toBe(5);
    });

    it("does not trigger on less than 5 days", () => {
      const logs: LogEntry[] = [
        makeLog("habit", { habitName: "Méditer" }, 0),
        makeLog("habit", { habitName: "Méditer" }, 1),
        makeLog("habit", { habitName: "Méditer" }, 3),
      ];
      const patterns = detectPatterns(logs, NOW);
      expect(patterns.find((p) => p.patternType === "habit_consistency")).toBeUndefined();
    });
  });

  describe("combined patterns", () => {
    it("returns multiple patterns simultaneously", () => {
      const logs: LogEntry[] = [
        // Crisis alert
        makeLog("crisis", { intensity: 8 }, 1),
        makeLog("crisis", { intensity: 7 }, 3),
        makeLog("crisis", { intensity: 6 }, 5),
        // Habit consistency
        makeLog("habit", {}, 0),
        makeLog("habit", {}, 1),
        makeLog("habit", {}, 2),
        makeLog("habit", {}, 3),
        makeLog("habit", {}, 5),
      ];
      const patterns = detectPatterns(logs, NOW);
      expect(patterns.length).toBeGreaterThanOrEqual(2);
      expect(patterns.find((p) => p.patternType === "crisis_alert")).toBeDefined();
      expect(patterns.find((p) => p.patternType === "habit_consistency")).toBeDefined();
    });

    it("returns empty array with no data", () => {
      expect(detectPatterns([], NOW)).toEqual([]);
    });
  });
});
