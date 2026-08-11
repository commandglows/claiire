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
import { useCompanion } from "@/features/companion/hooks/useCompanion";
import { AppIcon, type AppIconName } from "@/components/AppIcon";
import {
  getBreathingPhase,
  isRelationshipReflectionAction,
  RELATIONSHIP_REFLECTION_ACTIONS,
} from "@/features/routines/engine/relationshipReflection";
import { AppState } from "react-native";

// ─── Pre-defined actions ─────────────────────────────────────────────────────

const PRESET_ACTIONS = [
  { id: "water", label: "Boire de l'eau", icon: "droplet", durationSeconds: undefined },
  { id: "stretch", label: "Étirements", icon: "person", durationSeconds: 120 },
  { id: "meditate", label: "Méditer", icon: "flower", durationSeconds: 300 },
  { id: "journal", label: "Journaliser", icon: "notebook", durationSeconds: 300 },
  { id: "exercise", label: "Exercice", icon: "dumbbell", durationSeconds: 600 },
  { id: "breathe", label: "Respiration", icon: "wind", durationSeconds: 180 },
  { id: "gratitude", label: "Gratitude (3 choses)", icon: "heart", durationSeconds: 120 },
  { id: "cold-shower", label: "Douche froide", icon: "shower", durationSeconds: 120 },
  { id: "read", label: "Lire 10 pages", icon: "book", durationSeconds: 600 },
  { id: "no-phone", label: "Pas de téléphone 30min", icon: "smartphone", durationSeconds: 1800 },
  { id: "skincare", label: "Soin du visage", icon: "scan", durationSeconds: undefined },
  { id: "teeth", label: "Brossage de dents", icon: "sparkles", durationSeconds: 120 },
] as const;

type Action = {
  id: string;
  label: string;
  icon: AppIconName | string;
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

function PacedBreathing({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const elapsed = seconds - remaining;
  const phase = getBreathingPhase(elapsed);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          setRunning(false);
          onDone();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onDone, remaining, running]);

  return (
    <View style={guided.section}>
      <Text style={guided.phase} accessibilityLiveRegion="polite">
        {phase === "inhale" ? "Inspire doucement" : "Expire doucement"}
      </Text>
      <Text style={guided.timer}>{Math.floor(remaining / 60)}:{(remaining % 60).toString().padStart(2, "0")}</Text>
      <Text style={guided.hint}>Sans forcer. Fais une pause ou arrête si tu ressens une gêne ou un vertige.</Text>
      <TouchableOpacity style={guided.primaryButton} onPress={() => setRunning((value) => !value)}>
        <Text style={guided.primaryButtonText}>{running ? "Pause" : remaining === seconds ? "Commencer" : "Reprendre"}</Text>
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

  function selectRelationshipReflectionTemplate() {
    setName("Relation & réflexion");
    setSelected(RELATIONSHIP_REFLECTION_ACTIONS.map((action) => ({ ...action })));
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
        placeholderTextColor={AppDesignTokens.colors.textSubtle}
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={create.featuredTemplate} onPress={selectRelationshipReflectionTemplate}>
        <View style={create.featuredTemplateIcon}>
          <AppIcon name="heart" color={AppDesignTokens.colors.accentSoft} size={AppDesignTokens.icons.sizeMd} />
        </View>
        <View style={create.featuredTemplateCopy}>
          <Text style={create.featuredTemplateTitle}>Relation & réflexion</Text>
          <Text style={create.featuredTemplateText}>Respiration, écriture privée, visualisation douce et prochain pas · tout est facultatif</Text>
        </View>
        <AppIcon name="chevron-right" color={AppDesignTokens.colors.textMuted} size={AppDesignTokens.icons.sizeSm} />
      </TouchableOpacity>

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
              <AppIcon name={action.icon} color={isSelected ? AppDesignTokens.colors.accentSoft : AppDesignTokens.colors.textMuted} size={AppDesignTokens.icons.sizeSm} />
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
              <AppIcon name={action.icon} color={AppDesignTokens.colors.accentSoft} size={AppDesignTokens.icons.sizeSm} />
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
  const router = useRouter();
  const isRelationshipRoutine = routine.actions.some((item) => isRelationshipReflectionAction(item.id));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [companionMsg, setCompanionMsg] = useState(
    isRelationshipRoutine ? "Ici, rien n’est obligatoire. Prends seulement ce qui t’aide." : getEncouragement("start"),
  );
  const [result, setResult] = useState<{ xpAwarded: number; bonusXP: number } | null>(null);
  const [reflection, setReflection] = useState("");
  const [nextStep, setNextStep] = useState("");
  const completeRoutine = useMutation(api.routines.complete);
  const { personality } = useCompanion();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        setReflection("");
        setNextStep("");
      }
    });
    return () => {
      subscription.remove();
      setReflection("");
      setNextStep("");
    };
  }, []);

  useEffect(() => {
    if (result) {
      setReflection("");
      setNextStep("");
    }
  }, [result]);

  const action = routine.actions[currentIdx];
  const isLast = currentIdx === routine.actions.length - 1;
  const allDone = completed.size === routine.actions.length;

  function markDone() {
    const newCompleted = new Set([...completed, action.id]);
    setCompleted(newCompleted);

    // Companion message
    if (isRelationshipRoutine) {
      setCompanionMsg("Tu peux t’arrêter ici ou continuer, sans pression.");
    } else if (newCompleted.size === routine.actions.length) {
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
      setCompanionMsg(isRelationshipRoutine ? "Tu peux avancer à ton rythme." : getEncouragement("progress"));
    } else if (isRelationshipRoutine) {
      void finish();
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
          {isRelationshipRoutine ? "Pause terminée" : result.bonusXP > 0 ? "Routine complète !" : "Bien joué !"}
        </Text>
        {!isRelationshipRoutine && <Text style={exec.resultXP}>+{result.xpAwarded} XP</Text>}
        {!isRelationshipRoutine && result.bonusXP > 0 && (
          <Text style={exec.resultBonus}>dont +{result.bonusXP} XP bonus (100%)</Text>
        )}
        <Text style={exec.resultStats}>
          {completed.size}/{routine.actions.length} actions terminées
        </Text>
        <Text style={exec.companionResult}>{isRelationshipRoutine ? "Tes notes de session ont été effacées." : `${personality?.name ?? "Ton compagnon"} : "${companionMsg}"`}</Text>
        <TouchableOpacity style={exec.doneButton} onPress={onDone}>
          <Text style={exec.doneButtonText}>Fermer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
      <View style={exec.container}>
      {isRelationshipRoutine && (
        <TouchableOpacity style={guided.helpButton} onPress={() => router.push("/modal/situation-help" as never)}>
          <AppIcon name="shield-alert" color={AppDesignTokens.colors.dangerSoft} size={AppDesignTokens.icons.sizeXs} />
          <Text style={guided.helpText}>Besoin d’aide maintenant ?</Text>
        </TouchableOpacity>
      )}
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
        <AppIcon name={action.icon} color={AppDesignTokens.colors.accentSoft} size={AppDesignTokens.icons.sizeHero} />
        <Text style={exec.actionLabel}>{action.label}</Text>

        {action.id === "relationship-reflection-arrival" ? (
          <View style={guided.section}>
            <Text style={guided.prompt}>Prends un instant pour remarquer comment tu te sens, sans te juger ni devoir décider quoi que ce soit.</Text>
            <Text style={guided.hint}>Tu peux garder les yeux ouverts et passer cette étape.</Text>
            <TouchableOpacity style={guided.primaryButton} onPress={markDone}><Text style={guided.primaryButtonText}>Continuer</Text></TouchableOpacity>
          </View>
        ) : action.id === "relationship-reflection-breathing" ? (
          <PacedBreathing seconds={action.durationSeconds ?? 180} onDone={markDone} />
        ) : action.id === "relationship-reflection-journal" ? (
          <View style={guided.section}>
            <Text style={guided.prompt}>Qu’est-ce qui s’est passé, factuellement ? Qu’as-tu ressenti ? De quoi as-tu besoin ou quelle limite compte pour toi ?</Text>
            <TextInput style={guided.input} multiline value={reflection} onChangeText={setReflection} placeholder="Écris seulement ce qui t’aide…" placeholderTextColor={AppDesignTokens.colors.textSubtle} />
            <Text style={guided.privacy}>Cette note reste uniquement dans cette session et sera effacée à la fermeture.</Text>
            <TouchableOpacity style={guided.primaryButton} onPress={markDone}><Text style={guided.primaryButtonText}>Continuer</Text></TouchableOpacity>
          </View>
        ) : action.id === "relationship-reflection-visualization" ? (
          <View style={guided.section}>
            <Text style={guided.prompt}>Si c’est confortable, imagine une couleur, une lumière ou un lieu neutre qui t’aide à relâcher un peu la tension.</Text>
            <Text style={guided.hint}>Garde les yeux ouverts si tu préfères. Arrête ou passe si une image te met mal à l’aise.</Text>
            <Timer seconds={action.durationSeconds ?? 120} onDone={markDone} />
          </View>
        ) : action.id === "relationship-reflection-next-step" ? (
          <View style={guided.section}>
            <Text style={guided.prompt}>Quel petit pas sûr, réaliste et réversible veux-tu garder en tête ? Il ne doit pas impliquer de confrontation.</Text>
            <TextInput style={guided.input} multiline value={nextStep} onChangeText={setNextStep} placeholder="Par exemple : prendre du recul, noter un fait, contacter une personne de confiance…" placeholderTextColor={AppDesignTokens.colors.textSubtle} />
            <Text style={guided.privacy}>Cette note n’est pas enregistrée.</Text>
            <TouchableOpacity style={guided.primaryButton} onPress={markDone}><Text style={guided.primaryButtonText}>Terminer cette étape</Text></TouchableOpacity>
          </View>
        ) : action.durationSeconds && !completed.has(action.id) ? (
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
        {!completed.has(action.id) && (isRelationshipRoutine || !isLast) && (
          <TouchableOpacity style={exec.skipButton} onPress={skip}>
            <Text style={exec.skipText}>{isLast ? "Passer et terminer" : "Passer ›"}</Text>
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
                    <View key={a.id} style={styles.routineActionRow}>
                      <AppIcon name={a.icon} color={AppDesignTokens.colors.textMuted} size={AppDesignTokens.icons.sizeXs} />
                      <Text style={styles.routineActionLabel}>{a.label}</Text>
                    </View>
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
  container: { flex: 1, backgroundColor: AppDesignTokens.colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: AppDesignTokens.layout.v20,
    paddingVertical: AppDesignTokens.layout.v12,
  },
  closeText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v18, padding: AppDesignTokens.layout.v4 },
  backText: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v15, fontWeight: "600" },
  headerTitle: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v17, fontWeight: "700" },
  addText: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v14, fontWeight: "600" },
  listContent: { padding: AppDesignTokens.layout.v16, gap: AppDesignTokens.layout.v16, paddingBottom: AppDesignTokens.layout.v40 },
  empty: {
    alignItems: "center",
    paddingVertical: AppDesignTokens.layout.v60,
    gap: AppDesignTokens.layout.v10,
  },
  emptyEmoji: { fontSize: AppDesignTokens.layout.v48 },
  emptyText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v16, fontWeight: "600" },
  emptySub: { color: AppDesignTokens.colors.textSubtle, fontSize: AppDesignTokens.layout.v13, textAlign: "center", paddingHorizontal: AppDesignTokens.layout.v40 },
  emptyButton: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v12,
    paddingVertical: AppDesignTokens.layout.v12,
    paddingHorizontal: AppDesignTokens.layout.v24,
    marginTop: AppDesignTokens.layout.v8,
  },
  emptyButtonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v14, fontWeight: "700" },
  routineCard: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v14,
    padding: AppDesignTokens.layout.v16,
    gap: AppDesignTokens.layout.v12,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  routineCardDone: { borderColor: AppDesignTokens.colors.success, opacity: 0.75 },
  routineHeader: { flexDirection: "row", alignItems: "center", gap: AppDesignTokens.layout.v12 },
  routineType: { fontSize: AppDesignTokens.layout.v28 },
  routineInfo: { flex: 1, gap: AppDesignTokens.layout.v2 },
  routineName: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v16, fontWeight: "600" },
  routineActions: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v12 },
  doneBadge: { color: AppDesignTokens.colors.success, fontSize: AppDesignTokens.layout.v13, fontWeight: "700" },
  routineActionsList: { flexDirection: "row", flexWrap: "wrap", gap: AppDesignTokens.layout.v6 },
  routineActionRow: { flexDirection: "row", alignItems: "center", gap: AppDesignTokens.layout.v4 },
  routineActionLabel: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v12 },
  routineButtons: { flexDirection: "row", gap: AppDesignTokens.layout.v10, marginTop: AppDesignTokens.layout.v4 },
  startButton: {
    flex: 1,
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v10,
    paddingVertical: AppDesignTokens.layout.v10,
    alignItems: "center",
  },
  startButtonDone: { backgroundColor: AppDesignTokens.colors.textStrong },
  startButtonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v14, fontWeight: "700" },
  deleteButton: { paddingVertical: AppDesignTokens.layout.v10, paddingHorizontal: AppDesignTokens.layout.v12 },
  deleteText: { color: AppDesignTokens.colors.dangerSoft, fontSize: AppDesignTokens.layout.v13, fontWeight: "500" },
});

const create = StyleSheet.create({
  content: { padding: AppDesignTokens.layout.v20, gap: AppDesignTokens.layout.v16, paddingBottom: AppDesignTokens.layout.v40 },
  title: { fontSize: AppDesignTokens.layout.v22, fontWeight: "bold", color: AppDesignTokens.colors.text },
  typeRow: { flexDirection: "row", gap: AppDesignTokens.layout.v12 },
  typeButton: {
    flex: 1,
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    paddingVertical: AppDesignTokens.layout.v16,
    alignItems: "center",
    gap: AppDesignTokens.layout.v6,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  typeActive: { borderColor: AppDesignTokens.colors.accent, backgroundColor: AppDesignTokens.colors.surfaceAccent },
  typeEmoji: { fontSize: AppDesignTokens.layout.v28 },
  typeLabel: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v14, fontWeight: "500" },
  typeLabelActive: { color: AppDesignTokens.colors.text, fontWeight: "700" },
  input: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v14,
    color: AppDesignTokens.colors.text,
    fontSize: AppDesignTokens.layout.v15,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  featuredTemplate: {
    flexDirection: "row",
    alignItems: "center",
    gap: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v14,
    borderRadius: AppDesignTokens.layout.v14,
    borderWidth: AppDesignTokens.layout.v1,
    borderColor: AppDesignTokens.colors.accent40,
    backgroundColor: AppDesignTokens.colors.surfaceAccent,
  },
  featuredTemplateIcon: {
    width: AppDesignTokens.layout.v44,
    height: AppDesignTokens.layout.v44,
    borderRadius: AppDesignTokens.layout.v22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppDesignTokens.colors.accent30,
  },
  featuredTemplateCopy: { flex: AppDesignTokens.layout.v1, gap: AppDesignTokens.layout.v4 },
  featuredTemplateTitle: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v15, fontWeight: AppDesignTokens.typography.bold },
  featuredTemplateText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v12, lineHeight: AppDesignTokens.layout.v17 },
  sectionTitle: { fontSize: AppDesignTokens.layout.v15, fontWeight: "600", color: AppDesignTokens.colors.text },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: AppDesignTokens.layout.v8 },
  actionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v10,
    paddingVertical: AppDesignTokens.layout.v10,
    paddingHorizontal: AppDesignTokens.layout.v12,
    gap: AppDesignTokens.layout.v6,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  actionChipSelected: { borderColor: AppDesignTokens.colors.accent, backgroundColor: AppDesignTokens.colors.surfaceAccent },
  actionIcon: { fontSize: AppDesignTokens.layout.v18 },
  actionLabel: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v13, fontWeight: "500" },
  actionLabelSelected: { color: AppDesignTokens.colors.text },
  orderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: AppDesignTokens.layout.v10,
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v10,
    padding: AppDesignTokens.layout.v12,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  orderNum: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v14, fontWeight: "700", width: AppDesignTokens.layout.v20, textAlign: "center" },
  orderIcon: { fontSize: AppDesignTokens.layout.v18 },
  orderLabel: { flex: 1, color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v14 },
  orderDuration: { color: AppDesignTokens.colors.textSubtle, fontSize: AppDesignTokens.layout.v12 },
  createButton: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v12,
    paddingVertical: AppDesignTokens.layout.v14,
    alignItems: "center",
  },
  createButtonDisabled: { opacity: 0.4 },
  createButtonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v15, fontWeight: "700" },
});

const exec = StyleSheet.create({
  container: { flex: 1, padding: AppDesignTokens.layout.v20, justifyContent: "center", gap: AppDesignTokens.layout.v20 },
  progressBar: { flexDirection: "row", justifyContent: "center", gap: AppDesignTokens.layout.v6 },
  progressDot: {
    width: AppDesignTokens.layout.v10,
    height: AppDesignTokens.layout.v10,
    borderRadius: AppDesignTokens.layout.v5,
    backgroundColor: AppDesignTokens.colors.border,
  },
  progressDotDone: { backgroundColor: AppDesignTokens.colors.success },
  progressDotCurrent: { backgroundColor: AppDesignTokens.colors.accent, width: AppDesignTokens.layout.v24, borderRadius: AppDesignTokens.layout.v5 },
  companionBubble: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v14,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.accent40,
  },
  companionText: { color: AppDesignTokens.colors.accentSoft, fontSize: AppDesignTokens.layout.v13, fontStyle: "italic", lineHeight: AppDesignTokens.layout.v18 },
  actionCard: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v20,
    padding: AppDesignTokens.layout.v32,
    alignItems: "center",
    gap: AppDesignTokens.layout.v16,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  actionStep: { color: AppDesignTokens.colors.textSubtle, fontSize: AppDesignTokens.layout.v12, fontWeight: "600" },
  actionIcon: { fontSize: AppDesignTokens.layout.v56 },
  actionLabel: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v20, fontWeight: "700", textAlign: "center" },
  markButton: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v12,
    paddingVertical: AppDesignTokens.layout.v14,
    paddingHorizontal: AppDesignTokens.layout.v40,
  },
  markButtonDone: { backgroundColor: AppDesignTokens.colors.success },
  markButtonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v16, fontWeight: "700" },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: AppDesignTokens.layout.v16,
  },
  skipButton: { paddingVertical: AppDesignTokens.layout.v12, paddingHorizontal: AppDesignTokens.layout.v20 },
  skipText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v14, fontWeight: "500" },
  finishButton: {
    backgroundColor: AppDesignTokens.colors.success,
    borderRadius: AppDesignTokens.layout.v12,
    paddingVertical: AppDesignTokens.layout.v12,
    paddingHorizontal: AppDesignTokens.layout.v24,
  },
  finishText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v14, fontWeight: "700" },
  resultContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v32,
  },
  resultEmoji: { fontSize: AppDesignTokens.layout.v56 },
  resultTitle: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v22, fontWeight: "bold" },
  resultXP: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v28, fontWeight: "900" },
  resultBonus: { color: AppDesignTokens.colors.success, fontSize: AppDesignTokens.layout.v13, fontWeight: "600" },
  resultStats: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v14 },
  companionResult: {
    color: AppDesignTokens.colors.accentSoft,
    fontSize: AppDesignTokens.layout.v14,
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: AppDesignTokens.layout.v20,
    marginTop: AppDesignTokens.layout.v8,
  },
  doneButton: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v12,
    paddingVertical: AppDesignTokens.layout.v14,
    paddingHorizontal: AppDesignTokens.layout.v32,
    marginTop: AppDesignTokens.layout.v16,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  doneButtonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v15, fontWeight: "600" },
});

const timer = StyleSheet.create({
  container: { alignItems: "center", gap: AppDesignTokens.layout.v12 },
  display: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v36, fontWeight: "bold", fontVariant: ["tabular-nums"] },
  button: {
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v10,
    paddingVertical: AppDesignTokens.layout.v10,
    paddingHorizontal: AppDesignTokens.layout.v28,
  },
  buttonStop: { backgroundColor: AppDesignTokens.colors.warning },
  buttonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v14, fontWeight: "700" },
});

const guided = StyleSheet.create({
  helpButton: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: AppDesignTokens.layout.v6,
    paddingVertical: AppDesignTokens.layout.v8,
    paddingHorizontal: AppDesignTokens.layout.v12,
    minHeight: AppDesignTokens.layout.v44,
  },
  helpText: { color: AppDesignTokens.colors.dangerSoft, fontSize: AppDesignTokens.layout.v13, fontWeight: AppDesignTokens.typography.semibold },
  section: { width: "100%", alignItems: "center", gap: AppDesignTokens.layout.v12 },
  phase: { color: AppDesignTokens.colors.accentSoft2, fontSize: AppDesignTokens.layout.v22, fontWeight: AppDesignTokens.typography.bold, textAlign: "center" },
  timer: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v36, fontWeight: AppDesignTokens.typography.bold, fontVariant: ["tabular-nums"] },
  prompt: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v15, lineHeight: AppDesignTokens.layout.v22, textAlign: "center" },
  hint: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v13, lineHeight: AppDesignTokens.layout.v18, textAlign: "center" },
  privacy: { color: AppDesignTokens.colors.textSubtle, fontSize: AppDesignTokens.layout.v12, lineHeight: AppDesignTokens.layout.v17, textAlign: "center" },
  input: {
    width: "100%",
    minHeight: AppDesignTokens.layout.v120,
    padding: AppDesignTokens.layout.v14,
    borderRadius: AppDesignTokens.layout.v12,
    borderWidth: AppDesignTokens.layout.v1,
    borderColor: AppDesignTokens.colors.borderSoft,
    backgroundColor: AppDesignTokens.colors.background,
    color: AppDesignTokens.colors.text,
    fontSize: AppDesignTokens.layout.v14,
    lineHeight: AppDesignTokens.layout.v20,
    textAlignVertical: "top",
  },
  primaryButton: {
    minHeight: AppDesignTokens.layout.v44,
    justifyContent: "center",
    paddingVertical: AppDesignTokens.layout.v10,
    paddingHorizontal: AppDesignTokens.layout.v24,
    borderRadius: AppDesignTokens.layout.v10,
    backgroundColor: AppDesignTokens.colors.accent,
  },
  primaryButtonText: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v14, fontWeight: AppDesignTokens.typography.bold },
});
