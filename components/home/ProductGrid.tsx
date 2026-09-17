"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { formatVnd, products } from "@/data/products";
import { track } from "@/lib/analytics";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import styles from "./ProductCatalog.module.css";

export function ProductGrid() {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const openProduct = (product: (typeof products)[number]) => {
    track("select_item", {
      item_id: product.slug,
      item_name: product.name,
      location: product.location,
      value: product.price,
    });
    router.push(`/product/${product.slug}`);
  };

  const scrollCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const card = carousel.querySelector<HTMLElement>("article");
    const step = card ? card.offsetWidth + 16 : 280;
    carousel.scrollBy({ left: direction * step * 2, behavior: "smooth" });
  };

  return (
    <section className={styles.showcaseSection} id="shop-all" aria-labelledby="nk-shop-title">
      <div className={styles.innerContainer}>
        <header className={styles.header}>
          <div className={styles.titleArea}>
            <p className={styles.eyebrow}>BỘ SƯU TẬP NOOK KÝ</p>
            <h2 id="nk-shop-title" className={styles.title}>Sáu Nơi Chốn, Sáu Nhịp Ánh Sáng.</h2>
            <p className={styles.subtitle}>Chọn một nơi chốn để xem đầy đủ hình ảnh, câu chuyện và thông tin sản phẩm.</p>
          </div>

          <div className={styles.carouselControls} aria-label="Điều khiển danh sách sản phẩm">
            <button type="button" onClick={() => scrollCarousel(-1)} aria-label="Sản phẩm trước">←</button>
            <button type="button" onClick={() => scrollCarousel(1)} aria-label="Sản phẩm tiếp theo">→</button>
          </div>
        </header>

        <div ref={carouselRef} className={styles.catalogCarousel}>
          {products.map((product) => (
            <article
              key={product.slug}
              className={styles.catalogCard}
              role="link"
              tabIndex={0}
              aria-label={`Xem chi tiết ${product.name}`}
              onClick={() => openProduct(product)}
              onKeyDown={(event) => {
                if (event.key === "Enter") openProduct(product);
              }}
            >
              <div className={styles.catalogImageWrap}>
                <img
                  src={product.media.cover}
                  alt={product.name}
                  className={styles.catalogImage}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className={styles.catalogBody}>
                <div>
                  <p className={styles.catalogLocation}>{product.location}</p>
                  <h3 className={styles.catalogName}>{product.name}</h3>
                </div>

                <div className={styles.catalogFooter}>
                  <div className={styles.catalogPrice}>
                    {product.regularPrice ? <del>{formatVnd(product.regularPrice)}</del> : null}
                    <strong>{formatVnd(product.price)}</strong>
                  </div>

                  <div
                    className={styles.catalogCart}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <AddToCartButton
                      slug={product.slug}
                      className={styles.miniCartBtn}
                      label="🛒"
                      addedLabel="✓"
                      stopPropagation={true}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.swipeHint}>Kéo ngang để xem thêm <span aria-hidden="true">→</span></p>
      </div>
    </section>
  );
}
