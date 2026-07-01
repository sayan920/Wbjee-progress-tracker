import { useMemo, useState } from "react";
import { navItems, pageMeta } from "../../shared/navigation";
import DashboardPage from "./pages/DashboardPage";
import ChaptersPage from "./pages/ChaptersPage";
import PracticePage from "./pages/PracticePage";
import AiPage from "./pages/AiPage";

export default function WebApp() {
  const [page, setPage] = useState("dashboard");

  const renderedPage = useMemo(() => {
    if (page === "dashboard") return <DashboardPage />;
    if (page === "chapters") return <ChaptersPage />;
    if (page === "practice") return <PracticePage />;
    return <AiPage />;
  }, [page]);

  return (
    <div style={shell}>
      <div style={orbLeft} />
      <div style={orbRight} />
      <aside style={sidebar}>
        <div style={brandCard}>
          <div style={brandBadge}>SS</div>
          <div>
            <div style={eyebrow}>YOUR STUDY HUB</div>
            <h1 style={brandTitle}>StudySpace</h1>
            
  <p style={brandText}>
  Track your progress.<br />
  Stay consistent.<br />
  Achieve your goals.
</p>

          </div>
        </div>

        <div style={navStack}>
          {navItems.map((item, index) => {
            const active = page === item.key;
            return (
              <button
                key={item.key}
                style={{ ...navButton(active), animationDelay: `${index * 0.05}s` }}
                onClick={() => setPage(item.key)}
              >
                <span>{item.label}</span>
                <span style={navChip(active)}>{active ? "Now" : "Go"}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <main style={main}>
        <header style={header}>
          <div>
            <div style={headerEyebrow}>Study OS</div>
            <h2 style={headerTitle}>{pageMeta[page].title}</h2>
            <p style={headerText}>{pageMeta[page].subtitle}</p>
          </div>
        </header>

        <section key={page} style={content}>
          {renderedPage}
        </section>
      </main>
    </div>
  );
}

const shell = {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "300px minmax(0, 1fr)",
  minHeight: "100vh",
  overflow: "hidden"
};

const orbLeft = {
  position: "fixed",
  top: "-110px",
  left: "-80px",
  width: "360px",
  height: "360px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(127,90,240,0.36), transparent 70%)",
  filter: "blur(120px)",
  animation: "floatBlob 14s ease-in-out infinite",
  pointerEvents: "none"
};

const orbRight = {
  position: "fixed",
  right: "-120px",
  bottom: "-100px",
  width: "420px",
  height: "420px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(0,198,255,0.24), transparent 72%)",
  filter: "blur(140px)",
  animation: "floatBlob 17s ease-in-out infinite reverse",
  pointerEvents: "none"
};

const sidebar = {
  position: "relative",
  zIndex: 1,
  padding: "28px 22px",
  background: "linear-gradient(180deg, rgba(8,15,33,0.95), rgba(8,15,33,0.82))",
  borderRight: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(20px)"
};

const brandCard = {
  display: "flex",
  gap: "14px",
  alignItems: "flex-start",
  padding: "20px",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  textAlign: "left",
  boxShadow: "0 26px 60px -42px rgba(0,0,0,0.88)"
};

const brandBadge = {
  width: "52px",
  height: "52px",
  borderRadius: "18px",
  display: "grid",
  placeItems: "center",
  background: "linear-gradient(135deg, #7f5af0, #00c6ff)",
  color: "#fff",
  fontWeight: 800,
  letterSpacing: "0.08em"
};

const eyebrow = {
  color: "#7dd3fc",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.14em"
};

const brandTitle = {
  margin: "8px 0 0",
  fontSize: "28px",
  lineHeight: 1.06,
  color: "#f8fafc"
};

const brandText = {
  marginTop: "12px",
  color: "#cbd5e1",
  lineHeight: 1.6,
  textAlign: "left"
};

const navStack = {
  display: "grid",
  gap: "12px",
  marginTop: "24px"
};

const navButton = (active) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 18px",
  borderRadius: "20px",
  border: active ? "1px solid rgba(125,211,252,0.3)" : "1px solid rgba(255,255,255,0.06)",
  background: active
    ? "linear-gradient(135deg, rgba(127,90,240,0.22), rgba(0,198,255,0.14))"
    : "rgba(255,255,255,0.04)",
  color: "#f8fafc",
  cursor: "pointer",
  textAlign: "left",
  animation: "fade 0.45s ease both"
});

const navChip = (active) => ({
  padding: "6px 10px",
  borderRadius: "999px",
  background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
  color: active ? "#e0f2fe" : "#94a3b8",
  fontSize: "12px"
});

const main = {
  position: "relative",
  zIndex: 1,
  padding: "24px"
};

const header = {
  padding: "26px 28px",
  borderRadius: "30px",
  background: "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(15,23,42,0.58))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 28px 74px -48px rgba(0,0,0,0.9)",
  backdropFilter: "blur(18px)",
  textAlign: "left"
};

const headerEyebrow = {
  color: "#c084fc",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.14em"
};

const headerTitle = {
  margin: "12px 0 0",
  color: "#f8fafc",
  fontSize: "40px",
  lineHeight: 1.04
};

const headerText = {
  marginTop: "12px",
  color: "#cbd5e1",
  lineHeight: 1.6,
  textAlign: "left"
};

const content = {
  marginTop: "18px",
  animation: "pageIn 0.45s ease"
};
