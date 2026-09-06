# Nook Ký — Homepage QA Backlog

Nguồn review: bộ screenshot desktop người dùng bàn giao ngày 06/09/2026 + code hiện tại trên `migration/v3-2-next` + deep static audit toàn branch.

Nguyên tắc sign-off:
- Không merge PR #1 khi còn P0 mở.
- Vercel build PASS chỉ là một gate kỹ thuật, không thay thế visual/functional QA.
- Desktop bắt buộc: 1440×900.
- Mobile bắt buộc: 390×844.
- Deep audit chi tiết: `docs/DEEP_QA_AUDIT_2026-09-06.md`.

## P0 — Release blockers

| ID | Khu vực | Phát hiện | Hành động | Trạng thái |
|---|---|---|---|---|
| P0-01 | Typography | Ortland đã từng có trong V2 archive nhưng không được migrate sang Next. `docs/MIGRATION_AUDIT.md` yêu cầu `public/fonts/1FTV-Ortland.ttf`, trong khi media README cũ lại cấm commit font binary. | Đã sửa tài liệu để phản ánh đúng root cause. Cần recover font + kiểm tra license + tích hợp webfont đúng cách. | FONT ASSET PENDING |
| P0-02 | Mobile | Chưa có bằng chứng trực quan 390×844 sau batch QA. | Kiểm tra full homepage, menu, Hero CTA, Shop 2 cột, Spotlight, Place, Build, Brand Close, Footer. | PENDING VISUAL VERIFY |
| P0-03 | Cuối trang | Brand Close + Footer chưa được nhìn trọn sau batch mới nhất. | Review crop, seam, footer rhythm trên Preview. | PENDING VISUAL VERIFY |
| P0-04 | Deploy | HEAD mới nhất phải build/deploy thành công trên Vercel. | HEAD `543be7f597ac93c86630657e937a97fa0cec91a8` đã Vercel `success`. | PASS |
| P0-05 | User-facing controls | Search vẫn là button không có handler. PDP/Cart/Studio trước đây lộ implementation copy. | PDP/Cart/Studio đã đổi sang user-facing placeholder. Search vẫn phải làm thật hoặc ẩn khỏi sign-off build. | SEARCH OPEN |
| P0-06 | CSS source of truth | `globals.css` + `v3-migration.css` + `final-polish.css` đang override chồng nhau. | Consolidate sau visual PASS nhưng trước merge; không tạo thêm CSS fix layer. | OPEN |

### Course submission gate riêng

Repo hiện có 6 SKU. Tài liệu học phần yêu cầu website có tối thiểu 10 sản phẩm đầy đủ tên, mô tả, giá và hình ảnh trước Buổi 3. Đây không chặn việc QA 6 SKU của migration, nhưng **chặn trạng thái “sẵn sàng nộp môn”** cho tới khi có ít nhất 10 sản phẩm.

## P1 — Visual / UX / engineering polish

| ID | Khu vực | Phát hiện | Hướng sửa | Trạng thái |
|---|---|---|---|---|
| P1-01 | Compact Header | Header cũ chuyển compact ở 72% viewport, trước khi Hero kết thúc. | Đã đổi sang boundary thật của `.nk-hero` với fallback theo viewport. | CODE FIXED / VISUAL VERIFY PENDING |
| P1-02 | Featured Nooks | Khoảng trống nâu sau 2 product card khá dài. | Đã giảm bottom padding và min-height phần thông tin card. | CODE FIXED / VISUAL VERIFY PENDING |
| P1-03 | Shop Grid | Tên sản phẩm dài làm title/price thiếu nhịp đều. | Đã khóa min-height title row desktop và reset ở mobile. | CODE FIXED / VISUAL VERIFY PENDING |
| P1-04 | Product Spotlight | CTA `Thêm vào giỏ` disabled nhìn như chức năng lỗi. | Đã thay bằng CTA sang PDP và link về collection. | FIXED |
| P1-05 | Build Experience | Header → grid hơi giãn. | Đã giảm spacing. | CODE FIXED / VISUAL VERIFY PENDING |
| P1-06 | Typography identity | Be Vietnam Pro hiện chỉ là fallback; chưa phải typography Brand final. | Recover Ortland rồi review lại line-break/line-height desktop/mobile. | BLOCKED BY FONT ASSET |
| P1-07 | Spotlight controls | Dot hit target nhỏ. | Đã tăng hit target lên 28×28px, visual dot giữ 7px. | FIXED |
| P1-08 | Editorial assets | `real-hoi-an.webp` trùng binary với `brand-close.webp`; `real-ha-noi.webp` trùng `hero-mobile.webp`. | Thay asset đúng hoặc xác nhận chủ đích reuse. | OPEN |
| P1-09 | PDP navigation | `/product/*` trước đây không active mục Sản phẩm. | Đã map `/product/*` vào active state của Sản phẩm. | FIXED |
| P1-10 | Image performance | Toàn site dùng raw `<img>`; Hero chưa dùng Next image optimization. | Ưu tiên Hero/above-the-fold trước, sau đó Shop/PDP. | OPEN |
| P1-11 | Font loading | Poppins/Inter/Be Vietnam Pro đang load qua Google Fonts `@import`. | Chuyển sang `next/font/google` hoặc self-hosted pipeline. | OPEN |
| P1-12 | Build reproducibility | Không có package lockfile, dependency dùng caret ranges. | Chọn package manager, generate + commit lockfile. | OPEN |
| P1-13 | Accessibility | Zoom modal chưa focus trap/return focus; chưa có skip link. | Bổ sung và test keyboard thật. | OPEN |
| P1-14 | Analytics | Có `track()` boundary nhưng homepage component chưa instrument event. | Nối event khi tới phase GA4/GTM. | DEFERRED AFTER FRONTEND |

## Desktop 1440×900

- [x] Header overlay readable on Hero trong screenshot bàn giao
- [x] Wordmark viewport-centered trong screenshot bàn giao
- [x] Hero title, copy và CTA nằm trong safe zone
- [x] Featured Nooks có đúng 2 flagship products
- [x] Shop grid 3 cột và đủ 6 sản phẩm migration hiện tại
- [x] Region filter logic có state + useMemo
- [x] Spotlight arrows/dots/zoom + Escape handler có trong code
- [x] Place Selector đổi active product, visual, label và CTA trong code
- [x] Build Experience đổi đủ 3 step trong code
- [x] Real Nooks có editorial hierarchy ở phần nhìn thấy
- [ ] Review lại compact Header sau boundary fix
- [ ] Review lại Featured/Shop/Build spacing sau polish
- [ ] Brand Close + Footer không có visual seam

## Mobile 390×844 — static responsive audit

- [x] Header chuyển menu mobile ở breakpoint 800px
- [x] Hero có asset riêng `/media/editorial/hero-mobile.webp`
- [x] Hero copy chuyển xuống lower safe zone và CTA có mobile sizing
- [x] Featured về 1 cột
- [x] Shop giữ 2 cột ở <=520px; facts ẩn để giảm quá tải card
- [x] Spotlight stack ảnh trước nội dung
- [x] Place selector về 1 cột; option min-height 56px
- [x] Build về 1 cột; step min-height 145px
- [x] Real Nooks về 1 cột
- [x] Footer links giữ 2 cột
- [ ] Screenshot/Preview thật ở 390×844
- [ ] Không horizontal scroll thật ở 390px
- [ ] Brand Close crop hợp lý
- [ ] Menu mở không che/cắt item

## Interaction QA — code review

- [x] Header compact state theo Hero boundary + pathname
- [x] Mobile menu toggle và tự đóng khi route đổi
- [x] Product routes active mục Sản phẩm
- [x] Region filters dùng state + `useMemo`, không reload trang
- [x] Spotlight dots, arrows, modal zoom, overlay close, Escape close
- [x] Place Selector đổi active item và CTA
- [x] Build Experience đổi hình/nội dung theo 3 bước
- [x] `:focus-visible` có global treatment
- [x] `prefers-reduced-motion` tắt decorative motion
- [x] Logo có fallback nếu asset lỗi
- [ ] Search control có outcome thật
- [ ] Focus order + keyboard traversal live
- [ ] Touch interaction live mobile

## Merge decision

**NO MERGE YET.**

Bắt buộc trước Ready for Review:
1. Resolve Ortland delivery/integration hoặc có quyết định Brand rõ về fallback cho milestone này.
2. Search không còn dead control.
3. 390×844 live visual PASS.
4. Brand Close + Footer live visual PASS.
5. Consolidate CSS đủ để source of truth rõ trước merge.
6. Vercel HEAD cuối cùng PASS.

Course gate trước submission:
7. Có >=10 sản phẩm đầy đủ.
8. Cart/checkout/account đạt outcome yêu cầu của môn.
9. GA4 + Search Console có thể nối trên URL cuối.

## Ngoài phạm vi frontend migration hiện tại nhưng không được quên

- Real cart persistence
- Checkout/payment
- Supabase
- Inventory/order management
- Auth/account
- GA4/GTM destination configuration
- Search Console verification
- Studio configurator thật
- Room Preview
- Production domain
