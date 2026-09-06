# Nook Ký — Homepage QA Backlog

Nguồn review: bộ screenshot desktop người dùng bàn giao ngày 06/09/2026 + code hiện tại trên `migration/v3-2-next`.

Nguyên tắc sign-off:
- Không merge PR #1 khi còn P0 mở.
- P1 có thể sửa theo batch nhưng phải review lại trên Vercel Preview sau mỗi batch.
- Desktop bắt buộc: 1440×900.
- Mobile bắt buộc: 390×844.

## P0 — Release blockers

| ID | Khu vực | Phát hiện | Hành động | Trạng thái |
|---|---|---|---|---|
| P0-01 | Typography | Repo chưa có `public/fonts/1FTV-Ortland.ttf`. | Đã bỏ dependency vào font thiếu trong `final-polish.css` và dùng Be Vietnam Pro fallback có chủ đích. Khi có Ortland thật phải review line-break/cỡ chữ lại. | RESOLVED FOR FALLBACK / FINAL FONT PENDING |
| P0-02 | Mobile | Chưa có bằng chứng trực quan 390×844 sau batch QA. | Kiểm tra toàn homepage ở 390×844, đặc biệt header/menu, Hero CTA, Shop 2 cột, Spotlight, Place, Build, Brand Close, Footer. | PENDING VISUAL VERIFY |
| P0-03 | Cuối trang | Brand Close + Footer có trong code nhưng chưa được nhìn trọn trong bộ screenshot bàn giao. | Review trực tiếp phần cuối homepage trên Preview để xác nhận crop, seam và chiều cao. | PENDING VISUAL VERIFY |
| P0-04 | Deploy | HEAD sau batch QA phải build/deploy thành công trên Vercel. | Commit `6db8b9e71dd077bf198142d5be05335ba354aa68` đã có Vercel status `success`. | PASS |

### P0 đã quan sát là PASS trên desktop screenshot

- Không thấy broken image ở Hero, Featured, Shop, Spotlight, Place, Build, Real Nooks.
- Không thấy horizontal overflow ở viewport desktop.
- Header không che headline/CTA trong Hero.
- Shop hiển thị đủ 6 SKU và giá sale đúng cấu trúc.
- Spotlight có gallery/zoom UI và panel nội dung rõ ràng.
- Place Selector và Build Experience giữ đúng cấu trúc 2 cột desktop.

## P1 — Visual / UX polish

| ID | Khu vực | Phát hiện | Hướng sửa | Trạng thái |
|---|---|---|---|---|
| P1-01 | Compact Header | Header sau scroll chiếm nhiều diện tích do main + nav hai tầng. | Đã giảm chiều cao compact main/nav, thu wordmark và icon ở desktop. | CODE FIXED / VISUAL VERIFY PENDING |
| P1-02 | Featured Nooks | Khoảng trống nâu sau 2 product card khá dài. | Đã giảm bottom padding và min-height phần thông tin card. | CODE FIXED / VISUAL VERIFY PENDING |
| P1-03 | Shop Grid | Tên sản phẩm dài làm title/price thiếu nhịp đều. | Đã khóa min-height title row desktop và reset ở mobile. | CODE FIXED / VISUAL VERIFY PENDING |
| P1-04 | Product Spotlight | CTA `Thêm vào giỏ` disabled nhìn như chức năng lỗi trong preview. | Đã thay bằng CTA hoạt động sang PDP và link về toàn bộ bộ sưu tập. | FIXED |
| P1-05 | Build Experience | Header → grid hơi giãn. | Đã giảm top/bottom spacing và khoảng cách header → grid. | CODE FIXED / VISUAL VERIFY PENDING |
| P1-06 | Typography identity | Fallback sans chưa phải typography final của Nook Ký. | Không giả lập font. Chờ Ortland thật rồi review lại heading và line-break. | BLOCKED BY FONT ASSET |
| P1-07 | Spotlight controls | Dot điều hướng có hit target nhỏ. | Đã tăng vùng bấm lên 28×28px trong khi giữ dot hiển thị 7px. | FIXED |
| P1-08 | Section transition | Cần kiểm tra nhịp Cream → Spotlight white → Place beige → Build cream → Real dark → Brand Close. | Review sau batch spacing để tránh seam hoặc đoạn quá dài. | PENDING VISUAL VERIFY |

## Desktop 1440×900

- [x] Header overlay readable on Hero
- [x] Wordmark viewport-centered trong screenshot bàn giao
- [x] Hero title, copy và CTA nằm trong safe zone
- [x] Featured Nooks có đúng 2 flagship products
- [x] Shop grid 3 cột và đủ 6 sản phẩm
- [x] Region filter logic đổi danh sách theo `Region` trong code
- [x] Spotlight arrows/dots/zoom và Escape handler có trong code
- [x] Spotlight commerce panel đọc rõ trong screenshot
- [x] Place Selector đổi active product, visual, label và CTA trong code
- [x] Build Experience đổi đủ 3 step trong code
- [x] Real Nooks có editorial hierarchy ở phần nhìn thấy
- [ ] Brand Close + Footer không có visual seam trên Preview

## Mobile 390×844 — static responsive audit

- [x] Header chuyển menu mobile ở breakpoint 800px; nav top khớp 94px overlay / 64px compact
- [x] Hero có asset riêng `/media/editorial/hero-mobile.webp`
- [x] Hero copy chuyển xuống lower safe zone và CTA full-width tối đa 360px
- [x] Featured về 1 cột
- [x] Shop giữ 2 cột ở <=520px; facts ẩn để giảm quá tải card
- [x] Spotlight stack ảnh trước nội dung ở <=800px
- [x] Place selector về 1 cột; option min-height 56px
- [x] Build về 1 cột; step min-height 145px ở <=520px
- [x] Real Nooks về 1 cột ở <=520px
- [x] Footer links giữ 2 cột ở <=520px
- [ ] Xác nhận bằng screenshot/Preview thật ở 390×844
- [ ] Xác nhận không horizontal scroll thật ở 390px
- [ ] Xác nhận Brand Close crop hợp lý trên thiết bị thật

## Interaction QA — code review

- [x] Header compact state theo scroll + pathname
- [x] Mobile menu toggle và tự đóng khi route đổi
- [x] Region filters dùng state + `useMemo`, không reload trang
- [x] Spotlight dots, arrows, modal zoom, click overlay để đóng, Escape để đóng
- [x] Place Selector đổi active item và CTA theo sản phẩm đang chọn
- [x] Build Experience đổi hình và nội dung theo 3 bước
- [x] `:focus-visible` có global treatment
- [x] `prefers-reduced-motion` tắt decorative motion
- [x] Logo có fallback nếu asset lỗi
- [ ] Focus order và keyboard traversal cần chạy trên Preview thật
- [ ] Touch interaction cần xác nhận trên viewport mobile thật

## Merge decision

**NO MERGE YET.**

Lý do còn chặn sign-off:
1. Chưa visual verify 390×844.
2. Chưa visual verify Brand Close + Footer trọn vẹn sau batch QA.
3. Typography final vẫn chờ Ortland nếu Brand quyết định dùng font này.

PR #1 chỉ nên chuyển Ready for Review / merge sau khi P0-02 và P0-03 PASS. Nếu Ortland chưa sẵn sàng nhưng team chấp nhận fallback cho milestone này, P0-01 được xem là resolved theo fallback hiện tại.

## Ngoài phạm vi sign-off frontend migration

- Search backend
- Cart persistence
- Checkout/payment
- Supabase
- GA4/GTM destination configuration
- Inventory
- Auth/account
