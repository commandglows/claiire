import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** Request notification permissions. Returns true if granted. */
export async function requestPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

/** Schedule a daily reminder at a given hour (local time). */
export async function scheduleDailyReminder(hour: number, minute: number): Promise<string> {
  // Cancel existing daily reminder first
  await cancelDailyReminder();

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Rapport du jour",
      body: "N'oublie pas de logger ton sommeil et ton humeur !",
      data: { type: "daily_reminder" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  return id;
}

/** Cancel the daily reminder. */
export async function cancelDailyReminder(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    const data = notif.content.data as { type?: string } | undefined;
    if (data?.type === "daily_reminder") {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

/** Schedule a streak-at-risk warning for tonight if no activity today. */
export async function scheduleStreakWarning(): Promise<string | null> {
  // Cancel existing streak warning first
  await cancelStreakWarning();

  // Schedule for 20:00 today
  const now = new Date();
  const target = new Date(now);
  target.setHours(20, 0, 0, 0);

  // If it's already past 20:00, skip
  if (now >= target) return null;

  const seconds = Math.floor((target.getTime() - now.getTime()) / 1000);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Séquence en danger !",
      body: "Tu n'as rien loggé aujourd'hui. Ne perds pas ta série !",
      data: { type: "streak_warning" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
    },
  });

  return id;
}

/** Cancel streak warning notification. */
export async function cancelStreakWarning(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    const data = notif.content.data as { type?: string } | undefined;
    if (data?.type === "streak_warning") {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

/** Fire an immediate notification for achievement unlock. */
export async function notifyAchievement(title: string, icon: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${icon} Achievement débloqué !`,
      body: title,
      data: { type: "achievement" },
    },
    trigger: null, // immediate
  });
}

/** Fire an immediate notification for daily combo. */
export async function notifyDailyCombo(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🔥 Combo du jour !",
      body: "Sommeil + Humeur + Habitude = +50 XP bonus !",
      data: { type: "daily_combo" },
    },
    trigger: null,
  });
}

/** Set up Android notification channel. Call once at app start. */
export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Claiire",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}
