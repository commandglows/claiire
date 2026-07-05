import { create } from "zustand";

type NotificationStore = {
  // Daily reminder
  reminderHour: number;
  reminderMinute: number;
  remindersEnabled: boolean;
  setReminderTime: (hour: number, minute: number) => void;
  setRemindersEnabled: (enabled: boolean) => void;

  // Streak warning (20h if no activity)
  streakWarningEnabled: boolean;
  setStreakWarningEnabled: (enabled: boolean) => void;

  // Predictive alerts
  predictiveAlertsEnabled: boolean;
  setPredictiveAlertsEnabled: (enabled: boolean) => void;

  // Quiet hours (no notifications)
  quietHoursEnabled: boolean;
  quietStart: number; // hour 0-23
  quietEnd: number;   // hour 0-23
  setQuietHoursEnabled: (enabled: boolean) => void;
  setQuietHours: (start: number, end: number) => void;

  // Stealth mode (AD-8e): discreet notifications, neutral text
  stealthMode: boolean;
  setStealthMode: (enabled: boolean) => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  reminderHour: 9,
  reminderMinute: 0,
  remindersEnabled: true,
  setReminderTime: (hour, minute) => set({ reminderHour: hour, reminderMinute: minute }),
  setRemindersEnabled: (enabled) => set({ remindersEnabled: enabled }),

  streakWarningEnabled: true,
  setStreakWarningEnabled: (enabled) => set({ streakWarningEnabled: enabled }),

  predictiveAlertsEnabled: true,
  setPredictiveAlertsEnabled: (enabled) => set({ predictiveAlertsEnabled: enabled }),

  quietHoursEnabled: true,
  quietStart: 22,
  quietEnd: 8,
  setQuietHoursEnabled: (enabled) => set({ quietHoursEnabled: enabled }),
  setQuietHours: (start, end) => set({ quietStart: start, quietEnd: end }),

  stealthMode: false,
  setStealthMode: (enabled) => set({ stealthMode: enabled }),
}));
