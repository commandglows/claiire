import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useGamificationStore } from "../store";
import { AppDesignTokens } from '@/constants/AppDesignTokens';
import { AppIcon } from "@/components/AppIcon";

export function XPToast() {
  const { pendingXP, clearPendingXP } = useGamificationStore();
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const displayXP = useRef(0);

  useEffect(() => {
    if (pendingXP <= 0) return;
    displayXP.current = pendingXP;
    translateY.setValue(80);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -40, duration: 400, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start(() => clearPendingXP());
    }, 1800);

    return () => clearTimeout(timer);
  }, [pendingXP, translateY, opacity, clearPendingXP]);

  if (pendingXP <= 0) return null;

  return (
    <Animated.View style={[s.container, { transform: [{ translateY }], opacity }]} pointerEvents="none">
      <View style={s.icon}>
        <AppIcon name="zap" color={AppDesignTokens.colors.text} size={AppDesignTokens.icons.sizeSm} />
      </View>
      <Text style={s.text}>+{displayXP.current} XP</Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "absolute",
    top: AppDesignTokens.layout.v60,
    alignSelf: "center",
    backgroundColor: AppDesignTokens.colors.accent,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: AppDesignTokens.layout.v20,
    paddingVertical: AppDesignTokens.layout.v8,
    paddingHorizontal: AppDesignTokens.layout.v20,
    zIndex: AppDesignTokens.layout.v9998,
    shadowColor: AppDesignTokens.colors.accent,
    shadowOffset: { width: AppDesignTokens.layout.v0, height: AppDesignTokens.layout.v4 },
    shadowOpacity: AppDesignTokens.layout.v0p5,
    shadowRadius: AppDesignTokens.layout.v12,
    elevation: AppDesignTokens.layout.v10,
  },
  icon: { marginRight: AppDesignTokens.layout.v6 },
  text: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v18, fontWeight: "900", letterSpacing: AppDesignTokens.layout.v1 },
});
