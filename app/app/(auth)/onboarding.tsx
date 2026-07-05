import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { CompanionId } from "@/features/companion/types";
import { useCompanionStore } from "@/features/companion/store";
import { useModeStore, type AppMode } from "@/features/mode";

// ─── Data ────────────────────────────────────────────────────────────────────

type CompanionCard = {
  id: CompanionId;
  name: string;
  emoji: string;
  description: string;
  tagline: string;
  color: string;
};

const COMPANIONS: CompanionCard[] = [
  {
    id: "lumo",
    name: "Lumo",
    emoji: "✨",
    description: "Sage et douce, elle guide avec calme et introspection",
    tagline: "Pour ceux qui cherchent la paix intérieure",
    color: "#6c47ff",
  },
  {
    id: "papillon",
    name: "Papillon",
    emoji: "🦋",
    description: "Énergique et motivant, il célèbre chaque victoire avec toi",
    tagline: "Pour ceux qui ont besoin d'être propulsés",
    color: "#f59f00",
  },
  {
    id: "etoile",
    name: "Étoile",
    emoji: "⭐",
    description: "Empathique et bienveillante, elle comprend ta douleur",
    tagline: "Pour ceux qui ont besoin d'être compris",
    color: "#74c0fc",
  },
];

const STARTER_GOALS = [
  { id: "quit-smoking", label: "Arrêter de fumer", icon: "🚭", difficulty: "hard" as const },
  { id: "reduce-alcohol", label: "Réduire l'alcool", icon: "🍷", difficulty: "hard" as const },
  { id: "better-sleep", label: "Mieux dormir", icon: "😴", difficulty: "medium" as const },
  { id: "manage-anxiety", label: "Gérer l'anxiété", icon: "🧘", difficulty: "medium" as const },
  { id: "exercise", label: "Bouger plus", icon: "🏃", difficulty: "easy" as const },
  { id: "meditate", label: "Méditer chaque jour", icon: "🧠", difficulty: "easy" as const },
  { id: "eat-better", label: "Manger sainement", icon: "🥗", difficulty: "medium" as const },
  { id: "reduce-stress", label: "Réduire le stress", icon: "💆", difficulty: "medium" as const },
] as const;

const XP_MAP = { easy: 15, medium: 20, hard: 30 };

type Step = "welcome" | "companion" | "mode" | "goal" | "name" | "ready";

// ─── Fade wrapper ────────────────────────────────────────────────────────────

function FadeIn({ children }: { children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [opacity]);
  return <Animated.View style={{ opacity, flex: 1 }}>{children}</Animated.View>;
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const router = useRouter();
  const setCompanionId = useCompanionStore((s) => s.setCompanionId);
  const setMode = useModeStore((s) => s.setMode);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const createHabit = useMutation(api.habits.createHabit);

  const [step, setStep] = useState<Step>("welcome");
  const [selectedId, setSelectedId] = useState<CompanionId | null>(null);
  const [selectedMode, setSelectedMode] = useState<AppMode>("warrior");
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set());
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleGoal(id: string) {
    setSelectedGoals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id); // max 3 free
      return next;
    });
  }

  async function handleFinish() {
    if (!selectedId) return;
    setLoading(true);
    try {
      await completeOnboarding({
        companionId: selectedId,
        displayName: displayName.trim() || undefined,
      });

      // Create habits from selected goals
      for (const goalId of selectedGoals) {
        const goal = STARTER_GOALS.find((g) => g.id === goalId);
        if (goal) {
          await createHabit({
            name: goal.label,
            icon: goal.icon,
            difficulty: goal.difficulty,
            targetFrequency: "daily",
          });
        }
      }

      setCompanionId(selectedId);
      setMode(selectedMode);
      router.replace("/(tabs)");
    } catch {
      // silent — try again
      setLoading(false);
    }
  }

  const companionData = COMPANIONS.find((c) => c.id === selectedId);
  const isWarrior = selectedMode === "warrior";

  // ─── Step: Welcome ─────────────────────────────────────────────────────

  if (step === "welcome") {
    return (
      <SafeAreaView style={s.container}>
        <FadeIn>
          <View style={s.centerContent}>
            <Text style={s.welcomeEmoji}>💜</Text>
            <Text style={s.welcomeTitle}>Claiire</Text>
            <Text style={s.welcomeTagline}>
              Ton compagnon de bien-être{"\n"}qui se bat à tes côtés
            </Text>
            <View style={s.featureList}>
              <Text style={s.featureItem}>🎯 Suis tes habitudes et ton humeur</Text>
              <Text style={s.featureItem}>🤖 Un compagnon IA qui te connaît</Text>
              <Text style={s.featureItem}>⚔️ Transforme le changement en jeu</Text>
              <Text style={s.featureItem}>🔒 100% privé, IA sur ton appareil</Text>
            </View>
            <TouchableOpacity style={s.primaryButton} onPress={() => setStep("companion")}>
              <Text style={s.primaryButtonText}>Commencer →</Text>
            </TouchableOpacity>
          </View>
        </FadeIn>
      </SafeAreaView>
    );
  }

  // ─── Step: Companion ───────────────────────────────────────────────────

  if (step === "companion") {
    return (
      <SafeAreaView style={s.container}>
        <FadeIn>
          <View style={s.stepHeader}>
            <Text style={s.stepCount}>1/4</Text>
            <View style={s.progressBar}>
              <View style={[s.progressFill, { width: "25%" }]} />
            </View>
          </View>
          <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
            <Text style={s.title}>Choisis ton compagnon</Text>
            <Text style={s.subtitle}>
              Il sera à tes côtés dans chaque bataille. Tu pourras en changer plus tard.
            </Text>
            <View style={s.cards}>
              {COMPANIONS.map((c) => {
                const selected = selectedId === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[s.card, { borderColor: selected ? c.color : "#2a2a4a" }]}
                    onPress={() => setSelectedId(c.id)}
                    activeOpacity={0.8}
                  >
                    <View style={s.cardLeft}>
                      <Text style={s.cardEmoji}>{c.emoji}</Text>
                    </View>
                    <View style={s.cardContent}>
                      <View style={s.cardNameRow}>
                        <Text style={[s.cardName, selected && { color: c.color }]}>{c.name}</Text>
                        {selected && (
                          <View style={[s.checkBadge, { backgroundColor: c.color }]}>
                            <Text style={s.checkMark}>✓</Text>
                          </View>
                        )}
                      </View>
                      <Text style={s.cardDescription}>{c.description}</Text>
                      <Text style={[s.cardTagline, { color: c.color }]}>{c.tagline}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={[s.primaryButton, !selectedId && s.buttonDisabled]}
              onPress={() => setStep("mode")}
              disabled={!selectedId}
            >
              <Text style={s.primaryButtonText}>Suivant →</Text>
            </TouchableOpacity>
          </ScrollView>
        </FadeIn>
      </SafeAreaView>
    );
  }

  // ─── Step: Mode ────────────────────────────────────────────────────────

  if (step === "mode") {
    return (
      <SafeAreaView style={s.container}>
        <FadeIn>
          <View style={s.stepHeader}>
            <TouchableOpacity onPress={() => setStep("companion")}>
              <Text style={s.backText}>‹</Text>
            </TouchableOpacity>
            <Text style={s.stepCount}>2/4</Text>
            <View style={s.progressBar}>
              <View style={[s.progressFill, { width: "50%" }]} />
            </View>
          </View>
          <View style={s.centerContent}>
            <Text style={s.title}>Ton style</Text>
            <Text style={s.subtitle}>
              Même app, deux ambiances. Change quand tu veux.
            </Text>
            <View style={s.modeRow}>
              <TouchableOpacity
                style={[s.modeCard, selectedMode === "warrior" && { borderColor: "#6c47ff" }]}
                onPress={() => setSelectedMode("warrior")}
              >
                <Text style={s.modeEmoji}>⚔️</Text>
                <Text style={[s.modeName, selectedMode === "warrior" && { color: "#6c47ff" }]}>
                  Warrior
                </Text>
                <Text style={s.modeDesc}>Missions, combats,{"\n"}XP, victoires</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.modeCard, selectedMode === "zen" && { borderColor: "#3b82f6" }]}
                onPress={() => setSelectedMode("zen")}
              >
                <Text style={s.modeEmoji}>🧘</Text>
                <Text style={[s.modeName, selectedMode === "zen" && { color: "#3b82f6" }]}>
                  Zen
                </Text>
                <Text style={s.modeDesc}>Habitudes, journal,{"\n"}sérénité, progrès</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={s.primaryButton} onPress={() => setStep("goal")}>
              <Text style={s.primaryButtonText}>Suivant →</Text>
            </TouchableOpacity>
          </View>
        </FadeIn>
      </SafeAreaView>
    );
  }

  // ─── Step: Goal ────────────────────────────────────────────────────────

  if (step === "goal") {
    return (
      <SafeAreaView style={s.container}>
        <FadeIn>
          <View style={s.stepHeader}>
            <TouchableOpacity onPress={() => setStep("mode")}>
              <Text style={s.backText}>‹</Text>
            </TouchableOpacity>
            <Text style={s.stepCount}>3/4</Text>
            <View style={s.progressBar}>
              <View style={[s.progressFill, { width: "75%" }]} />
            </View>
          </View>
          <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
            <Text style={s.title}>
              {isWarrior ? "Tes premières missions" : "Tes premiers objectifs"}
            </Text>
            <Text style={s.subtitle}>
              Choisis jusqu'à 3 {isWarrior ? "combats" : "habitudes"} pour commencer.
              Tu pourras en ajouter d'autres après.
            </Text>
            <View style={s.goalGrid}>
              {STARTER_GOALS.map((goal) => {
                const selected = selectedGoals.has(goal.id);
                return (
                  <TouchableOpacity
                    key={goal.id}
                    style={[s.goalChip, selected && s.goalChipSelected]}
                    onPress={() => toggleGoal(goal.id)}
                  >
                    <Text style={s.goalIcon}>{goal.icon}</Text>
                    <Text style={[s.goalLabel, selected && s.goalLabelSelected]}>
                      {goal.label}
                    </Text>
                    {selected && (
                      <Text style={s.goalXP}>+{XP_MAP[goal.difficulty]}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={s.goalCount}>
              {selectedGoals.size}/3 {isWarrior ? "missions" : "habitudes"} sélectionnées
            </Text>
            <TouchableOpacity style={s.primaryButton} onPress={() => setStep("name")}>
              <Text style={s.primaryButtonText}>
                {selectedGoals.size > 0 ? "Suivant →" : "Passer"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </FadeIn>
      </SafeAreaView>
    );
  }

  // ─── Step: Name + Ready ────────────────────────────────────────────────

  if (step === "name") {
    return (
      <SafeAreaView style={s.container}>
        <FadeIn>
          <View style={s.stepHeader}>
            <TouchableOpacity onPress={() => setStep("goal")}>
              <Text style={s.backText}>‹</Text>
            </TouchableOpacity>
            <Text style={s.stepCount}>4/4</Text>
            <View style={s.progressBar}>
              <View style={[s.progressFill, { width: "100%" }]} />
            </View>
          </View>
          <View style={s.centerContent}>
            <Text style={s.title}>Comment t'appeler ?</Text>
            <TextInput
              style={s.input}
              placeholder="Ton prénom (optionnel)"
              placeholderTextColor="#555"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              autoComplete="given-name"
              maxLength={30}
            />

            {/* Companion greeting preview */}
            {companionData && (
              <View style={[s.previewBox, { borderLeftColor: companionData.color }]}>
                <Text style={s.previewEmoji}>{companionData.emoji}</Text>
                <Text style={s.previewText}>
                  "{displayName.trim()
                    ? `Bonjour, ${displayName.trim()}`
                    : "Bonjour, guerrier"
                  }. Je suis {companionData.name}. Ensemble, on va transformer ta vie."
                </Text>
              </View>
            )}

            <TouchableOpacity style={s.primaryButton} onPress={() => setStep("ready")}>
              <Text style={s.primaryButtonText}>Voir le résumé</Text>
            </TouchableOpacity>
          </View>
        </FadeIn>
      </SafeAreaView>
    );
  }

  // ─── Step: Ready ───────────────────────────────────────────────────────

  return (
    <SafeAreaView style={s.container}>
      <FadeIn>
        <View style={s.centerContent}>
          <Text style={s.readyEmoji}>{companionData?.emoji ?? "💜"}</Text>
          <Text style={s.readyTitle}>Tout est prêt !</Text>

          <View style={s.summaryCard}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Compagnon</Text>
              <Text style={s.summaryValue}>{companionData?.name}</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Mode</Text>
              <Text style={s.summaryValue}>
                {selectedMode === "warrior" ? "⚔️ Warrior" : "🧘 Zen"}
              </Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>{isWarrior ? "Missions" : "Habitudes"}</Text>
              <Text style={s.summaryValue}>{selectedGoals.size}</Text>
            </View>
            {displayName.trim() ? (
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Nom</Text>
                <Text style={s.summaryValue}>{displayName.trim()}</Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={s.launchButton}
            onPress={handleFinish}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.launchButtonText}>
                {isWarrior ? "En avant, guerrier ! ⚔️" : "C'est parti ! 🌿"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </FadeIn>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  content: { padding: 24, gap: 16, paddingBottom: 40 },
  centerContent: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  stepCount: { color: "#555", fontSize: 13, fontWeight: "600" },
  backText: { color: "#6c47ff", fontSize: 24, fontWeight: "600", paddingRight: 8 },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#1a1a2e",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#6c47ff", borderRadius: 2 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center" },
  subtitle: { color: "#888", fontSize: 14, textAlign: "center", lineHeight: 20, paddingHorizontal: 16 },

  // Welcome
  welcomeEmoji: { fontSize: 64 },
  welcomeTitle: { fontSize: 36, fontWeight: "900", color: "#fff", letterSpacing: 2 },
  welcomeTagline: { color: "#888", fontSize: 16, textAlign: "center", lineHeight: 24 },
  featureList: { gap: 12, marginTop: 16, alignSelf: "stretch", paddingHorizontal: 16 },
  featureItem: { color: "#ccc", fontSize: 15, lineHeight: 22 },

  // Primary button
  primaryButton: {
    backgroundColor: "#6c47ff",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.4 },
  primaryButtonText: { color: "#fff", fontSize: 17, fontWeight: "700" },

  // Companion cards
  cards: { gap: 12 },
  card: {
    flexDirection: "row",
    backgroundColor: "#13131f",
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    gap: 14,
    alignItems: "center",
  },
  cardLeft: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  cardEmoji: { fontSize: 28 },
  cardContent: { flex: 1, gap: 4 },
  cardNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardName: { fontSize: 17, fontWeight: "700", color: "#fff" },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  cardDescription: { fontSize: 13, color: "#888", lineHeight: 18 },
  cardTagline: { fontSize: 12, fontWeight: "500" },

  // Mode
  modeRow: { flexDirection: "row", gap: 12, alignSelf: "stretch" },
  modeCard: {
    flex: 1,
    backgroundColor: "#13131f",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#2a2a4a",
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  modeEmoji: { fontSize: 36 },
  modeName: { fontSize: 18, fontWeight: "700", color: "#fff" },
  modeDesc: { fontSize: 12, color: "#888", textAlign: "center", lineHeight: 18 },

  // Goals
  goalGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  goalChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  goalChipSelected: { borderColor: "#6c47ff", backgroundColor: "#1a1a3e" },
  goalIcon: { fontSize: 20 },
  goalLabel: { color: "#888", fontSize: 14, fontWeight: "500" },
  goalLabelSelected: { color: "#fff" },
  goalXP: { color: "#6c47ff", fontSize: 12, fontWeight: "700" },
  goalCount: { color: "#555", fontSize: 13, textAlign: "center" },

  // Name
  input: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2a2a4a",
    alignSelf: "stretch",
  },
  previewBox: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    alignSelf: "stretch",
  },
  previewEmoji: { fontSize: 32 },
  previewText: { flex: 1, color: "#aaa", fontSize: 14, fontStyle: "italic", lineHeight: 20 },

  // Ready
  readyEmoji: { fontSize: 64 },
  readyTitle: { fontSize: 28, fontWeight: "900", color: "#fff" },
  summaryCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    padding: 20,
    gap: 14,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { color: "#888", fontSize: 14 },
  summaryValue: { color: "#fff", fontSize: 15, fontWeight: "600" },
  launchButton: {
    backgroundColor: "#6c47ff",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    alignSelf: "stretch",
    shadowColor: "#6c47ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  launchButtonText: { color: "#fff", fontSize: 18, fontWeight: "800" },
});
