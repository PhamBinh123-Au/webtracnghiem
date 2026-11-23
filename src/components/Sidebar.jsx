export default function Sidebar({
  activeTab,
  onSelectTab,
  profile,
  onChangeStudent,
  lessonStats,
  isOpen,
  onClose,
}) {
  const completedLessons = Object.values(lessonStats || {}).filter(
    (s) => s && s.completed
  ).length;

  const navItems = [
    {
      id: "general",
      name: "Ôn tập tổng hợp",
      badge: "386 câu",
      icon: (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      desc: "Trộn ngẫu nhiên toàn bộ 11 bài",
    },
    {
      id: "lessons",
      name: "Luyện tập theo bài",
      badge: completedLessons > 0 ? `${completedLessons}/11 bài` : "11 bài",
      icon: (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      desc: "11 phần luyện tập độc lập",
    },
    {
      id: "docs",
      name: "Tài liệu học tập",
      badge: "2 file PDF",
      icon: (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      desc: "Đề cương 386 câu & Giáo trình",
    },
  ];

  return (
    <>
      {/* Backdrop on mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 font-extrabold text-white shadow-md shadow-blue-500/20">
              QP
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
                GDQP&amp;AN • HP1
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                Đường Lối QP&amp;AN
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            aria-label="Đóng menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>


        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-3" aria-label="Menu chính">
          <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Mục ôn tập
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`group flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div
                  className={`mt-0.5 rounded-lg p-1 transition ${
                    isActive ? "text-white" : "text-slate-500 group-hover:text-blue-600"
                  }`}
                >
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-sm font-bold leading-tight">{item.name}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-blue-50 text-blue-700 group-hover:bg-blue-100"
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <div
                    className={`mt-0.5 truncate text-xs ${
                      isActive ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-100 p-4 text-center">
          <div className="text-[11px] text-slate-400">Học phần 1 • 100% Client-side</div>
          <div className="mt-0.5 text-xs font-semibold text-slate-700">
            Creator: Phạm Quốc Bình 26DT_TN
          </div>
        </div>
      </aside>
    </>
  );
}
