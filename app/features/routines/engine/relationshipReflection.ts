import type { AppIconName } from "@/components/AppIcon";

export const RELATIONSHIP_ACTION_PREFIX = "relationship-reflection-";

export type RelationshipReflectionAction = {
  id: string;
  label: string;
  icon: AppIconName;
  durationSeconds?: number;
};

export const RELATIONSHIP_REFLECTION_ACTIONS: readonly RelationshipReflectionAction[] = [
  { id: `${RELATIONSHIP_ACTION_PREFIX}arrival`, label: "Je me pose", icon: "heart" },
  { id: `${RELATIONSHIP_ACTION_PREFIX}breathing`, label: "Respiration régulière", icon: "wind", durationSeconds: 180 },
  { id: `${RELATIONSHIP_ACTION_PREFIX}journal`, label: "Ce que j’observe", icon: "notebook" },
  { id: `${RELATIONSHIP_ACTION_PREFIX}visualization`, label: "Visualisation douce", icon: "eye", durationSeconds: 120 },
  { id: `${RELATIONSHIP_ACTION_PREFIX}next-step`, label: "Mon prochain petit pas", icon: "footprints" },
] as const;

export function isRelationshipReflectionAction(id: string): boolean {
  return id.startsWith(RELATIONSHIP_ACTION_PREFIX);
}

export function getBreathingPhase(elapsedSeconds: number): "inhale" | "exhale" {
  return Math.floor(Math.max(0, elapsedSeconds) / 5) % 2 === 0 ? "inhale" : "exhale";
}
