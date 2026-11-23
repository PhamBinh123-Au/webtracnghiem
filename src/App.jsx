import { useCallback, useEffect, useState } from "react";
import questionBank from "./data/questionBank.json";
import lessonsData from "./data/lessons.json";
import StartScreen from "./components/StartScreen.jsx";
import QuizScreen from "./components/QuizScreen.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import LessonListScreen from "./components/LessonListScreen.jsx";
import DocumentsScreen from "./components/DocumentsScreen.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { buildQuizItems } from "./utils/shuffle.js";
import {
  clearGeneralQuizState,
  clearLessonQuizState,
  clearProfile,
  loadActiveTab,
  loadAllLessonSummaries,
  loadGeneralQuizState,
  loadLessonQuizState,
  loadProfile,
  saveActiveTab,
  saveGeneralQuizState,
  saveLessonQuizState,
  saveProfile,
} from "./utils/storage.js";

const TOTAL_QUESTIONS = questionBank.length;
const LESSONS_BY_ID = Object.fromEntries(lessonsData.map((l) => [l.id, l]));

function createGeneralAttempt(name, cls) {
  return {
    v: 1,
    mode: "general",
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

function createLessonAttempt(lesson, name, cls) {
  const indices = Array.from(
    { length: lesson.count },
    (_, i) => lesson.startIndex + i
  );
  return {
    v: 1,
    mode: "lesson",
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    total: lesson.count,
    screen: "quiz",
    name,
    cls,
    items: buildQuizItems(indices),
    idx: 0,
    picks: [],
    correct: 0,
    wrong: 0,
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState(() => loadActiveTab("general"));
  const [profile, setProfile] = useState(() => loadProfile());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // General Quiz State (386 questions)
  const [generalState, setGeneralState] = useState(() =>
    loadGeneralQuizState(TOTAL_QUESTIONS)
  );

  // Lesson Quiz State (Current active lesson)
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [currentLessonState, setCurrentLessonState] = useState(null);

  // Summaries of all 11 lessons for badges
  const [lessonSummaries, setLessonSummaries] = useState(() =>
    loadAllLessonSummaries(lessonsData)
  );

  // Sync activeTab to storage
  useEffect(() => {
    saveActiveTab(activeTab);
  }, [activeTab]);

  // Sync generalState to storage
  useEffect(() => {
    if (generalState) {
      saveGeneralQuizState(generalState);
    }
  }, [generalState]);

  // Sync currentLessonState to storage & update summaries
  useEffect(() => {
    if (selectedLessonId && currentLessonState) {
      saveLessonQuizState(selectedLessonId, currentLessonState);
      setLessonSummaries((prev) => ({
        ...prev,
        [selectedLessonId]: {
          screen: currentLessonState.screen,
          idx: currentLessonState.idx,
          total: currentLessonState.total,
          correct: currentLessonState.correct,
          wrong: currentLessonState.wrong,
          completed: currentLessonState.screen === "result",
        },
      }));
    }
  }, [selectedLessonId, currentLessonState]);

  // Scroll to top on screen transitions
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [
    activeTab,
    selectedLessonId,
    generalState?.screen,
    generalState?.idx,
    currentLessonState?.screen,
    currentLessonState?.idx,
  ]);

  // --- Handlers for General Mode ---
  const handleStartGeneral = useCallback((name, cls) => {
    saveProfile(name, cls);
    setProfile({ name, cls });
    const nextState = createGeneralAttempt(name, cls);
    saveGeneralQuizState(nextState);
    setGeneralState(nextState);
  }, []);

  const handlePickGeneralOption = useCallback((pos) => {
    setGeneralState((prev) => {
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

  const handleNextGeneralQuestion = useCallback(() => {
    setGeneralState((prev) => {
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

  const handleRetryGeneral = useCallback(() => {
    setGeneralState((prev) => {
      const name = prev?.name || profile.name;
      const cls = prev?.cls || profile.cls;
      return createGeneralAttempt(name, cls);
    });
  }, [profile]);

  // --- Handlers for Lesson Mode ---
  const handleStartLesson = useCallback((lessonId, studentName, studentClass) => {
    const finalName = studentName || profile.name;
    const finalCls = studentClass || profile.cls;
    if (finalName && finalCls) {
      saveProfile(finalName, finalCls);
      setProfile({ name: finalName, cls: finalCls });
    }

    const lesson = LESSONS_BY_ID[lessonId];
    if (!lesson) return;

    const nextState = createLessonAttempt(lesson, finalName, finalCls);
    saveLessonQuizState(lessonId, nextState);
    setSelectedLessonId(lessonId);
    setCurrentLessonState(nextState);
    setActiveTab("lessons");
  }, [profile]);

  const handleContinueLesson = useCallback((lessonId) => {
    const lesson = LESSONS_BY_ID[lessonId];
    if (!lesson) return;

    let saved = loadLessonQuizState(lessonId, lesson.count);
    if (!saved) {
      saved = createLessonAttempt(lesson, profile.name || "", profile.cls || "");
    }
    setSelectedLessonId(lessonId);
    setCurrentLessonState(saved);
    setActiveTab("lessons");
  }, [profile]);

  const handleResetLesson = useCallback((lessonId) => {
    clearLessonQuizState(lessonId);
    setLessonSummaries((prev) => ({ ...prev, [lessonId]: null }));
    if (selectedLessonId === lessonId) {
      setSelectedLessonId(null);
      setCurrentLessonState(null);
    }
  }, [selectedLessonId]);

  const handlePickLessonOption = useCallback((pos) => {
    setCurrentLessonState((prev) => {
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

  const handleNextLessonQuestion = useCallback(() => {
    setCurrentLessonState((prev) => {
      if (!prev || prev.screen !== "quiz") return prev;
      if (typeof prev.picks[prev.idx] !== "number") return prev;

      if (prev.idx < prev.total - 1) {
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

  const handleRetryCurrentLesson = useCallback(() => {
    if (!selectedLessonId) return;
    const lesson = LESSONS_BY_ID[selectedLessonId];
    if (!lesson) return;
    const name = currentLessonState?.name || profile.name;
    const cls = currentLessonState?.cls || profile.cls;
    const nextState = createLessonAttempt(lesson, name, cls);
    saveLessonQuizState(selectedLessonId, nextState);
    setCurrentLessonState(nextState);
  }, [selectedLessonId, currentLessonState, profile]);

  const handleChangeStudent = useCallback(() => {
    clearGeneralQuizState();
    clearProfile();
    setProfile({ name: "", cls: "" });
    setGeneralState(null);
    setSelectedLessonId(null);
    setCurrentLessonState(null);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      {/* Responsive Left Sidebar (Desktop fixed/sticky, Mobile drawer) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== "lessons") {
            setSelectedLessonId(null);
          }
        }}
        profile={profile}
        onChangeStudent={handleChangeStudent}
        lessonStats={lessonSummaries}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col pb-16 lg:pb-6">
        {/* Mobile Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 active:scale-95"
              aria-label="Mở menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="text-sm font-extrabold text-blue-700">
              GDQP&amp;AN • HP1
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800">
              {activeTab === "general"
                ? "Tổng hợp"
                : activeTab === "lessons"
                ? selectedLessonId
                  ? `Bài ${selectedLessonId}`
                  : "11 bài"
                : "Tài liệu"}
            </span>
          </div>
        </header>

        {/* Content container */}
        <main className="mx-auto w-full max-w-[800px] px-3.5 pt-4 sm:pt-6">
          {/* TAB 1: ÔN TẬP TỔNG HỢP */}
          {activeTab === "general" && (
            <>
              {!generalState && (
                <StartScreen
                  totalQuestions={TOTAL_QUESTIONS}
                  initialProfile={profile}
                  onStart={handleStartGeneral}
                  onSelectTab={(tab) => {
                    setActiveTab(tab);
                    if (tab === "lessons") setSelectedLessonId(null);
                  }}
                />
              )}

              {generalState?.screen === "quiz" && (
                <QuizScreen
                  state={generalState}
                  questionBank={questionBank}
                  onPickOption={handlePickGeneralOption}
                  onNextQuestion={handleNextGeneralQuestion}
                />
              )}

              {generalState?.screen === "result" && (
                <ResultScreen
                  state={generalState}
                  questionBank={questionBank}
                  onRetry={handleRetryGeneral}
                  onChangeStudent={handleChangeStudent}
                  onGoToLessons={() => {
                    setActiveTab("lessons");
                    setSelectedLessonId(null);
                  }}
                />
              )}
            </>
          )}

          {/* TAB 2: LUYỆN TẬP THEO BÀI (11 BÀI HỌC) */}
          {activeTab === "lessons" && (
            <>
              {!selectedLessonId && (
                <LessonListScreen
                  profile={profile}
                  lessonStats={lessonSummaries}
                  onStartLesson={handleStartLesson}
                  onContinueLesson={handleContinueLesson}
                  onResetLesson={handleResetLesson}
                />
              )}

              {selectedLessonId && currentLessonState?.screen === "quiz" && (
                <QuizScreen
                  state={currentLessonState}
                  questionBank={questionBank}
                  onPickOption={handlePickLessonOption}
                  onNextQuestion={handleNextLessonQuestion}
                  onBack={() => setSelectedLessonId(null)}
                />
              )}

              {selectedLessonId && currentLessonState?.screen === "result" && (
                <ResultScreen
                  state={currentLessonState}
                  questionBank={questionBank}
                  onRetry={handleRetryCurrentLesson}
                  onChangeStudent={handleChangeStudent}
                  onBackToLessons={() => setSelectedLessonId(null)}
                  onNextLesson={(nextId) => {
                    if (nextId <= 11) {
                      handleStartLesson(nextId, profile.name, profile.cls);
                    }
                  }}
                />
              )}
            </>
          )}

          {/* TAB 3: TÀI LIỆU HỌC TẬP */}
          {activeTab === "docs" && <DocumentsScreen />}

          {/* Footer maintained as required */}
          <footer className="mt-8 space-y-1 text-center text-xs text-slate-500">
            <p>Ôn tập GDQP&amp;AN – Học phần I • Xử lý hoàn toàn trên trình duyệt</p>
            <p className="font-medium text-slate-600">Creator: Phạm Quốc Bình 26DT_TN</p>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (fixed on phones for quick thumb access) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white/95 px-2 py-1.5 backdrop-blur lg:hidden"
        aria-label="Điều hướng nhanh trên điện thoại"
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab("general");
            setSelectedLessonId(null);
          }}
          className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs font-bold transition ${
            activeTab === "general"
              ? "text-blue-600"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Tổng hợp</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("lessons");
            setSelectedLessonId(null);
          }}
          className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs font-bold transition ${
            activeTab === "lessons"
              ? "text-blue-600"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>11 Bài học</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("docs");
            setSelectedLessonId(null);
          }}
          className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs font-bold transition ${
            activeTab === "docs"
              ? "text-blue-600"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>Tài liệu</span>
        </button>
      </nav>
    </div>
  );
}
