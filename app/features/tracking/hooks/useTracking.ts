import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTrackingStore } from "../store";
import type { SleepLogData, MoodLogData } from "../types";

export function useTracking() {
  const { setIsLogging, setLastXPAwarded } = useTrackingStore();
  const logSleepMutation = useMutation(api.tracking.logSleep);
  const logMoodMutation = useMutation(api.tracking.logMood);

  async function logSleep(data: SleepLogData) {
    setIsLogging(true);
    try {
      const result = await logSleepMutation(data);
      setLastXPAwarded(result.xpAwarded);
      return result;
    } finally {
      setIsLogging(false);
    }
  }

  async function logMood(data: MoodLogData) {
    setIsLogging(true);
    try {
      const result = await logMoodMutation(data);
      setLastXPAwarded(result.xpAwarded);
      return result;
    } finally {
      setIsLogging(false);
    }
  }

  return { logSleep, logMood };
}

export function useRecentLogs() {
  return useQuery(api.tracking.getRecentLogs, {});
}
