import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAchievements } from "@/features/gamification/hooks/useAchievements";
import { AppDesignTokens } from '@/constants/AppDesignTokens';
import { AppIcon } from "@/components/AppIcon";
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
      <View style={styles.cardIcon}>
        <AppIcon
          name={unlocked ? def.icon : "lock"}
          color={unlocked ? AppDesignTokens.colors.accentSoft : AppDesignTokens.colors.textStrong}
          size={unlocked ? AppDesignTokens.icons.sizeLg : AppDesignTokens.icons.sizeMd}
        />
      </View>
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
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Fermer">
          <AppIcon name="close" color={AppDesignTokens.colors.textMuted} size={AppDesignTokens.icons.sizeSm} />
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
          <Text style={[styles.summaryValue, { color: AppDesignTokens.colors.accent }]}>+{totalXP}</Text>
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
              <AppIcon name={meta.icon} color={activeCategory === cat ? AppDesignTokens.colors.accentSoft : AppDesignTokens.colors.textMuted} size={AppDesignTokens.icons.sizeXs} />
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
  container: { flex: 1, backgroundColor: AppDesignTokens.colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: AppDesignTokens.layout.v20,
    paddingVertical: AppDesignTokens.layout.v12,
  },
  headerTitle: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v17, fontWeight: "700" },
  headerCount: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v14, fontWeight: "700" },
  summary: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: AppDesignTokens.colors.surface,
    marginHorizontal: AppDesignTokens.layout.v16,
    borderRadius: AppDesignTokens.layout.v14,
    paddingVertical: AppDesignTokens.layout.v16,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  summaryItem: { alignItems: "center", gap: AppDesignTokens.layout.v2 },
  summaryValue: { color: AppDesignTokens.colors.text, fontSize: AppDesignTokens.layout.v22, fontWeight: "900" },
  summaryLabel: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v11, textTransform: "uppercase", letterSpacing: AppDesignTokens.layout.v0p5 },
  summaryDivider: { width: AppDesignTokens.layout.v1, height: AppDesignTokens.layout.v30, backgroundColor: AppDesignTokens.colors.border },
  categoryScroll: {
    paddingHorizontal: AppDesignTokens.layout.v16,
    paddingVertical: AppDesignTokens.layout.v12,
    gap: AppDesignTokens.layout.v8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v20,
    paddingVertical: AppDesignTokens.layout.v7,
    paddingHorizontal: AppDesignTokens.layout.v12,
    gap: AppDesignTokens.layout.v5,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
    marginRight: AppDesignTokens.layout.v8,
  },
  categoryChipActive: { borderColor: AppDesignTokens.colors.accent, backgroundColor: AppDesignTokens.colors.surfaceAccent },
  categoryLabel: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v12, fontWeight: "500" },
  categoryLabelActive: { color: AppDesignTokens.colors.text },
  categoryStat: { color: AppDesignTokens.colors.textSubtle, fontSize: AppDesignTokens.layout.v10, fontWeight: "600" },
  scroll: { flex: 1 },
  content: { padding: AppDesignTokens.layout.v16, gap: AppDesignTokens.layout.v8, paddingBottom: AppDesignTokens.layout.v40 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: AppDesignTokens.layout.v14,
    padding: AppDesignTokens.layout.v14,
    gap: AppDesignTokens.layout.v12,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
    opacity: 0.5,
  },
  cardUnlocked: { opacity: 1, borderColor: AppDesignTokens.colors.accent30 },
  cardIcon: { width: AppDesignTokens.layout.v36, alignItems: "center", justifyContent: "center" },
  cardInfo: { flex: 1, gap: AppDesignTokens.layout.v3 },
  cardTitle: { color: AppDesignTokens.colors.textMuted, fontSize: AppDesignTokens.layout.v15, fontWeight: "600" },
  cardTitleLocked: { color: AppDesignTokens.colors.neutralDarker },
  cardDesc: { color: AppDesignTokens.colors.textSubtle, fontSize: AppDesignTokens.layout.v12 },
  cardDate: { color: AppDesignTokens.colors.accent, fontSize: AppDesignTokens.layout.v11, fontWeight: "500" },
  cardXP: { color: AppDesignTokens.colors.neutralDark, fontSize: AppDesignTokens.layout.v13, fontWeight: "700" },
  cardXPUnlocked: { color: AppDesignTokens.colors.success, fontSize: AppDesignTokens.layout.v16 },
  progressBar: {
    height: AppDesignTokens.layout.v6,
    backgroundColor: AppDesignTokens.colors.surfaceMutedAlt,
    borderRadius: AppDesignTokens.layout.v3,
    overflow: "hidden",
    marginTop: AppDesignTokens.layout.v4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: AppDesignTokens.colors.accent,
    borderRadius: AppDesignTokens.layout.v3,
  },
  progressText: {
    position: "absolute",
    right: AppDesignTokens.layout.v0,
    top: AppDesignTokens.layout.vMinus14,
    color: AppDesignTokens.colors.textSubtle,
    fontSize: AppDesignTokens.layout.v10,
    fontWeight: "500",
  },
});
