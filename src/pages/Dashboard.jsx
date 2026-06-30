import { useEffect, useMemo, useState } from "react";
import useViewport from "../hooks/useViewport";
import { readCoachReport, readJourneyFeed } from "../lib/studyData";
import { getReminderPreference, lightHaptic, scheduleDailyReminder } from "../lib/mobileNative";
import { isFirebaseConfigured, syncStudyStateToFirebase } from "../lib/firebaseSync";

export default function Dashboard() {
  const { isPhone } = useViewport();
  const [logs, setLogs] = useState([]);
  const [chapters, setChapters] = useState({});
  const [mistakes, setMistakes] = useState([]);
  const [coachReport, setCoachReport] = useState(null);
  const [journeyFeed, setJourneyFeed] = useState([]);
  const [reminder, setReminder] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem("practiceLogs")) || [];
    const storedChapters = JSON.parse(localStorage.getItem("chapters")) || {};
    const storedMistakes = JSON.parse(localStorage.getItem("mistakes")) || [];

    setLogs(storedLogs);
    setChapters(storedChapters);
    setMistakes(storedMistakes);
    setCoachReport(readCoachReport());
    setJourneyFeed(readJourneyFeed());
    getReminderPreference().then(setReminder);
  }, []);

  useEffect(() => {
    const move = (event) => {
      setMouse({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const today = new Date().toLocaleDateString();
  const todayLogs = useMemo(() => logs.filter((log) => log.date === today), [logs, today]);

  const streak = useMemo(() => {
    let count = 0;
    const date = new Date();

    while (true) {
      const day = date.toLocaleDateString();
      const found = logs.some((log) => log.date === day);
      if (!found) break;
      count += 1;
      date.setDate(date.getDate() - 1);
    }

    return count;
  }, [logs]);

  const accuracy = logs.length
    ? Math.round(logs.reduce((sum, log) => sum + (Number(log.accuracy) || 0), 0) / logs.length)
    : 0;
  const progress = Math.min((todayLogs.length / 3) * 100, 100);
  const totalQuestions = todayLogs.reduce((sum, log) => sum + (Number(log.total) || 0), 0);

  const weak = [];
  const strong = [];

  Object.values(chapters).forEach((items) => {
    items?.forEach((chapter) => {
      if (chapter.weak) weak.push(chapter.name);
      if (chapter.strong) strong.push(chapter.name);
    });
  });

  const recentAccuracySeries = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - offset));
    const day = date.toLocaleDateString();
    const dayLogs = logs.filter((log) => log.date === day);
    const value = dayLogs.length
      ? Math.round(dayLogs.reduce((sum, log) => sum + (Number(log.accuracy) || 0), 0) / dayLogs.length)
      : 0;

    return {
      label: day.slice(0, 5),
      value
    };
  });

  const progressSeries = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - offset));
    const day = date.toLocaleDateString();
    return {
      label: day.slice(0, 5),
      value: logs.filter((log) => log.date === day).length
    };
  });

  const handleReminderSetup = async () => {
    try {
      await lightHaptic();
      const savedReminder = await scheduleDailyReminder();
      setReminder(savedReminder);
      setStatusMessage(`Daily reminder enabled for ${savedReminder.hour}:00.`);
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const handleFirebaseSync = async () => {
    await lightHaptic();
    const result = await syncStudyStateToFirebase({
      logs,
      chapters,
      mistakes
    });

    setStatusMessage(
      result.synced
        ? "Firebase sync completed."
        : "Firebase config is missing. Add the Firebase values in .env to enable sync."
    );
  };

  return (
    <div style={page(isPhone)}>
      {!isPhone && (
        <div
          style={{
            ...mouseGlow,
            left: mouse.x - 180,
            top: mouse.y - 180
          }}
        />
      )}
      <div style={topAura} />
      <div style={bottomAura} />

      <section style={hero}>
        <div style={heroCopy(isPhone)}>
          <div style={eyebrow}>Today&apos;s Overview</div>
          <h2 style={heroTitle(isPhone)}>Your performance dashboard is live and easier to read.</h2>
          <p style={heroText(isPhone)}>
            Monitor streak, accuracy, mistakes, and chapter health from a calmer workspace with
            smoother visual feedback.
          </p>
        </div>

        <div style={heroPanel(isPhone)}>
          <div style={heroLabel}>Daily momentum</div>
          <div style={heroValue(isPhone)}>{Math.round(progress)}%</div>
          <div style={progressTrack}>
            <div style={{ ...progressFill, width: `${progress}%` }} />
          </div>
          <div style={heroSubtext}>
            {todayLogs.length < 2 ? "You are slightly behind today's target." : "You are on pace today."}
          </div>
        </div>
      </section>

      <section style={statsGrid}>
        <MetricCard title="Streak" value={`${streak} days`} accent="#7f5af0" />
        <MetricCard title="Accuracy" value={`${accuracy}%`} accent="#00c6ff" />
        <MetricCard title="Today" value={`${todayLogs.length}/3`} accent="#7cffb2" />
        <MetricCard title="Questions" value={totalQuestions} accent="#ffd166" />
      </section>

      <section style={contentGrid}>
        <div style={panel}>
          <div style={panelEyebrow}>Accuracy Graph</div>
          <h3 style={panelTitle}>Last 7 days accuracy</h3>
          <SparklineChart data={recentAccuracySeries} color="#00c6ff" suffix="%" />
        </div>

        <div style={panel}>
          <div style={panelEyebrow}>Progress Graph</div>
          <h3 style={panelTitle}>Practice sets over the last week</h3>
          <BarChart data={progressSeries} color="#7f5af0" />
        </div>
      </section>

      <section style={contentGrid}>
        <div style={panel}>
          <div style={panelHeader}>
            <div>
              <div style={panelEyebrow}>Weak Zones</div>
              <h3 style={panelTitle}>Chapters needing attention</h3>
            </div>
          </div>

          <div style={pillList}>
            {weak.length ? (
              weak.slice(0, 8).map((chapter, index) => (
                <div key={index} style={dangerPill}>
                  {chapter}
                </div>
              ))
            ) : (
              <div style={emptyState}>No weak chapters yet. Keep logging practice to surface them.</div>
            )}
          </div>
        </div>

        <div style={panel}>
          <div style={panelHeader}>
            <div>
              <div style={panelEyebrow}>Strong Zones</div>
              <h3 style={panelTitle}>What is already working</h3>
            </div>
          </div>

          <div style={pillList}>
            {strong.length ? (
              strong.slice(0, 8).map((chapter, index) => (
                <div key={index} style={successPill}>
                  {chapter}
                </div>
              ))
            ) : (
              <div style={emptyState}>Complete a few high-value chapters to fill this area.</div>
            )}
          </div>
        </div>
      </section>

      <section style={bottomGrid}>
        <div style={panel}>
          <div style={panelEyebrow}>Mistake Feed</div>
          <h3 style={panelTitle}>Recent mistakes to revisit</h3>
          <div style={timeline}>
            {mistakes.length ? (
              mistakes.slice(0, 6).map((mistake, index) => (
                <div key={index} style={timelineItem(isPhone)}>
                  <div style={timelineDot} />
                  <div>
                    <div style={timelineTitle}>{mistake.chapter}</div>
                    <div style={timelineMeta(isPhone)}>
                      {mistake.date} | {mistake.topic} | {mistake.accuracy}%
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={emptyState}>Your mistake log is clean right now.</div>
            )}
          </div>
        </div>

        <div style={panel}>
          <div style={panelEyebrow}>Session Health</div>
          <h3 style={panelTitle}>How practice is trending today</h3>
          <div style={healthCard}>
            <div style={healthRow}>
              <span style={healthLabel}>Practice sets completed</span>
              <span style={healthValue}>{todayLogs.length}</span>
            </div>
            <div style={healthRow}>
              <span style={healthLabel}>Questions solved</span>
              <span style={healthValue}>{totalQuestions}</span>
            </div>
            <div style={healthRow}>
              <span style={healthLabel}>Average accuracy</span>
              <span style={healthValue}>{accuracy}%</span>
            </div>
          </div>
        </div>
      </section>

      <section style={bottomGrid}>
        <div style={panel}>
          <div style={panelEyebrow}>Coach Notes</div>
          <h3 style={panelTitle}>Study guidance on your dashboard</h3>
          {coachReport ? (
            <div style={coachStack}>
              <div style={coachSummary}>{coachReport.summary}</div>
              {(coachReport.priorities || []).slice(0, 4).map((item, index) => (
                <div key={index} style={coachPriority}>
                  <div style={coachPriorityTitle}>{item.title}</div>
                  <div style={coachPriorityReason}>{item.reason}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={emptyState}>Your latest coach summary will appear here after analysis runs.</div>
          )}
        </div>

        <div style={panel}>
          <div style={panelEyebrow}>Journey Feed</div>
          <h3 style={panelTitle}>Recent study milestones</h3>
          <div style={timeline}>
            {journeyFeed.length ? (
              journeyFeed.slice(0, 6).map((entry, index) => (
                <div key={index} style={timelineItem(isPhone)}>
                  <div style={timelineDot} />
                  <div>
                    <div style={timelineTitle}>{entry.title}</div>
                    <div style={timelineMeta(isPhone)}>{entry.detail}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={emptyState}>Your study journey feed will update as you practice and analyze progress.</div>
            )}
          </div>
        </div>
      </section>

      <section style={bottomGrid}>
        <div style={panel}>
          <div style={panelEyebrow}>Notifications</div>
          <h3 style={panelTitle}>Daily study reminder</h3>
          <div style={coachStack}>
            <div style={coachSummary}>
              {reminder
                ? `Reminder active at ${reminder.hour}:${String(reminder.minute).padStart(2, "0")}.`
                : "No reminder is active yet."}
            </div>
            <button style={actionButton} onClick={handleReminderSetup}>
              Enable Daily Reminder
            </button>
          </div>
        </div>

        <div style={panel}>
          <div style={panelEyebrow}>Sync</div>
          <h3 style={panelTitle}>Backup and device sync</h3>
          <div style={coachStack}>
            <div style={coachSummary}>
              {isFirebaseConfigured()
                ? "Firebase is configured and ready for sync."
                : "Firebase is scaffolded but not configured yet."}
            </div>
            <button style={actionButton} onClick={handleFirebaseSync}>
              Sync to Firebase
            </button>
            {statusMessage && <div style={syncMessage}>{statusMessage}</div>}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ title, value, accent }) {
  return (
    <div style={{ ...metricCard, boxShadow: `0 22px 46px -32px ${accent}` }}>
      <div style={{ ...metricAccent, background: accent }} />
      <div style={metricTitle}>{title}</div>
      <div style={metricValue}>{value}</div>
    </div>
  );
}

function SparklineChart({ data, color, suffix = "" }) {
  const max = Math.max(...data.map((point) => point.value), 1);
  const points = data
    .map((point, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const y = 100 - (point.value / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div style={chartWrap}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={chartSvg}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>
      <div style={chartLabels}>
        {data.map((point) => (
          <div key={point.label} style={chartLabelItem}>
            <span>{point.label}</span>
            <strong>{point.value}{suffix}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ data, color }) {
  const max = Math.max(...data.map((point) => point.value), 1);

  return (
    <div style={barChartWrap}>
      {data.map((point) => (
        <div key={point.label} style={barGroup}>
          <div style={barValue}>{point.value}</div>
          <div style={barTrack}>
            <div
              style={{
                ...barColumn,
                height: `${Math.max((point.value / max) * 100, point.value ? 12 : 0)}%`,
                background: color
              }}
            />
          </div>
          <div style={barLabel}>{point.label}</div>
        </div>
      ))}
    </div>
  );
}

const page = (isPhone) => ({
  position: "relative",
  padding: isPhone ? "14px" : "18px",
  minHeight: "100%",
  color: "#f8fafc",
  overflow: "hidden",
  animation: "pageIn 0.45s ease"
});

const mouseGlow = {
  position: "fixed",
  width: "360px",
  height: "360px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(127,90,240,0.22), rgba(0,198,255,0.1), transparent 72%)",
  filter: "blur(50px)",
  pointerEvents: "none",
  zIndex: 0,
  transition: "left 0.16s ease-out, top 0.16s ease-out"
};

const topAura = {
  position: "absolute",
  top: "2%",
  left: "-6%",
  width: "320px",
  height: "320px",
  background: "radial-gradient(circle, rgba(127,90,240,0.35), transparent 72%)",
  filter: "blur(110px)",
  zIndex: 0
};

const bottomAura = {
  position: "absolute",
  right: "-8%",
  bottom: "8%",
  width: "340px",
  height: "340px",
  background: "radial-gradient(circle, rgba(0,198,255,0.24), transparent 72%)",
  filter: "blur(120px)",
  zIndex: 0
};

const hero = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
  marginBottom: "20px"
};

const heroCopy = (isPhone) => ({
  padding: isPhone ? "18px" : "28px",
  borderRadius: isPhone ? "20px" : "26px",
  background: "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(15,23,42,0.58))",
  border: "1px solid rgba(255,255,255,0.08)",
  textAlign: "left",
  boxShadow: "0 28px 70px -44px rgba(0,0,0,0.9)"
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
  color: "#f8fafc",
  fontSize: isPhone ? "28px" : "40px",
  lineHeight: 1.03
});

const heroText = (isPhone) => ({
  marginTop: "14px",
  color: "#cbd5e1",
  fontSize: isPhone ? "14px" : "15px",
  lineHeight: 1.65,
  textAlign: "left"
});

const heroPanel = (isPhone) => ({
  padding: isPhone ? "18px" : "28px",
  borderRadius: isPhone ? "20px" : "26px",
  background: "linear-gradient(145deg, rgba(127,90,240,0.2), rgba(0,198,255,0.12))",
  border: "1px solid rgba(125,211,252,0.18)",
  textAlign: "left",
  boxShadow: "0 28px 70px -44px rgba(0,198,255,0.5)"
});

const heroLabel = {
  color: "#7dd3fc",
  fontSize: "12px",
  letterSpacing: "0.14em",
  textTransform: "uppercase"
};

const heroValue = (isPhone) => ({
  marginTop: "10px",
  fontSize: isPhone ? "46px" : "64px",
  lineHeight: 1,
  fontWeight: 800,
  color: "#f8fafc"
});

const progressTrack = {
  width: "100%",
  height: "12px",
  marginTop: "18px",
  borderRadius: "999px",
  background: "rgba(15,23,42,0.7)",
  overflow: "hidden"
};

const progressFill = {
  height: "100%",
  borderRadius: "999px",
  background: "linear-gradient(90deg, #7f5af0, #00c6ff)"
};

const heroSubtext = {
  marginTop: "14px",
  color: "#dbeafe",
  fontSize: "14px"
};

const statsGrid = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginBottom: "20px"
};

const chartWrap = {
  marginTop: "18px"
};

const chartSvg = {
  width: "100%",
  height: "120px"
};

const chartLabels = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(74px, 1fr))",
  gap: "10px",
  marginTop: "14px"
};

const chartLabelItem = {
  display: "grid",
  gap: "4px",
  color: "#cbd5e1",
  fontSize: "12px"
};

const barChartWrap = {
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  gap: "10px",
  alignItems: "end",
  minHeight: "180px",
  marginTop: "18px"
};

const barGroup = {
  display: "grid",
  gap: "8px",
  justifyItems: "center"
};

const barValue = {
  color: "#e2e8f0",
  fontSize: "12px"
};

const barTrack = {
  width: "100%",
  height: "120px",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.05)",
  padding: "8px"
};

const barColumn = {
  width: "100%",
  borderRadius: "10px"
};

const barLabel = {
  color: "#94a3b8",
  fontSize: "12px"
};

const metricCard = {
  position: "relative",
  padding: "20px",
  borderRadius: "22px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  textAlign: "left",
  overflow: "hidden"
};

const metricAccent = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "3px"
};

const metricTitle = {
  color: "#94a3b8",
  fontSize: "12px",
  letterSpacing: "0.14em",
  textTransform: "uppercase"
};

const metricValue = {
  marginTop: "12px",
  fontSize: "32px",
  fontWeight: 700,
  color: "#f8fafc"
};

const contentGrid = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "18px",
  marginBottom: "18px"
};

const bottomGrid = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "18px"
};

const panel = {
  padding: "22px",
  borderRadius: "24px",
  background: "linear-gradient(145deg, rgba(15,23,42,0.82), rgba(15,23,42,0.58))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 24px 60px -42px rgba(0,0,0,0.86)",
  textAlign: "left"
};

const panelHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "14px",
  marginBottom: "16px"
};

const panelEyebrow = {
  color: "#7dd3fc",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.14em"
};

const panelTitle = {
  margin: "8px 0 0",
  color: "#f8fafc",
  fontSize: "24px",
  lineHeight: 1.15
};

const pillList = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px"
};

const dangerPill = {
  padding: "10px 14px",
  borderRadius: "999px",
  background: "rgba(248,113,113,0.12)",
  border: "1px solid rgba(248,113,113,0.18)",
  color: "#fecaca"
};

const successPill = {
  padding: "10px 14px",
  borderRadius: "999px",
  background: "rgba(74,222,128,0.12)",
  border: "1px solid rgba(74,222,128,0.18)",
  color: "#bbf7d0"
};

const timeline = {
  display: "grid",
  gap: "14px"
};

const timelineItem = (isPhone) => ({
  display: "grid",
  gridTemplateColumns: "16px minmax(0, 1fr)",
  gap: "12px",
  padding: "12px 0",
  borderBottom: "1px solid rgba(255,255,255,0.06)"
});

const timelineDot = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #7f5af0, #00c6ff)",
  marginTop: "6px",
  boxShadow: "0 0 18px rgba(0,198,255,0.4)"
};

const timelineTitle = {
  color: "#f8fafc",
  fontWeight: 600
};

const timelineMeta = (isPhone) => ({
  marginTop: "6px",
  color: "#94a3b8",
  fontSize: isPhone ? "12px" : "13px"
});

const healthCard = {
  display: "grid",
  gap: "12px"
};

const healthRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)"
};

const healthLabel = {
  color: "#cbd5e1"
};

const healthValue = {
  color: "#f8fafc",
  fontWeight: 700
};

const coachStack = {
  display: "grid",
  gap: "12px"
};

const coachSummary = {
  padding: "14px 16px",
  borderRadius: "18px",
  background: "rgba(125,211,252,0.08)",
  border: "1px solid rgba(125,211,252,0.14)",
  color: "#e0f2fe",
  lineHeight: 1.6
};

const coachPriority = {
  padding: "14px 16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)"
};

const coachPriorityTitle = {
  color: "#f8fafc",
  fontWeight: 700
};

const coachPriorityReason = {
  marginTop: "6px",
  color: "#cbd5e1",
  lineHeight: 1.55
};

const actionButton = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(90deg, #7f5af0, #00c6ff)",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer"
};

const syncMessage = {
  padding: "12px 14px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  color: "#cbd5e1"
};

const emptyState = {
  padding: "14px 16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  color: "#cbd5e1"
};
