import { useMemo, useState } from "react";

import Dashboard from "./pages/Dashboard";
import Chapters from "./pages/Chapters";
import AI from "./pages/AI";
import Practice from "./pages/Practice";
import useViewport from "./hooks/useViewport";
import { lightHaptic } from "./lib/mobileNative";

const pageConfig = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Track pace, consistency, and study momentum.",
    badge: "Performance"
  },
  chapters: {
    title: "Chapters",
    subtitle: "Stay on top of chapter progress across all subjects.",
    badge: "Mastery"
  },
  practice: {
    title: "Practice",
    subtitle: "Log focused sessions with a calmer premium workspace.",
    badge: "Execution"
  },
  ai: {
    title: "AI System",
    subtitle: "Use insights to decide your next best study move.",
    badge: "Strategy"
  }
};

const navItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "chapters", label: "Chapters" },
  { key: "practice", label: "Practice" },
  { key: "ai", label: "AI System" }
];

export default function Layout() {
  const [page, setPage] = useState("dashboard");
  const { isPhone, isTablet } = useViewport();
  const activePage = pageConfig[page];

  const renderedPage = useMemo(() => {
    if (page === "dashboard") return <Dashboard />;
    if (page === "chapters") return <Chapters />;
    if (page === "practice") return <Practice />;
    return <AI />;
  }, [page]);

  const handlePageChange = async (nextPage) => {
    await lightHaptic();
    setPage(nextPage);
  };

  return (
    <div style={shell(isTablet)}>
      <div style={ambientOrbOne} />
      <div style={ambientOrbTwo} />
      <div style={ambientMesh} />

      {!isPhone && (
        <aside style={sidebar(isTablet)}>
        <div style={brandBlock}>
          <div style={brandMark}>WB</div>
          <div>
            <div style={brandEyebrow}>WBJEE Prep OS</div>
            <h1 style={brandTitle(isPhone)}>Study with a cleaner rhythm.</h1>
          </div>
        </div>

        <div style={navGroup(isPhone, isTablet)}>
          {navItems.map((item) => {
            const active = page === item.key;

            return (
              <button
                key={item.key}
                style={navButton(active)}
                onClick={() => handlePageChange(item.key)}
              >
                <span style={navLabel}>{item.label}</span>
                <span style={navMeta(active)}>{active ? "Active" : "Open"}</span>
              </button>
            );
          })}
        </div>

        <div style={sidebarCard(isTablet)}>
          <div style={sidebarCardEyebrow}>Quick Focus</div>
          <div style={sidebarCardTitle}>Keep practice logs updated daily.</div>
          <p style={sidebarCardText}>
            The rest of the experience becomes smarter once your chapters and logs stay current.
          </p>
          <button style={sidebarCta} onClick={() => handlePageChange("practice")}>
            Jump to Practice
          </button>
        </div>
        </aside>
      )}

      <main style={main(isTablet)}>
        <header style={topbar(isTablet)}>
          <div>
            <div style={pageBadge}>{activePage.badge}</div>
            <h2 style={pageTitle(isPhone)}>{activePage.title}</h2>
            <p style={pageSubtitle(isPhone)}>{activePage.subtitle}</p>
          </div>

          <button style={floatingAction(isPhone)} onClick={() => handlePageChange("practice")}>
            Start Practice
          </button>
        </header>

        <section key={page} style={content(isPhone)}>
          {renderedPage}
        </section>

        {isPhone && (
          <nav style={bottomNav}>
            {navItems.map((item) => {
              const active = item.key === page;

              return (
                <button
                  key={item.key}
                  style={bottomNavButton(active)}
                  onClick={() => handlePageChange(item.key)}
                >
                  <span style={bottomNavLabel(active)}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </main>
    </div>
  );
}

const shell = (isTablet) => ({
  position: "relative",
  display: "grid",
  gridTemplateColumns: isTablet ? "1fr" : "290px minmax(0, 1fr)",
  minHeight: "100vh",
  background: "#050816",
  color: "#f8fafc",
  overflow: "hidden"
});

const ambientOrbOne = {
  position: "fixed",
  top: "-120px",
  left: "-90px",
  width: "360px",
  height: "360px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(127,90,240,0.42), transparent 70%)",
  filter: "blur(120px)",
  animation: "floatBlob 18s ease-in-out infinite",
  pointerEvents: "none"
};

const ambientOrbTwo = {
  position: "fixed",
  right: "-120px",
  bottom: "-90px",
  width: "420px",
  height: "420px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(0,198,255,0.28), transparent 72%)",
  filter: "blur(140px)",
  animation: "floatBlob 22s ease-in-out infinite reverse",
  pointerEvents: "none"
};

const ambientMesh = {
  position: "fixed",
  inset: 0,
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "46px 46px",
  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 95%)",
  opacity: 0.2,
  pointerEvents: "none"
};

const sidebar = (isTablet) => ({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: isTablet ? "20px 16px 16px" : "28px 22px",
  background: "linear-gradient(180deg, rgba(8,15,33,0.96), rgba(8,15,33,0.82))",
  borderRight: isTablet ? "none" : "1px solid rgba(255,255,255,0.08)",
  borderBottom: isTablet ? "1px solid rgba(255,255,255,0.08)" : "none",
  backdropFilter: "blur(20px)"
});

const brandBlock = {
  display: "flex",
  gap: "14px",
  alignItems: "flex-start",
  textAlign: "left"
};

const brandMark = {
  display: "grid",
  placeItems: "center",
  width: "48px",
  height: "48px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, rgba(127,90,240,0.9), rgba(0,198,255,0.75))",
  color: "#ffffff",
  fontWeight: 800,
  letterSpacing: "0.08em",
  boxShadow: "0 18px 45px -26px rgba(127,90,240,0.7)"
};

const brandEyebrow = {
  fontSize: "12px",
  color: "#7dd3fc",
  textTransform: "uppercase",
  letterSpacing: "0.14em"
};

const brandTitle = (isPhone) => ({
  margin: "8px 0 0",
  color: "#f8fafc",
  fontSize: isPhone ? "20px" : "26px",
  lineHeight: 1.08
});

const navGroup = (isPhone, isTablet) => ({
  display: "grid",
  gap: "10px",
  gridTemplateColumns: isPhone ? "1fr" : isTablet ? "repeat(2, minmax(0, 1fr))" : "1fr"
});

const navButton = (active) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  width: "100%",
  padding: "15px 16px",
  borderRadius: "18px",
  border: active ? "1px solid rgba(125,211,252,0.36)" : "1px solid rgba(255,255,255,0.06)",
  background: active
    ? "linear-gradient(135deg, rgba(127,90,240,0.22), rgba(0,198,255,0.12))"
    : "rgba(255,255,255,0.03)",
  color: "#f8fafc",
  cursor: "pointer",
  textAlign: "left",
  transform: active ? "translateX(4px)" : "translateX(0)",
  boxShadow: active ? "0 22px 40px -30px rgba(0,198,255,0.55)" : "none",
  transition: "all 0.28s ease"
});

const navLabel = {
  fontSize: "15px",
  fontWeight: 600
};

const navMeta = (active) => ({
  padding: "6px 10px",
  borderRadius: "999px",
  background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
  color: active ? "#e0f2fe" : "#94a3b8",
  fontSize: "12px"
});

const sidebarCard = (isTablet) => ({
  marginTop: isTablet ? "0" : "auto",
  padding: "18px",
  borderRadius: "22px",
  background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
  border: "1px solid rgba(255,255,255,0.08)",
  textAlign: "left",
  boxShadow: "0 24px 50px -34px rgba(0,0,0,0.85)"
});

const sidebarCardEyebrow = {
  color: "#c084fc",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.14em"
};

const sidebarCardTitle = {
  marginTop: "10px",
  color: "#f8fafc",
  fontSize: "18px",
  fontWeight: 700,
  lineHeight: 1.2
};

const sidebarCardText = {
  marginTop: "10px",
  color: "#cbd5e1",
  fontSize: "14px",
  lineHeight: 1.55,
  textAlign: "left"
};

const sidebarCta = {
  marginTop: "16px",
  width: "100%",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(90deg, rgba(127,90,240,0.9), rgba(0,198,255,0.9))",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer"
};

const main = (isTablet) => ({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  padding: isTablet ? "14px" : "22px"
});

const topbar = (isTablet) => ({
  display: "flex",
  flexDirection: isTablet ? "column" : "row",
  justifyContent: "space-between",
  alignItems: isTablet ? "stretch" : "flex-start",
  gap: "16px",
  padding: isTablet ? "20px" : "24px 26px",
  borderRadius: isTablet ? "22px" : "28px",
  background: "linear-gradient(145deg, rgba(15,23,42,0.88), rgba(15,23,42,0.6))",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(18px)",
  boxShadow: "0 28px 70px -46px rgba(0,0,0,0.85)",
  textAlign: "left"
});

const pageBadge = {
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#94a3b8",
  fontSize: "12px",
  letterSpacing: "0.14em",
  textTransform: "uppercase"
};

const pageTitle = (isPhone) => ({
  margin: "12px 0 0",
  color: "#f8fafc",
  fontSize: isPhone ? "28px" : "36px",
  lineHeight: 1.06
});

const pageSubtitle = (isPhone) => ({
  marginTop: "10px",
  color: "#cbd5e1",
  fontSize: isPhone ? "14px" : "15px",
  lineHeight: 1.6,
  textAlign: "left"
});

const floatingAction = (isPhone) => ({
  width: isPhone ? "100%" : "auto",
  padding: "14px 18px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(90deg, #7f5af0, #00c6ff)",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 22px 45px -26px rgba(0,198,255,0.55)"
});

const content = (isPhone) => ({
  flex: 1,
  minHeight: 0,
  marginTop: "18px",
  overflowY: "auto",
  borderRadius: isPhone ? "20px" : "30px",
  padding: isPhone ? "0 0 92px" : "6px",
  animation: "pageIn 0.45s ease"
});

const bottomNav = {
  position: "fixed",
  left: "14px",
  right: "14px",
  bottom: "12px",
  zIndex: 30,
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "10px",
  padding: "10px",
  borderRadius: "24px",
  background: "rgba(7,13,29,0.92)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(18px)",
  boxShadow: "0 18px 44px -26px rgba(0,0,0,0.9)"
};

const bottomNavButton = (active) => ({
  minHeight: "58px",
  padding: "12px 8px",
  borderRadius: "16px",
  border: active ? "1px solid rgba(125,211,252,0.28)" : "1px solid transparent",
  background: active
    ? "linear-gradient(135deg, rgba(127,90,240,0.24), rgba(0,198,255,0.16))"
    : "rgba(255,255,255,0.03)",
  color: "#f8fafc",
  cursor: "pointer"
});

const bottomNavLabel = (active) => ({
  fontSize: "12px",
  fontWeight: active ? 700 : 600,
  color: active ? "#e0f2fe" : "#cbd5e1"
});
