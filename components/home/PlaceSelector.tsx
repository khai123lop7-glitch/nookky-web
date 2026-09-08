"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { track } from "@/lib/analytics";

export function PlaceSelector() {
  const [active, setActive] = useState(0);
  const [switching, setSwitching] = useState(false);
  const product = products[active];

  const selectPlace = (index: number) => {
    if (index === active) return;
    const nextProduct = products[index];
    track("place_select", { product: nextProduct.slug, location: nextProduct.location, index: index + 1 });
    setSwitching(true);
    window.setTimeout(() => {
      setActive(index);
      window.setTimeout(() => setSwitching(false), 30);
    }, 150);
  };

  return (
    <section className="nk-place" aria-labelledby="nk-place-title">
      <div className="nk-container nk-place__grid">
        <div className={`nk-place__visual ${switching ? "is-switching" : ""}`} aria-live="polite">
          <img src={product.media.lifestyle} alt={product.name} loading="lazy" decoding="async" />
          <div className="nk-place__visual-label">
            <span>{product.location}</span>
            <span>{String(active + 1).padStart(2, "0")} / 06</span>
          </div>
        </div>

        <div className="nk-place__content">
          <p className="nk-eyebrow">CHỌN NƠI CHỐN</p>
          <h2 id="nk-place-title">Bạn muốn giữ lại nơi nào?</h2>
          <p className="nk-place__lead">Mỗi địa danh mang một nhịp ánh sáng, chất liệu và câu chuyện khác nhau.</p>

          <div className="nk-place__options" role="group" aria-label="Chọn địa danh">
            {products.map((item, index) => (
              <button
                type="button"
                className={`nk-place__option ${active === index ? "is-active" : ""}`}
                key={item.slug}
                onClick={() => selectPlace(index)}
                aria-pressed={active === index}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.location}</strong>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>

          <a className="nk-button" href={`/product/${product.slug}`}>
            Khám phá Nook này
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
