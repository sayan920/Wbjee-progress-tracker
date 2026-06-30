import useChapterManager from "../../../hooks/useChapterManager";

const subjects = [
  { key: "Math", title: "Mathematics", accent: "#7f5af0" },
  { key: "Physics", title: "Physics", accent: "#00c6ff" },
  { key: "Chemistry", title: "Chemistry", accent: "#7cffb2" }
];

export default function ChaptersPage() {
  const { chapters, popupData, setPopupData, toggle, getProgress } = useChapterManager();

  return (
    <div style={page}>
      {subjects.map((subject) => {
        const data = chapters[subject.key] || [];
        const progress = getProgress(data);
        return (
          <section key={subject.key} style={section}>
            <div style={header}>
              <div>
                <div style={{ ...eyebrow, color: subject.accent }}>{subject.title}</div>
                <h3 style={title}>Priority chapters</h3>
              </div>
              <div style={progressText}>{progress}%</div>
            </div>
            <div style={track}><div style={{ ...fill, width: `${progress}%`, background: subject.accent }} /></div>
            <div style={list}>
              {data.map((chapter, index) => (
                <label key={chapter.name} style={row}>
                  <div>
                    <strong>{chapter.name}</strong>
                    <div style={muted}>{chapter.weight}% weight | {chapter.priority}</div>
                  </div>
                  <div style={toggleBox}>
                    <input type="checkbox" checked={chapter.done || false} onChange={() => toggle(subject.key, index)} />
                  </div>
                </label>
              ))}
            </div>
          </section>
        );
      })}

      {popupData ? (
        <div style={overlay} onClick={() => setPopupData(null)}>
          <div style={modal} onClick={(event) => event.stopPropagation()}>
            <div style={eyebrow}>Chapter Completed</div>
            <h3 style={title}>{popupData.chapter.name}</h3>
            <p style={muted}>Nice work. The chapter has been marked as completed.</p>
            {popupData.next ? <div style={card}>Next up: {popupData.next.name}</div> : null}
            <button style={button} onClick={() => setPopupData(null)}>Close</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const page = { display: "grid", gap: "18px" };
const section = { padding: "22px", borderRadius: "26px", background: "linear-gradient(145deg, rgba(15,23,42,0.84), rgba(15,23,42,0.56))", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 58px -42px rgba(0,0,0,0.86)" };
const header = { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", textAlign: "left" };
const eyebrow = { fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.14em" };
const title = { margin: "8px 0 0", color: "#f8fafc", fontSize: "24px" };
const progressText = { color: "#f8fafc", fontSize: "28px", fontWeight: 700 };
const track = { width: "100%", height: "12px", marginTop: "16px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", overflow: "hidden" };
const fill = { height: "100%", borderRadius: "999px" };
const list = { display: "grid", gap: "12px", marginTop: "18px" };
const row = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left" };
const muted = { marginTop: "6px", color: "#94a3b8", lineHeight: 1.5 };
const toggleBox = { padding: "8px 10px", borderRadius: "14px", background: "rgba(255,255,255,0.04)" };
const overlay = { position: "fixed", inset: 0, display: "grid", placeItems: "center", background: "rgba(4,8,18,0.72)", backdropFilter: "blur(12px)", animation: "popupFade 0.28s ease" };
const modal = { width: "min(420px, calc(100vw - 32px))", padding: "26px", borderRadius: "24px", background: "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.78))", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 32px 70px -44px rgba(0,0,0,0.92)", textAlign: "left", animation: "popupRise 0.32s ease" };
const card = { padding: "14px 16px", marginTop: "16px", borderRadius: "18px", background: "rgba(255,255,255,0.04)", color: "#e2e8f0" };
const button = { width: "100%", marginTop: "18px", padding: "14px 16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(90deg, #7f5af0, #00c6ff)", color: "#fff", fontWeight: 700, cursor: "pointer" };
