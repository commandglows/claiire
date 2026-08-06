import { useModeStore } from "./modeStore";
import { getVocab } from "./vocabulary";
import { AppDesignTokens } from "@/constants/AppDesignTokens";

export function useMode() {
  const mode = useModeStore((s) => s.mode);
  const toggle = useModeStore((s) => s.toggle);
  const vocab = getVocab(mode);

  const colors = mode === "warrior"
    ? {
      accent: AppDesignTokens.colors.accent,
      accentLight: AppDesignTokens.colors.accentSoft,
      bg: AppDesignTokens.colors.background,
      card: AppDesignTokens.colors.surface,
      border: AppDesignTokens.colors.border,
    }
    : {
      accent: AppDesignTokens.colors.accentAlt,
      accentLight: AppDesignTokens.colors.accentSoft2,
      bg: AppDesignTokens.colors.zenBg,
      card: AppDesignTokens.colors.zenCard,
      border: AppDesignTokens.colors.zenBorder,
    };

  return { mode, toggle, vocab, colors };
}
