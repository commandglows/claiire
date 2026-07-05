/**
 * Offline Emergency Cache (AD-3)
 *
 * Stores ~50KB of critical data locally for offline crisis situations:
 * - Top 3 interventions (by success rate)
 * - Emergency contacts
 * - Active habits/missions
 * - Breathing exercise parameters
 * - Last companion personality
 *
 * Uses expo-secure-store for persistent local storage.
 * Updated on every app foreground.
 */

import * as SecureStore from "expo-secure-store";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CachedIntervention = {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  successRate: number | null;
};

export type CachedHabit = {
  id: string;
  name: string;
  icon: string;
};

export type EmergencyData = {
  interventions: CachedIntervention[];
  habits: CachedHabit[];
  companionName: string;
  companionEmoji: string;
  emergencyNumbers: { label: string; number: string }[];
  breathingParams: { inhale: number; hold: number; exhale: number; wait: number };
  groundingSteps: string[];
  updatedAt: number;
};

// ─── Default data (always available) ─────────────────────────────────────────

const DEFAULT_DATA: EmergencyData = {
  interventions: [
    { id: "breathe", emoji: "🧘", title: "Respiration", desc: "Respiration carrée 4-4-4-4", successRate: null },
    { id: "cold-water", emoji: "💧", title: "Eau froide", desc: "Poignets sous l'eau froide", successRate: null },
    { id: "walk", emoji: "🚶", title: "Marche", desc: "5 minutes dehors", successRate: null },
  ],
  habits: [],
  companionName: "Ton compagnon",
  companionEmoji: "✨",
  emergencyNumbers: [
    { label: "Suicide Écoute", number: "01 45 39 40 00" },
    { label: "SOS Amitié", number: "09 72 39 40 50" },
    { label: "Fil Santé Jeunes", number: "0 800 235 236" },
    { label: "SOS Addictions", number: "0 800 10 12 10" },
  ],
  breathingParams: { inhale: 4, hold: 4, exhale: 4, wait: 4 },
  groundingSteps: [
    "5 choses que tu vois",
    "4 choses que tu touches",
    "3 choses que tu entends",
    "2 choses que tu sens",
    "1 chose que tu goûtes",
  ],
  updatedAt: 0,
};

// In-memory fallback for synchronous access
let memoryCache: EmergencyData = DEFAULT_DATA;

// ─── Read / Write ────────────────────────────────────────────────────────────

const CACHE_KEY = "claiire_emergency_cache";

/**
 * Load cache from disk into memory. Call once at app start.
 */
export async function loadEmergencyCache(): Promise<void> {
  try {
    const raw = await SecureStore.getItemAsync(CACHE_KEY);
    if (raw) {
      memoryCache = { ...DEFAULT_DATA, ...JSON.parse(raw) };
    }
  } catch {
    // Use defaults
  }
}

/**
 * Get cached emergency data. Synchronous — always returns data.
 * Uses in-memory copy loaded at startup.
 */
export function getEmergencyData(): EmergencyData {
  return memoryCache;
}

/**
 * Update emergency cache with fresh data from Convex.
 * Called on app foreground and after significant data changes.
 */
export async function updateEmergencyCache(partial: Partial<EmergencyData>): Promise<void> {
  try {
    memoryCache = {
      ...memoryCache,
      ...partial,
      updatedAt: Date.now(),
    };
    await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify(memoryCache));
  } catch {
    // Silent failure — cache is best-effort
  }
}

/**
 * Check if cache is stale (>24 hours old).
 */
export function isCacheStale(): boolean {
  return Date.now() - memoryCache.updatedAt > 24 * 3_600_000;
}

/**
 * Clear the emergency cache (GDPR deletion).
 */
export async function clearEmergencyCache(): Promise<void> {
  memoryCache = DEFAULT_DATA;
  await SecureStore.deleteItemAsync(CACHE_KEY);
}
