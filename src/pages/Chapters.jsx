import { useEffect, useState } from "react";
import { mathData } from "../data/mathData";
import { physicsData } from "../data/physicsData";
import { chemistryData } from "../data/chemistryData";
import useViewport from "../hooks/useViewport";

const DEFAULT_CHAPTERS = {
  Math: mathData,
  Physics: physicsData,
  Chemistry: chemistryData
};

const getInitialChapters = () => ({
  Math: DEFAULT_CHAPTERS.Math.map((chapter) => ({ ...chapter })),
  Physics: DEFAULT_CHAPTERS.Physics.map((chapter) => ({ ...chapter })),
  Chemistry: DEFAULT_CHAPTERS.Chemistry.map((chapter) => ({ ...chapter }))
});

const isValidChapterState = (value) => {
  if (!value || typeof value !== "object") return false;

  return ["Math", "Physics", "Chemistry"].every(
    (key) => Array.isArray(value[key]) && value[key].length > 0
  );
};

const subjectConfig = [
  { key: "Math", title: "Mathematics", tone: "#7f5af0" },
  { key: "Physics", title: "Physics", tone: "#00c6ff" },
  { key: "Chemistry", title: "Chemistry", tone: "#7cffb2" }
];

export default function Chapters() {
  const { isPhone } = useViewport();
  const [chapters, setChapters] = useState({});
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chapters"));
    const initial = getInitialChapters();

    if (isValidChapterState(saved)) {
      setChapters(saved);
    } else {
      setChapters(initial);
      localStorage.setItem("chapters", JSON.stringify(initial));
    }
  }, []);

  const toggle = (subject, index) => {
    const updated = {
      ...chapters,
      [subject]: chapters[subject].map((chapter, chapterIndex) =>
        chapterIndex === index ? { ...chapter, done: !chapter.done } : chapter
      )
    };

    const chapter = updated[subject][index];

    if (chapter.done) {
      setPopupData({
        chapter,
        next: updated[subject][index + 1]
      });
    }

    setChapters(updated);
    localStorage.setItem("chapters", JSON.stringify(updated));
  };

  const getProgress = (list = []) => {
    if (!list.length) return 0;
    const done = list.filter((chapter) => chapter.done).length;
    return Math.round((done / list.length) * 100);
  };

  return (
    <div style={page(isPhone)}>
      <section style={hero(isPhone)}>
        <div>
          <div style={eyebrow}>Chapter Control Center</div>
          <h2 style={heroTitle(isPhone)}>Turn chapter tracking into a premium, glanceable system.</h2>
          <p style={heroText(isPhone)}>
            Subject blocks now feel more structured, with clearer priority badges, smoother cards,
            and a cleaner completion popup.
          </p>
        </div>

        <div style={heroStats}>
          {subjectConfig.map((subject) => {
            const data = chapters[subject.key] || [];

            return (
              <div key={subject.key} style={heroCard}>
                <div style={{ ...heroCardAccent, background: subject.tone }} />
                <div style={heroCardTitle}>{subject.title}</div>
                <div style={heroCardValue}>{getProgress(data)}%</div>
                <div style={heroCardMeta}>{data.filter((chapter) => chapter.done).length} completed</div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={sectionGrid}>
        {subjectConfig.map((subject) => {
          const data = chapters[subject.key] || [];
          const progress = getProgress(data);

          return (
            <div key={subject.key} style={sectionCard(isPhone)}>
              <div style={sectionHeader(isPhone)}>
                <div>
                  <div style={{ ...sectionEyebrow, color: subject.tone }}>{subject.title}</div>
                  <h3 style={sectionTitle(isPhone)}>Progress with priority awareness</h3>
                </div>
                <div style={sectionPercent}>{progress}%</div>
              </div>

              <div style={progressTrack}>
                <div style={{ ...progressFill, width: `${progress}%`, background: subject.tone }} />
              </div>

              <div style={chapterList}>
                {data.map((chapter, index) => (
                  <div key={chapter.name} style={chapterCard(isPhone)}>
                    <div>
                      <div style={chapterName}>{chapter.name}</div>
                      <div style={chapterMeta}>
                        {chapter.weight}% weight | {chapter.priority}
                      </div>
                    </div>
                    <label style={toggleWrap(isPhone)}>
                      <input
                        type="checkbox"
                        checked={chapter.done || false}
                        onChange={() => toggle(subject.key, index)}
                        style={checkbox}
                      />
                      <span style={toggleText}>{chapter.done ? "Done" : "Pending"}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {popupData && (
        <div style={popupBg} onClick={() => setPopupData(null)}>
          <div style={popupCard} onClick={(event) => event.stopPropagation()}>
            <div style={popupEyebrow}>Chapter Completed</div>
            <h3 style={popupTitle(isPhone)}>{popupData.chapter.name}</h3>
            <p style={popupText}>Great work. The system has marked this chapter as completed.</p>

            <div style={popupBlock}>
              <div style={popupBlockTitle}>Topics to remember</div>
              {(popupData.chapter.topics || []).slice(0, 3).map((topic, index) => (
                <div key={index} style={popupRow}>
                  {topic.name}
                </div>
              ))}
            </div>

            {popupData.next && (
              <div style={popupBlock}>
                <div style={popupBlockTitle}>Up next</div>
                <div style={popupNext}>{popupData.next.name}</div>
              </div>
            )}

            <button style={popupButton} onClick={() => setPopupData(null)}>
              Continue
            </button>
          </div>
        </div>
      )}
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
  color: "#f8fafc",
  fontSize: isPhone ? "28px" : "40px",
  lineHeight: 1.05
});

const heroText = (isPhone) => ({
  marginTop: "14px",
  color: "#cbd5e1",
  fontSize: isPhone ? "14px" : "15px",
  lineHeight: 1.65,
  textAlign: "left"
});

const heroStats = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "14px"
};

const heroCard = {
  position: "relative",
  padding: "18px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  overflow: "hidden",
  textAlign: "left"
};

const heroCardAccent = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "3px"
};

const heroCardTitle = {
  color: "#94a3b8",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.12em"
};

const heroCardValue = {
  marginTop: "12px",
  color: "#f8fafc",
  fontSize: "34px",
  fontWeight: 700
};

const heroCardMeta = {
  marginTop: "6px",
  color: "#cbd5e1",
  fontSize: "13px"
};

const sectionGrid = {
  display: "grid",
  gap: "18px"
};

const sectionCard = (isPhone) => ({
  padding: isPhone ? "18px" : "22px",
  borderRadius: isPhone ? "20px" : "24px",
  background: "linear-gradient(145deg, rgba(15,23,42,0.84), rgba(15,23,42,0.56))",
  border: "1px solid rgba(255,255,255,0.08)",
  textAlign: "left",
  boxShadow: "0 24px 58px -42px rgba(0,0,0,0.86)"
});

const sectionHeader = (isPhone) => ({
  display: "flex",
  flexDirection: isPhone ? "column" : "row",
  justifyContent: "space-between",
  alignItems: isPhone ? "flex-start" : "flex-end",
  gap: "14px"
});

const sectionEyebrow = {
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.14em"
};

const sectionTitle = (isPhone) => ({
  margin: "8px 0 0",
  color: "#f8fafc",
  fontSize: isPhone ? "20px" : "24px",
  lineHeight: 1.15
});

const sectionPercent = {
  color: "#f8fafc",
  fontSize: "28px",
  fontWeight: 700
};

const progressTrack = {
  width: "100%",
  height: "12px",
  marginTop: "18px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.06)",
  overflow: "hidden"
};

const progressFill = {
  height: "100%",
  borderRadius: "999px"
};

const chapterList = {
  display: "grid",
  gap: "12px",
  marginTop: "18px"
};

const chapterCard = (isPhone) => ({
  display: "flex",
  flexDirection: isPhone ? "column" : "row",
  justifyContent: "space-between",
  alignItems: isPhone ? "flex-start" : "center",
  gap: "16px",
  padding: "16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  transition: "transform 0.25s ease, box-shadow 0.25s ease"
});

const chapterName = {
  color: "#f8fafc",
  fontWeight: 600
};

const chapterMeta = {
  marginTop: "6px",
  color: "#94a3b8",
  fontSize: "13px"
};

const toggleWrap = (isPhone) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  whiteSpace: "nowrap"
});

const checkbox = {
  width: "18px",
  height: "18px",
  accentColor: "#00c6ff",
  cursor: "pointer"
};

const toggleText = {
  color: "#cbd5e1",
  fontSize: "13px"
};

const popupBg = {
  position: "fixed",
  inset: 0,
  display: "grid",
  placeItems: "center",
  background: "rgba(4,8,18,0.72)",
  backdropFilter: "blur(12px)",
  zIndex: 20,
  animation: "popupFade 0.28s ease"
};

const popupCard = {
  width: "min(420px, calc(100vw - 32px))",
  padding: "26px",
  borderRadius: "24px",
  background: "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.78))",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 32px 70px -44px rgba(0,0,0,0.92)",
  textAlign: "left",
  animation: "popupRise 0.32s ease"
};

const popupEyebrow = {
  color: "#7dd3fc",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.14em"
};

const popupTitle = (isPhone) => ({
  margin: "12px 0 0",
  color: "#f8fafc",
  fontSize: isPhone ? "24px" : "30px",
  lineHeight: 1.08
});

const popupText = {
  marginTop: "12px",
  color: "#cbd5e1",
  lineHeight: 1.6
};

const popupBlock = {
  marginTop: "18px",
  padding: "16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)"
};

const popupBlockTitle = {
  color: "#94a3b8",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.12em"
};

const popupRow = {
  marginTop: "10px",
  color: "#f8fafc"
};

const popupNext = {
  marginTop: "10px",
  color: "#f8fafc",
  fontWeight: 700
};

const popupButton = {
  width: "100%",
  marginTop: "20px",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(90deg, #7f5af0, #00c6ff)",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer"
};
