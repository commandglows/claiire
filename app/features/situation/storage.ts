import * as SecureStore from "expo-secure-store";
import type { SituationState } from "./types";

const STORAGE_KEY = "claiire.situation.v1";

export async function loadSituation(): Promise<SituationState | null> {
  try {
    const value = await SecureStore.getItemAsync(STORAGE_KEY);
    return value ? (JSON.parse(value) as SituationState) : null;
  } catch {
    return null;
  }
}

export async function saveSituation(state: SituationState): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(state));
}

export async function deleteSituation(): Promise<void> {
  await SecureStore.deleteItemAsync(STORAGE_KEY);
}
