# Nook Ký — Homepage QA Backlog

Nguồn review: bộ screenshot desktop người dùng bàn giao ngày 06/09/2026 + code hiện tại trên `migration/v3-2-next` + deep static audit toàn branch.

Nguyên tắc sign-off:
- Không merge PR #1 khi còn P0 mở.
- Vercel build PASS chỉ là một gate kỹ thuật, không thay thế visual/functional QA.
- Desktop bắt buộc: 1440×900.
- Mobile bắt buộc: 390×844.
- Ortland được **tách khỏi merge gate hiện tại theo quyết định của owner**. Typography final sẽ QA riêng khi font asset được tích hợp.
- Deep audit gốc: `docs/DEEP_QA_AUDIT_2026-09-06.md`.

## P0 — Release blockers hiện tại, không tính font

| ID | Khu vực | Phát hiện | Hành động | Trạng thái |
|---|---|---|---|---|
| P0-01 | Mobile | Chưa có bằng chứng trực quan 390×844 sau batch deep QA mới nhất. | Kiểm tra full homepage, menu, Hero CTA, Shop 2 cột, Spotlight, Place, Build, Brand Close, Footer. | PENDING VISUAL VERIFY |
| P0-02 | Cuối trang | Brand Close + Footer chưa được nhìn trọn sau batch mới nhất. | Review crop, seam, footer rhythm trên Preview. | PENDING VISUAL VERIFY |
| P0-03 | Deploy | HEAD cuối cùng phải build/deploy thành công trên Vercel. | Code HEAD `7a62710d3bfe776e8a707cbcad32977c92a8f040` đã PASS. Mọi commit tiếp theo vẫn phải re-check. | PASS / REVERIFY LATEST HEAD |
| P0-04 | CSS source of truth | `globals.css` + `v3-migration.css` + `final-polish.css` đang override chồng nhau. | Consolidate sau visual PASS nhưng trước merge; không tạo thêm CSS fix layer. | OPEN |

### Đã gỡ khỏi P0 sau deep QA

- Search dead control: **đã gỡ khỏi Header**.
- PDP disabled purchase control: **đã bỏ**, CTA hiện dẫn về bộ sưu tập cho tới khi commerce thật được nối.
- Cart/Studio development-facing copy: **đã làm sạch**.
- Header compact boundary: **đã sửa theo boundary thật của Hero**.
- PDP nav active state: **đã sửa cho `/product/*`**.

### Typography deferred

Ortland vẫn chưa được tích hợp vào Next.js, nhưng theo chỉ đạo hiện tại nó **không chặn batch frontend merge gate này**. Khi font thật được đưa vào, cần mở một QA riêng cho line-break, line-height, Vietnamese glyph và hierarchy desktop/mobile.

### Course submission gate riêng

Repo canonical hiện có 6 SKU. Tài liệu học phần yêu cầu website có tối thiểu 10 sản phẩm đầy đủ tên, mô tả, giá và hình ảnh trước Buổi 3. Đây không chặn việc QA migration 6 SKU, nhưng **chặn trạng thái “sẵn sàng nộp môn”** cho tới khi có ít nhất 10 sản phẩm từ data/asset được duyệt. Không tự bịa thêm 4 SKU.

## P1 — Visual / UX / engineering polish

| ID | Khu vực | Phát hiện | Hướng sửa | Trạng thái |
|---|---|---|---|---|
| P1-01 | Compact Header | Header cũ chuyển compact ở 72% viewport, trước khi Hero kết thúc. | Đã đổi sang boundary thật của `.nk-hero` với fallback theo viewport. | CODE FIXED / VISUAL VERIFY PENDING |
| P1-02 | Featured Nooks | Khoảng trống nâu sau 2 product card khá dài. | Đã giảm bottom padding và min-height phần thông tin card. | CODE FIXED / VISUAL VERIFY PENDING |
| P1-03 | Shop Grid | Tên sản phẩm dài làm title/price thiếu nhịp đều. | Đã khóa min-height title row desktop và reset ở mobile. | CODE FIXED / VISUAL VERIFY PENDING |
| P1-04 | Product Spotlight | CTA `Thêm vào giỏ` disabled nhìn như chức năng lỗi. | Đã thay bằng CTA sang PDP; PDP cũng không còn disabled purchase control. | FIXED |
| P1-05 | Build Experience | Header → grid hơi giãn. | Đã giảm spacing. | CODE FIXED / VISUAL VERIFY PENDING |
| P1-06 | Spotlight controls | Dot hit target nhỏ. | Đã tăng hit target lên 28×28px, visual dot giữ 7px. | FIXED |
| P1-07 | Editorial assets | Hai editorial file trước đây trùng binary dưới tên khác. | Real Nooks đã chuyển sang 4 canonical lifestyle assets riêng của sản phẩm. | FIXED |
| P1-08 | PDP navigation | `/product/*` trước đây không active mục Sản phẩm. | Đã map `/product/*` vào active state của Sản phẩm. | FIXED |
| P1-09 | Accessibility modal | Zoom modal trước đây chưa quản lý focus. | Đã focus nút đóng khi mở, giữ focus trong modal, Escape close và trả focus về trigger. | CODE FIXED / LIVE KEYBOARD VERIFY PENDING |
| P1-10 | Analytics interactions | Có `track()` boundary nhưng interaction chưa instrument. | Filter, Spotlight gallery/zoom, Place Selector và Build Experience đã gọi `track()`. | PARTIALLY FIXED |
| P1-11 | Product grid performance | Hover detail layer có thể làm tải thêm 6 ảnh chỉ để phục vụ hover. | Đã bỏ detail hover image; giữ cover + micro scale. | FIXED |
| P1-12 | Image loading | Nhiều ảnh không critical chưa khai báo decoding. | Đã thêm `decoding="async"` cho Featured, Shop, Spotlight, Place, Build, Real Nooks, Brand Close và ảnh PDP phù hợp. | PARTIALLY FIXED |
| P1-13 | Image pipeline | Toàn site vẫn chủ yếu dùng raw `<img>`; Hero chưa dùng Next image optimization. | Chuyển Hero/above-the-fold sang Next image pipeline sau khi visual baseline ổn định. | OPEN BEFORE PRODUCTION |
| P1-14 | Build reproducibility | Không có package lockfile, dependency dùng caret ranges. | Chọn package manager, generate + commit lockfile khi khóa environment production. | OPEN BEFORE PRODUCTION |
| P1-15 | Skip link / keyboard | Chưa có skip link và chưa live keyboard traversal toàn trang. | Bổ sung sau visual merge hoặc cùng accessibility pass cuối. | OPEN BEFORE PRODUCTION |

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
- [x] Real Nooks hiện dùng 4 lifestyle asset riêng
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
- [x] Spotlight modal focus management cơ bản
- [x] Place Selector đổi active item và CTA
- [x] Build Experience đổi hình/nội dung theo 3 bước
- [x] `:focus-visible` có global treatment
- [x] `prefers-reduced-motion` tắt decorative motion
- [x] Logo có fallback nếu asset lỗi
- [x] Search dead control đã gỡ
- [x] Interaction tracking đã nối vào analytics boundary cho filter/gallery/place/build
- [ ] Focus order + keyboard traversal live toàn trang
- [ ] Touch interaction live mobile

## Merge decision

**NO MERGE YET**, nhưng lý do hiện tại **không còn là font**.

Bắt buộc trước Ready for Review:
1. 390×844 live visual PASS.
2. Brand Close + Footer live visual PASS.
3. Review lại desktop sau Header/spacing deep QA fixes.
4. Consolidate CSS đủ để source of truth rõ trước merge.
5. Vercel HEAD cuối cùng PASS.

Course gate trước submission:
6. Có >=10 sản phẩm đầy đủ từ source được duyệt.
7. Cart/checkout/account đạt outcome yêu cầu của môn.
8. GA4 + Search Console có thể nối trên URL cuối.

## Ngoài phạm vi frontend migration hiện tại nhưng không được quên

- Ortland final typography QA
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
