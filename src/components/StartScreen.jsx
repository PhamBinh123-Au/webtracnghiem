import { useState } from "react";

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export default function StartScreen({
  totalQuestions,
  initialProfile,
  onStart,
  onSelectTab,
}) {
  const [name, setName] = useState(initialProfile?.name || "");
  const [cls, setCls] = useState(initialProfile?.cls || "");

  const trimmedName = normalizeText(name);
  const trimmedClass = normalizeText(cls);
  const isValid = trimmedName.length > 0 && trimmedClass.length > 0;

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    onStart(trimmedName, trimmedClass);
  }

  return (
    <section aria-labelledby="start-title">
      <div className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500 p-6 text-white shadow-lg sm:p-8">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <span className="mb-2.5 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide">
          GDQP&amp;AN • HỌC PHẦN I
        </span>
        <h1 id="start-title" className="text-2xl font-extrabold leading-snug sm:text-3xl">
          Ôn tập trắc nghiệm: Đường lối quốc phòng và an ninh của Đảng Cộng sản Việt Nam
        </h1>
        <p className="mt-2 text-sm text-white/90 sm:text-base">
          Bộ câu hỏi bám sát Đề cương ôn tập Học phần 1 &amp; Tập tài liệu lưu hành nội bộ – Trung tâm GDQPAN&amp;TT, Đại học Đà Nẵng.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white/15 px-2 py-2.5 text-center">
            <b className="block text-xl font-bold">{totalQuestions}</b>
            <span className="text-xs text-white/90">câu hỏi</span>
          </div>
          <div className="rounded-xl bg-white/15 px-2 py-2.5 text-center">
            <b className="block text-xl font-bold">11</b>
            <span className="text-xs text-white/90">bài học</span>
          </div>
          <div className="rounded-xl bg-white/15 px-2 py-2.5 text-center">
            <b className="block text-xl font-bold">4</b>
            <span className="text-xs text-white/90">phương án/câu</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        autoComplete="on"
        className="rounded-2xl bg-white p-5 shadow-md sm:p-7"
      >
        <h2 className="mb-4 text-lg font-bold text-slate-900">Thông tin người làm bài</h2>

        <div className="mb-4">
          <label htmlFor="inp-name" className="mb-1.5 block text-sm font-bold text-slate-800 sm:text-base">
            Họ và tên <span className="text-red-600">*</span>
          </label>
          <input
            id="inp-name"
            name="name"
            type="text"
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Nguyễn Văn An"
            autoComplete="name"
            required
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-3 text-base text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 sm:text-lg"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="inp-class" className="mb-1.5 block text-sm font-bold text-slate-800 sm:text-base">
            Lớp <span className="text-red-600">*</span>
          </label>
          <input
            id="inp-class"
            name="class"
            type="text"
            maxLength={30}
            value={cls}
            onChange={(e) => setCls(e.target.value)}
            placeholder="Ví dụ: 26DT_TN"
            autoComplete="off"
            required
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-3 text-base text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 sm:text-lg"
          />
        </div>

        {!isValid && (
          <p id="start-hint" className="mb-4 text-sm text-slate-500">
            Vui lòng nhập đầy đủ Họ và tên và Lớp để bắt đầu.
          </p>
        )}

        <button
          id="btn-start"
          type="submit"
          disabled={!isValid}
          className="inline-flex min-h-[54px] w-full cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-base font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.985] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none sm:text-lg"
        >
          Bắt đầu làm bài ▶
        </button>

        {onSelectTab && (
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={() => onSelectTab("lessons")}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-2.5 text-xs font-bold text-blue-800 transition hover:bg-blue-100"
            >
              📚 Ôn tập riêng theo từng bài (11 bài) →
            </button>
            <button
              type="button"
              onClick={() => onSelectTab("docs")}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
            >
              📄 Xem giáo trình &amp; Đề cương PDF →
            </button>
          </div>
        )}

        <div className="mt-4 text-sm text-slate-600">
          <b className="text-slate-800">Hướng dẫn:</b>
          <ul className="mt-1.5 list-disc space-y-1 pl-5">
            <li>Câu hỏi và vị trí đáp án được xáo trộn ngẫu nhiên ở mỗi lượt làm.</li>
            <li>Chạm chọn 1 phương án – hệ thống báo đúng/sai ngay và hiện giải thích.</li>
            <li>Tiến trình được lưu tự động, tải lại trang (F5) vẫn tiếp tục được.</li>
          </ul>
        </div>
      </form>
    </section>
  );
}
