import { useEffect, useMemo, useState } from "react";
import { mathData } from "../data/mathData";
import { physicsData } from "../data/physicsData";
import { chemistryData } from "../data/chemistryData";
import { analyzeProgressWithCoach } from "../lib/aiCoach";
import { openExamGoal } from "../lib/examGoal";
import { syncStudyStateToFirebase } from "../lib/firebaseSync";
import { lightHaptic, successHaptic } from "../lib/mobileNative";
import {
  appendJourneyEntry,
  readStudySection,
  readStudyState,
  writeStudySection
} from "../lib/studyData";

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

export default function usePracticeManager() {
  const [slots, setSlots] = useState([emptySlot(), emptySlot(), emptySlot()]);
  const [logs, setLogs] = useState([]);
  const [popup, setPopup] = useState(false);
  const [examGoalMessage, setExamGoalMessage] = useState("");

  useEffect(() => {
    setLogs(readStudySection("practiceLogs"));
  }, []);

  const today = new Date().toLocaleDateString();
  const todayLogs = useMemo(() => logs.filter((log) => log.date === today), [logs, today]);
  const totalQuestionsToday = todayLogs.reduce((sum, log) => sum + (Number(log.total) || 0), 0);
  const averageAccuracy = todayLogs.length
    ? Math.round(todayLogs.reduce((sum, log) => sum + (Number(log.accuracy) || 0), 0) / todayLogs.length)
    : 0;
  const completedSlots = slots.filter((slot) => slot.chapter && slot.topic && slot.total).length;

  const updateSlot = (index, field, value) => {
    setSlots((current) =>
      current.map((slot, slotIndex) => {
        if (slotIndex !== index) return slot;
        if (field === "subject") return { ...slot, subject: value, chapter: "", topic: "" };
        if (field === "chapter") return { ...slot, chapter: value, topic: "" };
        return { ...slot, [field]: value };
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

  const saveAll = async () => {
    const valid = slots.filter((slot) => slot.chapter && slot.topic && slot.total);
    if (!valid.length) return false;

    const newEntries = valid.map((slot) => ({
      ...slot,
      total: Number(slot.total),
      correct: Number(slot.correct),
      accuracy: Math.round((slot.correct / slot.total) * 100),
      date: today
    }));

    const updatedLogs = [...newEntries, ...logs];
    setLogs(updatedLogs);
    writeStudySection("practiceLogs", updatedLogs);

    const chapters = readStudySection("chapters");
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
    writeStudySection("chapters", chapters);

    const mistakes = newEntries
      .filter((entry) => entry.correct < entry.total)
      .map((entry) => ({
        chapter: entry.chapter,
        topic: entry.topic,
        note: entry.notes,
        accuracy: entry.accuracy,
        date: today
      }));
    const old = readStudySection("mistakes");
    writeStudySection("mistakes", [...mistakes, ...old]);

    appendJourneyEntry({
      type: "practice",
      title: "Practice session saved",
      detail: `${newEntries.length} slot(s) logged for ${today}.`
    });

    const currentState = readStudyState();
    analyzeProgressWithCoach(currentState, "practice_save");
    await syncStudyStateToFirebase(currentState);
    await successHaptic();

    setSlots([emptySlot(), emptySlot(), emptySlot()]);
    setPopup(true);
    setExamGoalMessage("");
    setTimeout(() => setPopup(false), 1800);
    return true;
  };

 const launchExamGoal = async () => {
  await lightHaptics();

  const result = await AppLauncher.canOpenUrl({
    url: "com.examgoal.jeemainpreparation.app"
  });

  if (result.value) {
    await AppLauncher.openUrl({
      url: "com.examgoal.jeemainpreparation.app"
    });

    setExamGoalMessage("ExamGOAL opened. When you return, continue here.");
  } else {
    window.open(
      "https://play.google.com/store/apps/details?id=com.examgoal.jeemainpreparation.app",
      "_blank"
    );

    setExamGoalMessage("ExamGOAL not installed. Play Store opened.");
  }
};

  return {
    allSubjects,
    slots,
    logs,
    popup,
    examGoalMessage,
    todayLogs,
    totalQuestionsToday,
    averageAccuracy,
    completedSlots,
    updateSlot,
    handleFile,
    saveAll,
    launchExamGoal
  };
}
