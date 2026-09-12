"use client";

import { useState } from "react";
import { AVAILABLE_PROMOS, useCart } from "./CartProvider";
import styles from "./PromoBox.module.css";

export function PromoBox() {
  const { appliedPromo, applyPromo, removePromo } = useCart();
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApply = (inputCode: string) => {
    if (!inputCode.trim()) return;
    const res = applyPromo(inputCode);
    setFeedback(res);
    if (res.success) {
      setCode("");
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleChipClick = (promoCode: string) => {
    handleApply(promoCode);
  };

  return (
    <div className={styles.box} aria-label="Mã giảm giá và ưu đãi">
      <div className={styles.boxTitle}>
        <span>🏷️</span> Mã ưu đãi / Voucher
      </div>

      {appliedPromo ? (
        <div className={styles.appliedCard}>
          <div className={styles.appliedInfo}>
            <span className={styles.appliedCode}>
              ✓ {appliedPromo.code}
            </span>
            <span className={styles.appliedDesc}>{appliedPromo.description}</span>
          </div>
          <button
            type="button"
            className={styles.removeBtn}
            onClick={removePromo}
            aria-label="Gỡ mã giảm giá"
          >
            Gỡ bỏ
          </button>
        </div>
      ) : (
        <>
          <div className={styles.inputRow}>
            <input
              type="text"
              className={styles.input}
              placeholder="Nhập mã ưu đãi..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApply(code);
                }
              }}
            />
            <button
              type="button"
              className={styles.applyBtn}
              onClick={() => handleApply(code)}
            >
              Áp dụng
            </button>
          </div>

          {feedback && (
            <p className={feedback.success ? styles.messageSuccess : styles.messageError}>
              {feedback.message}
            </p>
          )}

          <div className={styles.suggestions}>
            <span className={styles.suggestionsLabel}>Gợi ý ưu đãi độc quyền:</span>
            <div className={styles.chips}>
              {AVAILABLE_PROMOS.map((promo) => (
                <button
                  key={promo.code}
                  type="button"
                  className={styles.chip}
                  onClick={() => handleChipClick(promo.code)}
                  title={`Bấm để áp dụng ${promo.code}`}
                >
                  <span className={styles.chipCode}>{promo.code}</span>
                  <span className={styles.chipDesc}>({promo.label})</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
