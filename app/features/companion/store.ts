import { create } from "zustand";
import type { CompanionEmotion, CompanionId } from "./types";

type CompanionStore = {
  companionId: CompanionId | null;
  emotion: CompanionEmotion;
  isListening: boolean;
  isSpeaking: boolean;
  setCompanionId: (id: CompanionId | null) => void;
  setEmotion: (emotion: CompanionEmotion) => void;
  setIsListening: (v: boolean) => void;
  setIsSpeaking: (v: boolean) => void;
};

export const useCompanionStore = create<CompanionStore>((set) => ({
  companionId: null,
  emotion: "idle",
  isListening: false,
  isSpeaking: false,
  setCompanionId: (companionId) => set({ companionId }),
  setEmotion: (emotion) => set({ emotion }),
  setIsListening: (isListening) => set({ isListening }),
  setIsSpeaking: (isSpeaking) => set({ isSpeaking }),
}));
