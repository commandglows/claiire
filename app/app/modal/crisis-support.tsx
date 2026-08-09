import { useState, useEffect, useRef } from "react";
import { AppDesignTokens } from '@/constants/AppDesignTokens';
import {
  Animated,
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
import type { Id } from "@/convex/_generated/dataModel";
import { AppIcon, type AppIconName } from "@/components/AppIcon";

// ─── Breathing Guide ─────────────────────────────────────────────────────────

const PHASES = [
  { label: "Inspire", duration: 4000, color: AppDesignTokens.colors.accent },
  { label: "Retiens", duration: 4000, color: AppDesignTokens.colors.warning },
  { label: "Expire", duration: 4000, color: AppDesignTokens.colors.accentSoft2 },
  { label: "Attends", duration: 4000, color: AppDesignTokens.colors.textSubtle },
] as const;

function BreathingGuide() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(4);
  const [running, setRunning] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phase = PHASES[phaseIdx];

  function startBreathing() {
    setRunning(true);
    setPhaseIdx(0);
    setCount(4);
  }

  function stopBreathing() {
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  }

  useEffect(() => {
    if (!running) return;

    const targetScale = phaseIdx === 0 ? 1.5 : phaseIdx === 2 ? 0.8 : phaseIdx === 1 ? 1.5 : 0.8;
    Animated.timing(scale, {
      toValue: targetScale,
      duration: 800,
      useNativeDriver: true,
    }).start();

    setCount(4);
    timerRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setPhaseIdx((p) => (p + 1) % 4);
          return 4;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phaseIdx, running, scale]);

  return (
    <View style={breathing.container}>
      <Text style={breathing.title}>Respiration carrée 4-4-4-4</Text>
      <View style={breathing.circleWrapper}>
        <Animated.View
          style={[
            breathing.circle,
            {
              transform: [{ scale }],
              borderColor: running ? phase.color : AppDesignTokens.colors.border,
              shadowColor: running ? phase.color : "transparent",
            },
          ]}
        >
          <Text style={breathing.countText}>{running ? count : "●"}</Text>
          <Text style={[breathing.phaseText, { color: running ? phase.color : AppDesignTokens.colors.textSubtle }]}>
            {running ? phase.label : "Prêt"}
          </Text>
        </Animated.View>
      </View>
      <TouchableOpacity
        style={[breathing.button, { backgroundColor: running ? AppDesignTokens.colors.dangerAlt : AppDesignTokens.colors.accent }]}
        onPress={running ? stopBreathing : startBreathing}
      >
        <Text style={breathing.buttonText}>
          {running ? "Arrêter" : "Commencer"}
        </Text>
      </TouchableOpacity>
      {!running && (
        <Text style={breathing.hint}>
          Inspire 4s · Retiens 4s · Expire 4s · Attends 4s
        </Text>
      )}
    </View>
  );
}

// ─── Grounding (5-4-3-2-1) ───────────────────────────────────────────────────

const GROUNDING_STEPS = [
  { count: 5, sense: "vois", prompt: "Nomme 5 choses que tu vois" },
  { count: 4, sense: "touches", prompt: "Nomme 4 choses que tu touches" },
  { count: 3, sense: "entends", prompt: "Nomme 3 choses que tu entends" },
  { count: 2, sense: "sens", prompt: "Nomme 2 choses que tu sens" },
  { count: 1, sense: "goûtes", prompt: "Nomme 1 chose que tu goûtes" },
];

function GroundingGuide() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const total = GROUNDING_STEPS.reduce((s, step) => s + step.count, 0);
  const done = checked.size;
  const complete = done === total;

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <View style={grounding.container}>
      <Text style={grounding.title}>Technique d'ancrage 5-4-3-2-1</Text>
      <Text style={grounding.subtitle}>
        Ramène ton attention au moment présent.
      </Text>

      {complete && (
        <View style={grounding.completeBox}>
          <Text style={grounding.completeText}>
            ✓ Exercice terminé — Tu es ancré dans le présent.
          </Text>
        </View>
      )}

      {GROUNDING_STEPS.map((step) => (
        <View key={step.sense} style={grounding.step}>
          <Text style={grounding.stepPrompt}>{step.prompt}</Text>
          <View style={grounding.checkRow}>
            {Array.from({ length: step.count }, (_, i) => {
              const key = `${step.sense}-${i}`;
              const isChecked = checked.has(key);
              return (
                <TouchableOpacity
                  key={key}
                  style={[grounding.check, isChecked && grounding.checkDone]}
                  onPress={() => toggle(key)}
                >
                  <Text style={grounding.checkText}>{isChecked ? "✓" : i + 1}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Arsenal ─────────────────────────────────────────────────────────────────

const INTERVENTIONS = [
  {
    id: "cold-water",
    emoji: "💧",
    title: "Eau froide",
    desc: "Bois un verre d'eau froide ou pose tes poignets sous l'eau froide.",
    xp: 10,
  },
  {
    id: "walk",
    emoji: "🚶",
    title: "Marche 5 minutes",
    desc: "Sors marcher dehors, même juste dans le couloir.",
    xp: 15,
  },
  {
    id: "distraction",
    emoji: "🎮",
    title: "Diversion tactique",
    desc: "Joue à un jeu, regarde une vidéo, compte à rebours depuis 100.",
    xp: 10,
  },
  {
    id: "call",
    emoji: "📞",
    title: "Appel d'urgence",
    desc: "Appelle quelqu'un de confiance — tu n'as pas à expliquer pourquoi.",
    xp: 20,
  },
  {
    id: "write",
    emoji: "✏️",
    title: "Écrire le débrief",
    desc: "Note ce qui se passe. Ça sort de ta tête et ça devient visible.",
    xp: 15,
  },
  {
    id: "breathe",
    emoji: "🧘",
    title: "Retour à la respiration",
    desc: "Retourne à l'onglet Respiration et fais 2 cycles complets.",
    xp: 10,
  },
];

type InterventionStat = {
  interventionId: string;
  uses: number;
  successRate: number | null;
  mastered: boolean;
  advanced: boolean;
};

type CustomIntervention = {
  _id: Id<"customIntervention">;
  name: string;
  icon: string;
  description: string;
};

function CreateCustomForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<AppIconName>("target");
  const [desc, setDesc] = useState("");
  const createCustom = useMutation(api.interventions.createCustom);

  const ICONS: AppIconName[] = ["target", "dumbbell", "palette", "music", "puzzle", "leaf", "gem", "bell", "bath", "smartphone"];

  async function handleCreate() {
    if (!name.trim()) return;
    await createCustom({
      name: name.trim(),
      icon,
      description: desc.trim() || `Ma technique : ${name.trim()}`,
    });
    onDone();
  }

  return (
    <View style={customForm.container}>
      <Text style={customForm.title}>Nouvelle technique</Text>
      <View style={customForm.iconRow}>
        {ICONS.map((e) => (
          <TouchableOpacity
            key={e}
            style={[customForm.iconChip, icon === e && customForm.iconChipActive]}
            onPress={() => setIcon(e)}
          >
            <AppIcon name={e} color={icon === e ? AppDesignTokens.colors.accentSoft : AppDesignTokens.colors.textMuted} size={AppDesignTokens.icons.sizeSm} />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={customForm.input}
        placeholder="Nom de la technique"
        placeholderTextColor={AppDesignTokens.colors.textSubtle}
        value={name}
        onChangeText={setName}
        maxLength={40}
      />
      <TextInput
        style={[customForm.input, { minHeight: AppDesignTokens.layout.v60 }]}
        placeholder="Description (optionnel)"
        placeholderTextColor={AppDesignTokens.colors.textSubtle}
        value={desc}
        onChangeText={setDesc}
        multiline
        maxLength={120}
      />
      <TouchableOpacity
        style={[customForm.createBtn, !name.trim() && { opacity: 0.4 }]}
        onPress={handleCreate}
        disabled={!name.trim()}
      >
        <Text style={customForm.createBtnText}>Ajouter à l'arsenal</Text>
      </TouchableOpacity>
    </View>
  );
}

const customForm = StyleSheet.create({
  container: { gap: AppDesignTokens.layout.v12, paddingVertical: AppDesignTokens.layout.v8 },
  title: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v16, fontWeight: "600" },
  iconRow: { flexDirection: "row", flexWrap: "wrap", gap: AppDesignTokens.layout.v8 },
  iconChip: {
    width: AppDesignTokens.layout.v40, height: AppDesignTokens.layout.v40, borderRadius: AppDesignTokens.layout.v10,
    backgroundColor: AppDesignTokens.colors.surfaceMutedAlt, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: AppDesignTokens.colors.border,
  },
  iconChipActive: { borderColor: AppDesignTokens.colors.accent, backgroundColor: AppDesignTokens.colors.surfaceAccent },
  iconText: { fontSize: AppDesignTokens.layout.v20 },
  input: {
    backgroundColor: AppDesignTokens.colors.surfaceMutedAlt, borderRadius: AppDesignTokens.layout.v10, padding: AppDesignTokens.layout.v12,
    color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v14, borderWidth: 1, borderColor: AppDesignTokens.colors.border,
  },
  createBtn: {
    backgroundColor: AppDesignTokens.colors.accent, borderRadius: AppDesignTokens.layout.v10, paddingVertical: AppDesignTokens.layout.v12, alignItems: "center",
  },
  createBtnText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v14, fontWeight: "700" },
});

function Arsenal({ onSwitchToBreathing }: { onSwitchToBreathing: () => void }) {
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [lastLogId, setLastLogId] = useState<Id<"interventionLog"> | null>(null);
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const logUse = useMutation(api.interventions.logUse);
  const rateIntervention = useMutation(api.interventions.rateIntervention);
  const stats = (useQuery(api.interventions.getStats, {}) ?? []) as InterventionStat[];
  const customItems = (useQuery(api.interventions.getCustomInterventions, {}) ?? []) as CustomIntervention[];

  function getStatFor(id: string) {
    return stats.find((s) => s.interventionId === id);
  }

  // Merge built-in + custom interventions
  const allInterventions = [
    ...INTERVENTIONS,
    ...customItems.map((c) => ({
      id: `custom_${c._id}`,
      emoji: c.icon,
      title: c.name,
      desc: c.description,
      xp: 10,
    })),
  ];

  // Sort by success rate (most effective first), then by uses
  const sorted = [...allInterventions].sort((a, b) => {
    const sa = getStatFor(a.id);
    const sb = getStatFor(b.id);
    const rateA = sa?.successRate ?? -1;
    const rateB = sb?.successRate ?? -1;
    if (rateA !== rateB) return rateB - rateA;
    return (sb?.uses ?? 0) - (sa?.uses ?? 0);
  });

  async function handleUse(item: (typeof allInterventions)[number]) {
    if (item.id === "breathe") onSwitchToBreathing();
    setUsed((prev) => new Set([...prev, item.id]));
    try {
      const result = await logUse({ interventionId: item.id });
      setLastLogId(result.logId);
    } catch {
      // offline graceful degradation
    }
  }

  async function handleRate(interventionId: string, worked: boolean) {
    if (!lastLogId) return;
    setRatedIds((prev) => new Set([...prev, interventionId]));
    try {
      await rateIntervention({ logId: lastLogId, worked });
    } catch {
      // silent
    }
  }

  return (
    <View style={arsenal.container}>
      <Text style={arsenal.title}>Combat Arsenal</Text>
      <Text style={arsenal.subtitle}>
        Choisis une arme et utilise-la maintenant.
      </Text>
      {sorted.map((item) => {
        const isUsed = used.has(item.id);
        const stat = getStatFor(item.id);
        const isRated = ratedIds.has(item.id);

        return (
          <View key={item.id}>
            <View style={[arsenal.card, isUsed && arsenal.cardUsed]}>
              <AppIcon name={item.emoji} color={AppDesignTokens.colors.accentSoft} size={AppDesignTokens.icons.sizeLg} />
              <View style={arsenal.cardContent}>
                <View style={arsenal.cardTitleRow}>
                  <Text style={arsenal.cardTitle}>{item.title}</Text>
                  {stat?.mastered && <Text style={arsenal.masteredBadge}>⭐ Maîtrisé</Text>}
                  {stat?.advanced && !stat.mastered && <Text style={arsenal.advancedBadge}>🔥 Avancé</Text>}
                </View>
                <Text style={arsenal.cardDesc}>{item.desc}</Text>
                {stat && stat.successRate !== null && (
                  <Text style={arsenal.successRate}>
                    Efficacité : {Math.round(stat.successRate * 100)}% · {stat.uses}x utilisé
                  </Text>
                )}
                {stat && stat.successRate === null && stat.uses > 0 && (
                  <Text style={arsenal.successRate}>{stat.uses}x utilisé</Text>
                )}
              </View>
              <TouchableOpacity
                style={[arsenal.useButton, isUsed && arsenal.useButtonDone]}
                onPress={() => handleUse(item)}
                disabled={isUsed}
              >
                <Text style={arsenal.useButtonText}>
                  {isUsed ? "+30 XP" : "Utiliser"}
                </Text>
              </TouchableOpacity>
            </View>
            {/* Rate feedback — shows after use */}
            {isUsed && !isRated && (
              <View style={arsenal.rateRow}>
                <Text style={arsenal.rateText}>Ça a aidé ?</Text>
                <TouchableOpacity
                  style={arsenal.rateYes}
                  onPress={() => handleRate(item.id, true)}
                >
                  <Text style={arsenal.rateButtonText}>Oui +10 XP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={arsenal.rateNo}
                  onPress={() => handleRate(item.id, false)}
                >
                  <Text style={arsenal.rateButtonText}>Non</Text>
                </TouchableOpacity>
              </View>
            )}
            {isUsed && isRated && (
              <View style={arsenal.rateRow}>
                <Text style={arsenal.rateConfirm}>✓ Merci pour ton retour</Text>
              </View>
            )}
          </View>
        );
      })}

      {/* Create custom intervention */}
      {showCreate ? (
        <CreateCustomForm onDone={() => setShowCreate(false)} />
      ) : (
        <TouchableOpacity
          style={arsenal.addButton}
          onPress={() => setShowCreate(true)}
        >
          <Text style={arsenal.addButtonText}>+ Créer ma propre technique</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

const TABS = ["Respirer", "Ancrage", "Arsenal"] as const;
type Tab = (typeof TABS)[number];

export default function CrisisSupportModal() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Respirer");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Fermer">
          <AppIcon name="close" color={AppDesignTokens.colors.textMuted} size={AppDesignTokens.icons.sizeSm} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerEmoji}>🆘</Text>
          <Text style={styles.headerTitle}>Tu n'es pas seul</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/modal/log-mood" as never)}
        >
          <Text style={styles.logText}>Logger</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.headerSub}>
        Choisis une technique et agis maintenant.
      </Text>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabButton, tab === t && styles.tabButtonActive]}
            onPress={() => setTab(t)}
          >
            <Text
              style={[styles.tabText, tab === t && styles.tabTextActive]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {tab === "Respirer" && <BreathingGuide />}
        {tab === "Ancrage" && <GroundingGuide />}
        {tab === "Arsenal" && (
          <Arsenal onSwitchToBreathing={() => setTab("Respirer")} />
        )}
      </ScrollView>

      {/* Emergency footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Besoin d'aide immédiate ?</Text>
        <Text style={styles.footerNumber}>
          🇫🇷 Suicide Écoute : <Text style={styles.number}>01 45 39 40 00</Text>
          {"  "}· SOS Amitié : <Text style={styles.number}>09 72 39 40 50</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppDesignTokens.colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: AppDesignTokens.layout.v20,
    paddingTop: AppDesignTokens.layout.v8,
    paddingBottom: AppDesignTokens.layout.v12,
  },
  headerCenter: { alignItems: "center", gap: AppDesignTokens.layout.v2 },
  headerEmoji: { fontSize: AppDesignTokens.layout.v28 },
  headerTitle: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v16, fontWeight: "700" },
  logText: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v14, fontWeight: "600" },
  headerSub: {
    color: AppDesignTokens.colors.textMuted,
    fontSize: AppDesignTokens.layout.v13,
    textAlign: "center",
    paddingHorizontal: AppDesignTokens.layout.v24,
    marginBottom: AppDesignTokens.layout.v12,
  },
  tabBar: {
    flexDirection: "row",
    marginHorizontal: AppDesignTokens.layout.v16,
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v4,
    marginBottom: AppDesignTokens.layout.v4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: AppDesignTokens.layout.v8,
    alignItems: "center",
    borderRadius: AppDesignTokens.layout.v9,
  },
  tabButtonActive: { backgroundColor: AppDesignTokens.colors.accent },
  tabText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v13, fontWeight: "500" },
  tabTextActive: { color: AppDesignTokens.colors.text, fontWeight: "700" },
  scrollView: { flex: 1 },
  scrollContent: { padding: AppDesignTokens.layout.v16, paddingBottom: AppDesignTokens.layout.v24 },
  footer: {
    padding: AppDesignTokens.layout.v16,
    borderTopWidth: 1,
    borderTopColor: AppDesignTokens.colors.surface,
    alignItems: "center",
    gap: AppDesignTokens.layout.v4,
  },
  footerText: { color: AppDesignTokens.colors.textSubtle, fontSize: AppDesignTokens.layout.v12 },
  footerNumber: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v11, textAlign: "center" },
  number: { color: AppDesignTokens.colors.dangerSoft, fontWeight: "600" },
});

const breathing = StyleSheet.create({
  container: { alignItems: "center", gap: AppDesignTokens.layout.v20, paddingVertical: AppDesignTokens.layout.v16 },
  title: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v17, fontWeight: "600" },
  circleWrapper: { height: AppDesignTokens.layout.v180, alignItems: "center", justifyContent: "center" },
  circle: {
    width: AppDesignTokens.layout.v120,
    height: AppDesignTokens.layout.v120,
    borderRadius: AppDesignTokens.layout.v60,
    borderWidth: 3,
    backgroundColor: AppDesignTokens.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: AppDesignTokens.layout.v0, height: AppDesignTokens.layout.v0 },
    shadowOpacity: AppDesignTokens.layout.v0p6,
    shadowRadius: AppDesignTokens.layout.v20,
    elevation: AppDesignTokens.layout.v10,
  },
  countText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v36, fontWeight: "bold" },
  phaseText: { fontSize: AppDesignTokens.layout.v13, fontWeight: "600" },
  button: {
    borderRadius: AppDesignTokens.layout.v12,
    paddingVertical: AppDesignTokens.layout.v14,
    paddingHorizontal: AppDesignTokens.layout.v40,
  },
  buttonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v16, fontWeight: "700" },
  hint: {
    color: AppDesignTokens.colors.textSubtle,
    fontSize: AppDesignTokens.layout.v12,
    textAlign: "center",
    paddingHorizontal: AppDesignTokens.layout.v24,
  },
});

const grounding = StyleSheet.create({
  container: { gap: AppDesignTokens.layout.v16 },
  title: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v17, fontWeight: "600" },
  subtitle: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v13, marginTop: AppDesignTokens.layout.vMinus8 },
  completeBox: {
    backgroundColor: AppDesignTokens.colors.surfaceAccent,
    borderRadius: AppDesignTokens.layout.v10,
    padding: AppDesignTokens.layout.v12,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.success,
  },
  completeText: { color: AppDesignTokens.colors.success, fontSize: AppDesignTokens.layout.v14, fontWeight: "600" },
  step: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v14,
    gap: AppDesignTokens.layout.v10,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  stepPrompt: { color: AppDesignTokens.colors.neutralBorder, fontSize: AppDesignTokens.layout.v14, fontWeight: "500" },
  checkRow: { flexDirection: "row", gap: AppDesignTokens.layout.v8, flexWrap: "wrap" },
  check: {
    width: AppDesignTokens.layout.v36,
    height: AppDesignTokens.layout.v36,
    borderRadius: AppDesignTokens.layout.v8,
    backgroundColor: AppDesignTokens.colors.surfaceMutedAlt,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkDone: { backgroundColor: AppDesignTokens.colors.accent, borderColor: AppDesignTokens.colors.accent },
  checkText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v13, fontWeight: "600" },
});

const arsenal = StyleSheet.create({
  container: { gap: AppDesignTokens.layout.v12 },
  title: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v17, fontWeight: "600" },
  subtitle: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v13, marginTop: AppDesignTokens.layout.vMinus4 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v14,
    padding: AppDesignTokens.layout.v14,
    gap: AppDesignTokens.layout.v12,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  cardUsed: { borderColor: AppDesignTokens.colors.accent, opacity: 0.7 },
  cardEmoji: { fontSize: AppDesignTokens.layout.v28, width: AppDesignTokens.layout.v36, textAlign: "center" },
  cardContent: { flex: 1, gap: AppDesignTokens.layout.v3 },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: AppDesignTokens.layout.v8 },
  cardTitle: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v14, fontWeight: "600" },
  cardDesc: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v12, lineHeight: AppDesignTokens.layout.v17 },
  successRate: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v11, fontWeight: "500" },
  masteredBadge: { color: AppDesignTokens.colors.warning, fontSize: AppDesignTokens.layout.v10, fontWeight: "700" },
  advancedBadge: { color: AppDesignTokens.colors.dangerSoft, fontSize: AppDesignTokens.layout.v10, fontWeight: "700" },
  useButton: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v8,
    paddingVertical: AppDesignTokens.layout.v7,
    paddingHorizontal: AppDesignTokens.layout.v12,
  },
  useButtonDone: { backgroundColor: AppDesignTokens.colors.success },
  useButtonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v12, fontWeight: "700" },
  rateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: AppDesignTokens.layout.v8,
    paddingHorizontal: AppDesignTokens.layout.v14,
    paddingVertical: AppDesignTokens.layout.v6,
  },
  rateText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v12, flex: 1 },
  rateYes: {
    backgroundColor: AppDesignTokens.colors.success,
    borderRadius: AppDesignTokens.layout.v6,
    paddingVertical: AppDesignTokens.layout.v5,
    paddingHorizontal: AppDesignTokens.layout.v10,
  },
  rateNo: {
    backgroundColor: AppDesignTokens.colors.textStrong,
    borderRadius: AppDesignTokens.layout.v6,
    paddingVertical: AppDesignTokens.layout.v5,
    paddingHorizontal: AppDesignTokens.layout.v10,
  },
  rateButtonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v11, fontWeight: "600" },
  rateConfirm: { color: AppDesignTokens.colors.success, fontSize: AppDesignTokens.layout.v12, fontWeight: "500" },
  addButton: {
    borderRadius: AppDesignTokens.layout.v12,
    paddingVertical: AppDesignTokens.layout.v14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: AppDesignTokens.colors.accent,
    borderStyle: "dashed",
  },
  addButtonText: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v13, fontWeight: "600" },
});
