import { create } from "zustand";

type GamificationStore = {
  // Pending XP to animate (set after a log, cleared after animation)
  pendingXP: number;
  isAnimatingXP: boolean;
  addPendingXP: (xp: number) => void;
  clearPendingXP: () => void;
  setIsAnimatingXP: (v: boolean) => void;
};

export const useGamificationStore = create<GamificationStore>((set) => ({
  pendingXP: 0,
  isAnimatingXP: false,
  addPendingXP: (xp) => set((s) => ({ pendingXP: s.pendingXP + xp })),
  clearPendingXP: () => set({ pendingXP: 0 }),
  setIsAnimatingXP: (isAnimatingXP) => set({ isAnimatingXP }),
}));
