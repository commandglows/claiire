import { useEffect, useRef, useState } from "react";
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
import { useCompanion } from "@/features/companion/hooks/useCompanion";

// ─── Pre-defined actions ─────────────────────────────────────────────────────

const PRESET_ACTIONS = [
  { id: "water", label: "Boire de l'eau", icon: "💧", durationSeconds: undefined },
  { id: "stretch", label: "Étirements", icon: "🤸", durationSeconds: 120 },
  { id: "meditate", label: "Méditer", icon: "🧘", durationSeconds: 300 },
  { id: "journal", label: "Journaliser", icon: "📝", durationSeconds: 300 },
  { id: "exercise", label: "Exercice", icon: "🏃", durationSeconds: 600 },
  { id: "breathe", label: "Respiration", icon: "🌬️", durationSeconds: 180 },
  { id: "gratitude", label: "Gratitude (3 choses)", icon: "🙏", durationSeconds: 120 },
  { id: "cold-shower", label: "Douche froide", icon: "🚿", durationSeconds: 120 },
  { id: "read", label: "Lire 10 pages", icon: "📖", durationSeconds: 600 },
  { id: "no-phone", label: "Pas de téléphone 30min", icon: "📵", durationSeconds: 1800 },
  { id: "skincare", label: "Soin du visage", icon: "🧴", durationSeconds: undefined },
  { id: "teeth", label: "Brossage de dents", icon: "🪥", durationSeconds: 120 },
] as const;

type Action = {
  id: string;
  label: string;
  icon: string;
  durationSeconds?: number;
};

type RoutineType = "morning" | "night";

// ─── Companion encouragement ─────────────────────────────────────────────────

const ENCOURAGEMENTS = {
  start: [
    "C'est parti ! On fait ça ensemble.",
    "Prêt ? Chaque action compte.",
    "Ta routine, ta victoire. Go !",
  ],
  progress: [
    "Bien joué ! Continue.",
    "Tu es en feu !",
    "Un pas de plus vers la victoire.",
    "Ça avance bien !",
  ],
  complete: [
    "Routine terminée ! Tu es incroyable.",
    "100% — tu as tout donné !",
    "Mission accomplie. Fier de toi.",
  ],
  partial: [
    "Bravo d'avoir commencé. Demain, on ira plus loin.",
    "Chaque pas compte. Tu as fait du bon travail.",
  ],
};

function getEncouragement(phase: "start" | "progress" | "complete" | "partial"): string {
  const msgs = ENCOURAGEMENTS[phase];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

// ─── Timer Component ─────────────────────────────────────────────────────────

function Timer({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          onDone();
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, remaining, onDone]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <View style={timer.container}>
      <Text style={timer.display}>
        {mins}:{secs.toString().padStart(2, "0")}
      </Text>
      <TouchableOpacity
        style={[timer.button, running && timer.buttonStop]}
        onPress={() => {
          if (remaining <= 0) {
            onDone();
          } else {
            setRunning(!running);
          }
        }}
      >
        <Text style={timer.buttonText}>
          {remaining <= 0 ? "✓ Fait" : running ? "Pause" : "Lancer"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Create Routine View ─────────────────────────────────────────────────────

function CreateRoutine({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<RoutineType>("morning");
  const [selected, setSelected] = useState<Action[]>([]);
  const createRoutine = useMutation(api.routines.create);

  function toggleAction(action: Action) {
    setSelected((prev) => {
      const exists = prev.find((a) => a.id === action.id);
      if (exists) return prev.filter((a) => a.id !== action.id);
      return [...prev, action];
    });
  }

  async function handleCreate() {
    if (selected.length === 0) return;
    const routineName = name.trim() || (type === "morning" ? "Routine Matin" : "Routine Soir");
    await createRoutine({
      name: routineName,
      type,
      actions: selected.map((a) => ({
        id: a.id,
        label: a.label,
        icon: a.icon,
        durationSeconds: a.durationSeconds,
      })),
    });
    onCreated();
  }

  return (
    <ScrollView contentContainerStyle={create.content} showsVerticalScrollIndicator={false}>
      <Text style={create.title}>Nouvelle routine</Text>

      {/* Type selector */}
      <View style={create.typeRow}>
        <TouchableOpacity
          style={[create.typeButton, type === "morning" && create.typeActive]}
          onPress={() => setType("morning")}
        >
          <Text style={create.typeEmoji}>🌅</Text>
          <Text style={[create.typeLabel, type === "morning" && create.typeLabelActive]}>
            Matin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[create.typeButton, type === "night" && create.typeActive]}
          onPress={() => setType("night")}
        >
          <Text style={create.typeEmoji}>🌙</Text>
          <Text style={[create.typeLabel, type === "night" && create.typeLabelActive]}>
            Soir
          </Text>
        </TouchableOpacity>
      </View>

      {/* Name */}
      <TextInput
        style={create.input}
        placeholder={type === "morning" ? "Routine Matin" : "Routine Soir"}
        placeholderTextColor="#555"
        value={name}
        onChangeText={setName}
      />

      {/* Actions grid */}
      <Text style={create.sectionTitle}>Choisis tes actions</Text>
      <View style={create.actionsGrid}>
        {PRESET_ACTIONS.map((action) => {
          const isSelected = selected.some((a) => a.id === action.id);
          return (
            <TouchableOpacity
              key={action.id}
              style={[create.actionChip, isSelected && create.actionChipSelected]}
              onPress={() => toggleAction(action as Action)}
            >
              <Text style={create.actionIcon}>{action.icon}</Text>
              <Text style={[create.actionLabel, isSelected && create.actionLabelSelected]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Order preview */}
      {selected.length > 0 && (
        <>
          <Text style={create.sectionTitle}>Ordre ({selected.length} actions)</Text>
          {selected.map((action, i) => (
            <View key={action.id} style={create.orderRow}>
              <Text style={create.orderNum}>{i + 1}</Text>
              <Text style={create.orderIcon}>{action.icon}</Text>
              <Text style={create.orderLabel}>{action.label}</Text>
              {action.durationSeconds && (
                <Text style={create.orderDuration}>
                  {Math.floor(action.durationSeconds / 60)}min
                </Text>
              )}
            </View>
          ))}
        </>
      )}

      {/* Create button */}
      <TouchableOpacity
        style={[create.createButton, selected.length === 0 && create.createButtonDisabled]}
        onPress={handleCreate}
        disabled={selected.length === 0}
      >
        <Text style={create.createButtonText}>
          Créer la routine ({selected.length} actions)
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Execute Routine View ────────────────────────────────────────────────────

type Routine = {
  _id: Id<"routine">;
  name: string;
  type: RoutineType;
  actions: Action[];
};

function ExecuteRoutine({ routine, onDone }: { routine: Routine; onDone: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [companionMsg, setCompanionMsg] = useState(getEncouragement("start"));
  const [result, setResult] = useState<{ xpAwarded: number; bonusXP: number } | null>(null);
  const completeRoutine = useMutation(api.routines.complete);
  const { personality } = useCompanion();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const action = routine.actions[currentIdx];
  const isLast = currentIdx === routine.actions.length - 1;
  const allDone = completed.size === routine.actions.length;

  function markDone() {
    const newCompleted = new Set([...completed, action.id]);
    setCompleted(newCompleted);

    // Companion message
    if (newCompleted.size === routine.actions.length) {
      setCompanionMsg(getEncouragement("complete"));
    } else {
      setCompanionMsg(getEncouragement("progress"));
    }

    // Fade transition
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    if (!isLast) {
      setTimeout(() => setCurrentIdx((i) => i + 1), 200);
    }
  }

  function skip() {
    if (!isLast) {
      setCurrentIdx((i) => i + 1);
      setCompanionMsg(getEncouragement("progress"));
    }
  }

  async function finish() {
    try {
      const res = await completeRoutine({
        routineId: routine._id,
        completedActions: Array.from(completed),
      });
      setResult(res);
    } catch {
      onDone();
    }
  }

  if (result) {
    return (
      <View style={exec.resultContainer}>
        <Text style={exec.resultEmoji}>{result.bonusXP > 0 ? "🏆" : "👏"}</Text>
        <Text style={exec.resultTitle}>
          {result.bonusXP > 0 ? "Routine complète !" : "Bien joué !"}
        </Text>
        <Text style={exec.resultXP}>+{result.xpAwarded} XP</Text>
        {result.bonusXP > 0 && (
          <Text style={exec.resultBonus}>dont +{result.bonusXP} XP bonus (100%)</Text>
        )}
        <Text style={exec.resultStats}>
          {completed.size}/{routine.actions.length} actions terminées
        </Text>
        <Text style={exec.companionResult}>
          {personality?.name ?? "Ton compagnon"} : "{companionMsg}"
        </Text>
        <TouchableOpacity style={exec.doneButton} onPress={onDone}>
          <Text style={exec.doneButtonText}>Fermer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={exec.container}>
      {/* Progress bar */}
      <View style={exec.progressBar}>
        {routine.actions.map((a, i) => (
          <View
            key={a.id}
            style={[
              exec.progressDot,
              completed.has(a.id) && exec.progressDotDone,
              i === currentIdx && exec.progressDotCurrent,
            ]}
          />
        ))}
      </View>

      {/* Companion bubble */}
      <View style={exec.companionBubble}>
        <Text style={exec.companionText}>
          {personality?.name ?? "Compagnon"} : "{companionMsg}"
        </Text>
      </View>

      {/* Current action */}
      <Animated.View style={[exec.actionCard, { opacity: fadeAnim }]}>
        <Text style={exec.actionStep}>
          {currentIdx + 1} / {routine.actions.length}
        </Text>
        <Text style={exec.actionIcon}>{action.icon}</Text>
        <Text style={exec.actionLabel}>{action.label}</Text>

        {action.durationSeconds && !completed.has(action.id) ? (
          <Timer seconds={action.durationSeconds} onDone={markDone} />
        ) : (
          <TouchableOpacity
            style={[exec.markButton, completed.has(action.id) && exec.markButtonDone]}
            onPress={markDone}
            disabled={completed.has(action.id)}
          >
            <Text style={exec.markButtonText}>
              {completed.has(action.id) ? "✓ Fait" : "Marquer fait"}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Bottom buttons */}
      <View style={exec.bottomRow}>
        {!isLast && !completed.has(action.id) && (
          <TouchableOpacity style={exec.skipButton} onPress={skip}>
            <Text style={exec.skipText}>Passer ›</Text>
          </TouchableOpacity>
        )}
        {(isLast || allDone) && (
          <TouchableOpacity style={exec.finishButton} onPress={finish}>
            <Text style={exec.finishText}>
              {allDone ? "Terminer la routine" : "Finir maintenant"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Main Modal ──────────────────────────────────────────────────────────────

type RoutineData = {
  _id: Id<"routine">;
  name: string;
  type: RoutineType;
  actions: Action[];
};

type CompletionData = {
  routineId: Id<"routine">;
};

export default function RoutineModal() {
  const router = useRouter();
  const routines = (useQuery(api.routines.getMyRoutines, {}) ?? []) as RoutineData[];
  const todayCompletions = (useQuery(api.routines.getTodayCompletions, {}) ?? []) as CompletionData[];
  const removeRoutine = useMutation(api.routines.remove);
  const [mode, setMode] = useState<"list" | "create" | "execute">("list");
  const [activeRoutine, setActiveRoutine] = useState<RoutineData | null>(null);

  const completedRoutineIds = new Set(todayCompletions.map((c) => c.routineId));

  if (mode === "create") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMode("list")}>
            <Text style={styles.backText}>‹ Retour</Text>
          </TouchableOpacity>
        </View>
        <CreateRoutine onCreated={() => setMode("list")} />
      </SafeAreaView>
    );
  }

  if (mode === "execute" && activeRoutine) {
    return (
      <SafeAreaView style={styles.container}>
        <ExecuteRoutine
          routine={activeRoutine}
          onDone={() => {
            setMode("list");
            setActiveRoutine(null);
          }}
        />
      </SafeAreaView>
    );
  }

  // List view
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Routines</Text>
        <TouchableOpacity onPress={() => setMode("create")}>
          <Text style={styles.addText}>+ Créer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {routines.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌅</Text>
            <Text style={styles.emptyText}>Aucune routine encore</Text>
            <Text style={styles.emptySub}>
              Crée ta routine matin ou soir pour gagner de l'XP chaque jour
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => setMode("create")}>
              <Text style={styles.emptyButtonText}>Créer ma première routine</Text>
            </TouchableOpacity>
          </View>
        ) : (
          routines.map((routine) => {
            const isDone = completedRoutineIds.has(routine._id);
            return (
              <View key={routine._id} style={[styles.routineCard, isDone && styles.routineCardDone]}>
                <View style={styles.routineHeader}>
                  <Text style={styles.routineType}>
                    {routine.type === "morning" ? "🌅" : "🌙"}
                  </Text>
                  <View style={styles.routineInfo}>
                    <Text style={styles.routineName}>{routine.name}</Text>
                    <Text style={styles.routineActions}>
                      {routine.actions.length} actions · ~
                      {Math.ceil(
                        routine.actions.reduce(
                          (s, a) => s + (a.durationSeconds ?? 60),
                          0,
                        ) / 60,
                      )}
                      min
                    </Text>
                  </View>
                  {isDone && <Text style={styles.doneBadge}>✓ Fait</Text>}
                </View>

                <View style={styles.routineActionsList}>
                  {routine.actions.map((a) => (
                    <Text key={a.id} style={styles.routineActionLabel}>
                      {a.icon} {a.label}
                    </Text>
                  ))}
                </View>

                <View style={styles.routineButtons}>
                  <TouchableOpacity
                    style={[styles.startButton, isDone && styles.startButtonDone]}
                    onPress={() => {
                      setActiveRoutine(routine);
                      setMode("execute");
                    }}
                  >
                    <Text style={styles.startButtonText}>
                      {isDone ? "Refaire" : "Commencer"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeRoutine({ routineId: routine._id })}
                  >
                    <Text style={styles.deleteText}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeText: { color: "#888", fontSize: 18, padding: 4 },
  backText: { color: "#6c47ff", fontSize: 15, fontWeight: "600" },
  headerTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  addText: { color: "#6c47ff", fontSize: 14, fontWeight: "600" },
  listContent: { padding: 16, gap: 16, paddingBottom: 40 },
  empty: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyEmoji: { fontSize: 48 },
  emptyText: { color: "#888", fontSize: 16, fontWeight: "600" },
  emptySub: { color: "#555", fontSize: 13, textAlign: "center", paddingHorizontal: 40 },
  emptyButton: {
    backgroundColor: "#6c47ff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  emptyButtonText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  routineCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  routineCardDone: { borderColor: "#2f9e44", opacity: 0.75 },
  routineHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  routineType: { fontSize: 28 },
  routineInfo: { flex: 1, gap: 2 },
  routineName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  routineActions: { color: "#888", fontSize: 12 },
  doneBadge: { color: "#2f9e44", fontSize: 13, fontWeight: "700" },
  routineActionsList: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  routineActionLabel: { color: "#888", fontSize: 12 },
  routineButtons: { flexDirection: "row", gap: 10, marginTop: 4 },
  startButton: {
    flex: 1,
    backgroundColor: "#6c47ff",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  startButtonDone: { backgroundColor: "#333" },
  startButtonText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  deleteButton: { paddingVertical: 10, paddingHorizontal: 12 },
  deleteText: { color: "#ff6b6b", fontSize: 13, fontWeight: "500" },
});

const create = StyleSheet.create({
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  typeRow: { flexDirection: "row", gap: 12 },
  typeButton: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  typeActive: { borderColor: "#6c47ff", backgroundColor: "#1a1a3e" },
  typeEmoji: { fontSize: 28 },
  typeLabel: { color: "#888", fontSize: 14, fontWeight: "500" },
  typeLabelActive: { color: "#fff", fontWeight: "700" },
  input: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: "#fff" },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  actionChipSelected: { borderColor: "#6c47ff", backgroundColor: "#1a1a3e" },
  actionIcon: { fontSize: 18 },
  actionLabel: { color: "#888", fontSize: 13, fontWeight: "500" },
  actionLabelSelected: { color: "#fff" },
  orderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1a1a2e",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  orderNum: { color: "#6c47ff", fontSize: 14, fontWeight: "700", width: 20, textAlign: "center" },
  orderIcon: { fontSize: 18 },
  orderLabel: { flex: 1, color: "#fff", fontSize: 14 },
  orderDuration: { color: "#555", fontSize: 12 },
  createButton: {
    backgroundColor: "#6c47ff",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  createButtonDisabled: { opacity: 0.4 },
  createButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});

const exec = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", gap: 20 },
  progressBar: { flexDirection: "row", justifyContent: "center", gap: 6 },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2a2a4a",
  },
  progressDotDone: { backgroundColor: "#2f9e44" },
  progressDotCurrent: { backgroundColor: "#6c47ff", width: 24, borderRadius: 5 },
  companionBubble: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#6c47ff40",
  },
  companionText: { color: "#a78bfa", fontSize: 13, fontStyle: "italic", lineHeight: 18 },
  actionCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  actionStep: { color: "#555", fontSize: 12, fontWeight: "600" },
  actionIcon: { fontSize: 56 },
  actionLabel: { color: "#fff", fontSize: 20, fontWeight: "700", textAlign: "center" },
  markButton: {
    backgroundColor: "#6c47ff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  markButtonDone: { backgroundColor: "#2f9e44" },
  markButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  skipButton: { paddingVertical: 12, paddingHorizontal: 20 },
  skipText: { color: "#888", fontSize: 14, fontWeight: "500" },
  finishButton: {
    backgroundColor: "#2f9e44",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  finishText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  resultContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 32,
  },
  resultEmoji: { fontSize: 56 },
  resultTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  resultXP: { color: "#6c47ff", fontSize: 28, fontWeight: "900" },
  resultBonus: { color: "#2f9e44", fontSize: 13, fontWeight: "600" },
  resultStats: { color: "#888", fontSize: 14 },
  companionResult: {
    color: "#a78bfa",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 8,
  },
  doneButton: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  doneButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});

const timer = StyleSheet.create({
  container: { alignItems: "center", gap: 12 },
  display: { color: "#fff", fontSize: 36, fontWeight: "bold", fontVariant: ["tabular-nums"] },
  button: {
    backgroundColor: "#6c47ff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  buttonStop: { backgroundColor: "#f59f00" },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
