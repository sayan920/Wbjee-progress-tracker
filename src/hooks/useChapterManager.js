import { useEffect, useState } from "react";
import { syncStudyStateToFirebase } from "../lib/firebaseSync";
import { readStudySection, writeStudySection } from "../lib/studyData";

export default function useChapterManager() {
  const [chapters, setChapters] = useState({});
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
  const load = () => {
    setChapters(readStudySection("chapters"));
  };

  load();

  window.addEventListener("studyDataUpdated", load);

  return () => {
    window.removeEventListener("studyDataUpdated", load);
  };
}, []);

  const toggle = async (subject, index) => {
    const updated = {
      ...chapters,
      [subject]: chapters[subject].map((chapter, chapterIndex) =>
        chapterIndex === index ? { ...chapter, done: !chapter.done } : chapter
      )
    };
    const chapter = updated[subject][index];
    if (chapter.done) {
      setPopupData({ chapter, next: updated[subject][index + 1] });
    }
    setChapters(updated);
    writeStudySection("chapters", updated);
    await syncStudyStateToFirebase();
  };

  const getProgress = (list = []) => {
    if (!list.length) return 0;
    return Math.round((list.filter((chapter) => chapter.done).length / list.length) * 100);
  };

  return {
    chapters,
    popupData,
    setPopupData,
    toggle,
    getProgress
  };
}
