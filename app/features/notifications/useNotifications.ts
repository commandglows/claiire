import { useEffect, useRef } from "react";
import {
  addNotificationResponseReceivedListener,
  type NotificationResponse,
} from "expo-notifications";
import type { EventSubscription } from "expo-modules-core";
import { useRouter } from "expo-router";
import {
  requestPermissions,
  scheduleDailyReminder,
  scheduleStreakWarning,
  setupNotificationChannel,
} from "./notificationService";

/**
 * Hook to initialize notifications and handle taps.
 * Call once in the root layout.
 */
export function useNotifications() {
  const router = useRouter();
  const responseListener = useRef<EventSubscription | null>(null);

  useEffect(() => {
    // Setup
    setupNotificationChannel();
    requestPermissions().then((granted) => {
      if (granted) {
        scheduleDailyReminder(9, 0);
        scheduleStreakWarning();
      }
    });

    // Handle notification taps
    responseListener.current = addNotificationResponseReceivedListener(
      (response: NotificationResponse) => {
        const data = response.notification.request.content.data as { type?: string };
        switch (data?.type) {
          case "daily_reminder":
          case "streak_warning":
            router.push("/(tabs)/journal" as never);
            break;
          case "achievement":
            router.push("/modal/achievement" as never);
            break;
        }
      },
    );

    return () => {
      responseListener.current?.remove();
    };
  }, [router]);
}
