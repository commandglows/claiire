import { useModeStore } from "./modeStore";
import { getVocab } from "./vocabulary";

export function useMode() {
  const mode = useModeStore((s) => s.mode);
  const toggle = useModeStore((s) => s.toggle);
  const vocab = getVocab(mode);

  const colors = mode === "warrior"
    ? { accent: "#6c47ff", accentLight: "#a78bfa", bg: "#0f0f1a", card: "#1a1a2e", border: "#2a2a4a" }
    : { accent: "#3b82f6", accentLight: "#93c5fd", bg: "#0a1628", card: "#132035", border: "#1e3a5f" };

  return { mode, toggle, vocab, colors };
}
