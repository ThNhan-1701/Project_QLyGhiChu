# Project QLyGhiChu

Ứng dụng quản lý ghi chú cá nhân dùng Next.js 14, TypeScript, Tailwind CSS, shadcn-style components và Supabase.

## Tính năng chính

- Đăng ký, đăng nhập, đăng xuất bằng Supabase Auth.
- Tạo, sửa, xóa, ghim ghi chú.
- Upload ảnh bìa cho ghi chú qua Supabase Storage.
- Gắn tags, lọc theo tag và tìm kiếm theo tiêu đề hoặc nội dung.
- Tạo tag nhanh ngay trong form tạo/sửa ghi chú.
- Realtime updates cho danh sách ghi chú.
- Dark mode.
- Docker multi-stage build.

## Cài đặt local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Điền biến môi trường trong `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Cấu hình Supabase

1. Vào Supabase Dashboard.
2. Mở SQL Editor.
3. Chạy toàn bộ nội dung file `supabase/schema.sql`.
4. Script sẽ tự tạo/bật public bucket `note-covers` nếu đủ quyền.
5. Nếu bucket chưa xuất hiện, vào Storage tạo bucket `note-covers` và bật Public.

File `supabase/schema.sql` có thể chạy lại nhiều lần vì đã dùng:

- `CREATE TABLE IF NOT EXISTS`
- `DROP POLICY IF EXISTS`
- `CREATE INDEX IF NOT EXISTS`
- `INSERT ... ON CONFLICT`

## Kiểm tra

```bash
npm run lint
npm run build
```

## Docker

```bash
docker compose up --build
```

## Lưu ý bảo mật

- Không commit `.env.local`.
- Khi chạy production, nên bật email confirmation trong Supabase Auth.
- Anon key có thể nằm ở frontend, nhưng service role key tuyệt đối không được đưa vào source code client.
