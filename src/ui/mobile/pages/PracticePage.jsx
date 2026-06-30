import usePracticeManager from "../../../hooks/usePracticeManager";

export default function PracticePage() {
  const model = usePracticeManager();

  return (
    <div style={page}>
      <section style={section}>
        <h3 style={title}>Open ExamGOAL</h3>
        <p style={muted}>Launch the installed app. Your logs stay manual inside this app.</p>
        <button style={primary} onClick={model.launchExamGoal}>Open ExamGOAL</button>
        {model.examGoalMessage ? <div style={notice}>{model.examGoalMessage}</div> : null}
      </section>

      {model.slots.map((slot, index) => {
        const chapters = model.allSubjects[slot.subject] || [];
        const selectedChapter = chapters.find((chapter) => chapter.name === slot.chapter);
        const topics = selectedChapter?.topics || [];
        return (
          <section key={index} style={section}>
            <div style={slotTitle}>Slot {index + 1}</div>
            <div style={stack}>
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
              <Field label="Total Questions">
                <input value={slot.total} onChange={(event) => model.updateSlot(index, "total", event.target.value)} style={input} placeholder="30" />
              </Field>
              <Field label="Correct">
                <input value={slot.correct} onChange={(event) => model.updateSlot(index, "correct", event.target.value)} style={input} placeholder="24" />
              </Field>
              <Field label="Notes">
                <textarea value={slot.notes} onChange={(event) => model.updateSlot(index, "notes", event.target.value)} style={textarea} placeholder="Mistakes and revision notes" />
              </Field>
            </div>
          </section>
        );
      })}

      <button style={primary} onClick={model.saveAll}>Save Practice Session</button>
      {model.popup ? <div style={notice}>Practice saved successfully.</div> : null}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={field}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}

const page = { display: "grid", gap: "14px" };
const section = { padding: "16px", borderRadius: "20px", background: "#0f1b30", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left" };
const title = { margin: 0, color: "#f8fafc", fontSize: "22px" };
const slotTitle = { color: "#f8fafc", fontSize: "20px", fontWeight: 700 };
const muted = { marginTop: "8px", color: "#94a3b8", lineHeight: 1.5, textAlign: "left" };
const stack = { display: "grid", gap: "12px", marginTop: "14px" };
const field = { display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle = { color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em" };
const input = { width: "100%", boxSizing: "border-box", minHeight: "50px", padding: "12px 14px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)", background: "#14233b", color: "#f8fafc", outline: "none" };
const textarea = { ...input, minHeight: "100px", resize: "vertical" };
const primary = { width: "100%", minHeight: "54px", padding: "14px 16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", background: "#1b7cff", color: "#fff", fontWeight: 700, cursor: "pointer" };
const notice = { padding: "14px", borderRadius: "16px", background: "#14233b", color: "#e2e8f0", lineHeight: 1.55 };
