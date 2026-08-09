import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type Insight = {
  _id: string;
  patternType: string;
  confidence: number;
  data: { message?: string; [key: string]: unknown };
  detectedAt: number;
};

const PATTERN_META: Record<string, { icon: string; severity: "positive" | "warning" | "danger" }> = {
  sleep_mood_link: { icon: "moon", severity: "warning" },
  crisis_alert: { icon: "shield-alert", severity: "danger" },
  mood_trend_down: { icon: "trend-down", severity: "warning" },
  mood_improving: { icon: "trend-up", severity: "positive" },
  habit_consistency: { icon: "flame", severity: "positive" },
};

export function useInsights() {
  const raw = useQuery(api.analytics.getInsights) ?? [];

  const insights = (raw as Insight[]).map((p) => {
    const meta = PATTERN_META[p.patternType] ?? { icon: "lightbulb", severity: "warning" as const };
    return {
      ...p,
      icon: meta.icon,
      severity: meta.severity,
      message: (p.data?.message as string) ?? p.patternType,
    };
  });

  const warnings = insights.filter((i) => i.severity === "danger" || i.severity === "warning");
  const positives = insights.filter((i) => i.severity === "positive");
  const hasCrisisAlert = insights.some((i) => i.patternType === "crisis_alert");

  return { insights, warnings, positives, hasCrisisAlert };
}
