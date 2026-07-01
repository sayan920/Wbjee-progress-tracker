import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function UserSessionBar({ compact = false }) {
  const { user, logout } = useAuth();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);

    try {
      await logout();
    } finally {
      setPending(false);
    }
  };

  const label = user?.displayName || user?.email || "Signed in";

  return (
    <div style={wrapper(compact)}>
      <div style={meta}>
        <div style={eyebrow}>Signed In</div>
        <div style={labelStyle}>{label}</div>
      </div>
      <button type="button" style={button(compact)} onClick={handleLogout} disabled={pending}>
        {pending ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}

const wrapper = (compact) => ({
  display: "flex",
  flexDirection: compact ? "column" : "row",
  justifyContent: "space-between",
  alignItems: compact ? "stretch" : "center",
  gap: "12px",
  padding: compact ? "14px" : "16px 18px",
  borderRadius: compact ? "16px" : "20px",
  background: compact ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  textAlign: "left"
});

const meta = {
  minWidth: 0
};

const eyebrow = {
  color: "#7dd3fc",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.14em"
};

const labelStyle = {
  marginTop: "6px",
  color: "#f8fafc",
  fontSize: "14px",
  fontWeight: 600,
  overflow: "hidden",
  textOverflow: "ellipsis"
};

const button = (compact) => ({
  minHeight: compact ? "48px" : "44px",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: compact ? "#1b7cff" : "linear-gradient(90deg, #7f5af0, #00c6ff)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  whiteSpace: "nowrap"
});
