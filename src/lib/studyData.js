import { chemistryData } from "../data/chemistryData";
import { mathData } from "../data/mathData";
import { physicsData } from "../data/physicsData";

export const PRACTICE_LOGS_KEY = "practiceLogs";
export const CHAPTERS_KEY = "chapters";
export const MISTAKES_KEY = "mistakes";
export const COACH_REPORT_KEY = "coachReport";
export const JOURNEY_FEED_KEY = "journeyFeed";
export const REMINDERS_KEY = "reminders";
export const SETTINGS_KEY = "settings";
export const STATISTICS_KEY = "statistics";
export const STUDY_META_KEY = "studyMeta";
export const STUDY_CACHE_OWNER_KEY = "studyCacheOwner";
export const PENDING_EXAMGOAL_KEY = "pendingExamGoalSession";

const STORAGE_KEYS = {
  chapters: CHAPTERS_KEY,
  practiceLogs: PRACTICE_LOGS_KEY,
  mistakes: MISTAKES_KEY,
  coachReport: COACH_REPORT_KEY,
  journeyFeed: JOURNEY_FEED_KEY,
  reminders: REMINDERS_KEY,
  settings: SETTINGS_KEY,
  statistics: STATISTICS_KEY
};

const DEFAULT_CHAPTERS = {
  Math: mathData,
  Physics: physicsData,
  Chemistry: chemistryData
};

function createDefaultChapters() {
  return {
    Math: DEFAULT_CHAPTERS.Math.map((chapter) => ({ ...chapter })),
    Physics: DEFAULT_CHAPTERS.Physics.map((chapter) => ({ ...chapter })),
    Chemistry: DEFAULT_CHAPTERS.Chemistry.map((chapter) => ({ ...chapter }))
  };
}

function parseStoredValue(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function isValidChapterState(value) {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    ["Math", "Physics", "Chemistry"].every((key) => Array.isArray(value[key]) && value[key].length > 0)
  );
}

function defaultSectionValue(section) {
  if (section === "chapters") return createDefaultChapters();
  if (section === "practiceLogs") return [];
  if (section === "mistakes") return [];
  if (section === "coachReport") return null;
  if (section === "journeyFeed") return [];
  if (section === "reminders") return null;
  if (section === "settings") return {};
  if (section === "statistics") return {};
  return null;
}

function normalizeSection(section, value) {
  if (section === "chapters") {
    return isValidChapterState(value) ? value : createDefaultChapters();
  }

  if (section === "practiceLogs" || section === "mistakes" || section === "journeyFeed") {
    return Array.isArray(value) ? value : [];
  }

  if (section === "settings" || section === "statistics") {
    return value && typeof value === "object" ? value : {};
  }

  return value ?? defaultSectionValue(section);
}

function setStoredValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function dispatchStudyUpdate() {
  window.dispatchEvent(new Event("studyDataUpdated"));
}

export function readStudyCacheOwner() {
  return localStorage.getItem(STUDY_CACHE_OWNER_KEY) || "";
}

export function setStudyCacheOwner(uid) {
  if (!uid) return;
  localStorage.setItem(STUDY_CACHE_OWNER_KEY, uid);
}

export function readStudyMetadata() {
  return parseStoredValue(STUDY_META_KEY, {});
}

function writeStudyMetadata(metadata) {
  setStoredValue(STUDY_META_KEY, metadata);
}

export function getLatestMetadataTimestamp(metadata = {}) {
  const timestamps = Object.values(metadata).filter(Boolean);
  if (!timestamps.length) return "";
  return timestamps.sort().at(-1) || "";
}

export function getLatestLocalTimestamp(metadata = readStudyMetadata()) {
  return getLatestMetadataTimestamp(metadata);
}

export function createEmptyStudyData() {
  const base = {
    chapters: createDefaultChapters(),
    practiceLogs: [],
    mistakes: [],
    coachReport: null,
    journeyFeed: [],
    reminders: null,
    settings: {}
  };

  return {
    ...base,
    statistics: buildStatistics(base)
  };
}

export function readStudySection(section) {
  return normalizeSection(section, parseStoredValue(STORAGE_KEYS[section], defaultSectionValue(section)));
}

export function readLocalStudyData() {
  const studyData = {
    chapters: readStudySection("chapters"),
    practiceLogs: readStudySection("practiceLogs"),
    mistakes: readStudySection("mistakes"),
    coachReport: readStudySection("coachReport"),
    journeyFeed: readStudySection("journeyFeed"),
    reminders: readStudySection("reminders"),
    settings: readStudySection("settings")
  };

  return {
    ...studyData,
    statistics: buildStatistics(studyData)
  };
}

function buildStatistics(studyData) {
  const logs = studyData.practiceLogs || [];
  const mistakes = studyData.mistakes || [];
  const chapters = studyData.chapters || {};
  const chapterList = Object.values(chapters).flatMap((items) => items || []);

  return {
    totalLogs: logs.length,
    totalMistakes: mistakes.length,
    totalCompletedChapters: chapterList.filter((chapter) => chapter.done).length,
    totalTrackedChapters: chapterList.length,
    averageAccuracy: logs.length
      ? Math.round(logs.reduce((sum, log) => sum + (Number(log.accuracy) || 0), 0) / logs.length)
      : 0,
    updatedAt: new Date().toISOString()
  };
}

function writeStudySectionRaw(section, value, updatedAt) {
  const normalized = normalizeSection(section, value);
  setStoredValue(STORAGE_KEYS[section], normalized);

  const metadata = readStudyMetadata();
  metadata[section] = updatedAt;
  writeStudyMetadata(metadata);
}

export function writeLocalStudyData(studyData, { metadata = {}, silent = false } = {}) {
  const fallbackTimestamp = new Date().toISOString();

  Object.keys(STORAGE_KEYS).forEach((section) => {
    const value =
      section === "statistics"
        ? buildStatistics(studyData)
        : Object.hasOwn(studyData, section)
          ? studyData[section]
          : defaultSectionValue(section);

    writeStudySectionRaw(section, value, metadata[section] || fallbackTimestamp);
  });

  if (!silent) {
    dispatchStudyUpdate();
  }
}

export function replaceLocalStudyDataForUser(uid, studyData, options = {}) {
  writeLocalStudyData(studyData, options);
  setStudyCacheOwner(uid);
}

export function writeStudySection(section, value, { silent = false, updatedAt } = {}) {
  const timestamp = updatedAt || new Date().toISOString();
  writeStudySectionRaw(section, value, timestamp);

  const nextStudyData = readLocalStudyData();
  writeStudySectionRaw("statistics", buildStatistics(nextStudyData), timestamp);

  if (!silent) {
    dispatchStudyUpdate();
  }
}

export function hasMeaningfulStudyData(studyData = readLocalStudyData()) {
  return Boolean(
    studyData.practiceLogs?.length ||
    studyData.mistakes?.length ||
    studyData.journeyFeed?.length ||
    studyData.coachReport ||
    Object.keys(studyData.settings || {}).length ||
    studyData.reminders ||
    Object.values(studyData.chapters || {}).some((items) =>
      (items || []).some((chapter) => chapter.done || chapter.practice || chapter.weak || chapter.strong)
    )
  );
}

export function readStudyState() {
  const studyData = readLocalStudyData();

  return {
    logs: studyData.practiceLogs,
    chapters: studyData.chapters,
    mistakes: studyData.mistakes
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
  writeStudySection("coachReport", report);
}

export function readCoachReport() {
  return readStudySection("coachReport");
}

export function appendJourneyEntry(entry) {
  const current = readStudySection("journeyFeed");
  const next = [{ ...entry, createdAt: new Date().toISOString() }, ...current].slice(0, 20);
  writeStudySection("journeyFeed", next);
}

export function readJourneyFeed() {
  return readStudySection("journeyFeed");
}

export function saveReminderData(reminder) {
  writeStudySection("reminders", reminder);
}

export function readReminderData() {
  return readStudySection("reminders");
}
