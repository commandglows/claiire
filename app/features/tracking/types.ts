export type MoodEmotion =
  | "anger"
  | "anxiety"
  | "sadness"
  | "neutral"
  | "happy"
  | "excited";

export const MOOD_EMOTIONS: { id: MoodEmotion; emoji: string; label: string }[] =
  [
    { id: "anger", emoji: "😡", label: "Colère" },
    { id: "anxiety", emoji: "😰", label: "Anxiété" },
    { id: "sadness", emoji: "😢", label: "Tristesse" },
    { id: "neutral", emoji: "😐", label: "Neutre" },
    { id: "happy", emoji: "😊", label: "Bien" },
    { id: "excited", emoji: "🌟", label: "Excellent" },
  ];

export type SleepLogData = {
  hoursSlept: number; // 0–12, step 0.5
  quality: number; // 1–5
  bedtime?: string; // "HH:MM"
  wakeTime?: string; // "HH:MM"
  notes?: string;
};

export type MoodLogData = {
  intensity: number; // 1–10
  emotion: MoodEmotion;
  trigger?: string;
  context?: string;
  notes?: string;
};

export type CrisisLogData = {
  intensity: number; // 1–10 ("damage taken")
  trigger?: string;
  context?: string;
  notes?: string;
};

export type HabitLogData = {
  habitDefinitionId: string;
  completed: boolean;
  notes?: string;
};
