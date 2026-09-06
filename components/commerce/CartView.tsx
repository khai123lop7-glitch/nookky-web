"use client";

import { formatVnd, products } from "@/data/products";
import { useCart } from "./CartProvider";

export function CartView() {
  const { items, setQuantity, removeItem, clearCart } = useCart();
  const lines = items
    .map((item) => {
      const product = products.find((entry) => entry.slug === item.slug);
      return product ? { ...item, product } : null;
    })
    .filter((line): line is NonNullable<typeof line> => Boolean(line));

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

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

  return (
    <section className="nk-cart nk-container-wide" aria-labelledby="nk-cart-title">
      <header className="nk-cart__header">
        <div>
          <p className="nk-eyebrow">GIỎ HÀNG</p>
          <h1 id="nk-cart-title">Những góc bạn đã chọn.</h1>
        </div>
        <button className="nk-text-link nk-cart__clear" type="button" onClick={clearCart}>Xóa giỏ hàng</button>
      </header>

      <div className="nk-cart__layout">
        <div className="nk-cart__items">
          {lines.map(({ product, quantity }) => (
            <article className="nk-cart-line" key={product.slug}>
              <a className="nk-cart-line__media" href={`/product/${product.slug}`}>
                <img src={product.media.cover} alt={product.name} loading="lazy" decoding="async" />
              </a>
              <div className="nk-cart-line__body">
                <div>
                  <p className="nk-cart-line__location">{product.location}</p>
                  <a href={`/product/${product.slug}`}><h2>{product.name}</h2></a>
                </div>
                <div className="nk-cart-line__controls">
                  <div className="nk-quantity" aria-label={`Số lượng ${product.name}`}>
                    <button type="button" onClick={() => setQuantity(product.slug, quantity - 1)} aria-label="Giảm số lượng">−</button>
                    <span aria-live="polite">{quantity}</span>
                    <button type="button" onClick={() => setQuantity(product.slug, quantity + 1)} aria-label="Tăng số lượng">＋</button>
                  </div>
                  <strong>{formatVnd(product.price * quantity)}</strong>
                  <button className="nk-cart-line__remove" type="button" onClick={() => removeItem(product.slug)}>Xóa</button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="nk-cart__summary" aria-label="Tóm tắt giỏ hàng">
          <p>Tạm tính</p>
          <strong>{formatVnd(subtotal)}</strong>
          <div className="nk-cart__summary-note">Phí vận chuyển và thanh toán sẽ được xác nhận ở bước tiếp theo.</div>
          <a className="nk-button" href="/shop">Tiếp tục mua sắm</a>
        </aside>
      </div>
    </section>
  );
}
