import { Capacitor } from "@capacitor/core";
import useViewport from "../hooks/useViewport";

export default function useUiPlatform() {
  const { width, isPhone, isTablet } = useViewport();
  const capacitorPlatform = Capacitor.getPlatform();
  const isNativeMobile = capacitorPlatform === "android" || capacitorPlatform === "ios";
  const ui = isNativeMobile ? "mobile" : "web";

  return {
    width,
    isPhone,
    isTablet,
    isNativeMobile,
    capacitorPlatform,
    ui,
    isWebUi: ui === "web",
    isMobileUi: ui === "mobile"
  };
}
