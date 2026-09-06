# Branch Sync Note

Branch QA hiện tại: `migration/v3-2-next`.

Deep audit: `docs/DEEP_QA_AUDIT_2026-09-06.md`.
Homepage backlog: `docs/FINAL_QA_CHECKLIST.md`.

Merge status: **NO MERGE YET**.

Các blocker còn mở:
- Ortland chưa được recover/tích hợp vào Next.js.
- Search vẫn là dead control.
- Chưa visual verify 390×844 sau batch mới nhất.
- Chưa visual verify Brand Close → Footer.
- CSS vẫn còn 3 lớp override cần consolidate trước merge.
- Course submission còn thiếu tối thiểu 4 sản phẩm để đạt yêu cầu >=10 SKU.

Các fix deep QA đã commit:
- Header compact theo boundary thật của Hero.
- PDP route active mục Sản phẩm.
- PDP/Cart/Studio bỏ development-facing copy.
- Media README được sửa để giải thích đúng font pipeline/licensing.
