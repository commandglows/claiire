import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAchievements } from "@/features/gamification/hooks/useAchievements";
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  CATEGORY_LABELS,
  type AchievementCategory,
  type AchievementDef,
} from "@/constants/achievements";

function ProgressBar({ current, target }: { current: number; target: number }) {
  const pct = Math.min(current / target, 1) * 100;
  return (
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${pct}%` }]} />
      <Text style={styles.progressText}>{current}/{target}</Text>
    </View>
  );
}

function AchievementCard({
  def,
  unlocked,
  unlockedAt,
}: {
  def: AchievementDef;
  unlocked: boolean;
  unlockedAt?: number;
}) {
  return (
    <View style={[styles.card, unlocked && styles.cardUnlocked]}>
      <Text style={[styles.cardIcon, !unlocked && styles.cardIconLocked]}>
        {unlocked ? def.icon : "🔒"}
      </Text>
      <View style={styles.cardInfo}>
        <Text style={[styles.cardTitle, !unlocked && styles.cardTitleLocked]}>
          {def.title}
        </Text>
        <Text style={styles.cardDesc}>{def.description}</Text>
        {unlocked && unlockedAt && (
          <Text style={styles.cardDate}>
            {new Date(unlockedAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
            })}
          </Text>
        )}
        {!unlocked && def.target && (
          <ProgressBar current={0} target={def.target} />
        )}
      </View>
      <Text style={[styles.cardXP, unlocked && styles.cardXPUnlocked]}>
        {unlocked ? "✓" : `+${def.xpBonus}`}
      </Text>
    </View>
  );
}

export default function AchievementModal() {
  const router = useRouter();
  const { unlockedIds, unlocked, count } = useAchievements();
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | "all">("all");

  const unlockedMap = new Map(
    unlocked.map((a) => [a.achievementId, a.unlockedAt]),
  );

  const filtered =
    activeCategory === "all"
      ? ACHIEVEMENTS
      : ACHIEVEMENTS.filter((a) => a.category === activeCategory);

  const totalXP = unlocked.reduce((sum, a) => sum + (a.def?.xpBonus ?? 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <Text style={styles.headerCount}>
          {count}/{ACHIEVEMENTS.length}
        </Text>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{count}</Text>
          <Text style={styles.summaryLabel}>Débloqués</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{ACHIEVEMENTS.length - count}</Text>
          <Text style={styles.summaryLabel}>Restants</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: "#6c47ff" }]}>+{totalXP}</Text>
          <Text style={styles.summaryLabel}>XP gagné</Text>
        </View>
      </View>

      {/* Category tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        <TouchableOpacity
          style={[styles.categoryChip, activeCategory === "all" && styles.categoryChipActive]}
          onPress={() => setActiveCategory("all")}
        >
          <Text style={[styles.categoryLabel, activeCategory === "all" && styles.categoryLabelActive]}>
            Tout
          </Text>
        </TouchableOpacity>
        {ACHIEVEMENT_CATEGORIES.map((cat) => {
          const meta = CATEGORY_LABELS[cat];
          const catCount = ACHIEVEMENTS.filter((a) => a.category === cat).length;
          const catUnlocked = ACHIEVEMENTS.filter(
            (a) => a.category === cat && unlockedIds.has(a.id),
          ).length;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={styles.categoryEmoji}>{meta.emoji}</Text>
              <Text style={[styles.categoryLabel, activeCategory === cat && styles.categoryLabelActive]}>
                {meta.label}
              </Text>
              <Text style={styles.categoryStat}>{catUnlocked}/{catCount}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Achievement list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Show unlocked first */}
        {filtered
          .sort((a, b) => {
            const aUnlocked = unlockedIds.has(a.id) ? 0 : 1;
            const bUnlocked = unlockedIds.has(b.id) ? 0 : 1;
            return aUnlocked - bUnlocked;
          })
          .map((def) => (
            <AchievementCard
              key={def.id}
              def={def}
              unlocked={unlockedIds.has(def.id)}
              unlockedAt={unlockedMap.get(def.id)}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeText: { color: "#888", fontSize: 18, padding: 4 },
  headerTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  headerCount: { color: "#6c47ff", fontSize: 14, fontWeight: "700" },
  summary: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  summaryItem: { alignItems: "center", gap: 2 },
  summaryValue: { color: "#fff", fontSize: 22, fontWeight: "900" },
  summaryLabel: { color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 },
  summaryDivider: { width: 1, height: 30, backgroundColor: "#2a2a4a" },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    gap: 5,
    borderWidth: 1,
    borderColor: "#2a2a4a",
    marginRight: 8,
  },
  categoryChipActive: { borderColor: "#6c47ff", backgroundColor: "#1a1a3e" },
  categoryEmoji: { fontSize: 14 },
  categoryLabel: { color: "#888", fontSize: 12, fontWeight: "500" },
  categoryLabelActive: { color: "#fff" },
  categoryStat: { color: "#555", fontSize: 10, fontWeight: "600" },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 8, paddingBottom: 40 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#2a2a4a",
    opacity: 0.5,
  },
  cardUnlocked: { opacity: 1, borderColor: "#6c47ff30" },
  cardIcon: { fontSize: 28, width: 36, textAlign: "center" },
  cardIconLocked: { fontSize: 22 },
  cardInfo: { flex: 1, gap: 3 },
  cardTitle: { color: "#888", fontSize: 15, fontWeight: "600" },
  cardTitleLocked: { color: "#666" },
  cardDesc: { color: "#555", fontSize: 12 },
  cardDate: { color: "#6c47ff", fontSize: 11, fontWeight: "500" },
  cardXP: { color: "#444", fontSize: 13, fontWeight: "700" },
  cardXPUnlocked: { color: "#2f9e44", fontSize: 16 },
  progressBar: {
    height: 6,
    backgroundColor: "#13131f",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6c47ff",
    borderRadius: 3,
  },
  progressText: {
    position: "absolute",
    right: 0,
    top: -14,
    color: "#555",
    fontSize: 10,
    fontWeight: "500",
  },
});
