import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/** Daily session ID — conversation grouped by day. */
function todaySessionId(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export function useConversation(companionId: string) {
  const sessionId = todaySessionId();
  const savedMessages = useQuery(api.companion.getSessionMessages, { sessionId });
  const saveMessageMutation = useMutation(api.companion.saveMessage);

  async function persistMessage(role: "user" | "companion", content: string) {
    // Fire-and-forget — don't block UI on save
    saveMessageMutation({ companionId, role, content, sessionId }).catch(
      () => {}, // silently ignore if not connected
    );
  }

  return {
    sessionId,
    savedMessages: savedMessages ?? [],
    persistMessage,
  };
}
