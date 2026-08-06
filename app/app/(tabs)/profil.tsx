import { useState } from "react";
import { useClerk, useUser } from "@clerk/expo";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppDesignTokens } from '@/constants/AppDesignTokens';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCompanion } from "@/features/companion/hooks/useCompanion";
import { CompanionAvatar } from "@/features/companion/components/CompanionAvatar";
import { useAchievements } from "@/features/gamification/hooks/useAchievements";
import { ACHIEVEMENTS } from "@/constants/achievements";
import { useMode } from "@/features/mode";
import { SignatureMove } from "@/features/gamification/components/SignatureMove";

type MenuItemProps = {
  label: string;
  onPress: () => void;
  danger?: boolean;
  sub?: string;
};

function MenuItem({ label, onPress, danger, sub }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Text style={[styles.menuItemText, danger && styles.dangerText]}>
          {label}
        </Text>
        {sub ? <Text style={styles.menuItemSub}>{sub}</Text> : null}
      </View>
      <Text style={styles.menuItemArrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function ProfilScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const { companionId, personality } = useCompanion();
  const { unlocked, count } = useAchievements();
  const { mode, toggle, vocab } = useMode();
  const exportData = useQuery(api.users.exportAllUserData, {});
  const deleteAllData = useMutation(api.users.deleteAllUserData);
  const [deleting, setDeleting] = useState(false);

  async function handleExport() {
    if (!exportData) return;
    const json = JSON.stringify(exportData, null, 2);
    await Share.share({
      message: json,
      title: "Mes données Claiire",
    });
  }

  function handleDeleteAccount() {
    Alert.alert(
      "Supprimer mon compte",
      "Toutes tes données seront définitivement supprimées. Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer tout",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Tu es sûr ?",
              "Dernière chance. Toutes tes données, XP, habitudes, messages seront perdus.",
              [
                { text: "Non, garder", style: "cancel" },
                {
                  text: "Supprimer définitivement",
                  style: "destructive",
                  onPress: async () => {
                    setDeleting(true);
                    try {
                      await deleteAllData({});
                      await signOut();
                      router.replace("/(auth)/login");
                    } catch {
                      Alert.alert("Erreur", "La suppression a échoué. Réessaie.");
                      setDeleting(false);
                    }
                  },
                },
              ],
            );
          },
        },
      ],
    );
  }

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName ?? user?.username ?? "Guerrier";

  function handleSignOut() {
    Alert.alert(
      "Déconnexion",
      "Tu veux vraiment quitter le champ de bataille ?",
      [
        { text: "Rester", style: "cancel" },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/(auth)/login");
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* User header */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>
              {displayName[0]?.toUpperCase() ?? "?"}
            </Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        {/* Mode toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode</Text>
          <TouchableOpacity style={styles.modeToggle} onPress={toggle}>
            <View style={styles.modeOption}>
              <Text style={[styles.modeEmoji, mode === "warrior" && styles.modeActive]}>⚔️</Text>
              <Text style={[styles.modeLabel, mode === "warrior" && styles.modeLabelActive]}>Warrior</Text>
            </View>
            <View style={[styles.modeSwitch, mode === "zen" && styles.modeSwitchZen]}>
              <View style={[styles.modeDot, mode === "zen" && styles.modeDotZen]} />
            </View>
            <View style={styles.modeOption}>
              <Text style={[styles.modeEmoji, mode === "zen" && styles.modeActive]}>🧘</Text>
              <Text style={[styles.modeLabel, mode === "zen" && styles.modeLabelActive]}>Zen</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Active companion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{vocab.companionSection}</Text>
          <View style={styles.companionCard}>
            {companionId && personality ? (
              <>
                <CompanionAvatar
                  companionId={companionId}
                  emotion="idle"
                  size={72}
                  showName
                />
                <View style={styles.companionInfo}>
                  <Text style={styles.companionDesc}>
                    {personality.description}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.changeButton,
                      { borderColor: personality.color },
                    ]}
                    onPress={() => router.push("/(auth)/onboarding" as never)}
                  >
                    <Text
                      style={[
                        styles.changeButtonText,
                        { color: personality.color },
                      ]}
                    >
                      {vocab.changeCompanion}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <TouchableOpacity
                style={styles.noCompanionButton}
                onPress={() => router.push("/(auth)/onboarding" as never)}
              >
                <Text style={styles.noCompanionText}>
                  Choisir un compagnon →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <Text style={styles.achievementCount}>{count}/{ACHIEVEMENTS.length}</Text>
          </View>
          <TouchableOpacity
            style={styles.achievementCard}
            onPress={() => router.push("/modal/achievement" as never)}
          >
            <View style={styles.achievementIcons}>
              {unlocked.slice(0, 5).map((a) => (
                <Text key={a._id} style={styles.achievementIcon}>
                  {a.def?.icon ?? "🏆"}
                </Text>
              ))}
              {count === 0 && <Text style={styles.achievementEmpty}>Aucun pour l'instant</Text>}
            </View>
            <Text style={styles.achievementArrow}>Voir tout ›</Text>
          </TouchableOpacity>
        </View>

        {/* Signature Move */}
        <SignatureMove />

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte</Text>
          <View style={styles.menuGroup}>
            <MenuItem label="Modifier le profil" onPress={() => router.push("/modal/settings" as never)} />
            <MenuItem label="Notifications" onPress={() => router.push("/modal/settings" as never)} sub="Alertes et rappels" />
            <MenuItem label="Abonnement" onPress={() => {}} sub="Plan gratuit" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confidentialité</Text>
          <View style={styles.menuGroup}>
            <MenuItem label="Exporter mes données" onPress={handleExport} sub="Format JSON" />
            <MenuItem
              label="Supprimer mon compte"
              onPress={handleDeleteAccount}
              danger
            />
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Se déconnecter</Text>
        </TouchableOpacity>

        {deleting && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={AppDesignTokens.colors.dangerSoft} />
            <Text style={styles.overlayText}>Suppression en cours...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppDesignTokens.colors.background },
  content: { padding: 20, gap: 24, paddingBottom: 40 },
  userSection: {
    alignItems: "center",
    paddingVertical: 8,
    gap: 6,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: AppDesignTokens.colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { fontSize: 28, fontWeight: "bold", color: AppDesignTokens.colors.text },
  name: { fontSize: 20, fontWeight: "bold", color: AppDesignTokens.colors.text },
  email: { fontSize: 13, color: AppDesignTokens.colors.textMuted },
  section: { gap: 8 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: AppDesignTokens.colors.textSubtle,
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 4,
  },
  companionCard: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  companionInfo: { flex: 1, gap: 10 },
  companionDesc: { color: AppDesignTokens.colors.textMuted, fontSize: 13, lineHeight: 18 },
  changeButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  changeButtonText: { fontSize: 13, fontWeight: "600" },
  noCompanionButton: {
    padding: 8,
  },
  noCompanionText: { color: AppDesignTokens.colors.accent, fontSize: 15, fontWeight: "500" },
  menuGroup: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppDesignTokens.colors.border,
  },
  menuItemLeft: { gap: 2 },
  menuItemText: { color: AppDesignTokens.colors.text, fontSize: 15 },
  menuItemSub: { color: AppDesignTokens.colors.textSubtle, fontSize: 12 },
  menuItemArrow: { color: AppDesignTokens.colors.textSubtle, fontSize: 18 },
  dangerText: { color: AppDesignTokens.colors.dangerSoft },
  signOutButton: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  signOutText: { color: AppDesignTokens.colors.dangerSoft, fontSize: 16, fontWeight: "500" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  achievementCount: { color: AppDesignTokens.colors.accent, fontSize: 13, fontWeight: "700" },
  achievementCard: {
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
    gap: 10,
  },
  achievementIcons: { flexDirection: "row", gap: 8, alignItems: "center" },
  achievementIcon: { fontSize: 24 },
  achievementEmpty: { color: AppDesignTokens.colors.textSubtle, fontSize: 13 },
  achievementArrow: { color: AppDesignTokens.colors.accent, fontSize: 13, fontWeight: "600", textAlign: "right" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: AppDesignTokens.colors.mutedBg,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  overlayText: { color: AppDesignTokens.colors.dangerSoft, fontSize: 15, fontWeight: "500" },
  modeToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppDesignTokens.colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: AppDesignTokens.colors.border,
  },
  modeOption: { alignItems: "center", gap: 4 },
  modeEmoji: { fontSize: 28, opacity: 0.4 },
  modeActive: { opacity: 1 },
  modeLabel: { fontSize: 13, color: AppDesignTokens.colors.textSubtle, fontWeight: "500" },
  modeLabelActive: { color: AppDesignTokens.colors.text, fontWeight: "700" },
  modeSwitch: {
    width: 48,
    height: 26,
    borderRadius: 13,
    backgroundColor: AppDesignTokens.colors.accent,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  modeSwitchZen: { backgroundColor: AppDesignTokens.colors.accentAlt },
  modeDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: AppDesignTokens.colors.text,
  },
  modeDotZen: { alignSelf: "flex-end" },
});
