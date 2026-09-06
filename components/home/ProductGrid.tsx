"use client";

import { useMemo, useState } from "react";
import { formatVnd, products, Region } from "@/data/products";
import { track } from "@/lib/analytics";

type Filter = "all" | Region;

const filters: { label: string; value: Filter }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Miền Bắc", value: "north" },
  { label: "Miền Trung", value: "central" },
  { label: "Miền Nam", value: "south" },
];

export function ProductGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = useMemo(() => filter === "all" ? products : products.filter((product) => product.region === filter), [filter]);

  const selectFilter = (value: Filter) => {
    setFilter(value);
    track("shop_filter_click", { filter: value });
  };

  const selectProduct = (product: (typeof products)[number]) => {
    track("select_item", {
      item_id: product.slug,
      item_name: product.name,
      location: product.location,
      filter,
      value: product.price,
    });
  };

  return (
    <section className="nk-shop-all" id="shop-all" aria-labelledby="nk-shop-title">
      <div className="nk-container">
        <header className="nk-shop-all__header">
          <div>
            <p className="nk-eyebrow">BỘ SƯU TẬP</p>
            <h2 id="nk-shop-title">Chọn một nơi để bắt đầu.</h2>
          </div>
          <div className="nk-shop-all__aside">
            <p>Sáu nơi chốn, sáu nhịp ánh sáng. Lọc nhanh theo vùng hoặc xem toàn bộ bộ sưu tập.</p>
            <a className="nk-text-link" href="/shop">Xem trang sản phẩm</a>
          </div>
        </header>

        <div className="nk-filter" role="group" aria-label="Lọc sản phẩm theo vùng">
          {filters.map((item) => (
            <button
              type="button"
              key={item.value}
              className={filter === item.value ? "is-active" : ""}
              aria-pressed={filter === item.value}
              onClick={() => selectFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="nk-product-grid nk-shop-all__grid" aria-live="polite">
          {visible.map((product) => (
            <article className="nk-product-card" key={product.slug}>
              <a className="nk-product-card__media" href={`/product/${product.slug}`} aria-label={product.name} onClick={() => selectProduct(product)}>
                <img className="nk-product-card__cover" src={product.media.cover} alt={product.name} loading="lazy" decoding="async" />
                <img className="nk-product-card__hover" src={product.media.detail} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              </a>
              <div className="nk-product-card__body">
                <p className="nk-product-card__location">{product.location}</p>
                <div className="nk-product-card__title-row">
                  <a href={`/product/${product.slug}`} onClick={() => selectProduct(product)}><h3>{product.name}</h3></a>
                  <p className="nk-product-card__price">
                    {product.regularPrice ? <del>{formatVnd(product.regularPrice)}</del> : null}
                    <strong>{formatVnd(product.price)}</strong>
                  </p>
                </div>
                <dl className="nk-product-card__facts" aria-label="Thông tin sản phẩm">
                  <div><dt>Độ khó</dt><dd>{product.difficulty}</dd></div>
                  {product.pieces ? <div><dt>Số mảnh</dt><dd>{product.pieces}</dd></div> : null}
                  <div><dt>Thời gian</dt><dd>{product.buildTime}</dd></div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
