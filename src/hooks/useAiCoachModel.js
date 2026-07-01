import { useState } from "react";
import { analyzeProgressWithCoach, askCoach } from "../lib/aiCoach";
import { syncStudyStateToFirebase } from "../lib/firebaseSync";
import { readCoachReport, readStudyState, saveCoachReport } from "../lib/studyData";

export default function useAiCoachModel() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState("");
  const [coachReport, setCoachReport] = useState(() => readCoachReport());
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Ask me doubts, revision questions, or tell me to analyze your progress. I will use your saved study data when the coach API is connected."
    }
  ]);

  const handleAnalyze = async () => {
    setAnalysisLoading(true);
    setError("");
    try {
      const report = await analyzeProgressWithCoach(readStudyState(), "manual_analysis");
      setCoachReport(report);
      await syncStudyStateToFirebase();
    } catch (analysisError) {
      setError(analysisError.message);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!input.trim()) return;
    const nextMessages = [...messages, { role: "user", content: input.trim() }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const data = await askCoach(nextMessages, readStudyState());
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
      if (data.report) {
        saveCoachReport(data.report);
        setCoachReport(data.report);
        await syncStudyStateToFirebase();
      }
    } catch {
      setError(
        "ChatGPT is not connected yet. Add your OpenAI API key in the backend env file and run the API server."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    input,
    setInput,
    loading,
    analysisLoading,
    error,
    coachReport,
    messages,
    handleAnalyze,
    handleAsk
  };
}
