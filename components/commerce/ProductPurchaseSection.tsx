"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { useCart } from "./CartProvider";
import styles from "./ProductPurchaseSection.module.css";

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

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(99, prev + 1));
  };

  const handleAddToCart = () => {
    addItem(slug, quantity);
    track("add_to_cart", {
      item_id: slug,
      item_name: name,
      value: price * quantity,
      quantity,
      currency: "VND",
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
    <div className={styles.section}>
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
          onClick={handleAddToCart}
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
    </div>
  );
}
