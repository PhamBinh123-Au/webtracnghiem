function formatNumber(n) {
  return Number(n).toLocaleString("vi-VN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
}

function getFeedbackBanner(score) {
  if (score >= 9) return { emoji: "🏆", msg: "Xuất sắc! Bạn nắm rất chắc kiến thức." };
  if (score >= 8) return { emoji: "🎉", msg: "Giỏi lắm! Kiến thức của bạn rất vững." };
  if (score >= 6.5) return { emoji: "👍", msg: "Khá tốt! Hãy xem lại các câu sai để tiến bộ hơn." };
  if (score >= 5) return { emoji: "📘", msg: "Đạt yêu cầu. Cần ôn tập thêm để nắm chắc hơn." };
  return { emoji: "💪", msg: "Chưa đạt. Đừng nản – hãy ôn lại và làm thêm lượt mới!" };
}

export default function ResultScreen({ state, questionBank, onRetry, onChangeStudent }) {
  const total = state.total;
  let correctCount = 0;
  let wrongCount = 0;
  const wrongList = [];

  state.items.forEach((item, index) => {
    const pos = state.picks[index];
    if (typeof pos !== "number") return;
    const question = questionBank[item.q];
    const chosenOrigIdx = item.p[pos];
    if (chosenOrigIdx === question.correctAnswer) {
      correctCount++;
    } else {
      wrongCount++;
      wrongList.push({
        order: index + 1,
        question,
        chosenOrigIdx,
      });
    }
  });

  const pct = (correctCount / total) * 100;
  const score = Math.round((correctCount / total) * 10 * 100) / 100;
  const { emoji, msg } = getFeedbackBanner(score);

  return (
    <section id="screen-result" aria-labelledby="result-title">
      <div className="rounded-2xl bg-white p-5 shadow-md sm:p-7">
        <div className="mb-5 text-center">
          <div className="text-5xl leading-none">{emoji}</div>
          <h2 id="result-title" className="mt-2.5 text-2xl font-extrabold text-slate-900">
            Hoàn thành bài ôn tập!
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 sm:text-base">{msg}</p>

          <div
            className="mx-auto mt-4 grid h-[150px] w-[150px] place-items-center rounded-full"
            style={{
              background: `conic-gradient(#16a34a ${pct.toFixed(1)}%, #e5e7eb 0)`,
            }}
          >
            <div className="flex h-[118px] w-[118px] flex-col items-center justify-center rounded-full bg-white">
              <b className="text-3xl font-extrabold leading-none text-slate-900">
                {formatNumber(Math.round(score * 10) / 10)}
              </b>
              <span className="mt-1 text-xs text-slate-500">điểm / 10</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-left text-base" aria-label="Bảng kết quả">
            <tbody className="divide-y divide-slate-200">
              <tr>
                <th scope="row" className="w-[46%] bg-slate-50 px-3.5 py-3 font-semibold text-slate-700">
                  Họ và tên
                </th>
                <td id="r-name" className="break-words px-3.5 py-3 font-bold text-slate-900">
                  {state.name}
                </td>
              </tr>
              <tr>
                <th scope="row" className="w-[46%] bg-slate-50 px-3.5 py-3 font-semibold text-slate-700">
                  Lớp
                </th>
                <td id="r-class" className="break-words px-3.5 py-3 font-bold text-slate-900">
                  {state.cls}
                </td>
              </tr>
              <tr>
                <th scope="row" className="w-[46%] bg-slate-50 px-3.5 py-3 font-semibold text-slate-700">
                  Tổng số câu
                </th>
                <td id="r-total" className="px-3.5 py-3 font-bold text-slate-900">
                  {total}
                </td>
              </tr>
              <tr>
                <th scope="row" className="w-[46%] bg-slate-50 px-3.5 py-3 font-semibold text-slate-700">
                  Số câu Đúng
                </th>
                <td id="r-ok" className="px-3.5 py-3 font-bold text-green-600">
                  {correctCount}
                </td>
              </tr>
              <tr>
                <th scope="row" className="w-[46%] bg-slate-50 px-3.5 py-3 font-semibold text-slate-700">
                  Số câu Sai
                </th>
                <td id="r-bad" className="px-3.5 py-3 font-bold text-red-600">
                  {wrongCount}
                </td>
              </tr>
              <tr>
                <th scope="row" className="w-[46%] bg-slate-50 px-3.5 py-3 font-semibold text-slate-700">
                  Tỷ lệ đúng
                </th>
                <td id="r-pct" className="px-3.5 py-3 font-bold text-slate-900">
                  {formatNumber(Math.round(pct * 100) / 100)}%
                </td>
              </tr>
              <tr>
                <th scope="row" className="w-[46%] bg-slate-50 px-3.5 py-3 font-semibold text-slate-700">
                  Điểm số (thang 10)
                </th>
                <td id="r-score" className="px-3.5 py-3 text-xl font-extrabold text-blue-700">
                  {formatNumber(score)} / 10
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {wrongList.length > 0 && (
          <details className="group mt-4 rounded-xl border border-slate-200 bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 font-bold text-slate-800 [&::-webkit-details-marker]:hidden">
              <span>Xem lại {wrongList.length} câu trả lời sai</span>
              <span className="transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div className="divide-y divide-dashed divide-slate-200 px-4 pb-3.5">
              {wrongList.map((w) => (
                <div key={w.order} className="py-3 text-sm sm:text-base">
                  <div className="mb-1.5 font-bold text-slate-900">
                    Câu {w.order}. {w.question.question}
                  </div>
                  <div className="my-1 rounded-lg bg-red-100 px-2.5 py-1.5 text-red-900">
                    ✘ Bạn chọn: {w.question.options[w.chosenOrigIdx]}
                  </div>
                  <div className="my-1 rounded-lg bg-green-100 px-2.5 py-1.5 text-green-900">
                    ✔ Đáp án đúng: {w.question.options[w.question.correctAnswer]}
                  </div>
                  {w.question.explanation && (
                    <div className="mt-1.5 text-sm text-slate-600">
                      <b>Giải thích: </b>
                      {w.question.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </details>
        )}

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <button
            id="btn-retry"
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-[54px] w-full cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-base font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.985] sm:text-lg"
          >
            ⟲ Làm lại bài tập
          </button>
          <button
            id="btn-change"
            type="button"
            onClick={onChangeStudent}
            className="inline-flex min-h-[54px] w-full cursor-pointer items-center justify-center rounded-xl bg-blue-50 px-5 py-3 text-base font-bold text-blue-800 transition hover:bg-blue-100 active:scale-[0.985] sm:text-lg"
          >
            Đổi người làm bài
          </button>
        </div>
      </div>
    </section>
  );
}
