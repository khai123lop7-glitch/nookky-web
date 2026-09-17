"use client";

import { formatVnd } from "@/data/products";
import { useCart } from "./CartProvider";
import styles from "./PromotionBar.module.css";

const GOAL_FREESHIP = 1000000;
const GOAL_GIFT = 1500000;

export function PromotionBar() {
  const { subtotal } = useCart();

  const percentage = Math.min(100, Math.max(0, Math.round((subtotal / GOAL_GIFT) * 100)));
  const hasFreeship = subtotal >= GOAL_FREESHIP;
  const hasGift = subtotal >= GOAL_GIFT;

  return (
    <div className={styles.barContainer} role="region" aria-label="Tiến độ ưu đãi">
      <div className={styles.barHeader}>
        <p className={styles.barMessage}>
          {hasGift ? (
            <>🎉 <strong>Chúc mừng!</strong> Đơn hàng đã đạt Freeship & Quà tặng bộ dụng cụ Nook Ký</>
          ) : hasFreeship ? (
            <>
              🚚 Đã đạt <strong>Freeship</strong>! Thêm{" "}
              <strong>{formatVnd(GOAL_GIFT - subtotal)}</strong> để nhận 🎁 <strong>Bộ dụng cụ lắp ráp</strong>
            </>
          ) : (
            <>
              🚚 Thêm <strong>{formatVnd(GOAL_FREESHIP - subtotal)}</strong> để được{" "}
              <strong>Miễn phí vận chuyển toàn quốc</strong>
            </>
          )}
        </p>
      </div>

      <div className={styles.progressTrack} aria-hidden="true">
        <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
      </div>

      <div className={styles.milestones}>
        <span className={`${styles.milestoneItem} ${hasFreeship ? styles.milestoneActive : ""}`}>
          {hasFreeship ? <span className={styles.checkBadge}>✓</span> : "⚪"}{" "}
          1.000.000₫: Miễn phí vận chuyển
        </span>
        <span className={`${styles.milestoneItem} ${hasGift ? styles.milestoneActive : ""}`}>
          {hasGift ? <span className={styles.checkBadge}>✓</span> : "⚪"}{" "}
          1.500.000₫: Tặng bộ nhíp & keo chuyên dụng
        </span>
      </div>
    </div>
  );
}
