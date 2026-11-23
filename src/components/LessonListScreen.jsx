import { useState } from "react";
import lessonsData from "../data/lessons.json";

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export default function LessonListScreen({
  profile,
  lessonStats,
  onStartLesson,
  onContinueLesson,
  onResetLesson,
}) {
  const [targetLessonForProfile, setTargetLessonForProfile] = useState(null);
  const [name, setName] = useState(profile?.name || "");
  const [cls, setCls] = useState(profile?.cls || "");

  const hasProfile = Boolean(
    profile?.name && profile?.name.trim() && profile?.cls && profile?.cls.trim()
  );

  const completedCount = Object.values(lessonStats || {}).filter(
    (s) => s && s.completed
  ).length;

  const totalQuestions = lessonsData.reduce((acc, l) => acc + l.count, 0);

  function handleCardClick(lesson) {
    const current = lessonStats?.[lesson.id];
    if (!hasProfile) {
      setTargetLessonForProfile(lesson);
      return;
    }
    if (current && !current.completed) {
      onContinueLesson(lesson.id);
    } else {
      onStartLesson(lesson.id, profile.name, profile.cls);
    }
  }

  function handleProfileSubmit(e) {
    e.preventDefault();
    const trimmedName = normalizeText(name);
    const trimmedClass = normalizeText(cls);
    if (!trimmedName || !trimmedClass || !targetLessonForProfile) return;

    const lessonId = targetLessonForProfile.id;
    setTargetLessonForProfile(null);
    onStartLesson(lessonId, trimmedName, trimmedClass);
  }

  return (
    <section aria-labelledby="lessons-heading" className="space-y-5">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-blue-800 to-sky-600 p-6 text-white shadow-lg sm:p-7">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide">
            11 PHẦN LUYỆN TẬP ĐỘC LẬP
          </span>
          <span className="text-xs font-medium text-white/90">
            Tiến độ: <b>{completedCount}</b> / 11 bài hoàn thành
          </span>
        </div>

        <h1 id="lessons-heading" className="mt-2 text-2xl font-extrabold sm:text-3xl">
          Luyện tập trắc nghiệm theo từng bài học
        </h1>
        <p className="mt-1.5 text-sm text-white/90 sm:text-base">
          Mỗi bài học là một bộ đề trắc nghiệm riêng biệt, xáo trộn câu hỏi và 4 đáp án theo chuẩn đề cương ôn tập.
        </p>

        {/* Quick Stats Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white/15 px-3 py-2 text-center">
            <b className="block text-xl font-bold">11</b>
            <span className="text-xs text-white/90">bài học</span>
          </div>
          <div className="rounded-xl bg-white/15 px-3 py-2 text-center">
            <b className="block text-xl font-bold">{totalQuestions}</b>
            <span className="text-xs text-white/90">câu hỏi tổng</span>
          </div>
          <div className="rounded-xl bg-white/15 px-3 py-2 text-center">
            <b className="block text-xl font-bold">
              {Math.round((completedCount / 11) * 100)}%
            </b>
            <span className="text-xs text-white/90">đã hoàn thành</span>
          </div>
        </div>
      </div>

      {/* Profile Modal if student clicks without name */}
      {targetLessonForProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Nhập thông tin làm bài
              </h3>
              <button
                type="button"
                onClick={() => setTargetLessonForProfile(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Vui lòng nhập Họ tên và Lớp để bắt đầu luyện tập <b>Bài {targetLessonForProfile.id}</b>.
            </p>
            <form onSubmit={handleProfileSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-bold text-slate-700">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700">Lớp *</label>
                <input
                  type="text"
                  required
                  value={cls}
                  onChange={(e) => setCls(e.target.value)}
                  placeholder="Ví dụ: 26DT_TN"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTargetLessonForProfile(null)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || !cls.trim()}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-slate-400"
                >
                  Bắt đầu làm ▶
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List of 11 Lessons */}
      <div className="grid gap-3.5 sm:grid-cols-2">
        {lessonsData.map((lesson) => {
          const stats = lessonStats?.[lesson.id];
          const isDone = stats && stats.completed;
          const isInProgress = stats && !stats.completed && stats.idx > 0;
          const score = isDone ? Math.round((stats.correct / lesson.count) * 10 * 10) / 10 : 0;

          return (
            <article
              key={lesson.id}
              className={`flex flex-col justify-between rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
                isDone
                  ? "border-emerald-200 ring-1 ring-emerald-500/10"
                  : isInProgress
                  ? "border-blue-200 ring-1 ring-blue-500/10"
                  : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-lg bg-blue-600 px-2 py-0.5 text-xs font-extrabold text-white">
                      Bài {lesson.id}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {lesson.count} câu
                    </span>
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">
                      {lesson.pages}
                    </span>
                  </div>

                  {isDone ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      ✔ {stats.correct}/{lesson.count} ({score} đ)
                    </span>
                  ) : isInProgress ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                      ⏳ Câu {stats.idx + 1}/{lesson.count}
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400">
                      Chưa làm
                    </span>
                  )}
                </div>

                <h3 className="mt-2.5 text-base font-bold leading-snug text-slate-900">
                  {lesson.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {lesson.summary}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs font-medium text-slate-500">
                  Câu {lesson.idRange}
                </span>

                <div className="flex items-center gap-2">
                  {isInProgress && (
                    <button
                      type="button"
                      onClick={() => onResetLesson(lesson.id)}
                      title="Làm lại từ đầu"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCardClick(lesson)}
                    className={`inline-flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-bold shadow-sm transition active:scale-95 ${
                      isDone
                        ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
                        : isInProgress
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                    }`}
                  >
                    {isDone ? "Làm lại / Xem lại" : isInProgress ? "Làm tiếp ▶" : "Bắt đầu ▶"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
