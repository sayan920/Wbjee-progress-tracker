import {
  appendJourneyEntry,
  buildStudySnapshot,
  generateLocalCoachReport,
  saveCoachReport
} from "./studyData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

export async function analyzeProgressWithCoach(studyState, trigger = "manual") {
  const snapshot = buildStudySnapshot(studyState);
  const localReport = generateLocalCoachReport(snapshot);

  saveCoachReport(localReport);
  appendJourneyEntry({
    type: "coach",
    title: "Study coach refreshed",
    detail: localReport.summary
  });

  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        snapshot,
        trigger
      })
    });

    if (!response.ok) {
      throw new Error(`Coach API returned ${response.status}`);
    }

    const data = await response.json();

    if (data?.report) {
      saveCoachReport(data.report);
      appendJourneyEntry({
        type: "coach",
        title: "ChatGPT coach updated priorities",
        detail: data.report.summary
      });
      return data.report;
    }
  } catch {
    return localReport;
  }

  return localReport;
}

export async function askCoach(messages, studyState) {
  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages,
      snapshot: buildStudySnapshot(studyState)
    })
  });

  if (!response.ok) {
    throw new Error(`Chat API returned ${response.status}`);
  }

  return response.json();
}
