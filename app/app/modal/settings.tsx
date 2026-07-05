import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/expo";
import { useNotificationStore } from "@/features/notifications/notificationStore";
import {
  scheduleDailyReminder,
  cancelDailyReminder,
} from "@/features/notifications/notificationService";
import { useMode } from "@/features/mode";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6h to 21h

function SettingRow({
  label,
  sub,
  value,
  onToggle,
}: {
  label: string;
  sub?: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleInfo}>
        <Text style={styles.label}>{label}</Text>
        {sub && <Text style={styles.sublabel}>{sub}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#2a2a4a", true: "#6c47ff" }}
        thumbColor="#fff"
      />
    </View>
  );
}

export default function SettingsModal() {
  const router = useRouter();
  const { user } = useUser();
  const { mode, vocab } = useMode();

  const notifStore = useNotificationStore();

  const [displayName, setDisplayName] = useState(
    user?.firstName ?? user?.username ?? "",
  );
  const [nameSaved, setNameSaved] = useState(false);

  async function handleToggleReminders(enabled: boolean) {
    notifStore.setRemindersEnabled(enabled);
    if (enabled) {
      await scheduleDailyReminder(notifStore.reminderHour, notifStore.reminderMinute);
    } else {
      await cancelDailyReminder();
    }
  }

  async function handleChangeHour(hour: number) {
    notifStore.setReminderTime(hour, notifStore.reminderMinute);
    if (notifStore.remindersEnabled) {
      await scheduleDailyReminder(hour, notifStore.reminderMinute);
    }
  }

  async function handleSaveName() {
    if (!displayName.trim()) return;
    try {
      await user?.update({ firstName: displayName.trim() });
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    } catch {
      Alert.alert("Erreur", "Impossible de mettre à jour le nom.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Réglages</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Display name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Nom d'affichage</Text>
            <View style={styles.nameRow}>
              <TextInput
                style={styles.nameInput}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Ton nom"
                placeholderTextColor="#555"
                maxLength={30}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}>
                <Text style={styles.saveButtonText}>
                  {nameSaved ? "✓" : "Sauver"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <SettingRow
              label="Rappel quotidien"
              sub="Un rappel pour logger tes données"
              value={notifStore.remindersEnabled}
              onToggle={handleToggleReminders}
            />

            {notifStore.remindersEnabled && (
              <>
                <Text style={styles.sublabel}>Heure du rappel</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.hourRow}
                >
                  {HOURS.map((h) => (
                    <TouchableOpacity
                      key={h}
                      style={[
                        styles.hourChip,
                        h === notifStore.reminderHour && styles.hourChipActive,
                      ]}
                      onPress={() => handleChangeHour(h)}
                    >
                      <Text
                        style={[
                          styles.hourText,
                          h === notifStore.reminderHour && styles.hourTextActive,
                        ]}
                      >
                        {h}h
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            <View style={styles.divider} />

            <SettingRow
              label="Alerte séquence"
              sub="Prévenir à 20h si rien n'est loggé"
              value={notifStore.streakWarningEnabled}
              onToggle={notifStore.setStreakWarningEnabled}
            />

            <View style={styles.divider} />

            <SettingRow
              label="Alertes prédictives"
              sub="Prévenir avant une fenêtre à risque"
              value={notifStore.predictiveAlertsEnabled}
              onToggle={notifStore.setPredictiveAlertsEnabled}
            />
          </View>
        </View>

        {/* Quiet hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Heures calmes</Text>
          <View style={styles.card}>
            <SettingRow
              label="Mode silencieux"
              sub={`Pas de notifications de ${notifStore.quietStart}h à ${notifStore.quietEnd}h`}
              value={notifStore.quietHoursEnabled}
              onToggle={notifStore.setQuietHoursEnabled}
            />
            {notifStore.quietHoursEnabled && (
              <View style={styles.quietRow}>
                <View style={styles.quietItem}>
                  <Text style={styles.quietLabel}>Début</Text>
                  <View style={styles.quietPicker}>
                    <TouchableOpacity
                      style={styles.quietArrow}
                      onPress={() =>
                        notifStore.setQuietHours(
                          (notifStore.quietStart - 1 + 24) % 24,
                          notifStore.quietEnd,
                        )
                      }
                    >
                      <Text style={styles.quietArrowText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.quietTime}>{notifStore.quietStart}h</Text>
                    <TouchableOpacity
                      style={styles.quietArrow}
                      onPress={() =>
                        notifStore.setQuietHours(
                          (notifStore.quietStart + 1) % 24,
                          notifStore.quietEnd,
                        )
                      }
                    >
                      <Text style={styles.quietArrowText}>›</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.quietDash}>→</Text>
                <View style={styles.quietItem}>
                  <Text style={styles.quietLabel}>Fin</Text>
                  <View style={styles.quietPicker}>
                    <TouchableOpacity
                      style={styles.quietArrow}
                      onPress={() =>
                        notifStore.setQuietHours(
                          notifStore.quietStart,
                          (notifStore.quietEnd - 1 + 24) % 24,
                        )
                      }
                    >
                      <Text style={styles.quietArrowText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.quietTime}>{notifStore.quietEnd}h</Text>
                    <TouchableOpacity
                      style={styles.quietArrow}
                      onPress={() =>
                        notifStore.setQuietHours(
                          notifStore.quietStart,
                          (notifStore.quietEnd + 1) % 24,
                        )
                      }
                    >
                      <Text style={styles.quietArrowText}>›</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Stealth mode */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confidentialité</Text>
          <View style={styles.card}>
            <SettingRow
              label="Mode discret"
              sub='Notifications génériques : "Ton appli a un message"'
              value={notifStore.stealthMode}
              onToggle={notifStore.setStealthMode}
            />
            {notifStore.stealthMode && (
              <View style={styles.stealthPreview}>
                <Text style={styles.stealthTitle}>Aperçu notification :</Text>
                <View style={styles.stealthNotif}>
                  <Text style={styles.stealthNotifTitle}>App</Text>
                  <Text style={styles.stealthNotifBody}>Tu as un nouveau message</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* App info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>0.1.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mode</Text>
              <Text style={styles.infoValue}>
                {mode === "warrior" ? "⚔️ Warrior" : "🧘 Zen"}
              </Text>
            </View>
          </View>
        </View>
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
  scroll: { flex: 1 },
  content: { padding: 20, gap: 20, paddingBottom: 40 },
  section: { gap: 8 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  label: { color: "#fff", fontSize: 15, fontWeight: "500" },
  sublabel: { color: "#888", fontSize: 12 },
  divider: { height: 1, backgroundColor: "#2a2a4a" },
  nameRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  nameInput: {
    flex: 1,
    backgroundColor: "#0f0f1a",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  saveButton: {
    backgroundColor: "#6c47ff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  saveButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleInfo: { flex: 1, gap: 2, paddingRight: 12 },
  hourRow: { gap: 8, paddingVertical: 4 },
  hourChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#0f0f1a",
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  hourChipActive: { backgroundColor: "#6c47ff", borderColor: "#6c47ff" },
  hourText: { color: "#888", fontSize: 14, fontWeight: "500" },
  hourTextActive: { color: "#fff", fontWeight: "700" },
  quietRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  quietItem: { alignItems: "center", gap: 6 },
  quietLabel: { color: "#888", fontSize: 11, textTransform: "uppercase" },
  quietPicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f1a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  quietArrow: { padding: 10 },
  quietArrowText: { color: "#6c47ff", fontSize: 18, fontWeight: "600" },
  quietTime: { color: "#fff", fontSize: 18, fontWeight: "700", minWidth: 40, textAlign: "center" },
  quietDash: { color: "#555", fontSize: 16 },
  stealthPreview: { gap: 8 },
  stealthTitle: { color: "#888", fontSize: 12 },
  stealthNotif: {
    backgroundColor: "#0f0f1a",
    borderRadius: 10,
    padding: 12,
    gap: 2,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  stealthNotifTitle: { color: "#888", fontSize: 12, fontWeight: "600" },
  stealthNotifBody: { color: "#fff", fontSize: 14 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: { color: "#888", fontSize: 14 },
  infoValue: { color: "#fff", fontSize: 14, fontWeight: "500" },
});
