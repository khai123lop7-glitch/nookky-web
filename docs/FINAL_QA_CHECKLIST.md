# Nook Ký — Homepage QA Backlog

Nguồn review: bộ screenshot desktop người dùng bàn giao ngày 06/09/2026 + code hiện tại trên `migration/v3-2-next`.

Nguyên tắc sign-off:
- Không merge PR #1 khi còn P0 mở.
- P1 có thể sửa theo batch nhưng phải review lại trên Vercel Preview sau mỗi batch.
- Desktop bắt buộc: 1440×900.
- Mobile bắt buộc: 390×844.

## P0 — Release blockers

| ID | Khu vực | Phát hiện | Tác động | Hành động | Trạng thái |
|---|---|---|---|---|---|
| P0-01 | Typography | `final-polish.css` đang gọi `NookOrtland` nhưng repo chưa có `public/fonts/1FTV-Ortland.ttf`. | Trình duyệt phải fallback, tạo dependency lỗi và typography chưa thật sự được khóa. | Tạm dùng fallback có chủ đích cho tới khi font asset được đưa vào repo. | IN PROGRESS |
| P0-02 | Mobile | Bộ ảnh bàn giao hiện chỉ đủ để review desktop; chưa có bằng chứng 390×844. | Không thể sign-off responsive dù CSS đã có breakpoint. | Chụp/kiểm tra toàn homepage ở 390×844, đặc biệt header, Hero CTA, grid 2 cột, Spotlight, Place, Build, Footer. | PENDING VISUAL VERIFY |
| P0-03 | Cuối trang | Brand Close + Footer có trong code nhưng không xuất hiện trọn vẹn trong bộ screenshot bàn giao. | Chưa xác nhận được seam, crop ảnh và chiều cao cuối trang. | Review trực tiếp phần cuối homepage trên Preview sau batch sửa. | PENDING VISUAL VERIFY |
| P0-04 | Deploy | Mọi thay đổi QA phải build/deploy thành công trên Vercel trước sign-off. | Có thể pass local/code review nhưng fail production preview. | Kiểm tra Vercel status ở HEAD mới nhất. | VERIFY AFTER EACH BATCH |

### P0 đã quan sát là PASS trên desktop screenshot

- Không thấy broken image ở Hero, Featured, Shop, Spotlight, Place, Build, Real Nooks.
- Không thấy horizontal overflow ở viewport desktop.
- Header không che headline/CTA trong Hero.
- Shop hiển thị đủ 6 SKU và giá sale đúng cấu trúc.
- Spotlight có gallery/zoom UI và panel nội dung rõ ràng.
- Place Selector và Build Experience giữ đúng cấu trúc 2 cột desktop.

## P1 — Visual / UX polish

| ID | Khu vực | Phát hiện từ screenshot | Hướng sửa | Trạng thái |
|---|---|---|---|---|
| P1-01 | Compact Header | Header sau scroll vẫn chiếm khoảng 100px+ do main + nav hai tầng, làm giảm diện tích nội dung hữu dụng. | Giảm chiều cao compact main/nav, thu nhẹ wordmark và khoảng cách nav nhưng giữ layout 2 tầng. | OPEN |
| P1-02 | Featured Nooks | Khoảng trống nâu sau 2 product card khá dài, làm nhịp chuyển sang Shop bị chậm. | Giảm bottom padding và min-height phần thông tin card ở desktop. | OPEN |
| P1-03 | Shop Grid | Tên sản phẩm có độ dài khác nhau, đặc biệt “Sông Vừa Thức Giấc”, làm hàng title/price thiếu nhịp đều. | Khóa min-height hợp lý cho title row desktop, reset ở mobile. | OPEN |
| P1-04 | Product Spotlight | Primary CTA “Thêm vào giỏ” đang disabled nên nhìn như chức năng lỗi trong preview dù commerce chưa thuộc phase này. | Tạm dùng CTA hoạt động sang PDP; khi commerce nối thật sẽ đổi lại Add to cart. | OPEN |
| P1-05 | Build Experience | Phần header có nhiều khoảng trắng, ảnh/step bắt đầu hơi xa headline nên cảm giác quá trình lắp ráp bị rời. | Giảm top spacing và khoảng cách header → grid, giữ nguyên kiến trúc. | OPEN |
| P1-06 | Typography identity | Fallback sans hiện rõ, tổng thể sạch nhưng chưa đủ đặc trưng Nook Ký. | Không giả lập font. Chờ Ortland thật rồi review line-break/cỡ chữ lại. | BLOCKED BY FONT ASSET |
| P1-07 | Spotlight controls | Dot điều hướng có visual nhỏ, hit target chưa lý tưởng. | Tăng vùng bấm nhưng giữ dot hiển thị nhỏ. | OPEN |
| P1-08 | Section transition | Cần kiểm tra nhịp Cream → Spotlight white → Place beige → Build cream → Real dark → Brand Close. | Review sau batch spacing để tránh seam hoặc đoạn quá dài. | PENDING VISUAL VERIFY |

## Checklist Desktop 1440×900

- [x] Header overlay readable on Hero
- [x] Wordmark remains viewport-centered trong screenshot
- [x] Hero title, copy và CTA nằm trong safe zone
- [x] Featured Nooks có đúng 2 flagship products
- [x] Shop grid 3 cột và đủ 6 sản phẩm
- [ ] Region filters thao tác thật không gây layout break
- [ ] Spotlight arrows, dots và zoom thao tác thật
- [x] Spotlight commerce panel đọc rõ trong screenshot
- [ ] Place Selector đổi visual, label và CTA khi thao tác
- [ ] Build Experience đổi đủ 3 step khi thao tác
- [x] Real Nooks có editorial hierarchy ở phần nhìn thấy
- [ ] Brand Close + Footer hoàn tất trang không có layout seam

## Checklist Mobile 390×844

- [ ] Header/menu không horizontal overflow
- [ ] Hero dùng portrait asset và copy ở lower safe zone
- [ ] CTA Hero hiển thị trọn vẹn
- [ ] Featured về 1 cột
- [ ] Shop giữ 2 cột, tên/giá đọc được
- [ ] Spotlight stack ảnh trước nội dung
- [ ] Place options không bị clip
- [ ] Build steps đủ vùng bấm
- [ ] Real Nooks về 1 cột
- [ ] Brand Close crop hợp lý
- [ ] Footer links đọc được

## Accessibility / resilience

- [x] Có `:focus-visible`
- [x] Escape đóng product zoom trong code
- [x] Có reduced-motion fallback
- [x] Logo có fallback nếu asset lỗi
- [ ] Xác nhận focus order trên Preview
- [ ] Xác nhận không horizontal scroll ở 390px

## Ngoài phạm vi sign-off frontend migration

- Search backend
- Cart persistence
- Checkout/payment
- Supabase
- GA4/GTM destination configuration
- Inventory
- Auth/account
