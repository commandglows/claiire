import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCelebrationStore } from "../store/celebrationStore";
import { useCompanion } from "@/features/companion/hooks/useCompanion";

const { width, height } = Dimensions.get("window");

const COMPANION_MESSAGES: Record<string, string[]> = {
  level_up: [
    "Tu montes en puissance !",
    "Nouveau niveau, nouvelles victoires !",
    "Tu es de plus en plus fort !",
  ],
  streak_3: [
    "3 jours d'affilée ! Le début de quelque chose de grand.",
    "La constance paie. Continue !",
  ],
  streak_7: [
    "Une semaine complète ! Tu es une machine !",
    "7 jours ! Tes ennemis tremblent.",
  ],
  streak_30: [
    "30 JOURS. Tu es légendaire.",
    "Un mois entier. Tu as prouvé que tu peux tout vaincre.",
  ],
  achievement: [
    "Nouveau badge débloqué !",
    "Tu l'as mérité. Bravo !",
  ],
};

function getCompanionMsg(type: string): string {
  const msgs = COMPANION_MESSAGES[type] ?? COMPANION_MESSAGES.achievement;
  return msgs[Math.floor(Math.random() * msgs.length)];
}

// Particle positions for confetti effect
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    delay: Math.random() * 600,
    emoji: ["✨", "⭐", "🎉", "💜", "🔥", "💫"][i % 6],
  }));
}

function Particle({ x, delay, emoji }: { x: number; delay: number; emoji: string }) {
  const translateY = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height * 0.6,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.delay(1200),
          Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, [translateY, opacity, delay]);

  return (
    <Animated.Text
      style={[
        styles.particle,
        {
          left: x,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
}

export function CelebrationOverlay() {
  const { current, dismiss } = useCelebrationStore();
  const { personality } = useCompanion();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (current) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(bgOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      scaleAnim.setValue(0);
      bgOpacity.setValue(0);
    }
  }, [current, scaleAnim, bgOpacity]);

  function handleDismiss() {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bgOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => dismiss());
  }

  if (!current) return null;

  const particles = generateParticles(12);
  const companionName = personality?.name ?? "Compagnon";
  const companionMsg = getCompanionMsg(current.type);

  return (
    <Animated.View style={[styles.overlay, { opacity: bgOpacity }]}>
      {/* Confetti particles */}
      {particles.map((p) => (
        <Particle key={p.id} x={p.x} delay={p.delay} emoji={p.emoji} />
      ))}

      <TouchableOpacity
        style={styles.touchArea}
        activeOpacity={1}
        onPress={handleDismiss}
      >
        <Animated.View
          style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={styles.emoji}>{current.emoji}</Text>
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.subtitle}>{current.subtitle}</Text>

          {current.xpBonus && current.xpBonus > 0 && (
            <Text style={styles.xpBonus}>+{current.xpBonus} XP</Text>
          )}

          <View style={styles.companionBubble}>
            <Text style={styles.companionText}>
              {companionName} : "{companionMsg}"
            </Text>
          </View>

          <Text style={styles.tapHint}>Tap pour continuer</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 20, 0.85)",
    zIndex: 9999,
  },
  particle: {
    position: "absolute",
    fontSize: 20,
  },
  touchArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    gap: 12,
    marginHorizontal: 32,
    borderWidth: 2,
    borderColor: "#6c47ff",
    shadowColor: "#6c47ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  emoji: { fontSize: 56 },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: "#a78bfa",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  xpBonus: {
    color: "#6c47ff",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4,
  },
  companionBubble: {
    backgroundColor: "#13131f",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#6c47ff30",
  },
  companionText: {
    color: "#888",
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 18,
  },
  tapHint: {
    color: "#444",
    fontSize: 12,
    marginTop: 8,
  },
});
