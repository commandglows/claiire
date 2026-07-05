import { useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCompanionStore } from "../store";
import type { CompanionId, CompanionPersonality } from "../types";

import lumo from "../personalities/lumo.json";
import papillon from "../personalities/papillon.json";
import etoile from "../personalities/etoile.json";

const PERSONALITIES: Record<CompanionId, CompanionPersonality> = {
  lumo: lumo as CompanionPersonality,
  papillon: papillon as CompanionPersonality,
  etoile: etoile as CompanionPersonality,
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useCompanion() {
  const store = useCompanionStore();
  const profile = useQuery(api.users.getCurrentUser, {});

  // Sync companionId from Convex profile into the store on first load
  useEffect(() => {
    if (profile?.companionId && !store.companionId) {
      store.setCompanionId(profile.companionId as CompanionId);
    }
  }, [profile, store]);

  const companionId = store.companionId ?? (profile?.companionId as CompanionId | undefined) ?? null;
  const personality = companionId ? PERSONALITIES[companionId] : null;

  const greeting = useMemo(
    () => (personality ? pickRandom(personality.greetings) : "Bonjour."),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [companionId],
  );

  function getEncouragement(): string {
    if (!personality) return "Continue comme ça.";
    return pickRandom(personality.encouragements);
  }

  return {
    companionId,
    personality,
    emotion: store.emotion,
    isListening: store.isListening,
    isSpeaking: store.isSpeaking,
    greeting,
    getEncouragement,
    setEmotion: store.setEmotion,
    setIsListening: store.setIsListening,
    setIsSpeaking: store.setIsSpeaking,
  };
}
