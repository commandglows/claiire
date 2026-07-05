import { create } from "zustand";

export type CelebrationType = "level_up" | "streak_3" | "streak_7" | "streak_30" | "achievement";

export type CelebrationData = {
  type: CelebrationType;
  title: string;
  subtitle: string;
  emoji: string;
  xpBonus?: number;
};

type CelebrationState = {
  current: CelebrationData | null;
  queue: CelebrationData[];
  show: (data: CelebrationData) => void;
  dismiss: () => void;
};

export const useCelebrationStore = create<CelebrationState>((set, get) => ({
  current: null,
  queue: [],

  show: (data) => {
    const { current } = get();
    if (current) {
      // Queue if one is already showing
      set((s) => ({ queue: [...s.queue, data] }));
    } else {
      set({ current: data });
    }
  },

  dismiss: () => {
    const { queue } = get();
    if (queue.length > 0) {
      // Show next in queue
      const [next, ...rest] = queue;
      set({ current: next, queue: rest });
    } else {
      set({ current: null });
    }
  },
}));
