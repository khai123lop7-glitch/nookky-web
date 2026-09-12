"use client";

import { useEffect } from "react";
import { formatVnd, products } from "@/data/products";
import { track } from "@/lib/analytics";
import { useCart } from "./CartProvider";
import { PromotionBar } from "./PromotionBar";
import { PromoBox } from "./PromoBox";
import styles from "./CartView.module.css";

export function CartView() {
  const {
    items,
    setQuantity,
    removeItem,
    clearCart,
    hydrated,
    appliedPromo,
    discountAmount,
    isFreeShipping,
  } = useCart();

  const lines = items
    .map((item) => {
      const product = products.find((entry) => entry.slug === item.slug);
      return product ? { ...item, product } : null;
    })
    .filter((line): line is NonNullable<typeof line> => Boolean(line));

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  useEffect(() => {
    if (hydrated && lines.length > 0) {
      track("view_cart", {
        item_count: lines.length,
        value: finalTotal,
        currency: "VND",
      });
    }
  }, [hydrated, lines.length, finalTotal]);

  if (!hydrated) {
    return (
      <section className={`${styles.cart} nk-container-wide`} aria-busy="true">
        <header className={styles.header}>
          <div>
            <p className="nk-eyebrow">GIỎ HÀNG</p>
            <h1>Đang tải giỏ hàng...</h1>
          </div>
        </header>
        <div className={styles.skeletonLayout}>
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLine} />
        </div>
      </section>
    );
  }

  if (lines.length === 0) {
    return (
      <section className="nk-cart-shell nk-container">
        <p className="nk-eyebrow">GIỎ HÀNG</p>
        <h1>Giỏ hàng của bạn đang trống.</h1>
        <p>Chọn một Nook bạn muốn giữ lại, sau đó thêm vào giỏ để tiếp tục.</p>
        <a className="nk-button" href="/shop">Xem bộ sưu tập</a>
      </section>
    );
  }

  const handleCheckoutClick = () => {
    track("begin_checkout", {
      value: finalTotal,
      currency: "VND",
      item_count: lines.length,
    });
  };

  return (
    <section className={`${styles.cart} nk-container-wide`} aria-labelledby="nk-cart-title">
      <header className={styles.header}>
        <div>
          <p className="nk-eyebrow">GIỎ HÀNG</p>
          <h1 id="nk-cart-title">Những góc bạn đã chọn.</h1>
        </div>
        <button className={`${styles.clear} nk-text-link`} type="button" onClick={clearCart}>Xóa giỏ hàng</button>
      </header>

      {/* Promotion bar */}
      <PromotionBar />

      <div className={styles.layout}>
        <div className={styles.items}>
          {lines.map(({ product, quantity }) => (
            <article className={styles.line} key={product.slug}>
              <a className={styles.media} href={`/product/${product.slug}`}>
                <img src={product.media.cover} alt={product.name} loading="lazy" decoding="async" />
              </a>
              <div className={styles.body}>
                <div>
                  <p className={styles.location}>{product.location}</p>
                  <a href={`/product/${product.slug}`}><h2>{product.name}</h2></a>
                </div>
                <div className={styles.controls}>
                  <div className={styles.quantity} aria-label={`Số lượng ${product.name}`}>
                    <button type="button" onClick={() => setQuantity(product.slug, quantity - 1)} aria-label="Giảm số lượng">−</button>
                    <span aria-live="polite">{quantity}</span>
                    <button type="button" onClick={() => setQuantity(product.slug, quantity + 1)} aria-label="Tăng số lượng">＋</button>
                  </div>
                  <strong>{formatVnd(product.price * quantity)}</strong>
                  <button className={styles.remove} type="button" onClick={() => removeItem(product.slug)}>Xóa</button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className={styles.summary} aria-label="Tóm tắt giỏ hàng">
          <p>Tạm tính</p>
          <strong>{formatVnd(subtotal)}</strong>

          {appliedPromo && discountAmount > 0 && (
            <div className={styles.discountLine}>
              <span>Ưu đãi ({appliedPromo.code}):</span>
              <strong>-{formatVnd(discountAmount)}</strong>
            </div>
          )}

          {/* Promo voucher input box */}
          <PromoBox />

          <div className={styles.note}>
            {isFreeShipping ? (
              <span className={styles.freeShipNote}>
                ✓ Bạn được miễn phí vận chuyển {appliedPromo?.type === "freeship" ? "(Mã FREESHIP)" : ""}
              </span>
            ) : (
              <span>Thêm {formatVnd(1000000 - subtotal)} để được miễn phí vận chuyển</span>
            )}
          </div>

          <a className="nk-button" href="/checkout" onClick={handleCheckoutClick}>
            Tiến hành đặt hàng →
          </a>
          <div className={styles.continueShopping}>
            <a className="nk-text-link" href="/shop">
              ← Tiếp tục xem sản phẩm
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
