# Nook Ký Web

Nook Ký đang được chuyển từ WordPress/WooCommerce sang một codebase Next.js để có workflow làm nhóm mượt hơn, preview theo branch và deploy liên tục qua Vercel.

## Kiến trúc hiện tại

- Frontend: Next.js + React + TypeScript
- Hosting frontend: Vercel
- Source control: GitHub
- Domain production dự kiến: `nookky.shop`
- Backend/data/commerce: sẽ nối ở giai đoạn sau; không hardcode payment/order logic trong frontend.

## Quy tắc làm việc nhóm

`main` là bản đã được duyệt.

Mỗi task/function tạo branch riêng, ví dụ:

- `feature/hero-video`
- `feature/nook-studio`
- `feature/room-preview`
- `feature/promotion`

Flow chuẩn:

1. Pull code mới nhất từ `main`.
2. Tạo branch cho task.
3. Code và test trên branch.
4. Push lên GitHub.
5. Vercel sinh Preview URL cho branch/PR.
6. Review trực tiếp bằng giao diện trên Preview URL.
7. Sai thì sửa tiếp trên cùng branch.
8. Đúng thì merge vào `main`.
9. `main` deploy lên production.

## Migration V3.2

Nguồn migration là bản WordPress V3.2 hiện tại + Simply Static full-site export.

Các block cần port đầu tiên:

1. Header
2. Hero
3. Featured Nooks
4. Shop All
5. Product Spotlight
6. Choose Your Place
7. Build Experience
8. Real Nooks
9. Brand Close

WordPress/PHP/WooCommerce hooks sẽ không được bê nguyên vào Next.js. Chỉ tái sử dụng design, assets, copy, data và interaction có giá trị.

## Không commit secrets

Không commit `.env`, API keys, Supabase service keys, payment secrets hoặc token vào repo. Dùng Vercel Environment Variables cho secrets.
