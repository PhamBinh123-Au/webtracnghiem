import { useState } from "react";
import lessonsData from "../data/lessons.json";

export default function DocumentsScreen() {
  const [selectedDoc, setSelectedDoc] = useState(null);

  const docs = [
    {
      id: "decuong",
      title: "Đề cương ôn tập Học phần 1 (386 câu trắc nghiệm)",
      filename: "De_cuong_on_tap_HP1_GDQPAN_386_cau_trac_nghiem.pdf",
      url: "/tailieu/De_cuong_on_tap_HP1_GDQPAN_386_cau_trac_nghiem.pdf",
      size: "3.76 MB",
      pages: "133 trang",
      tag: "Trọng tâm ôn thi",
      tagColor: "bg-amber-100 text-amber-800",
      desc: "Chuyển thể từ Đề cương HP1 (ID 47) & Tập tài liệu lưu hành nội bộ 9/2026. Bao gồm 386 câu hỏi trắc nghiệm 4 lựa chọn, bảng đáp án A-B-C-D và giải thích chi tiết dẫn chiếu theo từng bài.",
    },
    {
      id: "giaotrinh",
      title: "Giáo trình GDQP&AN Học phần 1: Đường lối QP&AN",
      filename: "Hoc_phan_1_GDQPAN.pdf",
      url: "/tailieu/Hoc_phan_1_GDQPAN.pdf",
      size: "2.46 MB",
      pages: "206 trang",
      tag: "Giáo trình chính thức",
      tagColor: "bg-blue-100 text-blue-800",
      desc: "Tập bài giảng lý thuyết toàn diện gồm 11 bài học về Quan điểm Mác - Lênin & tư tưởng Hồ Chí Minh, Xây dựng nền QPTD & ANND, Chiến tranh nhân dân, LLVTND, Nghệ thuật quân sự, Chủ quyền biển đảo...",
    },
  ];

  return (
    <section aria-labelledby="docs-heading" className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 p-6 text-white shadow-lg sm:p-7">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-blue-500/10"
          aria-hidden="true"
        />
        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide">
          KHO TÀI LIỆU CHÍNH THỨC
        </span>
        <h1 id="docs-heading" className="mt-2 text-2xl font-extrabold sm:text-3xl">
          Tài liệu học tập &amp; Ôn thi GDQP&amp;AN HP1
        </h1>
        <p className="mt-1.5 text-sm text-slate-300 sm:text-base">
          Tập hợp đầy đủ Giáo trình và Đề cương ôn tập trắc nghiệm 386 câu trong thư mục tài liệu của môn học.
        </p>
      </div>

      {/* Documents Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {docs.map((doc) => {
          const isViewing = selectedDoc === doc.id;
          return (
            <article
              key={doc.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${doc.tagColor}`}>
                    {doc.tag}
                  </span>
                  <div className="text-xs text-slate-500">
                    {doc.pages} • {doc.size}
                  </div>
                </div>

                <div className="mt-3 flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                      {doc.title}
                    </h2>
                    <p className="mt-0.5 text-xs font-mono text-slate-500">
                      {doc.filename}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {doc.desc}
                </p>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDoc(isViewing ? null : doc.id)}
                    className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold shadow-sm transition active:scale-95 ${
                      isViewing
                        ? "bg-slate-800 text-white hover:bg-slate-900"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    {isViewing ? "Đóng trình đọc" : "Đọc trực tiếp"}
                  </button>

                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Mở trong tab mới"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:scale-95"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>

                  <a
                    href={doc.url}
                    download={doc.filename}
                    title="Tải về máy"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:scale-95"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Embedded In-App PDF Viewer */}
      {selectedDoc && (
        <div className="overflow-hidden rounded-2xl border-2 border-blue-600 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-sm font-bold">
                {docs.find((d) => d.id === selectedDoc)?.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={docs.find((d) => d.id === selectedDoc)?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/20"
              >
                Mở tab mới ↗
              </a>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="rounded-lg bg-white/10 p-1 text-slate-300 hover:bg-white/20 hover:text-white"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="relative h-[650px] w-full bg-slate-100 sm:h-[750px]">
            <iframe
              src={docs.find((d) => d.id === selectedDoc)?.url}
              title="Trình đọc tài liệu PDF"
              className="h-full w-full border-none"
            />
          </div>
          <div className="border-t border-slate-200 bg-slate-50 p-2 text-center text-xs text-slate-500">
            Nếu thiết bị của bạn không hiển thị tài liệu bên trên, vui lòng bấm{" "}
            <a
              href={docs.find((d) => d.id === selectedDoc)?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline"
            >
              Mở trong tab mới
            </a>{" "}
            hoặc tải xuống về máy.
          </div>
        </div>
      )}

      {/* Fast Lesson Lookup Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">
          Bảng đối chiếu 11 bài học &amp; Vị trí trong giáo trình
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Tra cứu nhanh số trang trong giáo trình để đọc lại khi làm sai câu hỏi trắc nghiệm.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="py-2.5 pl-3 pr-2 font-bold">Bài</th>
                <th className="px-2 py-2.5 font-bold">Tên bài học</th>
                <th className="px-2 py-2.5 font-bold text-center">Số câu</th>
                <th className="px-2 py-2.5 font-bold">Trang giáo trình</th>
                <th className="py-2.5 pl-2 pr-3 font-bold">Thứ tự câu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {lessonsData.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 pl-3 pr-2 font-bold text-blue-700">
                    Bài {l.id}
                  </td>
                  <td className="px-2 py-2.5 font-medium text-slate-900">
                    {l.title}
                  </td>
                  <td className="px-2 py-2.5 text-center font-bold text-slate-800">
                    {l.count}
                  </td>
                  <td className="px-2 py-2.5 font-mono text-xs text-slate-500">
                    {l.pages}
                  </td>
                  <td className="py-2.5 pl-2 pr-3 font-mono text-xs text-slate-500">
                    Câu {l.idRange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
