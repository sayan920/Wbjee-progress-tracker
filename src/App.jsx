import useUiPlatform from "./platform/useUiPlatform";
import WebApp from "./ui/web/WebApp";
import MobileApp from "./ui/mobile/MobileApp";

export default function App() {
  const { isMobileUi } = useUiPlatform();
  return isMobileUi ? <MobileApp /> : <WebApp />;
}
