# Branch Sync Note

Branch QA hiện tại: `migration/v3-2-next`.

Deep audit: `docs/DEEP_QA_AUDIT_2026-09-06.md`.
Homepage backlog: `docs/FINAL_QA_CHECKLIST.md`.

Merge status: **NO MERGE YET**.

Theo chỉ đạo hiện tại, Ortland được tách khỏi batch xử lý này. Font không chặn việc tiếp tục sửa các vấn đề còn lại; typography final sẽ sign-off riêng khi asset được tích hợp sau.

## Deep QA fixes đã hoàn tất

- Header compact theo boundary thật của Hero, không còn đổi state quá sớm.
- PDP route active mục Sản phẩm.
- Search dead control đã được gỡ khỏi Header.
- Fake cart count `0` đã được gỡ cho tới khi có cart state thật.
- Mobile menu có `aria-controls`, đóng bằng Escape và chuyển sang dark Brand assets khi menu mở trên nền sáng.
- Logo/wordmark fallback đã được sửa để fallback thực sự xuất hiện nếu asset load lỗi.
- PDP không còn disabled purchase control; CTA hiện quay về bộ sưu tập cho tới khi commerce thật được nối.
- Cart/Studio bỏ toàn bộ development-facing copy.
- Spotlight modal: Escape close, focus vào nút đóng khi mở, giữ focus trong modal và trả focus về trigger khi đóng.
- Product filter, product selection, Spotlight gallery/zoom, Place Selector và Build Experience đã gọi analytics boundary `track()`.
- Product Grid/Place/Build/Spotlight bổ sung `aria-pressed`/`aria-live` phù hợp và `decoding="async"` cho ảnh không critical.
- Real Nooks chuyển sang 4 lifestyle assets canonical của sản phẩm, không còn dùng hai editorial binary bị trùng dưới tên khác.
- Featured và Brand Close bổ sung async image decoding.
- Product hover detail image được **giữ lại có chủ đích** vì CSS hiện tại dùng crossfade cover → detail. Một thử nghiệm bỏ layer này đã được rollback sau khi phát hiện sẽ làm card trắng khi hover.
- Vercel PASS tại code HEAD `d716f755b94146f48f6f1572cd74b886c3f4914c`.

## Còn mở ngoài font

- Chưa visual verify live 390×844 sau batch mới nhất.
- Chưa visual verify Brand Close → Footer sau batch mới nhất.
- CSS vẫn có ba lớp `globals.css` → `v3-migration.css` → `final-polish.css`; chỉ consolidate sau khi visual PASS để tránh regression.
- Raw `<img>`/Google Fonts/lockfile là engineering debt trước production, không chặn visual QA hiện tại.
- Course submission vẫn cần tối thiểu 10 sản phẩm; repo canonical hiện có 6 SKU và không được tự bịa thêm 4 SKU khi chưa có data/asset được duyệt.
