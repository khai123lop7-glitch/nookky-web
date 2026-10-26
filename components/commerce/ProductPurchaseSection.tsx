"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/lib/promotions";
import { useCart } from "./CartProvider";
import styles from "./ProductPurchaseSection.module.css";

const formatVnd = (value: number) => new Intl.NumberFormat("vi-VN").format(value) + " ₫";

interface ProductPurchaseSectionProps {
  slug: string;
  name: string;
  price: number;
}

export function ProductPurchaseSection({ slug, name, price }: ProductPurchaseSectionProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // <main> của PDP có will-change: transform, khiến position: fixed bám theo <main> thay vì viewport,
  // nên thanh mua cố định được render thẳng vào document.body.
  useEffect(() => setPortalReady(true), []);

  // Thanh mua cố định trên mobile chỉ hiện khi khu vực mua chính đã cuộn qua phía trên màn hình.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    track("view_item", {
      item_id: slug,
      item_name: name,
      value: price,
      currency: "VND",
    });
  }, [slug, name, price]);

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(99, prev + 1));
  };

  const handleAddToCart = (placement: "buy_box" | "sticky_bar" = "buy_box") => {
    addItem(slug, quantity);
    track("add_to_cart", {
      item_id: slug,
      item_name: name,
      value: price * quantity,
      quantity,
      currency: "VND",
      placement,
    });
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const handleBuyNow = () => {
    addItem(slug, quantity);
    track("add_to_cart", {
      item_id: slug,
      item_name: name,
      value: price * quantity,
      quantity,
      currency: "VND",
    });
    router.push("/checkout");
  };

  return (
    <div className={styles.section} ref={sectionRef}>
      <div className={styles.quantityRow}>
        <span className={styles.quantityLabel}>Số lượng:</span>
        <div className={styles.quantityControl} role="group" aria-label="Chọn số lượng">
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={handleDecrease}
            disabled={quantity <= 1}
            aria-label="Giảm 1 sản phẩm"
          >
            −
          </button>
          <span className={styles.qtyValue} aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={handleIncrease}
            disabled={quantity >= 99}
            aria-label="Tăng 1 sản phẩm"
          >
            +
          </button>
        </div>
      </div>

      <div className={styles.actionsGrid}>
        <button
          type="button"
          className={styles.addToCartBtn}
          onClick={() => handleAddToCart()}
          aria-live="polite"
        >
          {isAdding ? `✓ Đã thêm (${quantity})` : "Thêm vào giỏ"}
        </button>
        <button
          type="button"
          className={styles.buyNowBtn}
          onClick={handleBuyNow}
        >
          Mua ngay →
        </button>
      </div>

      <div className={styles.cartLinkRow}>
        <a href="/cart" className={styles.cartLink}>
          Xem giỏ hàng
        </a>
        <span className={styles.shippingNote}>
          ✓ Miễn phí vận chuyển cho đơn từ 1.000.000₫
        </span>
      </div>

      <ul className={styles.assurances} aria-label="Giao hàng, thanh toán và bảo hành">
        <li>
          <strong>Giao hàng</strong>
          <span>
            2–3 ngày tại TP.HCM, Hà Nội; 3–5 ngày tỉnh khác. Phí {formatVnd(STANDARD_SHIPPING_FEE)}, miễn phí từ{" "}
            {formatVnd(FREE_SHIPPING_THRESHOLD)}.
          </span>
        </li>
        <li>
          <strong>Thanh toán</strong>
          <span>COD (trả tiền khi nhận hàng), chuyển khoản, MoMo, ZaloPay.</span>
        </li>
        <li>
          <strong>Bảo hành</strong>
          <span>Gửi bù miễn phí mảnh gỗ bị gãy hoặc thất lạc trong 30 ngày.</span>
        </li>
      </ul>

      {portalReady && createPortal(
        <div className={`${styles.stickyBar} ${showStickyBar ? styles.stickyBarVisible : ""}`} aria-hidden={!showStickyBar}>
          <div className={styles.stickyInfo}>
            <span className={styles.stickyName}>{name}</span>
            <strong className={styles.stickyPrice}>{formatVnd(price)}</strong>
          </div>
          <button
            type="button"
            className={styles.stickyBtn}
            onClick={() => handleAddToCart("sticky_bar")}
            tabIndex={showStickyBar ? 0 : -1}
          >
            {isAdding ? "✓ Đã thêm" : "Thêm vào giỏ"}
          </button>
        </div>,
        document.body,
      )}
    </div>
  );
}
