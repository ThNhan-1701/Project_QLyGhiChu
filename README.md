# Project QLyGhiChu - NoteApp

Ứng dụng web quản lý ghi chú cá nhân được xây dựng bằng Next.js 14, TypeScript, Tailwind CSS, shadcn-style components và Supabase.

## Tính Năng Chính

- Đăng ký, đăng nhập, đăng xuất bằng Supabase Auth.
- Gửi lại email xác nhận khi đăng ký.
- Tự xử lý session Supabase không hợp lệ và đưa người dùng về trang đăng nhập.
- Tạo, sửa, xóa và ghim ghi chú.
- Upload ảnh bìa cho ghi chú qua Supabase Storage.
- Quản lý tags màu, tạo tag nhanh trong form ghi chú.
- Tìm kiếm ghi chú theo tiêu đề hoặc nội dung.
- Lọc ghi chú theo tag và mood.
- Daily prompt: viết ghi chú từ prompt hôm nay.
- Tự lưu bản nháp khi tạo ghi chú.
- Mẫu ghi chú nhanh: nhật ký, cuộc họp, ý tưởng, checklist.
- Mood cho ghi chú: tập trung, vui vẻ, ý tưởng, cần xử lý, bình tĩnh, thành tựu, rối não, quan trọng.
- Note Personality: Classic, Neon, Calm, Paper, Focus.
- Card ghi chú có màu sắc, hiệu ứng hover, glow, viền động và animation xuất hiện.
- Realtime updates cho danh sách ghi chú.
- Dark mode.
- Docker multi-stage build.

## Công Nghệ

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Radix UI / shadcn-style components
- Supabase Auth, Database, Storage, Realtime
- next-themes
- sonner
- lucide-react
- Docker / Docker Compose

## Cài Đặt Local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Điền biến môi trường trong `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Ứng dụng mặc định chạy tại:

```txt
http://localhost:3000
```

## Cấu Hình Supabase

1. Vào Supabase Dashboard.
2. Mở SQL Editor.
3. Chạy toàn bộ nội dung file `supabase/schema.sql`.
4. Script sẽ tạo các bảng `notes`, `tags`, `note_tags`, policy RLS và index cần thiết.
5. Script cũng cấu hình bucket Storage `note-covers`.
6. Nếu bucket chưa xuất hiện, vào Storage tạo bucket `note-covers` và bật Public.

File `supabase/schema.sql` có thể chạy lại nhiều lần vì đã dùng:

- `CREATE TABLE IF NOT EXISTS`
- `DROP POLICY IF EXISTS`
- `CREATE INDEX IF NOT EXISTS`
- `INSERT ... ON CONFLICT`

## Kiểm Tra

```bash
npm run lint
npm run build
```

## Chạy Production

```bash
npm run build
npm run start
```

Nếu chạy bằng PM2:

```bash
pm2 start npm --name Project_QLyGhiChu -- start
```

Restart sau khi cập nhật code:

```bash
git pull origin main
npm install
npm run build
pm2 restart Project_QLyGhiChu
```

## Docker

```bash
docker compose up --build
```

## Ghi Chú Bảo Mật

- Không commit `.env.local`.
- Chỉ dùng `NEXT_PUBLIC_SUPABASE_ANON_KEY` ở frontend.
- Tuyệt đối không đưa service role key vào source code client.
- Khi chạy production, nên bật email confirmation trong Supabase Auth.
- Kiểm tra Site URL và Redirect URLs trong Supabase Auth khi deploy lên domain thật.

## Tài Liệu

Tài liệu báo cáo nằm trong thư mục `docs/`, bao gồm bản DOCX cập nhật:

```txt
docs/bao-cao-toan-van-cap-nhat.docx
```
