import useUiPlatform from "./platform/useUiPlatform";
import { useAuth } from "./context/AuthContext";
import AuthScreen from "./components/auth/AuthScreen";
import AuthBootstrap from "./components/auth/AuthBootstrap";
import WebApp from "./ui/web/WebApp";
import MobileApp from "./ui/mobile/MobileApp";

export default function App() {
  const { isMobileUi } = useUiPlatform();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={loadingScreen}>Loading StudySpace...</div>;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <AuthBootstrap>
      {isMobileUi ? <MobileApp /> : <WebApp />}
    </AuthBootstrap>
  );
}

const loadingScreen = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#050816",
  color: "#f8fafc",
  fontSize: "18px",
  fontWeight: 600
};
