import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMode } from "@/features/mode";

// ─── Crisis types ────────────────────────────────────────────────────────────

const CRISIS_TYPES = [
  { id: "craving", warrior: "Envie soudaine", zen: "Envie forte", icon: "🔥" },
  { id: "anxiety", warrior: "Attaque d'anxiété", zen: "Anxiété", icon: "😰" },
  { id: "anger", warrior: "Montée de rage", zen: "Colère", icon: "😤" },
  { id: "sadness", warrior: "Vague de tristesse", zen: "Tristesse", icon: "😢" },
  { id: "stress", warrior: "Surcharge", zen: "Stress intense", icon: "💥" },
  { id: "insomnia", warrior: "Nuit blanche", zen: "Insomnie", icon: "🌙" },
  { id: "social", warrior: "Pression sociale", zen: "Pression sociale", icon: "👥" },
  { id: "other", warrior: "Autre ennemi", zen: "Autre", icon: "❓" },
] as const;

const EMOTIONS = [
  { id: "fear", label: "Peur", icon: "😨" },
  { id: "shame", label: "Honte", icon: "😳" },
  { id: "anger", label: "Colère", icon: "😡" },
  { id: "sadness", label: "Tristesse", icon: "😢" },
  { id: "confusion", label: "Confusion", icon: "😵" },
  { id: "numbness", label: "Vide", icon: "😶" },
  { id: "panic", label: "Panique", icon: "😱" },
  { id: "guilt", label: "Culpabilité", icon: "😞" },
] as const;

const TRIGGERS = [
  "Solitude", "Fatigue", "Ennui", "Conflit", "Réseaux sociaux",
  "Alcool", "Travail", "Argent", "Famille", "Souvenir",
] as const;

type InterventionStat = {
  interventionId: string;
  uses: number;
  successRate: number | null;
};

const SUGGESTED_INTERVENTIONS = [
  { id: "breathe", emoji: "🧘", title: "Respiration", desc: "Respiration carrée 4-4-4-4" },
  { id: "cold-water", emoji: "💧", title: "Eau froide", desc: "Poignets sous l'eau froide" },
  { id: "walk", emoji: "🚶", title: "Marche", desc: "5 minutes dehors" },
  { id: "call", emoji: "📞", title: "Appeler", desc: "Quelqu'un de confiance" },
  { id: "write", emoji: "✏️", title: "Écrire", desc: "Note ce qui se passe" },
  { id: "distraction", emoji: "🎮", title: "Diversion", desc: "Change-toi les idées" },
];

// ─── Steps ───────────────────────────────────────────────────────────────────

type Step = "type" | "intensity" | "details" | "result";

export default function BattleReportModal() {
  const router = useRouter();
  const { mode } = useMode();
  const logCrisis = useMutation(api.tracking.logCrisis);
  const interventionStats = (useQuery(api.interventions.getStats, {}) ?? []) as InterventionStat[];

  const [step, setStep] = useState<Step>("type");
  const [crisisType, setCrisisType] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [xpResult, setXpResult] = useState(0);

  async function handleLog() {
    try {
      const result = await logCrisis({
        intensity,
        trigger: trigger ?? undefined,
        context: crisisType ?? undefined,
        notes: notes || undefined,
      });
      setXpResult(result.xpAwarded);
      setStep("result");
    } catch {
      // fallback
      setStep("result");
    }
  }

  // Get top 3 suggested interventions sorted by success rate
  const suggested = [...SUGGESTED_INTERVENTIONS]
    .map((item) => {
      const stat = interventionStats.find((s) => s.interventionId === item.id);
      return { ...item, successRate: stat?.successRate ?? null, uses: stat?.uses ?? 0 };
    })
    .sort((a, b) => (b.successRate ?? -1) - (a.successRate ?? -1))
    .slice(0, 3);

  const isWarrior = mode === "warrior";

  // ─── Step: Type ──────────────────────────────────────────────────────────

  if (step === "type") {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={s.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={s.stepLabel}>1/3</Text>
        </View>
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.title}>
            {isWarrior ? "Type d'attaque" : "Que se passe-t-il ?"}
          </Text>
          <Text style={s.subtitle}>
            {isWarrior ? "Identifie l'ennemi" : "Choisis ce qui te correspond"}
          </Text>
          <View style={s.grid}>
            {CRISIS_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[s.typeCard, crisisType === type.id && s.typeCardSelected]}
                onPress={() => {
                  setCrisisType(type.id);
                  setStep("intensity");
                }}
              >
                <Text style={s.typeIcon}>{type.icon}</Text>
                <Text style={[s.typeLabel, crisisType === type.id && s.typeLabelSelected]}>
                  {isWarrior ? type.warrior : type.zen}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Step: Intensity ─────────────────────────────────────────────────────

  if (step === "intensity") {
    const intensityColor =
      intensity <= 3 ? "#2f9e44" : intensity <= 6 ? "#f59f00" : "#e03131";

    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setStep("type")}>
            <Text style={s.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={s.stepLabel}>2/3</Text>
        </View>
        <View style={s.centerContent}>
          <Text style={s.title}>
            {isWarrior ? "Dégâts subis" : "Intensité"}
          </Text>

          <View style={s.intensityCircle}>
            <Text style={[s.intensityValue, { color: intensityColor }]}>
              {intensity}
            </Text>
            <Text style={s.intensityMax}>/10</Text>
          </View>

          <View style={s.intensityRow}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  s.intensityDot,
                  val <= intensity && { backgroundColor: intensityColor },
                ]}
                onPress={() => setIntensity(val)}
              >
                <Text style={s.intensityDotText}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={s.nextButton}
            onPress={() => setStep("details")}
          >
            <Text style={s.nextButtonText}>Suivant</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.skipDetails} onPress={handleLog}>
            <Text style={s.skipDetailsText}>Logger maintenant (sans détails)</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Step: Details (optional) ────────────────────────────────────────────

  if (step === "details") {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setStep("intensity")}>
            <Text style={s.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={s.stepLabel}>3/3</Text>
        </View>
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.title}>
            {isWarrior ? "Renseignements" : "Détails (optionnel)"}
          </Text>

          {/* Emotion */}
          <Text style={s.sectionLabel}>
            {isWarrior ? "Ton état" : "Comment tu te sens"}
          </Text>
          <View style={s.chipRow}>
            {EMOTIONS.map((e) => (
              <TouchableOpacity
                key={e.id}
                style={[s.chip, emotion === e.id && s.chipSelected]}
                onPress={() => setEmotion(emotion === e.id ? null : e.id)}
              >
                <Text style={s.chipIcon}>{e.icon}</Text>
                <Text style={[s.chipLabel, emotion === e.id && s.chipLabelSelected]}>
                  {e.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Trigger */}
          <Text style={s.sectionLabel}>
            {isWarrior ? "Arme de l'ennemi" : "Déclencheur"}
          </Text>
          <View style={s.chipRow}>
            {TRIGGERS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[s.chip, trigger === t && s.chipSelected]}
                onPress={() => setTrigger(trigger === t ? null : t)}
              >
                <Text style={[s.chipLabel, trigger === t && s.chipLabelSelected]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Notes */}
          <Text style={s.sectionLabel}>
            {isWarrior ? "Débrief" : "Notes"}
          </Text>
          <TextInput
            style={s.notesInput}
            placeholder="Ce qui s'est passé..."
            placeholderTextColor="#555"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity style={s.logButton} onPress={handleLog}>
            <Text style={s.logButtonText}>
              {isWarrior ? "Rapport envoyé" : "Logger"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Step: Result ────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={s.container}>
      <View style={s.resultContainer}>
        <Text style={s.resultEmoji}>⚔️</Text>
        <Text style={s.resultTitle}>
          {isWarrior ? "Rapport de bataille enregistré" : "Moment enregistré"}
        </Text>
        <Text style={s.resultXP}>+{xpResult} XP</Text>

        {/* Counter-attack suggestion */}
        <Text style={s.counterTitle}>
          {isWarrior ? "Veux-tu contre-attaquer ?" : "Besoin d'un outil ?"}
        </Text>

        <View style={s.suggestionList}>
          {suggested.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={s.suggestionCard}
              onPress={() => {
                router.back();
                setTimeout(() => {
                  router.push("/modal/crisis-support" as never);
                }, 300);
              }}
            >
              <Text style={s.suggestionEmoji}>{item.emoji}</Text>
              <View style={s.suggestionInfo}>
                <Text style={s.suggestionTitle}>{item.title}</Text>
                <Text style={s.suggestionDesc}>{item.desc}</Text>
              </View>
              {item.successRate !== null && (
                <Text style={s.suggestionRate}>
                  {Math.round(item.successRate * 100)}%
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={s.doneButton}
          onPress={() => router.back()}
        >
          <Text style={s.doneButtonText}>
            {isWarrior ? "Ça va, merci" : "Fermer"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeText: { color: "#888", fontSize: 18, padding: 4 },
  backText: { color: "#6c47ff", fontSize: 24, fontWeight: "600", padding: 4 },
  stepLabel: { color: "#555", fontSize: 13, fontWeight: "600" },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  centerContent: { flex: 1, padding: 20, alignItems: "center", justifyContent: "center", gap: 24 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  subtitle: { color: "#888", fontSize: 14, marginTop: -8 },

  // Type grid
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeCard: {
    width: "47%",
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  typeCardSelected: { borderColor: "#e03131", backgroundColor: "#1a1020" },
  typeIcon: { fontSize: 32 },
  typeLabel: { color: "#ccc", fontSize: 13, fontWeight: "500", textAlign: "center" },
  typeLabelSelected: { color: "#fff", fontWeight: "700" },

  // Intensity
  intensityCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#2a2a4a",
  },
  intensityValue: { fontSize: 42, fontWeight: "900" },
  intensityMax: { color: "#555", fontSize: 14, marginTop: -4 },
  intensityRow: { flexDirection: "row", gap: 6 },
  intensityDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  intensityDotText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  nextButton: {
    backgroundColor: "#6c47ff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  nextButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  skipDetails: { paddingVertical: 8 },
  skipDetailsText: { color: "#555", fontSize: 13 },

  // Details
  sectionLabel: { color: "#888", fontSize: 13, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  chipSelected: { borderColor: "#6c47ff", backgroundColor: "#1a1a3e" },
  chipIcon: { fontSize: 16 },
  chipLabel: { color: "#888", fontSize: 13, fontWeight: "500" },
  chipLabelSelected: { color: "#fff" },
  notesInput: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#2a2a4a",
    minHeight: 80,
    textAlignVertical: "top",
  },
  logButton: {
    backgroundColor: "#e03131",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  logButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // Result
  resultContainer: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  resultEmoji: { fontSize: 48 },
  resultTitle: { color: "#fff", fontSize: 18, fontWeight: "700", textAlign: "center" },
  resultXP: { color: "#6c47ff", fontSize: 28, fontWeight: "900" },
  counterTitle: {
    color: "#f59f00",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 16,
  },
  suggestionList: { width: "100%", gap: 8, marginTop: 4 },
  suggestionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  suggestionEmoji: { fontSize: 24 },
  suggestionInfo: { flex: 1, gap: 2 },
  suggestionTitle: { color: "#fff", fontSize: 14, fontWeight: "600" },
  suggestionDesc: { color: "#888", fontSize: 12 },
  suggestionRate: { color: "#2f9e44", fontSize: 12, fontWeight: "700" },
  doneButton: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  doneButtonText: { color: "#888", fontSize: 14, fontWeight: "600" },
});
