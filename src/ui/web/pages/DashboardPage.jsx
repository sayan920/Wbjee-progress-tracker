import useDashboardModel from "../../../hooks/useDashboardModel";

export default function DashboardPage() {
  const model = useDashboardModel();

  return (
    <div style={page}>
      <section style={hero}>
        <Metric title="Streak" value={`${model.streak} days`} accent="#7f5af0" />
        <Metric title="Accuracy" value={`${model.accuracy}%`} accent="#00c6ff" />
        <Metric title="Today" value={`${model.todayLogs.length}/3`} accent="#7cffb2" />
        <Metric title="Questions" value={model.totalQuestions} accent="#ffd166" />
      </section>

      <section style={grid}>
        <Panel title="Accuracy Trend" subtitle="Last 7 days">
          <LineChart data={model.recentAccuracySeries} color="#00c6ff" suffix="%" />
        </Panel>
        <Panel title="Practice Volume" subtitle="Daily sets">
          <BarChart data={model.progressSeries} color="#7f5af0" />
        </Panel>
      </section>

      <section style={grid}>
        <Panel title="Coach Notes" subtitle="Latest guidance">
          {model.coachReport ? (
            <div style={stack}>
              <div style={highlight}>{model.coachReport.summary}</div>
              {(model.coachReport.priorities || []).slice(0, 3).map((item, index) => (
                <div key={index} style={card}>
                  <strong>{item.title}</strong>
                  <div style={muted}>{item.reason}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={empty}>Coach notes will appear after analysis runs.</div>
          )}
        </Panel>
        <Panel title="Journey Feed" subtitle="Recent milestones">
          <div style={stack}>
            {model.journeyFeed.length ? (
              model.journeyFeed.slice(0, 5).map((entry, index) => (
                <div key={index} style={card}>
                  <strong>{entry.title}</strong>
                  <div style={muted}>{entry.detail}</div>
                </div>
              ))
            ) : (
              <div style={empty}>Your journey feed updates as you practice and analyze.</div>
            )}
          </div>
        </Panel>
      </section>

      <section style={grid}>
        <Panel title="Notifications" subtitle="Study reminders">
          <div style={stack}>
            <div style={highlight}>
              {model.reminder
                ? `Daily reminder active at ${model.reminder.hour}:${String(model.reminder.minute).padStart(2, "0")}.`
                : "No daily reminder is active yet."}
            </div>
            <button style={button} onClick={model.enableReminder}>Enable Reminder</button>
          </div>
        </Panel>
        <Panel title="Firebase Sync" subtitle="Backup status">
          <div style={stack}>
            <div style={highlight}>
              {model.isFirebaseReady ? "Firebase is configured and ready." : "Firebase is scaffolded but not configured yet."}
            </div>
            <button style={button} onClick={model.syncFirebase}>Sync Now</button>
            {model.statusMessage ? <div style={muted}>{model.statusMessage}</div> : null}
          </div>
        </Panel>
      </section>
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <div style={panel}>
      <div style={panelSubtitle}>{subtitle}</div>
      <h3 style={panelTitle}>{title}</h3>
      {children}
    </div>
  );
}

function Metric({ title, value, accent }) {
  return (
    <div style={{ ...metric, boxShadow: `0 22px 46px -32px ${accent}` }}>
      <div style={{ ...metricLine, background: accent }} />
      <div style={metricTitle}>{title}</div>
      <div style={metricValue}>{value}</div>
    </div>
  );
}

function LineChart({ data, color, suffix = "" }) {
  const max = Math.max(...data.map((point) => point.value), 1);
  const points = data
    .map((point, index) => `${(index / Math.max(data.length - 1, 1)) * 100},${100 - (point.value / max) * 100}`)
    .join(" ");
  return (
    <div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={svg}>
        <polyline fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points} />
      </svg>
      <div style={chartLabels}>
        {data.map((point) => (
          <div key={point.label} style={chartItem}>
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
    <div style={barWrap}>
      {data.map((point) => (
        <div key={point.label} style={barGroup}>
          <div style={barValue}>{point.value}</div>
          <div style={barTrack}>
            <div style={{ ...bar, height: `${Math.max((point.value / max) * 100, point.value ? 12 : 0)}%`, background: color }} />
          </div>
          <div style={barLabel}>{point.label}</div>
        </div>
      ))}
    </div>
  );
}

const page = { display: "grid", gap: "18px" };
const hero = { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "16px" };
const grid = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "18px" };
const metric = { position: "relative", padding: "20px", borderRadius: "22px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" };
const metricLine = { position: "absolute", top: 0, left: 0, width: "100%", height: "3px" };
const metricTitle = { color: "#94a3b8", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase" };
const metricValue = { marginTop: "12px", color: "#f8fafc", fontSize: "32px", fontWeight: 700 };
const panel = { padding: "22px", borderRadius: "26px", background: "linear-gradient(145deg, rgba(15,23,42,0.84), rgba(15,23,42,0.56))", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 60px -42px rgba(0,0,0,0.86)", textAlign: "left" };
const panelSubtitle = { color: "#7dd3fc", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase" };
const panelTitle = { margin: "10px 0 0", color: "#f8fafc", fontSize: "24px" };
const stack = { display: "grid", gap: "12px", marginTop: "16px" };
const highlight = { padding: "14px 16px", borderRadius: "18px", background: "rgba(125,211,252,0.08)", border: "1px solid rgba(125,211,252,0.14)", color: "#e0f2fe", lineHeight: 1.6 };
const card = { padding: "14px 16px", borderRadius: "18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" };
const muted = { marginTop: "6px", color: "#cbd5e1", lineHeight: 1.55 };
const empty = { ...card, color: "#94a3b8" };
const button = { padding: "14px 16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(90deg, #7f5af0, #00c6ff)", color: "#fff", fontWeight: 700, cursor: "pointer" };
const svg = { width: "100%", height: "120px", marginTop: "16px" };
const chartLabels = { display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "8px", marginTop: "12px" };
const chartItem = { display: "grid", gap: "4px", color: "#cbd5e1", fontSize: "12px" };
const barWrap = { display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "10px", alignItems: "end", minHeight: "180px", marginTop: "18px" };
const barGroup = { display: "grid", gap: "8px", justifyItems: "center" };
const barValue = { color: "#e2e8f0", fontSize: "12px" };
const barTrack = { width: "100%", height: "120px", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "8px", borderRadius: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" };
const bar = { width: "100%", borderRadius: "10px" };
const barLabel = { color: "#94a3b8", fontSize: "12px" };
