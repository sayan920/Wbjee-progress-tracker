import { Capacitor } from "@capacitor/core";
import { AppLauncher } from "@capacitor/app-launcher";

export const EXAMGOAL_PACKAGE = "com.examgoal.jeemainpreparation.app";
export const EXAMGOAL_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.examgoal.jeemainpreparation.app";

export async function openExamGoal() {
  if (Capacitor.isNativePlatform()) {
    try {
      const status = await AppLauncher.canOpenUrl({ url: EXAMGOAL_PACKAGE });
      if (status.value) {
        await AppLauncher.openUrl({ url: EXAMGOAL_PACKAGE });
        return { launched: true, source: "app" };
      }
    } catch {
      // Fall through to the Play Store fallback.
    }
  }

  window.open(EXAMGOAL_PLAY_URL, "_blank", "noopener,noreferrer");
  return { launched: false, source: "store" };
}
