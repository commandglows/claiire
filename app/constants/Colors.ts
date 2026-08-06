import { AppDesignTokens } from "@/constants/AppDesignTokens";

const tintColorLight = AppDesignTokens.colors.accentAlt;
const tintColorDark = AppDesignTokens.colors.text;

export default {
  light: {
    text: AppDesignTokens.colors.textInverse,
    background: AppDesignTokens.colors.text,
    tint: tintColorLight,
    tabIconDefault: AppDesignTokens.colors.neutralBorder,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: AppDesignTokens.colors.text,
    background: AppDesignTokens.colors.textInverse,
    tint: tintColorDark,
    tabIconDefault: AppDesignTokens.colors.neutralBorder,
    tabIconSelected: tintColorDark,
  },
};
