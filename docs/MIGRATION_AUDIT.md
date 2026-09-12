# Nook Ký — Migration Audit

## Trạng thái nguồn

Có hai nguồn đang được dùng song song:

1. **Theme V3.2 Clone-Derived Master Design**: đây là nguồn đáng tin cho UI hiện tại, component structure, copy, interaction và curated assets.
2. **Simply Static export mới**: hữu ích để inventory URL/assets, nhưng nội dung HTML đang phản ánh một state cũ hơn của site.

## Phát hiện quan trọng về Simply Static export

Bản export mới có khoảng 4.120 files, ~124 MB và chứa đủ route chính như `/`, `/shop/`, `/bo-suu-tap/`, `/build-your-nook/`, `/ve-nook-ky/`, 6 product routes, cart, checkout, account.

Tuy nhiên HTML homepage trong export vẫn có dấu vết V2.2, ví dụ H1 `Những góc Việt Nam, thu nhỏ để ở lại.` thay vì Hero V3.2 `Giữ lại một góc Việt Nam.`. Một số Shop/Product/Cart page cũng xuất ra placeholder `Great things are on the horizon`.

**Kết luận:** không dùng Simply Static HTML làm source of truth cho visual. Dùng nó để:

- inventory route;
- inventory asset;
- kiểm tra URL legacy;
- đối chiếu content tĩnh khi cần.

UI source of truth cho migration là V3.2 theme + screenshot QA đã duyệt.

## Những gì đã port sang branch `migration/v3-2-next`

- Canonical product data 6 SKU.
- Header với overlay → compact state.
- Hero.
- Featured Nooks.
- Shop All + filter client-side.
- Product Spotlight + gallery + zoom shell.
- Choose Your Place interaction.
- Build Experience interaction.
- Real Nooks.
- Brand Close.
- Design tokens và responsive foundation.

## Chưa nối ở phase này

- Commerce backend thật.
- Add to cart thật.
- Checkout/payment.
- Account/auth.
- Inventory/order management.
- Supabase.
- GA4/GTM event layer.
- Studio configurator thật.
- Room Preview thật.

## Asset migration cần làm ngay tiếp theo

Copy curated V3.2 assets vào Next.js `public/`:

- `public/fonts/1FTV-Ortland.ttf`
- `public/media/brand/*`
- `public/media/editorial/*`
- `public/media/products/<slug>/{cover,detail,lifestyle}.webp`

Không import toàn bộ 124 MB export vào repo. Chỉ mang asset đang dùng production để repo nhẹ và dễ maintain.

## Acceptance Gate cho migration frontend

Chỉ merge vào `main` khi:

1. Vercel Preview build PASS.
2. 1440px composition gần V3.2 screenshot.
3. 390px không overflow và hierarchy đúng.
4. Header/Hero/filters/gallery/place/build interactions hoạt động.
5. Không có link WordPress localhost.
6. Không có PHP/WooCommerce runtime dependency.
7. Không commit secrets.
