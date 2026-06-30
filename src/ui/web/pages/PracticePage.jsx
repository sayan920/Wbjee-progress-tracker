import usePracticeManager from "../../../hooks/usePracticeManager";

export default function PracticePage() {
  const model = usePracticeManager();

  return (
    <div style={page}>
      <section style={hero}>
        <div style={heroCard}>
          <div style={eyebrow}>Practice Workspace</div>
          <h3 style={heroTitle}>Focused logging with quick launch support.</h3>
          <p style={heroText}>Use this page to capture your practice manually, then update notes and mistakes inside your own app.</p>
        </div>
        <div style={stats}>
          <Stat label="Today's Sets" value={model.todayLogs.length} />
          <Stat label="Questions" value={model.totalQuestionsToday} />
          <Stat label="Avg Accuracy" value={`${model.averageAccuracy}%`} />
          <Stat label="Ready" value={`${model.completedSlots}/3`} />
        </div>
      </section>

      <section style={launchCard}>
        <div>
          <div style={eyebrow}>Quick Launch</div>
          <h3 style={panelTitle}>Open ExamGOAL</h3>
          <p style={heroText}>Simple launcher only. No reading or syncing from the external app.</p>
        </div>
        <button style={button} onClick={model.launchExamGoal}>Open ExamGOAL</button>
      </section>

      {model.examGoalMessage ? <div style={banner}>{model.examGoalMessage}</div> : null}

      <div style={stack}>
        {model.slots.map((slot, index) => {
          const chapters = model.allSubjects[slot.subject] || [];
          const selectedChapter = chapters.find((chapter) => chapter.name === slot.chapter);
          const topics = selectedChapter?.topics || [];
          return (
            <section key={index} style={slotCard}>
              <div style={slotHeader}>
                <div>
                  <div style={eyebrow}>Slot {index + 1}</div>
                  <h3 style={panelTitle}>{slot.chapter || "Pick a chapter"}</h3>
                </div>
              </div>

              <div style={grid}>
                <Field label="Subject">
                  <select value={slot.subject} onChange={(event) => model.updateSlot(index, "subject", event.target.value)} style={input}>
                    {Object.keys(model.allSubjects).map((subject) => <option key={subject}>{subject}</option>)}
                  </select>
                </Field>
                <Field label="Chapter">
                  <select value={slot.chapter} onChange={(event) => model.updateSlot(index, "chapter", event.target.value)} style={input}>
                    <option value="">Select Chapter</option>
                    {chapters.map((chapter) => <option key={chapter.name} value={chapter.name}>{chapter.name}</option>)}
                  </select>
                </Field>
                <Field label="Topic">
                  <select value={slot.topic} onChange={(event) => model.updateSlot(index, "topic", event.target.value)} style={input}>
                    <option value="">Select Topic</option>
                    {topics.map((topic) => <option key={topic.name} value={topic.name}>{topic.name}</option>)}
                  </select>
                </Field>
              </div>

              <div style={grid}>
                <Field label="Total Questions">
                  <input value={slot.total} onChange={(event) => model.updateSlot(index, "total", event.target.value)} style={input} placeholder="30" />
                </Field>
                <Field label="Correct">
                  <input value={slot.correct} onChange={(event) => model.updateSlot(index, "correct", event.target.value)} style={input} placeholder="24" />
                </Field>
              </div>

              <Field label="Mistakes and Learnings">
                <textarea value={slot.notes} onChange={(event) => model.updateSlot(index, "notes", event.target.value)} style={textarea} placeholder="Capture traps, formulas, and mistakes." />
              </Field>
            </section>
          );
        })}
      </div>

      <button style={saveButton} onClick={model.saveAll}>Save Practice Session</button>
      {model.popup ? <div style={banner}>Practice saved successfully.</div> : null}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={field}>
      <span style={fieldLabel}>{label}</span>
      {children}
    </label>
  );
}

function Stat({ label, value }) {
  return (
    <div style={stat}>
      <div style={fieldLabel}>{label}</div>
      <div style={statValue}>{value}</div>
    </div>
  );
}

const page = { display: "grid", gap: "18px" };
const hero = { display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "18px" };
const heroCard = { padding: "24px", borderRadius: "26px", background: "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(15,23,42,0.58))", border: "1px solid rgba(255,255,255,0.08)", textAlign: "left" };
const stats = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" };
const stat = { padding: "18px", borderRadius: "22px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "left" };
const statValue = { marginTop: "10px", fontSize: "30px", fontWeight: 700, color: "#f8fafc" };
const launchCard = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "18px", padding: "22px", borderRadius: "24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "left" };
const banner = { padding: "16px", borderRadius: "18px", background: "rgba(125,211,252,0.08)", border: "1px solid rgba(125,211,252,0.16)", color: "#e0f2fe", lineHeight: 1.55, textAlign: "left" };
const stack = { display: "grid", gap: "18px" };
const slotCard = { padding: "22px", borderRadius: "24px", background: "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))", border: "1px solid rgba(255,255,255,0.08)", textAlign: "left" };
const slotHeader = { marginBottom: "18px" };
const grid = { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px", marginBottom: "14px" };
const field = { display: "flex", flexDirection: "column", gap: "8px" };
const eyebrow = { color: "#7dd3fc", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.14em" };
const panelTitle = { margin: "8px 0 0", color: "#f8fafc", fontSize: "24px" };
const heroTitle = { margin: "8px 0 0", color: "#f8fafc", fontSize: "34px", lineHeight: 1.08 };
const heroText = { marginTop: "12px", color: "#cbd5e1", lineHeight: 1.6, textAlign: "left" };
const fieldLabel = { color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em" };
const input = { width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.7)", color: "#f8fafc", outline: "none" };
const textarea = { ...input, minHeight: "110px", resize: "vertical" };
const button = { minWidth: "170px", padding: "14px 18px", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(90deg, #7f5af0, #00c6ff)", color: "#fff", fontWeight: 700, cursor: "pointer" };
const saveButton = { ...button, width: "100%" };
