export type LogEntry = {
  type: "sleep" | "mood" | "crisis" | "habit" | "meal";
  data: Record<string, unknown>;
  createdAt: number;
};

export type DetectedPattern = {
  patternType: string;
  confidence: number; // 0–1
  data: Record<string, unknown>;
};

const DAY_MS = 86_400_000;

function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

/** Poor sleep: ≤5h or quality ≤2 */
function isPoorSleep(log: LogEntry): boolean {
  const d = log.data as { hoursSlept?: number; quality?: number };
  return (d.hoursSlept != null && d.hoursSlept <= 5) || (d.quality != null && d.quality <= 2);
}

/** Negative mood: anger, anxiety, sadness or intensity ≥7 */
function isNegativeMood(log: LogEntry): boolean {
  const d = log.data as { emotion?: string; intensity?: number };
  const negativeEmotions = ["anger", "anxiety", "sadness"];
  return negativeEmotions.includes(d.emotion ?? "") || (d.intensity != null && d.intensity >= 7);
}

/**
 * Detect sleep → mood correlation.
 * Looks for poor sleep followed by negative mood within 24h.
 */
function detectSleepMoodLink(logs: LogEntry[]): DetectedPattern | null {
  const sleepLogs = logs.filter((l) => l.type === "sleep");
  const moodLogs = logs.filter((l) => l.type === "mood");

  if (sleepLogs.length < 3 || moodLogs.length < 3) return null;

  const poorSleepDays = sleepLogs.filter(isPoorSleep);
  if (poorSleepDays.length === 0) return null;

  let correlations = 0;
  for (const sleep of poorSleepDays) {
    const nextDayMoods = moodLogs.filter(
      (m) => m.createdAt > sleep.createdAt && m.createdAt - sleep.createdAt < DAY_MS,
    );
    if (nextDayMoods.some(isNegativeMood)) correlations++;
  }

  const confidence = correlations / poorSleepDays.length;
  if (confidence < 0.5) return null;

  return {
    patternType: "sleep_mood_link",
    confidence: Math.min(confidence, 1),
    data: {
      poorSleepCount: poorSleepDays.length,
      correlatedBadMoods: correlations,
      message: "Quand tu dors mal, ton humeur est souvent moins bonne le lendemain.",
    },
  };
}

/**
 * Crisis frequency alert (BurnoutAlert).
 * 3+ crises in the last 7 days.
 */
function detectCrisisAlert(logs: LogEntry[], now: number): DetectedPattern | null {
  const sevenDaysAgo = now - 7 * DAY_MS;
  const recentCrises = logs.filter((l) => l.type === "crisis" && l.createdAt >= sevenDaysAgo);

  if (recentCrises.length < 3) return null;

  return {
    patternType: "crisis_alert",
    confidence: Math.min(recentCrises.length / 7, 1),
    data: {
      crisisCount: recentCrises.length,
      window: 7,
      message: `${recentCrises.length} crises cette semaine. Prends soin de toi, tu traverses une période difficile.`,
    },
  };
}

/**
 * Mood trend: compare average mood intensity (last 7d vs previous 7d).
 * Returns a declining or improving pattern.
 */
function detectMoodTrend(logs: LogEntry[], now: number): DetectedPattern | null {
  const moodLogs = logs.filter((l) => l.type === "mood");
  if (moodLogs.length < 5) return null;

  const sevenDaysAgo = now - 7 * DAY_MS;
  const fourteenDaysAgo = now - 14 * DAY_MS;

  const recentMoods = moodLogs.filter((l) => l.createdAt >= sevenDaysAgo);
  const previousMoods = moodLogs.filter((l) => l.createdAt >= fourteenDaysAgo && l.createdAt < sevenDaysAgo);

  if (recentMoods.length < 2 || previousMoods.length < 2) return null;

  const avg = (logs: LogEntry[]) =>
    logs.reduce((sum, l) => sum + ((l.data as { intensity?: number }).intensity ?? 5), 0) / logs.length;

  const recentAvg = avg(recentMoods);
  const previousAvg = avg(previousMoods);
  const diff = recentAvg - previousAvg;

  // intensity 1-10 where high = bad (anger/anxiety) — so rising avg = worsening
  if (Math.abs(diff) < 1) return null;

  if (diff > 0) {
    return {
      patternType: "mood_trend_down",
      confidence: Math.min(diff / 5, 1),
      data: {
        recentAvg: Math.round(recentAvg * 10) / 10,
        previousAvg: Math.round(previousAvg * 10) / 10,
        message: "Ton intensité émotionnelle augmente ces derniers jours. Surveille tes déclencheurs.",
      },
    };
  }

  return {
    patternType: "mood_improving",
    confidence: Math.min(Math.abs(diff) / 5, 1),
    data: {
      recentAvg: Math.round(recentAvg * 10) / 10,
      previousAvg: Math.round(previousAvg * 10) / 10,
      message: "Ton humeur s'améliore cette semaine. Continue comme ça !",
    },
  };
}

/**
 * Habit consistency: completed habits on 5+ of the last 7 days.
 */
function detectHabitConsistency(logs: LogEntry[], now: number): DetectedPattern | null {
  const sevenDaysAgo = now - 7 * DAY_MS;
  const habitLogs = logs.filter((l) => l.type === "habit" && l.createdAt >= sevenDaysAgo);

  const uniqueDays = new Set(habitLogs.map((l) => dayKey(l.createdAt)));
  if (uniqueDays.size < 5) return null;

  return {
    patternType: "habit_consistency",
    confidence: uniqueDays.size / 7,
    data: {
      activeDays: uniqueDays.size,
      window: 7,
      message: `Habitudes complétées ${uniqueDays.size} jours sur 7. Ta discipline paie !`,
    },
  };
}

/**
 * Main entry point: analyze logs and return all detected patterns.
 * Pure function — no side effects.
 */
export function detectPatterns(logs: LogEntry[], now?: number): DetectedPattern[] {
  const timestamp = now ?? Date.now();
  const patterns: DetectedPattern[] = [];

  const sleepMood = detectSleepMoodLink(logs);
  if (sleepMood) patterns.push(sleepMood);

  const crisis = detectCrisisAlert(logs, timestamp);
  if (crisis) patterns.push(crisis);

  const mood = detectMoodTrend(logs, timestamp);
  if (mood) patterns.push(mood);

  const habits = detectHabitConsistency(logs, timestamp);
  if (habits) patterns.push(habits);

  return patterns;
}
