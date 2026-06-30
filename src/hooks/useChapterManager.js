import { useEffect, useState } from "react";
import { mathData } from "../data/mathData";
import { physicsData } from "../data/physicsData";
import { chemistryData } from "../data/chemistryData";

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

const isValidChapterState = (value) =>
  Boolean(value) &&
  typeof value === "object" &&
  ["Math", "Physics", "Chemistry"].every((key) => Array.isArray(value[key]) && value[key].length > 0);

export default function useChapterManager() {
  const [chapters, setChapters] = useState({});
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
  const load = () => {
    const saved = JSON.parse(localStorage.getItem("chapters"));
    const initial = getInitialChapters();

    if (isValidChapterState(saved)) {
      setChapters(saved);
    } else {
      setChapters(initial);
      localStorage.setItem("chapters", JSON.stringify(initial));
    }
  };

  load();

  window.addEventListener("studyDataUpdated", load);

  return () => {
    window.removeEventListener("studyDataUpdated", load);
  };
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
      setPopupData({ chapter, next: updated[subject][index + 1] });
    }
    setChapters(updated);
    localStorage.setItem("chapters", JSON.stringify(updated));
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
