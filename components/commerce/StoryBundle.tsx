import { formatVnd } from "@/data/products";
import styles from "./StoryBundle.module.css";

interface StoryBundleProps {
  currentName: string;
}

export function StoryBundle({ currentName }: StoryBundleProps) {
  return (
    <section aria-label="Story Bundle" className={styles.bundle}>
      <p className={styles.eyebrow}>Hoàn thiện câu chuyện này</p>
      <h3 className={styles.title}>Dấu Chân Miền Trung</h3>
      <p>Kết hợp {currentName} cùng Huế để lưu giữ trọn vẹn một vùng ký ức.</p>
      <div className={styles.price}>
        <span>1.828.000₫</span>
        <strong>{formatVnd(1699000)}</strong>
      </div>
      <p>Tiết kiệm 129.000₫ khi mua combo.</p>
      <button type="button" className={styles.button}>Thêm combo vào giỏ</button>
    </section>
  );
}
