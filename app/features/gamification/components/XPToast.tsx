import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { useGamificationStore } from "../store";

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
      <Text style={s.text}>+{displayXP.current} XP</Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    backgroundColor: "#6c47ff",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    zIndex: 9998,
    shadowColor: "#6c47ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  text: { color: "#fff", fontSize: 18, fontWeight: "900", letterSpacing: 1 },
});
