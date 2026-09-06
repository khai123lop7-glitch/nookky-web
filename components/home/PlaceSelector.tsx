"use client";

import { useState } from "react";
import { products } from "@/data/products";

export function PlaceSelector() {
  const [active, setActive] = useState(0);
  const product = products[active];

  return (
    <section className="nk-place" aria-labelledby="place-title">
      <div className="nk-container nk-place__grid">
        <div className="nk-place__visual">
          <img src={product.media.lifestyle} alt={`${product.name} trong không gian`} />
          <div className="nk-place__label"><span>{product.location}</span><span>{String(active + 1).padStart(2, "0")} / 06</span></div>
        </div>
        <div className="nk-place__content">
          <p className="nk-eyebrow">CHỌN NƠI CHỐN</p>
          <h2 id="place-title">Bạn muốn giữ lại nơi nào?</h2>
          <p>Mỗi địa danh mang một nhịp ánh sáng, chất liệu và câu chuyện khác nhau.</p>
          <div className="nk-place__options">
            {products.map((item, index) => (
              <button
                type="button"
                className={active === index ? "is-active" : ""}
                key={item.slug}
                onClick={() => setActive(index)}
                aria-pressed={active === index}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.location}</strong>
                <span>↗</span>
              </button>
            ))}
          </div>
          <a className="nk-button" href={`/product/${product.slug}`}>Khám phá Nook này →</a>
        </div>
      </div>
    </section>
  );
}
