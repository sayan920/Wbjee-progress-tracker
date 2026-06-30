import useChapterManager from "../../../hooks/useChapterManager";

const subjects = ["Math", "Physics", "Chemistry"];

export default function ChaptersPage() {
  const { chapters, toggle, getProgress } = useChapterManager();

  return (
    <div style={page}>
      {subjects.map((subject) => {
        const data = chapters[subject] || [];
        return (
          <section key={subject} style={section}>
            <div style={header}>
              <strong>{subject}</strong>
              <span style={progress}>{getProgress(data)}%</span>
            </div>
            <div style={list}>
              {data.map((chapter, index) => (
                <label key={chapter.name} style={row}>
                  <div>
                    <div style={name}>{chapter.name}</div>
                    <div style={meta}>{chapter.weight}% | {chapter.priority}</div>
                  </div>
                  <input type="checkbox" checked={chapter.done || false} onChange={() => toggle(subject, index)} />
                </label>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

const page = { display: "grid", gap: "14px" };
const section = { padding: "16px", borderRadius: "20px", background: "#0f1b30", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left" };
const header = { display: "flex", justifyContent: "space-between", alignItems: "center", color: "#f8fafc" };
const progress = { color: "#7dd3fc", fontWeight: 700 };
const list = { display: "grid", gap: "10px", marginTop: "14px" };
const row = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", padding: "14px", borderRadius: "16px", background: "#14233b", color: "#e2e8f0" };
const name = { fontWeight: 600 };
const meta = { marginTop: "4px", color: "#94a3b8", fontSize: "12px" };
