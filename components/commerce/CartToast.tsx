"use client";

import { useEffect } from "react";
import { formatVnd } from "@/data/products";
import { useCart } from "./CartProvider";
import styles from "./CartToast.module.css";

export function CartToast() {
  const { lastAdded, closeToast } = useCart();

  useEffect(() => {
    if (!lastAdded) return;
    const timer = setTimeout(() => {
      closeToast();
    }, 4500);
    return () => clearTimeout(timer);
  }, [lastAdded, closeToast]);

  if (!lastAdded) return null;

  return (
    <aside className={styles.toastContainer} aria-live="polite" role="status">
      <div className={styles.toast}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>
            <span className={styles.checkmark}>✓</span> Đã thêm vào giỏ hàng
          </span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeToast}
            aria-label="Đóng thông báo"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          {lastAdded.image && (
            <div className={styles.thumb}>
              <img src={lastAdded.image} alt={lastAdded.name} />
            </div>
          )}
          <div className={styles.info}>
            <p className={styles.title}>{lastAdded.name}</p>
            <p className={styles.meta}>
              Số lượng: <strong>{lastAdded.quantity}</strong> ·{" "}
              <strong>{formatVnd(lastAdded.price * lastAdded.quantity)}</strong>
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <a href="/cart" className={styles.viewCart} onClick={closeToast}>
            Xem giỏ hàng
          </a>
          <a href="/checkout" className={styles.checkout} onClick={closeToast}>
            Thanh toán ngay →
          </a>
        </div>
      </div>
    </aside>
  );
}
