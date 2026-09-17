"use client";

import { useRouter } from "next/navigation";
import { formatVnd, products } from "@/data/products";
import { track } from "@/lib/analytics";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import styles from "./ProductGrid.module.css";

export function ProductGrid() {
  const router = useRouter();

  const openProduct = (product: (typeof products)[number]) => {
    track("select_item", {
      item_id: product.slug,
      item_name: product.name,
      location: product.location,
      value: product.price,
    });
    router.push(`/product/${product.slug}`);
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
        </header>

        <div className={styles.catalogGrid}>
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
      </div>
    </section>
  );
}
