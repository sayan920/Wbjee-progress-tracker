import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Preferences } from "@capacitor/preferences";

const REMINDER_KEY = "dailyStudyReminder";

export function isNativeMobile() {
  return Capacitor.getPlatform() === "android" || Capacitor.getPlatform() === "ios";
}

export async function lightHaptic() {
  try {
    if (isNativeMobile()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  } catch {
    // Ignore haptic failures on unsupported devices.
  }
}

export async function successHaptic() {
  try {
    if (isNativeMobile()) {
      await Haptics.notification({ type: "SUCCESS" });
    }
  } catch {
    // Ignore haptic failures on unsupported devices.
  }
}

export async function getReminderPreference() {
  const { value } = await Preferences.get({ key: REMINDER_KEY });
  return value ? JSON.parse(value) : null;
}

export async function setReminderPreference(value) {
  await Preferences.set({
    key: REMINDER_KEY,
    value: JSON.stringify(value)
  });
}

export async function scheduleDailyReminder({
  hour = 19,
  minute = 0,
  title = "Study now",
  body = "Complete 2 practice sets and update your dashboard."
} = {}) {
  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  await LocalNotifications.cancel({ notifications: [{ id: 101 }] });

  await LocalNotifications.schedule({
    notifications: [
      {
        id: 101,
        title,
        body,
        schedule: {
          on: {
            hour,
            minute
          },
          repeats: true
        }
      }
    ]
  });

  const preference = { enabled: true, hour, minute, title, body };
  await setReminderPreference(preference);
  return preference;
}
