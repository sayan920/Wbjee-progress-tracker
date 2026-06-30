import { useMemo, useState } from "react";
import useViewport from "../hooks/useViewport";
import { analyzeProgressWithCoach, askCoach } from "../lib/aiCoach";
import { readCoachReport, readStudyState } from "../lib/studyData";

export default function AI() {
  const { isPhone } = useViewport();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState("");
  const [coachReport, setCoachReport] = useState(readCoachReport());
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Ask me doubts, chapter strategy questions, or tell me to analyze your progress. I will use your saved study data when the coach API is connected."
    }
  ]);

  const studyState = useMemo(() => readStudyState(), []);

  const handleAnalyze = async () => {
    setAnalysisLoading(true);
    setError("");

    try {
      const report = await analyzeProgressWithCoach(readStudyState(), "manual_analysis");
      setCoachReport(report);
    } catch (analysisError) {
      setError(analysisError.message);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!input.trim()) return;

    const nextMessages = [...messages, { role: "user", content: input.trim() }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const data = await askCoach(nextMessages, readStudyState());
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
      if (data.report) {
        setCoachReport(data.report);
      }
    } catch (chatError) {
      setError(
        "ChatGPT is not connected yet. Add your OpenAI API key in the backend env file and run the API server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page(isPhone)}>
      <section style={hero(isPhone)}>
        <div>
          <div style={eyebrow}>AI Guidance Layer</div>
          <h2 style={heroTitle(isPhone)}>Connect your study data to a real coach workflow.</h2>
          <p style={heroText(isPhone)}>
            This section is now ready for ChatGPT-backed doubt support and progress evaluation.
            Use the analyze button to refresh chapter priorities and ask direct study questions below.
          </p>
        </div>

        <div style={heroActions}>
          <button style={primaryButton} onClick={handleAnalyze} disabled={analysisLoading}>
            {analysisLoading ? "Analyzing..." : "Analyze My Progress"}
          </button>
          <div style={heroHint}>
            The coach uses your saved chapters, logs, and mistakes to create notes and priorities.
          </div>
        </div>
      </section>

      <section style={grid}>
        <div style={panel}>
          <div style={panelEyebrow}>ChatGPT Doubts</div>
          <h3 style={panelTitle}>Ask doubts and strategy questions</h3>

          <div style={chatFeed}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={message.role === "user" ? userMessage : assistantMessage}
              >
                {message.content}
              </div>
            ))}
          </div>

          <div style={composer}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a doubt, request a revision plan, or ask which chapter to do next."
              style={textarea}
            />
            <button style={primaryButton} onClick={handleAsk} disabled={loading}>
              {loading ? "Thinking..." : "Ask Coach"}
            </button>
          </div>

          {error && <div style={errorBox}>{error}</div>}
        </div>

        <div style={panel}>
          <div style={panelEyebrow}>Coach Report</div>
          <h3 style={panelTitle}>Current priorities and notes</h3>

          {coachReport ? (
            <div style={reportStack}>
              <div style={summaryCard}>{coachReport.summary}</div>

              <div style={reportSectionTitle}>Priority chapters</div>
              {(coachReport.priorities || []).length ? (
                coachReport.priorities.map((item, index) => (
                  <div key={index} style={reportCard}>
                    <div style={reportCardTitle}>{item.title}</div>
                    <div style={reportCardText}>{item.reason}</div>
                  </div>
                ))
              ) : (
                <div style={emptyState}>No urgent chapter priorities yet.</div>
              )}

              <div style={reportSectionTitle}>Notes</div>
              {(coachReport.notes || []).map((note, index) => (
                <div key={index} style={reportCard}>
                  <div style={reportCardText}>{note}</div>
                </div>
              ))}

              <div style={reportSectionTitle}>Mistake reminders</div>
              {(coachReport.mistakes || []).length ? (
                coachReport.mistakes.map((item, index) => (
                  <div key={index} style={reportCard}>
                    <div style={reportCardTitle}>{item.title}</div>
                    <div style={reportCardText}>
                      {item.note} | {item.accuracy}% | {item.date}
                    </div>
                  </div>
                ))
              ) : (
                <div style={emptyState}>Mistake reminders will appear here after you save practice.</div>
              )}
            </div>
          ) : (
            <div style={emptyState}>Run your first analysis to generate a coach report.</div>
          )}
        </div>
      </section>

      <section style={grid}>
        <div style={panel}>
          <div style={panelEyebrow}>Daily Plan</div>
          <h3 style={panelTitle}>What to do next</h3>
          <div style={reportStack}>
            {(coachReport?.priorities || []).slice(0, 3).map((item, index) => (
              <div key={index} style={reportCard}>
                <div style={reportCardTitle}>Step {index + 1}</div>
                <div style={reportCardText}>{item.title}</div>
                <div style={reportCardText}>{item.reason}</div>
              </div>
            ))}
            {!(coachReport?.priorities || []).length && (
              <div style={emptyState}>Run an analysis to generate your next study steps.</div>
            )}
          </div>
        </div>

        <div style={panel}>
          <div style={panelEyebrow}>Weak Topic Suggestions</div>
          <h3 style={panelTitle}>Focus areas from your current data</h3>
          <div style={reportStack}>
            {(coachReport?.mistakes || []).slice(0, 4).map((item, index) => (
              <div key={index} style={reportCard}>
                <div style={reportCardTitle}>{item.title}</div>
                <div style={reportCardText}>{item.note}</div>
              </div>
            ))}
            {!(coachReport?.mistakes || []).length && (
              <div style={emptyState}>Weak-topic suggestions will appear after more practice is logged.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const page = (isPhone) => ({
  display: "grid",
  gap: "20px",
  padding: isPhone ? "14px" : "18px",
  minHeight: "100%",
  color: "#f8fafc",
  animation: "pageIn 0.45s ease"
});

const hero = (isPhone) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "18px",
  padding: isPhone ? "18px" : "28px",
  borderRadius: isPhone ? "22px" : "28px",
  background: "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(15,23,42,0.58))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 26px 68px -44px rgba(0,0,0,0.88)",
  textAlign: "left"
});

const eyebrow = {
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

const heroTitle = (isPhone) => ({
  margin: "14px 0 0",
  fontSize: isPhone ? "28px" : "40px",
  lineHeight: 1.05,
  color: "#f8fafc"
});

const heroText = (isPhone) => ({
  marginTop: "14px",
  maxWidth: "620px",
  color: "#cbd5e1",
  fontSize: isPhone ? "14px" : "15px",
  lineHeight: 1.65,
  textAlign: "left"
});

const heroActions = {
  display: "grid",
  alignContent: "start",
  gap: "14px"
};

const heroHint = {
  color: "#cbd5e1",
  lineHeight: 1.6
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "18px"
};

const panel = {
  padding: "22px",
  borderRadius: "24px",
  background: "linear-gradient(145deg, rgba(15,23,42,0.84), rgba(15,23,42,0.56))",
  border: "1px solid rgba(255,255,255,0.08)",
  textAlign: "left",
  boxShadow: "0 24px 58px -42px rgba(0,0,0,0.86)"
};

const panelEyebrow = {
  color: "#7dd3fc",
  fontSize: "12px",
  letterSpacing: "0.14em",
  textTransform: "uppercase"
};

const panelTitle = {
  margin: "10px 0 0",
  color: "#f8fafc",
  fontSize: "25px",
  lineHeight: 1.15
};

const chatFeed = {
  display: "grid",
  gap: "12px",
  marginTop: "18px",
  maxHeight: "420px",
  overflowY: "auto",
  paddingRight: "4px"
};

const assistantMessage = {
  padding: "14px 16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.06)",
  color: "#e2e8f0",
  lineHeight: 1.6
};

const userMessage = {
  padding: "14px 16px",
  borderRadius: "18px",
  background: "rgba(125,211,252,0.12)",
  border: "1px solid rgba(125,211,252,0.16)",
  color: "#e0f2fe",
  lineHeight: 1.6
};

const composer = {
  display: "grid",
  gap: "12px",
  marginTop: "16px"
};

const textarea = {
  width: "100%",
  minHeight: "120px",
  boxSizing: "border-box",
  padding: "14px 16px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(2,6,23,0.72)",
  color: "#f8fafc",
  resize: "vertical",
  outline: "none"
};

const primaryButton = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(90deg, #7f5af0, #00c6ff)",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer"
};

const errorBox = {
  marginTop: "12px",
  padding: "14px 16px",
  borderRadius: "16px",
  background: "rgba(248,113,113,0.12)",
  border: "1px solid rgba(248,113,113,0.16)",
  color: "#fecaca"
};

const reportStack = {
  display: "grid",
  gap: "12px",
  marginTop: "18px"
};

const summaryCard = {
  padding: "14px 16px",
  borderRadius: "18px",
  background: "rgba(125,211,252,0.08)",
  border: "1px solid rgba(125,211,252,0.14)",
  color: "#e0f2fe",
  lineHeight: 1.6
};

const reportSectionTitle = {
  marginTop: "6px",
  color: "#94a3b8",
  fontSize: "12px",
  letterSpacing: "0.12em",
  textTransform: "uppercase"
};

const reportCard = {
  padding: "14px 16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)"
};

const reportCardTitle = {
  color: "#f8fafc",
  fontWeight: 700
};

const reportCardText = {
  marginTop: "6px",
  color: "#cbd5e1",
  lineHeight: 1.55
};

const emptyState = {
  padding: "16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  color: "#cbd5e1"
};
