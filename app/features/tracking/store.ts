import { create } from "zustand";

type TrackingStore = {
  isLogging: boolean;
  lastXPAwarded: number | null;
  setIsLogging: (v: boolean) => void;
  setLastXPAwarded: (xp: number) => void;
  clearLastXP: () => void;
};

export const useTrackingStore = create<TrackingStore>((set) => ({
  isLogging: false,
  lastXPAwarded: null,
  setIsLogging: (isLogging) => set({ isLogging }),
  setLastXPAwarded: (xp) => set({ lastXPAwarded: xp }),
  clearLastXP: () => set({ lastXPAwarded: null }),
}));
