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

## QA gate trước merge

PR migration không được merge chỉ vì Vercel build PASS.

Source of truth hiện tại:

- `docs/FINAL_QA_CHECKLIST.md`
- `docs/DEEP_QA_AUDIT_2026-09-06.md`

Các blocker chính đang mở gồm: Ortland integration, Search dead control, mobile 390×844 live visual QA, Brand Close → Footer QA và CSS consolidation.

## Font Brand

Display font đã khóa là `1FTV Ortland Regular`. Font từng nằm trong WordPress V2 archive nhưng chưa được migrate vào Next.js branch. Vì repo này là public, font binary chỉ được đưa vào source/deployment sau khi xác nhận quyền sử dụng web/self-hosted phù hợp. Xem thêm `public/media/README.md` và deep QA audit.

## Ghi đơn hàng vào Google Sheet (lưu trữ đơn hàng tạm thời)

Trước đây toàn bộ luồng checkout/thanh toán chỉ chạy ở trình duyệt, đơn hàng
chỉ nằm trong `localStorage` của khách nên chủ shop không bao giờ nhận được.
Hai route `app/api/orders/route.ts` (khi đặt đơn) và
`app/api/orders/payment-reported/route.ts` (khi khách bấm "đã chuyển tiền")
ghi mỗi sự kiện thành một dòng vào Google Sheet, dùng làm nơi lưu trữ đơn
giản trong lúc chưa có database thật.

Các bước tạo Service Account (chỉ làm 1 lần):

1. Vào [Google Cloud Console](https://console.cloud.google.com/) → tạo project mới (hoặc dùng project có sẵn).
2. Bật **Google Sheets API** cho project đó (APIs & Services → Library → tìm "Google Sheets API" → Enable).
3. Vào **APIs & Services → Credentials → Create Credentials → Service Account**, đặt tên bất kỳ, bỏ qua phần gán quyền (role) cấp project.
4. Mở Service Account vừa tạo → tab **Keys → Add Key → Create new key → JSON**. File JSON tải về chứa `client_email` và `private_key`, đây chính là `GOOGLE_SERVICE_ACCOUNT_EMAIL` và `GOOGLE_PRIVATE_KEY`.
5. Tạo một Google Sheet mới, tạo 1 tab tên `Orders` (hoặc tên khác rồi khai vào `GOOGLE_SHEET_TAB_NAME`) với hàng tiêu đề gợi ý: `Thời gian | Sự kiện | Mã đơn | Khách hàng | SĐT | Email | Địa chỉ | Sản phẩm | Tổng tiền | Phương thức | Trạng thái | Ghi chú`.
6. Bấm **Share** trên Google Sheet đó, thêm chính email trong `client_email` (dạng `...@...iam.gserviceaccount.com`) với quyền **Editor**. Bỏ qua bước này thì API sẽ ghi lỗi 403.
7. Lấy `GOOGLE_SHEET_ID` từ URL của Sheet: `https://docs.google.com/spreadsheets/d/GOOGLE_SHEET_ID/edit`.
8. Khai 4 biến trên vào Vercel Environment Variables (và `.env.local` nếu chạy `npm run dev` ở máy). Với `GOOGLE_PRIVATE_KEY`, giữ nguyên các ký tự `\n` như trong file JSON tải về.

Lưu ý: đây vẫn là **QR chuyển khoản thủ công**, không phải cổng thanh toán
thật. Route `payment-reported` chỉ ghi lại việc khách TỰ KHAI đã chuyển tiền,
chủ shop vẫn cần tự đối soát bằng app ngân hàng trước khi đóng gói/giao hàng.
Muốn tự động xác nhận thanh toán thật (không cần đối soát tay) thì cần tích
hợp một cổng thanh toán có webhook/IPN như PayOS, VNPay hoặc MoMo Business.

## Thông báo tức thời cho chủ shop

`lib/notify.ts` bắn thông báo khi có đơn mới và khi khách báo đã chuyển tiền.
Kênh nào thiếu biến môi trường thì tự bỏ qua, không lỗi cho khách hàng.

- **Telegram bot** (khuyến nghị setup trước, nhanh nhất): nhắn `/newbot` cho
  [@BotFather](https://t.me/BotFather) trên Telegram để lấy `TELEGRAM_BOT_TOKEN`,
  sau đó nhắn thử 1 tin bất kỳ cho bot rồi mở
  `https://api.telegram.org/bot<TOKEN>/getUpdates` để lấy `TELEGRAM_CHAT_ID`
  của chính mình.
- **Zalo OA**: cần đã có một Official Account cho Nook Ký, lấy
  `ZALO_OA_ACCESS_TOKEN` qua OAuth của Zalo Developers. API `message/cs` chỉ
  gửi được cho người đã tương tác với OA trong 7 ngày gần nhất, nên bạn cần tự
  nhắn cho OA của mình định kỳ để duy trì quyền nhận thông báo qua kênh này,
  hoặc xin duyệt template ZNS nếu muốn gửi ổn định không giới hạn 7 ngày.

## Không commit secrets

Không commit `.env`, API keys, Supabase service keys, payment secrets hoặc token vào repo. Dùng Vercel Environment Variables cho secrets.
