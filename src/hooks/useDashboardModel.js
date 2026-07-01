import { useEffect, useMemo, useState } from "react";
import { getReminderPreference, lightHaptic, scheduleDailyReminder } from "../lib/mobileNative";
import { isFirebaseConfigured, syncStudyStateToFirebase } from "../lib/firebaseSync";
import {
  readCoachReport,
  readJourneyFeed,
  readReminderData,
  readStudyState,
  saveReminderData
} from "../lib/studyData";

export default function useDashboardModel() {
  const [state, setState] = useState(() => readStudyState());
  const [coachReport, setCoachReport] = useState(() => readCoachReport());
  const [journeyFeed, setJourneyFeed] = useState(() => readJourneyFeed());
  const [reminder, setReminder] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
  const update = () => {
    setState(readStudyState());
    setCoachReport(readCoachReport());
    setJourneyFeed(readJourneyFeed());
    setReminder(readReminderData());
  };

  update(); // initial load

  window.addEventListener("studyDataUpdated", update);

  getReminderPreference().then((value) => {
    if (!readReminderData() && value) {
      saveReminderData(value);
      setReminder(value);
    }
  });

  return () => {
    window.removeEventListener("studyDataUpdated", update);
  };
}, []);

  const { logs, chapters, mistakes } = state;
  const today = new Date().toLocaleDateString();
  const todayLogs = useMemo(() => logs.filter((log) => log.date === today), [logs, today]);

  const streak = useMemo(() => {
    let count = 0;
    const date = new Date();
    while (true) {
      const day = date.toLocaleDateString();
      if (!logs.some((log) => log.date === day)) break;
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
    return { label: day.slice(0, 5), value };
  });

  const progressSeries = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - offset));
    const day = date.toLocaleDateString();
    return { label: day.slice(0, 5), value: logs.filter((log) => log.date === day).length };
  });

  const enableReminder = async () => {
    await lightHaptic();
    const savedReminder = await scheduleDailyReminder();
    saveReminderData(savedReminder);
    await syncStudyStateToFirebase();
    setReminder(savedReminder);
    setStatusMessage(`Daily reminder enabled for ${savedReminder.hour}:00.`);
  };

  const syncFirebase = async () => {
    await lightHaptic();
    const result = await syncStudyStateToFirebase({ logs, chapters, mistakes });
    setStatusMessage(
      result.synced
        ? "Firebase sync completed."
        : "Firebase config is missing. Add the Firebase values in .env to enable sync."
    );
  };

  return {
    logs,
    chapters,
    mistakes,
    coachReport,
    journeyFeed,
    reminder,
    statusMessage,
    isFirebaseReady: isFirebaseConfigured(),
    todayLogs,
    streak,
    accuracy,
    progress,
    totalQuestions,
    weak,
    strong,
    recentAccuracySeries,
    progressSeries,
    enableReminder,
    syncFirebase
  };
}
