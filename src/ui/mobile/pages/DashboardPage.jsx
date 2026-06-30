import useDashboardModel from "../../../hooks/useDashboardModel";

export default function DashboardPage() {
  const model = useDashboardModel();

  return (
    <div style={page}>
      <div style={statsGrid}>
        <Stat label="Streak" value={`${model.streak}d`} />
        <Stat label="Accuracy" value={`${model.accuracy}%`} />
        <Stat label="Today" value={`${model.todayLogs.length}/3`} />
        <Stat label="Questions" value={model.totalQuestions} />
      </div>

      <Section title="Coach Notes">
        {model.coachReport ? (
          <div style={stack}>
            <div style={card}>{model.coachReport.summary}</div>
            {(model.coachReport.priorities || []).slice(0, 2).map((item, index) => (
              <div key={index} style={card}>
                <strong>{item.title}</strong>
                <div style={muted}>{item.reason}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={card}>Run AI analysis to see your current priorities.</div>
        )}
      </Section>

      <Section title="Notifications">
        <div style={stack}>
          <div style={card}>
            {model.reminder
              ? `Reminder active at ${model.reminder.hour}:${String(model.reminder.minute).padStart(2, "0")}`
              : "No reminder active"}
          </div>
          <button style={button} onClick={model.enableReminder}>Enable Reminder</button>
        </div>
      </Section>

      <Section title="Sync">
        <div style={stack}>
          <div style={card}>
            {model.isFirebaseReady ? "Firebase ready for sync." : "Firebase not configured yet."}
          </div>
          <button style={button} onClick={model.syncFirebase}>Sync Now</button>
          {model.statusMessage ? <div style={muted}>{model.statusMessage}</div> : null}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={section}>
      <h3 style={titleStyle}>{title}</h3>
      {children}
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div style={stat}>
      <div style={statLabel}>{label}</div>
      <div style={statValue}>{value}</div>
    </div>
  );
}

const page = { display: "grid", gap: "14px" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" };
const stat = { padding: "16px", borderRadius: "18px", background: "#0f1b30", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left" };
const statLabel = { color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em" };
const statValue = { marginTop: "10px", color: "#f8fafc", fontSize: "28px", fontWeight: 700 };
const section = { padding: "16px", borderRadius: "20px", background: "#0f1b30", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left" };
const titleStyle = { margin: 0, fontSize: "20px", color: "#f8fafc" };
const stack = { display: "grid", gap: "10px", marginTop: "14px" };
const card = { padding: "14px", borderRadius: "16px", background: "#14233b", color: "#e2e8f0", lineHeight: 1.55 };
const muted = { color: "#94a3b8", lineHeight: 1.5 };
const button = { minHeight: "52px", padding: "12px 14px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", background: "#1b7cff", color: "#fff", fontWeight: 700, cursor: "pointer" };
