# Nook Ký — QA State

Frontend foundation đã đủ để tiếp tục QA nhưng **chưa Ready for Review / chưa được merge**.

Vercel build đang được kiểm tra theo HEAD branch `migration/v3-2-next`.

Deep QA đã phát hiện thêm các blocker ngoài visual spacing:

- Ortland chưa được migrate/tích hợp dù font đã tồn tại trong V2 archive trước đây.
- Search vẫn là dead control.
- Chưa visual verify live mobile 390×844 sau batch mới nhất.
- Chưa visual verify Brand Close → Footer.
- CSS còn 3 lớp override cần consolidate trước merge.
- Editorial asset có duplicate binary dưới tên khác.
- Course submission còn thiếu sản phẩm để đạt yêu cầu >=10 SKU.

Xem:
- `docs/DEEP_QA_AUDIT_2026-09-06.md`
- `docs/FINAL_QA_CHECKLIST.md`
