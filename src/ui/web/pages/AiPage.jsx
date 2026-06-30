import useAiCoachModel from "../../../hooks/useAiCoachModel";

export default function AiPage() {
  const model = useAiCoachModel();

  return (
    <div style={page}>
      <section style={hero}>
        <div>
          <div style={eyebrow}>AI Coach</div>
          <h3 style={heroTitle}>A richer web workspace for planning, doubts, and priorities.</h3>
          <p style={heroText}>Use AI to build a daily plan, resolve doubts, and turn your study history into next actions.</p>
        </div>
        <button style={button} onClick={model.handleAnalyze} disabled={model.analysisLoading}>
          {model.analysisLoading ? "Analyzing..." : "Analyze My Progress"}
        </button>
      </section>

      <section style={grid}>
        <div style={panel}>
          <div style={panelEyebrow}>Chat</div>
          <h3 style={panelTitle}>Ask a doubt or strategy question</h3>
          <div style={chatFeed}>
            {model.messages.map((message, index) => (
              <div key={index} style={message.role === "user" ? userBubble : assistantBubble}>{message.content}</div>
            ))}
          </div>
          <div style={stack}>
            <textarea value={model.input} onChange={(event) => model.setInput(event.target.value)} style={textarea} placeholder="Ask about weak chapters, next study steps, or a doubt." />
            <button style={button} onClick={model.handleAsk} disabled={model.loading}>
              {model.loading ? "Thinking..." : "Ask Coach"}
            </button>
            {model.error ? <div style={error}>{model.error}</div> : null}
          </div>
        </div>

        <div style={panel}>
          <div style={panelEyebrow}>Plan</div>
          <h3 style={panelTitle}>Daily priorities and weak-topic suggestions</h3>
          <div style={stack}>
            {model.coachReport ? (
              <>
                <div style={highlight}>{model.coachReport.summary}</div>
                {(model.coachReport.priorities || []).slice(0, 4).map((item, index) => (
                  <div key={index} style={card}>
                    <strong>{item.title}</strong>
                    <div style={muted}>{item.reason}</div>
                  </div>
                ))}
                {(model.coachReport.mistakes || []).slice(0, 3).map((item, index) => (
                  <div key={index} style={card}>
                    <strong>{item.title}</strong>
                    <div style={muted}>{item.note}</div>
                  </div>
                ))}
              </>
            ) : (
              <div style={card}>Run an analysis to build your AI study plan.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const page = { display: "grid", gap: "18px" };
const hero = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "18px", padding: "24px", borderRadius: "26px", background: "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(15,23,42,0.58))", border: "1px solid rgba(255,255,255,0.08)", textAlign: "left" };
const eyebrow = { color: "#7dd3fc", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.14em" };
const heroTitle = { margin: "8px 0 0", color: "#f8fafc", fontSize: "32px", lineHeight: 1.08 };
const heroText = { marginTop: "12px", color: "#cbd5e1", lineHeight: 1.6, textAlign: "left" };
const grid = { display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "18px" };
const panel = { padding: "22px", borderRadius: "24px", background: "linear-gradient(145deg, rgba(15,23,42,0.84), rgba(15,23,42,0.56))", border: "1px solid rgba(255,255,255,0.08)", textAlign: "left" };
const panelEyebrow = { color: "#c084fc", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.14em" };
const panelTitle = { margin: "10px 0 0", color: "#f8fafc", fontSize: "24px" };
const chatFeed = { display: "grid", gap: "12px", marginTop: "16px", maxHeight: "360px", overflowY: "auto" };
const assistantBubble = { padding: "14px 16px", borderRadius: "18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)", color: "#e2e8f0", lineHeight: 1.6 };
const userBubble = { padding: "14px 16px", borderRadius: "18px", background: "rgba(125,211,252,0.12)", border: "1px solid rgba(125,211,252,0.16)", color: "#e0f2fe", lineHeight: 1.6 };
const stack = { display: "grid", gap: "12px", marginTop: "16px" };
const textarea = { width: "100%", minHeight: "120px", boxSizing: "border-box", padding: "14px 16px", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.72)", color: "#f8fafc", resize: "vertical", outline: "none" };
const button = { padding: "14px 18px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(90deg, #7f5af0, #00c6ff)", color: "#fff", fontWeight: 700, cursor: "pointer" };
const highlight = { padding: "14px 16px", borderRadius: "18px", background: "rgba(125,211,252,0.08)", border: "1px solid rgba(125,211,252,0.14)", color: "#e0f2fe", lineHeight: 1.6 };
const card = { padding: "14px 16px", borderRadius: "18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" };
const muted = { marginTop: "6px", color: "#cbd5e1", lineHeight: 1.55 };
const error = { padding: "14px 16px", borderRadius: "16px", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.16)", color: "#fecaca" };
