import { useMemo, useState } from "react";
import { navItems, pageMeta } from "../../shared/navigation";
import DashboardPage from "./pages/DashboardPage";
import ChaptersPage from "./pages/ChaptersPage";
import PracticePage from "./pages/PracticePage";
import AiPage from "./pages/AiPage";

export default function MobileApp() {
  const [page, setPage] = useState("dashboard");

  const renderedPage = useMemo(() => {
    if (page === "dashboard") return <DashboardPage />;
    if (page === "chapters") return <ChaptersPage />;
    if (page === "practice") return <PracticePage />;
    return <AiPage />;
  }, [page]);

  return (
    <div style={shell}>
      <header style={header}>
        <div style={eyebrow}>Mobile Mode</div>
        <h1 style={title}>{pageMeta[page].title}</h1>
        <p style={subtitle}>{pageMeta[page].subtitle}</p>
      </header>

      <main style={content}>{renderedPage}</main>

      <nav style={bottomNav}>
        {navItems.map((item) => {
          const active = item.key === page;
          return (
            <button key={item.key} style={navButton(active)} onClick={() => setPage(item.key)}>
              <span style={navLabel(active)}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

const shell = {
  minHeight: "100vh",
  background: "#07111f",
  color: "#f8fafc"
};

const header = {
  padding: "18px 16px 14px",
  background: "#0b1527",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  textAlign: "left"
};

const eyebrow = {
  color: "#7dd3fc",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.14em"
};

const title = {
  margin: "8px 0 0",
  fontSize: "28px",
  lineHeight: 1.08,
  color: "#f8fafc"
};

const subtitle = {
  marginTop: "8px",
  color: "#94a3b8",
  fontSize: "14px",
  lineHeight: 1.55,
  textAlign: "left"
};

const content = {
  padding: "14px 14px 92px"
};

const bottomNav = {
  position: "fixed",
  left: "12px",
  right: "12px",
  bottom: "10px",
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "10px",
  padding: "10px",
  borderRadius: "22px",
  background: "rgba(11,21,39,0.96)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 14px 36px -24px rgba(0,0,0,0.9)"
};

const navButton = (active) => ({
  minHeight: "56px",
  padding: "10px 6px",
  borderRadius: "16px",
  border: active ? "1px solid rgba(125,211,252,0.2)" : "1px solid transparent",
  background: active ? "rgba(125,211,252,0.12)" : "rgba(255,255,255,0.03)",
  color: "#f8fafc",
  cursor: "pointer"
});

const navLabel = (active) => ({
  fontSize: "12px",
  fontWeight: active ? 700 : 600,
  color: active ? "#e0f2fe" : "#cbd5e1"
});
