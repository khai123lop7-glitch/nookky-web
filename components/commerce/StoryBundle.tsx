import { formatVnd } from "@/data/products";

interface StoryBundleProps {
  currentName: string;
}

export function StoryBundle({ currentName }: StoryBundleProps) {
  return (
    <section aria-label="Story Bundle" style={{ marginTop: 28, padding: 24, borderRadius: 24, background: "#f4eadb" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>Hoàn thiện câu chuyện này</p>
      <h3 style={{ margin: "12px 0" }}>Dấu Chân Miền Trung</h3>
      <p style={{ marginBottom: 16 }}>Kết hợp {currentName} cùng Huế để lưu giữ trọn vẹn một vùng ký ức.</p>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <span>1.828.000₫</span>
        <strong>{formatVnd(1699000)}</strong>
      </div>
      <p style={{ marginTop: 8 }}>Tiết kiệm 129.000₫ khi mua combo.</p>
      <button type="button">Thêm combo vào giỏ</button>
    </section>
  );
}
