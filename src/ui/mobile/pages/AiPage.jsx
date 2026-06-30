import useAiCoachModel from "../../../hooks/useAiCoachModel";

export default function AiPage() {
  const model = useAiCoachModel();

  return (
    <div style={page}>
      <section style={section}>
        <h3 style={title}>AI Coach</h3>
        <p style={muted}>Ask doubts, get a daily plan, and review next steps from your saved data.</p>
        <button style={button} onClick={model.handleAnalyze} disabled={model.analysisLoading}>
          {model.analysisLoading ? "Analyzing..." : "Analyze Progress"}
        </button>
      </section>

      <section style={section}>
        <h3 style={title}>Chat</h3>
        <div style={feed}>
          {model.messages.map((message, index) => (
            <div key={index} style={message.role === "user" ? userBubble : assistantBubble}>{message.content}</div>
          ))}
        </div>
        <div style={stack}>
          <textarea value={model.input} onChange={(event) => model.setInput(event.target.value)} style={textarea} placeholder="Ask a doubt or next-step question" />
          <button style={button} onClick={model.handleAsk} disabled={model.loading}>
            {model.loading ? "Thinking..." : "Ask Coach"}
          </button>
          {model.error ? <div style={error}>{model.error}</div> : null}
        </div>
      </section>

      <section style={section}>
        <h3 style={title}>Daily Plan</h3>
        <div style={stack}>
          {model.coachReport ? (
            <>
              <div style={card}>{model.coachReport.summary}</div>
              {(model.coachReport.priorities || []).slice(0, 3).map((item, index) => (
                <div key={index} style={card}>
                  <strong>{item.title}</strong>
                  <div style={muted}>{item.reason}</div>
                </div>
              ))}
            </>
          ) : (
            <div style={card}>Run analysis to generate your next steps.</div>
          )}
        </div>
      </section>
    </div>
  );
}

const page = { display: "grid", gap: "14px" };
const section = { padding: "16px", borderRadius: "20px", background: "#0f1b30", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left" };
const title = { margin: 0, color: "#f8fafc", fontSize: "22px" };
const muted = { marginTop: "8px", color: "#94a3b8", lineHeight: 1.5, textAlign: "left" };
const button = { width: "100%", minHeight: "52px", padding: "12px 14px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", background: "#1b7cff", color: "#fff", fontWeight: 700, cursor: "pointer", marginTop: "14px" };
const feed = { display: "grid", gap: "10px", marginTop: "14px", maxHeight: "260px", overflowY: "auto" };
const assistantBubble = { padding: "12px 14px", borderRadius: "16px", background: "#14233b", color: "#e2e8f0", lineHeight: 1.55 };
const userBubble = { padding: "12px 14px", borderRadius: "16px", background: "rgba(27,124,255,0.18)", color: "#e0f2fe", lineHeight: 1.55 };
const stack = { display: "grid", gap: "10px", marginTop: "14px" };
const textarea = { width: "100%", minHeight: "100px", boxSizing: "border-box", padding: "12px 14px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)", background: "#14233b", color: "#f8fafc", resize: "vertical", outline: "none" };
const card = { padding: "14px", borderRadius: "16px", background: "#14233b", color: "#e2e8f0", lineHeight: 1.55 };
const error = { padding: "12px 14px", borderRadius: "16px", background: "rgba(248,113,113,0.12)", color: "#fecaca" };
