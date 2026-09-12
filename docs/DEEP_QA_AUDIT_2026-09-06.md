# Nook Ký — Deep QA Audit 06/09/2026

Phạm vi: branch `migration/v3-2-next`, homepage + các route người dùng có thể đi tới từ homepage, asset integrity, typography, responsive foundation, accessibility, performance, course-readiness và merge gate.

## Kết luận ngắn

Vercel build PASS nhưng branch **chưa đủ điều kiện merge**. Visual desktop đã đi đúng hướng, tuy nhiên deep QA phát hiện các vấn đề nghiêm trọng hơn lớp spacing/typography ban đầu:

1. Ortland không bị “quên” ở phía Brand. Font đã tồn tại trong WordPress V2 archive trước đây, nhưng bị rơi khỏi migration pipeline.
2. Tài liệu migration từng tự mâu thuẫn về font: `docs/MIGRATION_AUDIT.md` yêu cầu copy `public/fonts/1FTV-Ortland.ttf`, trong khi `public/media/README.md` cũ lại ghi `Do not commit font files`. README đã được sửa để phản ánh đúng root cause và licensing gate.
3. Repo hiện có ba lớp CSS `globals.css` → `v3-migration.css` → `final-polish.css`, trái với nguyên tắc đã chốt là không tiếp tục tạo CSS override layer. Cần consolidation trước merge.
4. Development copy ở PDP/Cart/Studio đã được thay bằng user-facing placeholder. Search button vẫn là dead control và chưa thể sign-off.
5. Course-readiness chưa đạt: source học phần yêu cầu tối thiểu 10 sản phẩm, repo hiện mới có 6 SKU canonical.
6. Editorial asset pack có file trùng binary dưới tên khác: `real-hoi-an.webp` trùng `brand-close.webp`; `real-ha-noi.webp` trùng `hero-mobile.webp`.
7. Mobile 390×844 và Brand Close → Footer vẫn chưa có live visual evidence sau batch sửa.

---

## P0 — Blockers trước merge

### P0-01 — Ortland migration pipeline bị gãy

**Evidence**
- Brand đã chốt display font: `1FTV Ortland Regular`.
- WordPress V2 handoff trước đây ghi font nằm trong `assets/fonts/1FTV-Ortland.ttf` của theme archive.
- `docs/MIGRATION_AUDIT.md` hiện vẫn yêu cầu copy sang `public/fonts/1FTV-Ortland.ttf`.
- Branch hiện tại không có `public/fonts/`.
- Media-only pipeline trước đây đã loại font ra khỏi pack.

**Root cause**
Asset migration pack được thiết kế theo kiểu “media only”, còn font bị loại ra bởi một rule bảo vệ binary/licensing. Sau đó CSS migration vẫn giả định font sẽ xuất hiện ở `/fonts/1FTV-Ortland.ttf`. Đây là lỗi pipeline/documentation, không phải Brand chưa cung cấp font.

**Đã làm**
- Sửa `public/media/README.md` để bỏ mâu thuẫn và ghi rõ Ortland là Brand asset bắt buộc nhưng phải đi qua licensing/webfont gate phù hợp với public repo.

**Còn phải làm**
- Recover đúng file Ortland từ V2 archive hoặc nguồn Brand.
- Kiểm tra quyền sử dụng webfont trước khi đưa vào public deployment vì repo hiện là public.
- Sau khi asset hợp lệ, ưu tiên tích hợp bằng `next/font/local` hoặc một self-hosted webfont pipeline rõ ràng.
- Review lại toàn bộ line-break/line-height desktop + mobile sau khi font thật hoạt động.

### P0-02 — Dead / development-facing UI

**Đã sửa**
- PDP không còn copy “nối commerce ở phase sau”; thay bằng trạng thái user-facing.
- Cart không còn mô tả Commerce Adapter/backend.
- Studio không còn “Frontend foundation · chưa nối data/commerce”.

**Còn mở**
- Header Search vẫn là button không có handler; `title` còn mang ngôn ngữ implementation.

**Required fix**
Search phải được làm thật hoặc ẩn khỏi sign-off build. Không giữ một control nhìn như hoạt động nhưng click không có outcome.

### P0-03 — Course requirement: 6 SKU chưa đủ 10 sản phẩm

`data/products.ts` hiện chỉ có 6 SKU canonical.

Tài liệu học phần yêu cầu trước Buổi 3: website có **tối thiểu 10 sản phẩm** với tên, mô tả, giá và hình ảnh đầy đủ.

**Required fix**
Tách hai gate:
- Frontend migration gate: có thể QA với 6 SKU.
- Course submission gate: bắt buộc bổ sung ít nhất 4 sản phẩm hợp lệ trước khi coi project sẵn sàng nộp/đi tiếp đúng yêu cầu môn.

Không cần quay lại WordPress chỉ vì gap này, nhưng outcome cuối vẫn phải đáp ứng yêu cầu bài học.

### P0-04 — Live responsive evidence còn thiếu

Static CSS audit cho thấy breakpoint đã có, nhưng chưa đủ để ký PASS.

Bắt buộc chụp/kiểm tra live:
- 1440×900 full homepage sau batch mới nhất.
- 390×844 full homepage.
- Brand Close → Footer.
- Header overlay và compact.
- Menu mobile mở.
- Spotlight zoom.
- Place Selector active state.
- Build step active state.

### P0-05 — CSS architecture chưa được cleanup trước merge

`app/layout.tsx` đang import:
1. `globals.css`
2. `v3-migration.css`
3. `final-polish.css`

Tổng ba file khoảng 59 KB source CSS trước minification và có nhiều selector cùng component bị override nhiều lớp.

**Risk**
- khó biết rule nào là source of truth;
- regression khi sửa responsive;
- font token bị khai báo ở nhiều nơi;
- tiếp tục tạo “fix layer” sẽ làm maintenance tệ nhanh.

**Required fix**
Sau khi visual PASS, merge các rule đang được chấp nhận vào một design/migration layer rõ ràng, xóa stale rule cũ và giữ `final-polish.css` không còn là lớp vá vĩnh viễn.

---

## P1 — Cần sửa trước production-ready

### P1-01 — Editorial asset duplication

Tree hiện tại cho thấy:
- `public/media/editorial/real-hoi-an.webp` và `brand-close.webp` cùng blob SHA.
- `public/media/editorial/real-ha-noi.webp` và `hero-mobile.webp` cùng blob SHA.

Điều này làm Real Nooks không có đủ bốn visual context độc lập như tên file gợi ý.

**Fix**: thay bằng asset đúng cho từng ngữ cảnh hoặc đổi content strategy nếu chủ đích là reuse.

### P1-02 — Header compact boundary

**Phát hiện**
Header home trước đây chuyển compact ở `72%` viewport dù Hero cao `100svh`, nên compact state có thể xuất hiện trước khi Hero kết thúc.

**Đã sửa**
Header hiện đọc boundary thật của `.nk-hero` và chuyển state khi bottom Hero chạm vùng header; có fallback theo viewport nếu selector không tồn tại.

**Còn phải làm**
Visual verify trên Preview ở 1440×900 và 390×844.

### P1-03 — PDP nav active state

**Đã sửa**
Route `/product/*` hiện được map vào active state của mục `Sản phẩm`.

### P1-04 — Toàn site đang dùng `<img>` thay vì Next image pipeline

Hero, product cards, PDP, editorial đều đang dùng raw `<img>`.

**Tác động**
- bỏ qua resize/format optimization tự động của Next;
- thiếu responsive `sizes` chuẩn;
- LCP/cost trên mobile khó kiểm soát hơn;
- hero desktop hiện ~340 KB JPG, mobile ~172 KB WebP.

Không cần đổi mọi ảnh ngay, nhưng Hero + above-the-fold nên là ưu tiên đầu.

### P1-05 — Google Fonts load qua CSS `@import`

`v3-migration.css` gọi Be Vietnam Pro, Inter, Poppins qua Google Fonts `@import`.

**Risk**
- external render dependency;
- có thể FOUT/font swap;
- khó khóa performance và consistency.

**Fix**: chuyển UI/body font sang `next/font/google` hoặc self-hosted webfont phù hợp.

### P1-06 — Build reproducibility chưa khóa

Repo không có `package-lock.json`, `pnpm-lock.yaml` hoặc `yarn.lock`. `package.json` dùng range như `next: ^16.0.0`, `react: ^19.0.0`.

Vercel PASS hôm nay không đảm bảo dependency resolution giống hệt trong build tương lai.

**Fix**: chọn package manager, generate lockfile, commit lockfile, sau đó dùng install mode tương ứng trong CI/Vercel.

### P1-07 — Accessibility còn thiếu ở modal và page navigation

Đã có `:focus-visible`, Escape close và reduced motion. Tuy nhiên:
- Zoom modal chưa focus trap.
- Chưa return focus về trigger sau close.
- Chưa có skip link tới main content.
- Chưa live keyboard traversal QA.

### P1-08 — Analytics boundary tồn tại nhưng UI chưa instrument

`lib/analytics.ts` đã tạo `track()` và event taxonomy, nhưng các component homepage hiện chưa gọi `track()`.

Khi nối GTM/GA4, dataLayer sẽ tồn tại nhưng các interaction quan trọng vẫn không tự phát event nếu không instrument component.

### P1-09 — Product hover image gây tải thêm

Shop render đồng thời cover + detail cho mỗi card. Dù `loading="lazy"`, khi grid vào vùng gần viewport browser có thể tải cả ảnh hover.

Với 6 card, đây là thêm 6 ảnh chỉ để phục vụ hover. Cần đo network thật trước khi production.

---

## P2 — Sau frontend merge nhưng trước production/public launch

- Metadata per route/product.
- Open Graph / social share image.
- sitemap/robots/canonical.
- Product structured data.
- GA4/GTM destination configuration.
- Search Console verification.
- Performance budget + Lighthouse/Core Web Vitals.
- Error boundary / not-found styling.
- Automated interaction smoke test bằng Playwright/Cypress hoặc tương đương.
- Real cart/account/checkout/payment flow.
- Domain production.

---

## Merge decision hiện tại

**NO MERGE.**

Vercel build PASS chỉ xác nhận code build/deploy được. Nó chưa chứng minh:
- typography đúng Brand;
- mobile visual đúng;
- Search có outcome;
- asset pack đúng nội dung;
- course requirement đạt;
- CSS architecture đủ sạch để làm baseline mới.

### Gate để chuyển PR #1 sang Ready for Review

Bắt buộc PASS:
1. Ortland pipeline có quyết định rõ và font thật được recover/tích hợp hoặc Brand chốt fallback cho milestone.
2. Search không còn dead control.
3. 390×844 live visual PASS.
4. Brand Close + Footer live visual PASS.
5. CSS consolidation đủ để source of truth rõ trước merge.
6. Vercel HEAD cuối cùng PASS.

Course gate bổ sung trước submission:
7. Có >=10 sản phẩm đầy đủ.
8. Cart/checkout/account outcome đáp ứng bài học tương ứng.
9. GA4 + Search Console có thể nối trên URL cuối.
