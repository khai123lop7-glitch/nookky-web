"use client";

import { useMemo, useState } from "react";
import { formatVnd, products, Region } from "@/data/products";

type Filter = "all" | Region;

const filters: { label: string; value: Filter }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Miền Bắc", value: "north" },
  { label: "Miền Trung", value: "central" },
  { label: "Miền Nam", value: "south" },
];

export function ProductGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.region === filter)),
    [filter],
  );

  return (
    <section className="nk-shop" id="shop-all" aria-labelledby="shop-title">
      <div className="nk-container">
        <header className="nk-section-head">
          <div>
            <p className="nk-eyebrow">BỘ SƯU TẬP</p>
            <h2 id="shop-title">Chọn một nơi để bắt đầu.</h2>
          </div>
          <div className="nk-section-head__aside">
            <p>Sáu nơi chốn, sáu nhịp ánh sáng. Lọc nhanh theo vùng hoặc xem toàn bộ bộ sưu tập.</p>
            <a href="/shop">Xem trang sản phẩm</a>
          </div>
        </header>

        <div className="nk-filter" role="group" aria-label="Lọc sản phẩm theo vùng">
          {filters.map((item) => (
            <button
              type="button"
              key={item.value}
              className={filter === item.value ? "is-active" : ""}
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="nk-product-grid">
          {visible.map((product) => (
            <article className="nk-product-card" key={product.slug}>
              <a href={`/product/${product.slug}`}>
                <div className="nk-product-card__media"><img src={product.media.cover} alt={product.name} /></div>
                <p className="nk-product-card__location">{product.location}</p>
                <div className="nk-product-card__title-row">
                  <h3>{product.name}</h3>
                  <div className="nk-product-card__price">
                    {product.regularPrice ? <s>{formatVnd(product.regularPrice)}</s> : null}
                    <strong>{formatVnd(product.price)}</strong>
                  </div>
                </div>
                <dl className="nk-product-card__facts">
                  <div><dt>Độ khó</dt><dd>{product.difficulty}</dd></div>
                  {product.pieces ? <div><dt>Số mảnh</dt><dd>{product.pieces}</dd></div> : null}
                  <div><dt>Thời gian</dt><dd>{product.buildTime}</dd></div>
                </dl>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
