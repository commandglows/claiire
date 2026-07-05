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
  sleep_mood_link: { icon: "🌙", severity: "warning" },
  crisis_alert: { icon: "🚨", severity: "danger" },
  mood_trend_down: { icon: "📉", severity: "warning" },
  mood_improving: { icon: "📈", severity: "positive" },
  habit_consistency: { icon: "🔥", severity: "positive" },
};

export function useInsights() {
  const raw = useQuery(api.analytics.getInsights) ?? [];

  const insights = (raw as Insight[]).map((p) => {
    const meta = PATTERN_META[p.patternType] ?? { icon: "💡", severity: "warning" as const };
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
