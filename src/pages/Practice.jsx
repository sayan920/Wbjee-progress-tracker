import { useEffect, useState } from "react";

import { mathData } from "../data/mathData";
import { physicsData } from "../data/physicsData";
import { chemistryData } from "../data/chemistryData";
import useViewport from "../hooks/useViewport";
import { analyzeProgressWithCoach } from "../lib/aiCoach";
import { openExamGoal } from "../lib/examGoal";
import { appendJourneyEntry, readStudyState } from "../lib/studyData";
import { syncStudyStateToFirebase } from "../lib/firebaseSync";
import { lightHaptic, successHaptic } from "../lib/mobileNative";

const allSubjects = {
  Math: mathData,
  Physics: physicsData,
  Chemistry: chemistryData
};

const emptySlot = () => ({
  subject: "Math",
  chapter: "",
  topic: "",
  total: "",
  correct: "",
  easy: "",
  medium: "",
  hard: "",
  notes: "",
  files: []
});

export default function Practice() {
  const { isPhone } = useViewport();
  const [slots, setSlots] = useState([emptySlot(), emptySlot(), emptySlot()]);
  const [logs, setLogs] = useState([]);
  const [popup, setPopup] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [examGoalMessage, setExamGoalMessage] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("practiceLogs")) || [];
    setLogs(saved);
  }, []);

  useEffect(() => {
    if (isPhone) return undefined;

    const move = (event) => {
      setMouse({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isPhone]);

  const updateSlot = (index, field, value) => {
    setSlots((current) =>
      current.map((slot, slotIndex) => {
        if (slotIndex !== index) return slot;

        if (field === "subject") {
          return {
            ...slot,
            subject: value,
            chapter: "",
            topic: ""
          };
        }

        if (field === "chapter") {
          return {
            ...slot,
            chapter: value,
            topic: ""
          };
        }

        return {
          ...slot,
          [field]: value
        };
      })
    );
  };

  const handleFile = (index, files) => {
    setSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, files: [...files] } : slot
      )
    );
  };

  const saveAll = () => {
    const today = new Date().toLocaleDateString();
    const valid = slots.filter((slot) => slot.chapter && slot.topic && slot.total);

    if (!valid.length) return;

    const newEntries = valid.map((slot) => ({
      ...slot,
      total: Number(slot.total),
      correct: Number(slot.correct),
      accuracy: Math.round((slot.correct / slot.total) * 100),
      date: today
    }));

    const updatedLogs = [...newEntries, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem("practiceLogs", JSON.stringify(updatedLogs));

    let chapters = JSON.parse(localStorage.getItem("chapters")) || {};

    newEntries.forEach((entry) => {
      Object.keys(chapters).forEach((subject) => {
        chapters[subject]?.forEach((chapter) => {
          if (chapter.name === entry.chapter) {
            chapter.practice = (chapter.practice || 0) + entry.total;

            if (entry.accuracy < 50) chapter.weak = true;
            if (entry.accuracy > 80) chapter.strong = true;
          }
        });
      });
    });

    localStorage.setItem("chapters", JSON.stringify(chapters));

    const mistakes = newEntries
      .filter((entry) => entry.correct < entry.total)
      .map((entry) => ({
        chapter: entry.chapter,
        topic: entry.topic,
        note: entry.notes,
        accuracy: entry.accuracy,
        date: today
      }));

    const old = JSON.parse(localStorage.getItem("mistakes")) || [];
    localStorage.setItem("mistakes", JSON.stringify([...mistakes, ...old]));

    appendJourneyEntry({
      type: "practice",
      title: "Practice session saved",
      detail: `${newEntries.length} slot(s) logged for ${today}.`
    });

    const currentState = readStudyState();
    analyzeProgressWithCoach(currentState, "practice_save");
    syncStudyStateToFirebase(currentState);
    successHaptic();

    setSlots([emptySlot(), emptySlot(), emptySlot()]);
    setPopup(true);
    setTimeout(() => setPopup(false), 1800);
  };

  const handleOpenExamGoal = async () => {
    await lightHaptic();
    const result = await openExamGoal();
    setExamGoalMessage(
      result.source === "app"
        ? "ExamGOAL opened. When you come back here, your app will continue normally."
        : "ExamGOAL is not installed here, so the Play Store page was opened."
    );
  };

  const today = new Date().toLocaleDateString();
  const todayLogs = logs.filter((log) => log.date === today);
  const totalQuestionsToday = todayLogs.reduce((sum, log) => sum + (Number(log.total) || 0), 0);
  const averageAccuracy = todayLogs.length
    ? Math.round(todayLogs.reduce((sum, log) => sum + (Number(log.accuracy) || 0), 0) / todayLogs.length)
    : 0;
  const completedSlots = slots.filter((slot) => slot.chapter && slot.topic && slot.total).length;

  return (
    <div style={container(isPhone)}>
      {!isPhone && (
        <div
          style={{
            ...mouseGlow,
            left: mouse.x - 160,
            top: mouse.y - 160
          }}
        />
      )}
      <div style={ambientOne} />
      <div style={ambientTwo} />
      <div style={ambientGrid} />

      <section style={heroPanel(isPhone)}>
        <div style={heroCopy}>
          <div style={eyebrow}>Premium Practice Workspace</div>
          <h1 style={heroTitle(isPhone)}>Sharpen every session with a cleaner, calmer flow.</h1>
          <p style={heroText(isPhone)}>
            Track chapter work, keep mistakes visible, and log your sessions in a layout that
            feels closer to a product dashboard than a plain form.
          </p>
        </div>

        <div style={heroStats}>
          <StatCard label="Today's Sets" value={todayLogs.length} accent="#7f5af0" />
          <StatCard label="Questions Solved" value={totalQuestionsToday} accent="#00c6ff" />
          <StatCard label="Avg Accuracy" value={`${averageAccuracy}%`} accent="#7cffb2" />
          <StatCard label="Ready To Save" value={`${completedSlots}/3`} accent="#ffd166" />
        </div>
      </section>

      <section style={launchPanel(isPhone)}>
        <div style={launchCopy}>
          <div style={handoffEyebrow}>Quick Launch</div>
          <div style={launchTitle}>Open ExamGOAL from inside your app</div>
          <div style={handoffHint}>
            This is a simple launcher only. Your practice logs, chapters, and notes stay fully manual inside this app.
          </div>
        </div>
        <button style={launchButton(isPhone)} onClick={handleOpenExamGoal}>
          Open ExamGOAL
        </button>
      </section>

      {examGoalMessage && (
        <section style={handoffBanner}>
          <div style={handoffEyebrow}>ExamGOAL Status</div>
          <div style={handoffText}>{examGoalMessage}</div>
        </section>
      )}

      <section style={slotsGrid}>
        {slots.map((slot, index) => {
          const chapters = allSubjects[slot.subject] || [];
          const selectedChapter = chapters.find((chapter) => chapter.name === slot.chapter);
          const topics = selectedChapter?.topics || [];
          const completion =
            slot.total && slot.correct
              ? `${Math.round((Number(slot.correct) / Number(slot.total || 1)) * 100)}% ready`
              : "Waiting for inputs";

          return (
            <div key={index} style={{ ...slotCard(isPhone), animationDelay: `${index * 0.08}s` }}>
              <div style={slotHeader(isPhone)}>
                <div>
                  <div style={slotLabel}>Practice Slot {index + 1}</div>
                  <h3 style={slotTitle(isPhone)}>{slot.chapter || "Pick a chapter to begin"}</h3>
                </div>
                <div style={slotPill}>{completion}</div>
              </div>

              <div style={fieldGrid}>
                <label style={fieldBlock}>
                  <span style={fieldLabel}>Subject</span>
                  <select
                    value={slot.subject}
                    onChange={(event) => updateSlot(index, "subject", event.target.value)}
                    style={input}
                  >
                    {Object.keys(allSubjects).map((subject) => (
                      <option key={subject}>{subject}</option>
                    ))}
                  </select>
                </label>

                <label style={fieldBlock}>
                  <span style={fieldLabel}>Chapter</span>
                  <select
                    value={slot.chapter}
                    onChange={(event) => updateSlot(index, "chapter", event.target.value)}
                    style={input}
                  >
                    <option value="">Select Chapter</option>
                    {chapters.map((chapter) => (
                      <option key={chapter.name} value={chapter.name}>
                        {chapter.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label style={fieldBlock}>
                  <span style={fieldLabel}>Topic</span>
                  <select
                    value={slot.topic}
                    onChange={(event) => updateSlot(index, "topic", event.target.value)}
                    style={input}
                  >
                    <option value="">Select Topic</option>
                    {topics.map((topic) => (
                      <option key={topic.name} value={topic.name}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div style={metricGrid}>
                <label style={fieldBlock}>
                  <span style={fieldLabel}>Total Questions</span>
                  <input
                    placeholder="e.g. 30"
                    value={slot.total}
                    onChange={(event) => updateSlot(index, "total", event.target.value)}
                    style={input}
                  />
                </label>

                <label style={fieldBlock}>
                  <span style={fieldLabel}>Correct</span>
                  <input
                    placeholder="e.g. 24"
                    value={slot.correct}
                    onChange={(event) => updateSlot(index, "correct", event.target.value)}
                    style={input}
                  />
                </label>
              </div>

              <div style={difficultyGrid}>
                <label style={fieldBlock}>
                  <span style={fieldLabel}>Easy</span>
                  <input
                    placeholder="0"
                    value={slot.easy}
                    onChange={(event) => updateSlot(index, "easy", event.target.value)}
                    style={smallInput}
                  />
                </label>

                <label style={fieldBlock}>
                  <span style={fieldLabel}>Medium</span>
                  <input
                    placeholder="0"
                    value={slot.medium}
                    onChange={(event) => updateSlot(index, "medium", event.target.value)}
                    style={smallInput}
                  />
                </label>

                <label style={fieldBlock}>
                  <span style={fieldLabel}>Hard</span>
                  <input
                    placeholder="0"
                    value={slot.hard}
                    onChange={(event) => updateSlot(index, "hard", event.target.value)}
                    style={smallInput}
                  />
                </label>
              </div>

              <label style={fieldBlock}>
                <span style={fieldLabel}>Mistakes and Learnings</span>
                <textarea
                  placeholder="Capture patterns, traps, and what to revise next."
                  value={slot.notes}
                  onChange={(event) => updateSlot(index, "notes", event.target.value)}
                  style={textarea}
                />
              </label>

              <label style={uploadCard}>
                <span style={fieldLabel}>Attach screenshots or notes</span>
                <input
                  type="file"
                  multiple
                  onChange={(event) => handleFile(index, event.target.files)}
                  style={fileInput}
                />
                <span style={uploadHint}>
                  {slot.files.length ? `${slot.files.length} file(s) selected` : "No files selected yet"}
                </span>
              </label>

            </div>
          );
        })}
      </section>

      <button onClick={saveAll} style={saveBtn}>
        Save Practice Session
      </button>

      {popup && <div style={popupStyle(isPhone)}>Practice saved successfully.</div>}

      <section style={historyPanel(isPhone)}>
        <div style={historyHeader(isPhone)}>
          <div>
            <div style={eyebrow}>Session History</div>
            <h2 style={historyTitle(isPhone)}>Recent practice snapshots</h2>
          </div>
          <div style={historyCount}>{logs.length} logs</div>
        </div>

        <div style={historyList}>
          {logs.length ? (
            logs.slice(0, 12).map((log, index) => (
              <div key={index} style={historyItem(isPhone)}>
                <div>
                  <div style={historyChapter}>{log.chapter}</div>
                  <div style={historyMeta}>
                    {log.date} | {log.topic}
                  </div>
                </div>
                <div style={historyAccuracy(isPhone)}>{log.accuracy}%</div>
              </div>
            ))
          ) : (
            <div style={emptyHistory}>Your saved sessions will appear here after the first practice log.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{ ...statCard, boxShadow: `0 18px 50px -28px ${accent}` }}>
      <div style={{ ...statAccent, background: accent }} />
      <div style={statLabel}>{label}</div>
      <div style={statValue}>{value}</div>
    </div>
  );
}

const container = (isPhone) => ({
  position: "relative",
  minHeight: "100vh",
  padding: isPhone ? "14px" : "28px",
  color: "#f8fafc",
  overflow: "hidden",
  animation: "fade 0.5s ease"
});

const mouseGlow = {
  position: "fixed",
  width: "320px",
  height: "320px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(127,90,240,0.28), rgba(0,198,255,0.12), transparent 68%)",
  filter: "blur(40px)",
  pointerEvents: "none",
  zIndex: 0,
  transition: "left 0.15s ease-out, top 0.15s ease-out"
};

const ambientOne = {
  position: "absolute",
  inset: "4% auto auto -10%",
  width: "340px",
  height: "340px",
  background: "radial-gradient(circle, rgba(127,90,240,0.5), transparent 70%)",
  filter: "blur(110px)",
  animation: "floatBlob 12s ease-in-out infinite",
  zIndex: 0
};

const ambientTwo = {
  position: "absolute",
  right: "-6%",
  bottom: "4%",
  width: "360px",
  height: "360px",
  background: "radial-gradient(circle, rgba(0,198,255,0.42), transparent 70%)",
  filter: "blur(120px)",
  animation: "floatBlob 14s ease-in-out infinite reverse",
  zIndex: 0
};

const ambientGrid = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
  backgroundSize: "42px 42px",
  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.65), transparent 92%)",
  opacity: 0.22,
  zIndex: 0
};

const heroPanel = (isPhone) => ({
  position: "relative",
  zIndex: 1,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "22px",
  padding: isPhone ? "18px" : "28px",
  marginBottom: "24px",
  borderRadius: isPhone ? "22px" : "28px",
  background: "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(15,23,42,0.62))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 30px 80px -45px rgba(0,0,0,0.9)",
  backdropFilter: "blur(18px)"
});

const heroCopy = {
  textAlign: "left"
};

const eyebrow = {
  display: "inline-block",
  padding: "6px 12px",
  marginBottom: "14px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#94a3b8",
  fontSize: "12px",
  letterSpacing: "0.18em",
  textTransform: "uppercase"
};

const heroTitle = (isPhone) => ({
  margin: 0,
  color: "#f8fafc",
  fontSize: isPhone ? "30px" : "44px",
  lineHeight: 1.02,
  letterSpacing: "-0.04em"
});

const heroText = (isPhone) => ({
  maxWidth: "620px",
  marginTop: "16px",
  color: "#cbd5e1",
  fontSize: isPhone ? "14px" : "16px",
  lineHeight: 1.65,
  textAlign: "left"
});

const heroStats = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "14px"
};

const handoffBanner = {
  position: "relative",
  zIndex: 1,
  marginBottom: "20px",
  padding: "18px",
  borderRadius: "20px",
  background: "rgba(125,211,252,0.08)",
  border: "1px solid rgba(125,211,252,0.22)",
  textAlign: "left"
};

const launchPanel = (isPhone) => ({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: isPhone ? "column" : "row",
  justifyContent: "space-between",
  alignItems: isPhone ? "stretch" : "center",
  gap: "16px",
  marginBottom: "20px",
  padding: "18px",
  borderRadius: "22px",
  background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
  border: "1px solid rgba(255,255,255,0.08)"
});

const launchCopy = {
  textAlign: "left"
};

const launchTitle = {
  marginTop: "8px",
  color: "#f8fafc",
  fontSize: "20px",
  fontWeight: 700
};

const launchButton = (isPhone) => ({
  width: isPhone ? "100%" : "auto",
  minWidth: isPhone ? "0" : "170px",
  minHeight: "58px",
  padding: "14px 18px",
  borderRadius: "18px",
  border: "1px solid rgba(125,211,252,0.25)",
  background: "linear-gradient(90deg, #7f5af0, #00c6ff)",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: "15px",
  cursor: "pointer",
  boxShadow: "0 20px 44px -26px rgba(0,198,255,0.5)"
});

const handoffEyebrow = {
  color: "#7dd3fc",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.14em"
};

const handoffText = {
  marginTop: "10px",
  color: "#f8fafc",
  fontWeight: 600
};

const handoffHint = {
  marginTop: "8px",
  color: "#cbd5e1",
  lineHeight: 1.55
};

const statCard = {
  position: "relative",
  padding: "18px",
  borderRadius: "22px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  textAlign: "left",
  overflow: "hidden"
};

const statAccent = {
  position: "absolute",
  inset: "0 auto auto 0",
  width: "100%",
  height: "3px",
  opacity: 0.95
};

const statLabel = {
  color: "#94a3b8",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.12em"
};

const statValue = {
  marginTop: "10px",
  fontSize: "32px",
  fontWeight: 700,
  color: "#f8fafc"
};

const slotsGrid = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gap: "20px"
};

const slotCard = (isPhone) => ({
  padding: isPhone ? "18px" : "24px",
  borderRadius: isPhone ? "20px" : "24px",
  background: "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(18px)",
  boxShadow: "0 24px 65px -40px rgba(0,0,0,0.85)",
  animation: "fade 0.55s ease both",
  textAlign: "left"
});

const slotHeader = (isPhone) => ({
  display: "flex",
  flexDirection: isPhone ? "column" : "row",
  justifyContent: "space-between",
  alignItems: isPhone ? "stretch" : "flex-start",
  gap: "16px",
  marginBottom: "20px"
});

const slotLabel = {
  color: "#7dd3fc",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.14em"
};

const slotTitle = (isPhone) => ({
  margin: "8px 0 0",
  color: "#f8fafc",
  fontSize: isPhone ? "20px" : "24px",
  lineHeight: 1.1
});

const slotPill = {
  padding: "10px 14px",
  borderRadius: "999px",
  background: "rgba(127,90,240,0.14)",
  border: "1px solid rgba(127,90,240,0.35)",
  color: "#d8b4fe",
  whiteSpace: "nowrap",
  fontSize: "13px"
};

const fieldGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "14px",
  marginBottom: "14px"
};

const metricGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "14px",
  marginBottom: "14px"
};

const difficultyGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "14px",
  marginBottom: "14px"
};

const fieldBlock = {
  display: "flex",
  flexDirection: "column",
  gap: "8px"
};

const fieldLabel = {
  fontSize: "12px",
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.12em"
};

const input = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(2,6,23,0.7)",
  color: "#f8fafc",
  outline: "none",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)"
};

const smallInput = {
  ...input
};

const textarea = {
  width: "100%",
  minHeight: "110px",
  boxSizing: "border-box",
  padding: "14px 16px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(2,6,23,0.72)",
  color: "#f8fafc",
  resize: "vertical",
  outline: "none"
};

const uploadCard = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginTop: "2px",
  padding: "16px",
  borderRadius: "18px",
  background: "rgba(15,23,42,0.58)",
  border: "1px dashed rgba(125,211,252,0.3)"
};

const fileInput = {
  ...input,
  padding: "10px 12px"
};

const uploadHint = {
  color: "#cbd5e1",
  fontSize: "13px"
};

const saveBtn = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  marginTop: "22px",
  padding: "18px 24px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(90deg, #7f5af0, #00c6ff)",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 24px 55px -28px rgba(0,198,255,0.55)",
  transition: "transform 0.25s ease, box-shadow 0.25s ease"
};

const popupStyle = (isPhone) => ({
  position: "fixed",
  top: isPhone ? "16px" : "28px",
  right: isPhone ? "16px" : "28px",
  left: isPhone ? "16px" : "auto",
  zIndex: 3,
  padding: "14px 18px",
  borderRadius: "16px",
  background: "rgba(12,18,34,0.92)",
  color: "#ecfeff",
  border: "1px solid rgba(0,198,255,0.28)",
  boxShadow: "0 18px 45px -24px rgba(0,198,255,0.45)",
  backdropFilter: "blur(14px)",
  animation: "fade 0.3s ease"
});

const historyPanel = (isPhone) => ({
  position: "relative",
  zIndex: 1,
  marginTop: "24px",
  padding: isPhone ? "18px" : "24px",
  borderRadius: isPhone ? "20px" : "24px",
  background: "linear-gradient(145deg, rgba(15,23,42,0.84), rgba(15,23,42,0.56))",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(18px)",
  textAlign: "left"
});

const historyHeader = (isPhone) => ({
  display: "flex",
  flexDirection: isPhone ? "column" : "row",
  justifyContent: "space-between",
  alignItems: isPhone ? "stretch" : "flex-end",
  gap: "16px",
  marginBottom: "18px"
});

const historyTitle = (isPhone) => ({
  margin: "8px 0 0",
  fontSize: isPhone ? "22px" : "28px",
  color: "#f8fafc"
});

const historyCount = {
  padding: "10px 14px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.05)",
  color: "#cbd5e1",
  border: "1px solid rgba(255,255,255,0.08)"
};

const historyList = {
  display: "grid",
  gap: "12px"
};

const historyItem = (isPhone) => ({
  display: "flex",
  flexDirection: isPhone ? "column" : "row",
  justifyContent: "space-between",
  alignItems: isPhone ? "flex-start" : "center",
  gap: "16px",
  padding: "16px 18px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.05)"
});

const historyChapter = {
  color: "#f8fafc",
  fontSize: "17px",
  fontWeight: 600
};

const historyMeta = {
  marginTop: "5px",
  color: "#94a3b8",
  fontSize: "13px"
};

const historyAccuracy = (isPhone) => ({
  fontSize: isPhone ? "18px" : "20px",
  fontWeight: 700,
  color: "#7dd3fc"
});

const emptyHistory = {
  padding: "18px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.04)",
  color: "#cbd5e1",
  border: "1px solid rgba(255,255,255,0.05)"
};
