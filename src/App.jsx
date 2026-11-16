import { useCallback, useEffect, useState } from "react";
import questionBank from "./data/questionBank.json";
import StartScreen from "./components/StartScreen.jsx";
import QuizScreen from "./components/QuizScreen.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import { buildQuizItems } from "./utils/shuffle.js";
import {
  clearProfile,
  clearQuizState,
  loadProfile,
  loadQuizState,
  saveProfile,
  saveQuizState,
} from "./utils/storage.js";

const TOTAL_QUESTIONS = questionBank.length;

function createAttempt(name, cls) {
  return {
    v: 1,
    total: TOTAL_QUESTIONS,
    screen: "quiz",
    name,
    cls,
    items: buildQuizItems(TOTAL_QUESTIONS),
    idx: 0,
    picks: [],
    correct: 0,
    wrong: 0,
  };
}

export default function App() {
  const [state, setState] = useState(() => loadQuizState(TOTAL_QUESTIONS));
  const [profile, setProfile] = useState(() => loadProfile());

  useEffect(() => {
    if (state) {
      saveQuizState(state);
    }
  }, [state]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state?.screen, state?.idx]);

  const handleStart = useCallback((name, cls) => {
    saveProfile(name, cls);
    setProfile({ name, cls });
    const nextState = createAttempt(name, cls);
    saveQuizState(nextState);
    setState(nextState);
  }, []);

  const handlePickOption = useCallback((pos) => {
    setState((prev) => {
      if (!prev || prev.screen !== "quiz") return prev;
      if (typeof prev.picks[prev.idx] === "number") return prev;

      const currentItem = prev.items[prev.idx];
      const question = questionBank[currentItem.q];
      const isRight = currentItem.p[pos] === question.correctAnswer;

      const nextPicks = prev.picks.slice();
      nextPicks[prev.idx] = pos;

      return {
        ...prev,
        picks: nextPicks,
        correct: prev.correct + (isRight ? 1 : 0),
        wrong: prev.wrong + (isRight ? 0 : 1),
      };
    });
  }, []);

  const handleNextQuestion = useCallback(() => {
    setState((prev) => {
      if (!prev || prev.screen !== "quiz") return prev;
      if (typeof prev.picks[prev.idx] !== "number") return prev;

      if (prev.idx < TOTAL_QUESTIONS - 1) {
        return {
          ...prev,
          idx: prev.idx + 1,
        };
      }

      return {
        ...prev,
        screen: "result",
      };
    });
  }, []);

  const handleRetry = useCallback(() => {
    setState((prev) => {
      const name = prev?.name || profile.name;
      const cls = prev?.cls || profile.cls;
      return createAttempt(name, cls);
    });
  }, [profile]);

  const handleChangeStudent = useCallback(() => {
    clearQuizState();
    clearProfile();
    setProfile({ name: "", cls: "" });
    setState(null);
  }, []);

  return (
    <div className="mx-auto max-w-[760px] px-3.5 pb-8 pt-4 sm:pt-7">
      {!state && (
        <StartScreen
          totalQuestions={TOTAL_QUESTIONS}
          initialProfile={profile}
          onStart={handleStart}
        />
      )}

      {state?.screen === "quiz" && (
        <QuizScreen
          state={state}
          questionBank={questionBank}
          onPickOption={handlePickOption}
          onNextQuestion={handleNextQuestion}
        />
      )}

      {state?.screen === "result" && (
        <ResultScreen
          state={state}
          questionBank={questionBank}
          onRetry={handleRetry}
          onChangeStudent={handleChangeStudent}
        />
      )}

      <footer className="mt-5 space-y-1 text-center text-xs text-slate-500">
        <p>Ôn tập GDQP&amp;AN – Học phần I • Xử lý hoàn toàn trên trình duyệt</p>
        <p className="font-medium text-slate-600">Creator: Phạm Quốc Bình 26DT_TN</p>
      </footer>
    </div>
  );
}
