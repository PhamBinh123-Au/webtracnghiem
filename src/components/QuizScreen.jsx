import { useEffect, useRef } from "react";
import { OPTION_LETTERS } from "../utils/shuffle.js";

export default function QuizScreen({
  state,
  questionBank,
  onPickOption,
  onNextQuestion,
}) {
  const btnNextRef = useRef(null);
  const total = state.total;
  const item = state.items[state.idx];
  const question = questionBank[item.q];
  const chosenPos = state.picks[state.idx];
  const isAnswered = typeof chosenPos === "number";
  const correctPos = item.p.indexOf(question.correctAnswer);
  const isCorrect = isAnswered && chosenPos === correctPos;

  const answeredCount = state.correct + state.wrong;
  const progressPct = Math.round((answeredCount / total) * 100);
  const isLastQuestion = state.idx === total - 1;

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = (e.key || "").toUpperCase();
      const optionKeyMap = { A: 0, B: 1, C: 2, D: 3, 1: 0, 2: 1, 3: 2, 4: 3 };
      if (Object.prototype.hasOwnProperty.call(optionKeyMap, key)) {
        if (!isAnswered) {
          e.preventDefault();
          onPickOption(optionKeyMap[key]);
        }
      } else if ((key === "ENTER" || key === "ARROWRIGHT") && isAnswered) {
        e.preventDefault();
        onNextQuestion();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAnswered, onPickOption, onNextQuestion]);

  function handleOptionClick(pos) {
    if (isAnswered) return;
    onPickOption(pos);
    setTimeout(() => {
      const btn = btnNextRef.current;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          btn.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }
    }, 60);
  }

  return (
    <section id="screen-quiz" aria-label="Làm bài">
      <div className="sticky top-0 z-10 -mx-1 mb-3 bg-slate-100/95 px-1 pb-2.5 pt-2 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2.5">
          <div id="quiz-who" className="min-w-0 truncate text-sm text-slate-500">
            <b className="text-slate-900">{state.name}</b> • Lớp {state.cls}
          </div>
          <div className="flex shrink-0 gap-1.5">
            <span
              className="whitespace-nowrap rounded-full bg-green-100 px-2.5 py-1 text-sm font-bold text-green-900"
              title="Số câu đúng"
            >
              ✔ <span id="cnt-ok">{state.correct}</span>
            </span>
            <span
              className="whitespace-nowrap rounded-full bg-red-100 px-2.5 py-1 text-sm font-bold text-red-900"
              title="Số câu sai"
            >
              ✘ <span id="cnt-bad">{state.wrong}</span>
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-700 sm:text-sm">
          <span id="progress-text">
            Câu {state.idx + 1}/{total}
          </span>
          <span id="progress-pct">
            Đã làm {answeredCount} câu ({progressPct}%)
          </span>
        </div>

        <div
          id="progress-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPct}
          className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-300/70"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-500 transition-[width] duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <article className="rounded-2xl bg-white p-5 shadow-md sm:p-7">
        <span className="mb-2.5 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-800 sm:text-sm">
          Câu {state.idx + 1} / {total}
        </span>

        <h2 className="mb-4 text-lg font-bold leading-snug text-slate-900 sm:text-xl">
          {question.question}
        </h2>

        <div className="grid gap-2.5" role="group" aria-label="Các phương án trả lời">
          {item.p.map((origIdx, pos) => {
            const isOptionCorrect = isAnswered && pos === correctPos;
            const isOptionWrong = isAnswered && pos === chosenPos && !isOptionCorrect;
            const isDimmed = isAnswered && !isOptionCorrect && !isOptionWrong;

            let cardClasses =
              "border-slate-200 bg-white text-slate-900 hover:border-blue-300 hover:bg-blue-50/40";
            let letterClasses = "bg-slate-200 text-slate-700";
            let mark = "";

            if (isOptionCorrect) {
              cardClasses = "border-green-600 bg-green-100 text-green-950";
              letterClasses = "bg-green-600 text-white";
              mark = "✔";
            } else if (isOptionWrong) {
              cardClasses = "border-red-600 bg-red-100 text-red-950";
              letterClasses = "bg-red-600 text-white";
              mark = "✘";
            } else if (isDimmed) {
              cardClasses = "border-slate-200 bg-white text-slate-900 opacity-55";
            }

            return (
              <button
                key={origIdx}
                type="button"
                disabled={isAnswered}
                aria-disabled={isAnswered ? "true" : undefined}
                onClick={() => handleOptionClick(pos)}
                className={`opt flex min-h-[56px] w-full items-start gap-3 rounded-xl border-2 px-3.5 py-3 text-left text-base leading-relaxed transition active:scale-[0.99] disabled:cursor-default disabled:active:scale-100 sm:text-[17px] ${cardClasses} ${
                  isOptionCorrect ? "correct" : isOptionWrong ? "wrong" : ""
                }`}
              >
                <span
                  className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${letterClasses}`}
                >
                  {OPTION_LETTERS[pos]}
                </span>
                <span className="flex-1 pt-0.5">{question.options[origIdx]}</span>
                {mark && <span className="shrink-0 pt-0.5 text-lg font-extrabold">{mark}</span>}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div
            role="status"
            aria-live="polite"
            className={`animate-pop mt-4 rounded-xl border-l-[6px] p-4 ${
              isCorrect
                ? "border-green-600 bg-green-50"
                : "border-red-600 bg-red-50"
            }`}
          >
            <div
              className={`mb-1 text-base font-extrabold sm:text-lg ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect ? "✔ Chính xác!" : "✘ Chưa đúng!"}
            </div>

            {!isCorrect && (
              <div className="my-1 text-sm text-slate-800 sm:text-base">
                <b>Đáp án đúng: {OPTION_LETTERS[correctPos]}. </b>
                {question.options[question.correctAnswer]}
              </div>
            )}

            {question.explanation && (
              <div className="text-sm leading-relaxed text-slate-700 sm:text-base">
                <b className="text-slate-900">Giải thích: </b>
                {question.explanation}
              </div>
            )}
          </div>
        )}

        {isAnswered && (
          <div className="mt-4">
            <button
              id="btn-next"
              ref={btnNextRef}
              type="button"
              onClick={onNextQuestion}
              className="inline-flex min-h-[54px] w-full cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-base font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.985] sm:text-lg"
            >
              {isLastQuestion ? "Hoàn thành ✓" : "Câu tiếp theo →"}
            </button>
          </div>
        )}

        <p className="mt-3 text-center text-xs text-slate-500">
          Máy tính: nhấn phím A/B/C/D (hoặc 1–4) để chọn, Enter để sang câu tiếp.
        </p>
      </article>
    </section>
  );
}
