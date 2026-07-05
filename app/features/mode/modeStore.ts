import { create } from "zustand";

export type AppMode = "warrior" | "zen";

type ModeStore = {
  mode: AppMode;
  toggle: () => void;
  setMode: (mode: AppMode) => void;
};

export const useModeStore = create<ModeStore>((set) => ({
  mode: "warrior",
  toggle: () => set((s) => ({ mode: s.mode === "warrior" ? "zen" : "warrior" })),
  setMode: (mode) => set({ mode }),
}));
