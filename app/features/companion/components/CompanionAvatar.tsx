import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type { CompanionEmotion, CompanionId } from "../types";

const COMPANION_CONFIG: Record<
  CompanionId,
  { emoji: string; color: string; name: string }
> = {
  lumo: { emoji: "✨", color: "#6c47ff", name: "Lumo" },
  papillon: { emoji: "🦋", color: "#f59f00", name: "Papillon" },
  etoile: { emoji: "⭐", color: "#74c0fc", name: "Étoile" },
};

export type CompanionAvatarProps = {
  companionId: CompanionId;
  emotion?: CompanionEmotion;
  size?: number;
  showName?: boolean;
};

export function CompanionAvatar({
  companionId,
  emotion = "idle",
  size = 120,
  showName = false,
}: CompanionAvatarProps) {
  const config = COMPANION_CONFIG[companionId];
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Breathing animation when idle or listening
  useEffect(() => {
    if (emotion === "idle" || emotion === "listening") {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      );
    } else if (emotion === "excited") {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 300 }),
          withTiming(1.0, { duration: 300 }),
        ),
        4,
        false,
      );
    } else if (emotion === "thinking") {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 800 }),
          withTiming(1.0, { duration: 800 }),
        ),
        -1,
        false,
      );
    } else {
      scale.value = withTiming(1.0, { duration: 300 });
      opacity.value = withTiming(1.0, { duration: 300 });
    }
  }, [emotion, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.avatarCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: config.color,
            shadowColor: config.color,
          },
          animatedStyle,
        ]}
      >
        <Text style={{ fontSize: size * 0.42 }}>{config.emoji}</Text>
      </Animated.View>
      {showName && (
        <Text style={[styles.name, { color: config.color }]}>{config.name}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
  },
  avatarCircle: {
    backgroundColor: "#1a1a2e",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
});
