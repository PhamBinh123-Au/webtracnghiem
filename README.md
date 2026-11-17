# Web App Ôn Tập Trắc Nghiệm GDQP&AN – Học Phần I

Ứng dụng web ôn tập trắc nghiệm **Học phần I: Đường lối quốc phòng và an ninh của Đảng Cộng sản Việt Nam** (386 câu hỏi theo Đề cương ôn tập Học phần 1, 11 bài học), xây dựng bằng **Vite + React + Tailwind CSS**.

## Tính năng chính

- **386 câu hỏi trắc nghiệm 4 phương án** trích xuất 100% từ Đề cương ôn tập Học phần 1 & Tập tài liệu lưu hành nội bộ (lưu tại `src/data/questionBank.json`), không gắn cứng chữ cái `A/B/C/D` vào nội dung phương án.
- **Thuật toán Fisher-Yates** xáo trộn ngẫu nhiên cả thứ tự câu hỏi lẫn vị trí 4 phương án ở mỗi lượt làm bài hoặc làm lại.
- **Phản hồi tức thì**: chọn đáp án sẽ khóa câu hỏi ngay, tô màu xanh/đỏ, hiển thị đáp án đúng và giải thích kèm dẫn chiếu mục, số trang.
- **Lưu tiến trình tự động (`localStorage`)**: tải lại trang (`F5`) không bị mất bài đang làm.
- **Kiến trúc 100% Client-side**: toàn bộ logic chạy trên trình duyệt, khi deploy lên Vercel (CDN tĩnh) có thể phục vụ hơn 500 người dùng cùng lúc mà không lo nghẽn máy chủ.

## Cấu trúc dự án

```text
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── components/
    │   ├── StartScreen.jsx
    │   ├── QuizScreen.jsx
    │   └── ResultScreen.jsx
    ├── data/
    │   └── questionBank.json
    └── utils/
        ├── shuffle.js
        └── storage.js
```

## Chạy thử trên máy cá nhân

```bash
npm install
npm run dev
```

Build bản production:

```bash
npm run build
npm run preview
```

## Đẩy lên GitHub và xuất link Vercel

1. Khởi tạo Git và đẩy mã nguồn lên GitHub repository mới:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: GDQPAN HP1 quiz app"
   git branch -M main
   git remote add origin https://github.com/<ten-tai-khoan>/<ten-repo>.git
   git push -u origin main
   ```
2. Đăng nhập [Vercel](https://vercel.com), chọn **Add New… → Project**.
3. Chọn repository GitHub vừa đẩy lên và bấm **Import**.
4. Vercel tự động nhận diện **Framework Preset: Vite** (`Build Command: npm run build`, `Output Directory: dist`). Bấm **Deploy** để nhận đường link chia sẻ cho sinh viên.
