export const COACH_REPORT_KEY = "coachReport";
export const JOURNEY_FEED_KEY = "journeyFeed";
export const PENDING_EXAMGOAL_KEY = "pendingExamGoalSession";

export function readStudyState() {
  return {
    logs: JSON.parse(localStorage.getItem("practiceLogs")) || [],
    chapters: JSON.parse(localStorage.getItem("chapters")) || {},
    mistakes: JSON.parse(localStorage.getItem("mistakes")) || []
  };
}

export function buildStudySnapshot({ logs, chapters, mistakes }) {
  const chapterEntries = Object.entries(chapters).flatMap(([subject, list]) =>
    (list || []).map((chapter) => ({
      subject,
      name: chapter.name,
      priority: chapter.priority || "MEDIUM",
      weight: chapter.weight || 0,
      done: Boolean(chapter.done),
      practice: chapter.practice || 0,
      weak: Boolean(chapter.weak),
      strong: Boolean(chapter.strong)
    }))
  );

  const today = new Date().toLocaleDateString();
  const todayLogs = logs.filter((log) => log.date === today);
  const lastSevenDays = new Set(
    Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - index);
      return date.toLocaleDateString();
    })
  );

  const recentLogs = logs.filter((log) => lastSevenDays.has(log.date));

  return {
    generatedAt: new Date().toISOString(),
    today,
    stats: {
      totalLogs: logs.length,
      todayLogs: todayLogs.length,
      totalMistakes: mistakes.length,
      averageAccuracy: logs.length
        ? Math.round(logs.reduce((sum, log) => sum + (Number(log.accuracy) || 0), 0) / logs.length)
        : 0,
      recentPracticeCount: recentLogs.length
    },
    chapters: chapterEntries,
    recentLogs: logs.slice(0, 20),
    recentMistakes: mistakes.slice(0, 20)
  };
}

export function generateLocalCoachReport(snapshot) {
  const ignoredHighPriority = snapshot.chapters
    .filter(
      (chapter) =>
        !chapter.done &&
        (chapter.priority === "VERY HIGH" || chapter.priority === "HIGH") &&
        (chapter.practice || 0) < 20
    )
    .sort((left, right) => right.weight - left.weight)
    .slice(0, 6);

  const weakChapters = snapshot.chapters
    .filter((chapter) => chapter.weak)
    .sort((left, right) => right.weight - left.weight)
    .slice(0, 6);

  const accuracyTrend =
    snapshot.stats.averageAccuracy >= 80
      ? "Your overall accuracy is healthy."
      : snapshot.stats.averageAccuracy >= 60
        ? "Accuracy is improving, but there is still room to tighten revision."
        : "Accuracy is under pressure, so you should slow down and revise weak topics."
  ;

  return {
    generatedAt: snapshot.generatedAt,
    summary:
      snapshot.stats.todayLogs === 0
        ? "No practice was logged today. Start with one focused PYQ block to keep momentum alive."
        : `You logged ${snapshot.stats.todayLogs} practice set(s) today with an average accuracy of ${snapshot.stats.averageAccuracy}%. ${accuracyTrend}`,
    priorities: ignoredHighPriority.map((chapter) => ({
      title: `${chapter.subject}: ${chapter.name}`,
      reason: `${chapter.priority} priority chapter is still not completed and has very low logged practice.`
    })),
    notes: [
      snapshot.stats.totalMistakes
        ? `You have ${snapshot.stats.totalMistakes} mistake record(s). Revisit the latest ones before starting fresh practice.`
        : "You currently have no stored mistakes. Keep logging mistakes to make the dashboard smarter.",
      weakChapters.length
        ? `Weak chapters detected: ${weakChapters.map((chapter) => chapter.name).join(", ")}.`
        : "No weak chapters are marked yet.",
      snapshot.stats.recentPracticeCount < 4
        ? "Recent practice volume is low. Daily short sessions will help more than occasional long sessions."
        : "Recent practice volume is good. Focus on finishing high-weight chapters consistently."
    ],
    mistakes: snapshot.recentMistakes.slice(0, 5).map((mistake) => ({
      title: `${mistake.chapter} - ${mistake.topic}`,
      note: mistake.note || "Review this question pattern again.",
      accuracy: mistake.accuracy,
      date: mistake.date
    }))
  };
}

export function saveCoachReport(report) {
  localStorage.setItem(COACH_REPORT_KEY, JSON.stringify(report));
}

export function readCoachReport() {
  return JSON.parse(localStorage.getItem(COACH_REPORT_KEY)) || null;
}

export function appendJourneyEntry(entry) {
  const current = JSON.parse(localStorage.getItem(JOURNEY_FEED_KEY)) || [];
  const next = [{ ...entry, createdAt: new Date().toISOString() }, ...current].slice(0, 20);
  localStorage.setItem(JOURNEY_FEED_KEY, JSON.stringify(next));
}

export function readJourneyFeed() {
  return JSON.parse(localStorage.getItem(JOURNEY_FEED_KEY)) || [];
}
