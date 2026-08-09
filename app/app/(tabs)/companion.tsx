import { useState, useEffect, useRef } from "react";
import { AppDesignTokens } from '@/constants/AppDesignTokens';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCompanion } from "@/features/companion/hooks/useCompanion";
import { useConversation } from "@/features/companion/hooks/useConversation";
import { CompanionAvatar } from "@/features/companion/components/CompanionAvatar";
import { MILESTONES } from "@/convex/discovery";
import {
  CONTEXTUAL_PROMPTS,
  getContextualGreeting,
} from "@/features/companion/engine/contextMessages";

type Message = {
  id: string;
  role: "user" | "companion";
  text: string;
};

type CompanionContext = {
  level: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  todayLogCount: number;
  todayHabitsDone: number;
  totalActiveHabits: number;
  hasLoggedToday: boolean;
  recentCrisis: { hoursAgo: number; intensity: number } | null;
  activePatterns: { type: string; confidence: number }[];
  hour: number;
};

export default function CompanionScreen() {
  const router = useRouter();
  const {
    companionId,
    personality,
    emotion,
    setEmotion,
  } = useCompanion();

  const { savedMessages, persistMessage } = useConversation(
    companionId ?? "lumo",
  );

  const context = useQuery(api.companion.getCompanionContext, {}) as CompanionContext | null;
  const pendingDiscoveries = (useQuery(api.discovery.getPendingDiscoveries, {}) ?? []) as string[];
  const acknowledgeMilestone = useMutation(api.discovery.acknowledge);

  const [messages, setMessages] = useState<Message[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [shownDiscoveries, setShownDiscoveries] = useState<Set<string>>(new Set());
  const scrollRef = useRef<ScrollView>(null);

  const userName = "guerrier"; // TODO: from profile

  // Load saved messages or show contextual greeting
  useEffect(() => {
    if (hasInitialized || !personality || !context) return;
    setHasInitialized(true);

    if (savedMessages.length > 0) {
      setMessages(
        savedMessages.map((m: { _id: string; role: "user" | "companion"; content: string }) => ({
          id: m._id,
          role: m.role,
          text: m.content,
        })),
      );
    } else {
      const greetingText = getContextualGreeting(
        context,
        personality.name,
        userName,
      );
      const greetingMsg: Message = {
        id: "greeting",
        role: "companion",
        text: greetingText,
      };
      setMessages([greetingMsg]);
      if (companionId) persistMessage("companion", greetingText);
    }
  }, [savedMessages, personality, hasInitialized, context, companionId, persistMessage, userName]);

  // Show discovery messages when new milestones are pending
  useEffect(() => {
    if (!hasInitialized || !personality || pendingDiscoveries.length === 0) return;

    for (const milestoneId of pendingDiscoveries) {
      if (shownDiscoveries.has(milestoneId)) continue;

      const def = MILESTONES.find((m) => m.id === milestoneId);
      if (!def) continue;

      setShownDiscoveries((prev) => new Set([...prev, milestoneId]));

      // Show discovery message with delay
      setTimeout(() => {
        const discoveryText = `${def.emoji} ${def.companionMessage}\n\n💡 ${def.featureHint}`;
        const id = `discovery_${milestoneId}`;
        setMessages((prev) => [...prev, { id, role: "companion", text: discoveryText }]);
        if (companionId) persistMessage("companion", discoveryText);
        acknowledgeMilestone({ milestoneId });
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
      }, 1500);

      break; // Show one at a time
    }
  }, [pendingDiscoveries, hasInitialized, personality, shownDiscoveries, companionId, persistMessage, acknowledgeMilestone]);

  function addMessage(role: "user" | "companion", text: string) {
    const id = String(Date.now() + Math.random());
    setMessages((prev) => [...prev, { id, role, text }]);
    if (companionId) persistMessage(role, text);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }

  function handlePrompt(promptId: string) {
    if (!personality || !context) return;

    const prompt = CONTEXTUAL_PROMPTS.find((p) => p.id === promptId);
    if (!prompt) return;

    // Show user's question
    addMessage("user", prompt.label);
    setEmotion("thinking");

    // Generate contextual response
    setTimeout(() => {
      const response = prompt.generate(context, userName);
      addMessage("companion", response);
      setEmotion("happy");
      setTimeout(() => setEmotion("idle"), 2000);
    }, 600 + Math.random() * 400);
  }

  // No companion selected
  if (!companionId || !personality) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>✨</Text>
          <Text style={styles.emptyTitle}>Pas de compagnon</Text>
          <Text style={styles.emptySubtitle}>
            Complète l'onboarding pour choisir ton compagnon
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Avatar section */}
      <View style={styles.avatarSection}>
        <CompanionAvatar
          companionId={companionId}
          emotion={emotion}
          size={140}
        />
        <View style={styles.nameBadge}>
          <Text style={[styles.companionName, { color: personality.color }]}>
            {personality.name}
          </Text>
          <View style={[styles.statusDot, { backgroundColor: personality.color }]} />
          <Text style={styles.statusText}>
            {emotion === "listening"
              ? "écoute..."
              : emotion === "thinking"
                ? "réfléchit..."
                : emotion === "speaking"
                  ? "parle..."
                  : "disponible"}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.bubble,
              msg.role === "user" ? styles.bubbleUser : styles.bubbleCompanion,
              msg.role === "companion" && {
                borderColor: personality.color + "40",
              },
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                msg.role === "user" && styles.bubbleTextUser,
              ]}
            >
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Quick prompts */}
      <View style={styles.promptsSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promptsScroll}
        >
          {CONTEXTUAL_PROMPTS.map((prompt) => (
            <TouchableOpacity
              key={prompt.id}
              style={[styles.promptChip, { borderColor: personality.color + "60" }]}
              onPress={() => handlePrompt(prompt.id)}
            >
              <Text style={styles.promptEmoji}>{prompt.emoji}</Text>
              <Text style={styles.promptLabel}>{prompt.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bottom actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.sosButton]}
          onPress={() => router.push("/modal/battle-report" as never)}
        >
          <Text style={styles.sosEmoji}>🆘</Text>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.voiceButton, { backgroundColor: personality.color }]}
          activeOpacity={0.8}
        >
          <Text style={styles.voiceEmoji}>🎙️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolsButton]}
          onPress={() => router.push("/modal/crisis-support" as never)}
        >
          <Text style={styles.toolsEmoji}>🛡️</Text>
          <Text style={styles.toolsText}>Arsenal</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.voiceHint}>
        Conversation vocale disponible après téléchargement du modèle IA
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppDesignTokens.colors.background },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: AppDesignTokens.layout.v12,
    padding: AppDesignTokens.layout.v24,
  },
  emptyEmoji: { fontSize: AppDesignTokens.layout.v64 },
  emptyTitle: { fontSize: AppDesignTokens.layout.v20, fontWeight: "bold", color: AppDesignTokens.colors.text },
  emptySubtitle: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v14, textAlign: "center" },
  avatarSection: {
    alignItems: "center",
    paddingVertical: AppDesignTokens.layout.v20,
    gap: AppDesignTokens.layout.v10,
  },
  nameBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: AppDesignTokens.layout.v6,
  },
  companionName: { fontSize: AppDesignTokens.layout.v18, fontWeight: "700" },
  statusDot: { width: AppDesignTokens.layout.v7, height: AppDesignTokens.layout.v7, borderRadius: AppDesignTokens.layout.v4 },
  statusText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v13 },
  messagesContainer: { flex: 1 },
  messagesList: {
    padding: AppDesignTokens.layout.v16,
    gap: AppDesignTokens.layout.v10,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: AppDesignTokens.layout.v16,
    padding: AppDesignTokens.layout.v12,
    borderWidth: 1,
  },
  bubbleCompanion: {
    alignSelf: "flex-start",
    backgroundColor: AppDesignTokens.colors.surface,
    borderColor: AppDesignTokens.colors.border,
  },
  bubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: AppDesignTokens.colors.panel,
    borderColor: AppDesignTokens.colors.accent,
  },
  bubbleText: { color: AppDesignTokens.colors.borderMuted, fontSize: AppDesignTokens.layout.v15, lineHeight: AppDesignTokens.layout.v21 },
  bubbleTextUser: { color: AppDesignTokens.colors.text },
  promptsSection: {
    borderTopWidth: 1,
    borderTopColor: AppDesignTokens.colors.surface,
    paddingVertical: AppDesignTokens.layout.v10,
  },
  promptsScroll: {
    paddingHorizontal: AppDesignTokens.layout.v16,
    gap: AppDesignTokens.layout.v8,
  },
  promptChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v20,
    paddingVertical: AppDesignTokens.layout.v8,
    paddingHorizontal: AppDesignTokens.layout.v14,
    gap: AppDesignTokens.layout.v6,
    borderWidth: 1,
    marginRight: AppDesignTokens.layout.v8,
  },
  promptEmoji: { fontSize: AppDesignTokens.layout.v16 },
  promptLabel: { color: AppDesignTokens.colors.neutralBorder, fontSize: AppDesignTokens.layout.v13, fontWeight: "500" },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: AppDesignTokens.layout.v16,
    paddingVertical: AppDesignTokens.layout.v10,
    gap: AppDesignTokens.layout.v12,
  },
  sosButton: {
    flex: 1,
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v14,
    paddingVertical: AppDesignTokens.layout.v10,
    alignItems: "center",
    gap: AppDesignTokens.layout.v3,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.dangerSoft40,
  },
  sosEmoji: { fontSize: AppDesignTokens.layout.v20 },
  sosText: { color: AppDesignTokens.colors.dangerSoft, fontSize: AppDesignTokens.layout.v11, fontWeight: "600" },
  voiceButton: {
    width: AppDesignTokens.layout.v56,
    height: AppDesignTokens.layout.v56,
    borderRadius: AppDesignTokens.layout.v28,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: AppDesignTokens.layout.v0, height: AppDesignTokens.layout.v4 },
    shadowOpacity: AppDesignTokens.layout.v0p4,
    shadowRadius: AppDesignTokens.layout.v12,
    elevation: AppDesignTokens.layout.v8,
  },
  voiceEmoji: { fontSize: AppDesignTokens.layout.v24 },
  toolsButton: {
    flex: 1,
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v14,
    paddingVertical: AppDesignTokens.layout.v10,
    alignItems: "center",
    gap: AppDesignTokens.layout.v3,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  toolsEmoji: { fontSize: AppDesignTokens.layout.v20 },
  toolsText: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v11, fontWeight: "600" },
  voiceHint: {
    color: AppDesignTokens.colors.textStrong,
    fontSize: AppDesignTokens.layout.v11,
    textAlign: "center",
    paddingHorizontal: AppDesignTokens.layout.v24,
    paddingBottom: AppDesignTokens.layout.v10,
  },
});
