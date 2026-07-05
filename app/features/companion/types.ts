export type CompanionId = "lumo" | "papillon" | "etoile";

export type CompanionEmotion =
  | "idle"
  | "happy"
  | "excited"
  | "sad"
  | "thinking"
  | "listening"
  | "speaking";

export type CompanionPersonality = {
  id: CompanionId;
  name: string;
  emoji: string;
  description: string;
  color: string;
  personality: "calm" | "energetic" | "nurturing";
  greetings: string[];
  encouragements: string[];
};
