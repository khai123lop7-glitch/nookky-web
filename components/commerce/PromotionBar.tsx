"use client";

import { formatVnd } from "@/data/products";
import { FREE_SHIPPING_THRESHOLD, GIFT_THRESHOLD } from "@/lib/promotions";
import { useCart } from "./CartProvider";
import styles from "./PromotionBar.module.css";

export function PromotionBar() {
  const { subtotal } = useCart();

  const percentage = Math.min(100, Math.max(0, Math.round((subtotal / GIFT_THRESHOLD) * 100)));
  const hasFreeship = subtotal >= FREE_SHIPPING_THRESHOLD;
  const hasGift = subtotal >= GIFT_THRESHOLD;

  return (
    <div className={styles.barContainer} role="region" aria-label="Tiến độ ưu đãi">
      <div className={styles.barHeader}>
        <p className={styles.barMessage}>
          {hasGift ? (
            <>🎉 <strong>Chúc mừng!</strong> Đơn hàng đã đạt Freeship & Quà tặng bộ dụng cụ Nook Ký</>
          ) : hasFreeship ? (
            <>
              🚚 Đã đạt <strong>Freeship</strong>! Thêm{" "}
              <strong>{formatVnd(GIFT_THRESHOLD - subtotal)}</strong> để nhận 🎁 <strong>Bộ dụng cụ lắp ráp</strong>
            </>
          ) : (
            <>
              🚚 Thêm <strong>{formatVnd(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> để được{" "}
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
