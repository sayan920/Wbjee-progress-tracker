export default function Navbar({ active, setActive }) {
  const tabs = ["dashboard", "journal", "chapters", "analytics", "practice", "ai"];

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          style={{
            padding: "10px 18px",
            borderRadius: "20px",
            border: "none",
            background: active === tab ? "#38bdf8" : "#1e293b",
            color: "white",
            cursor: "pointer",
          }}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
}