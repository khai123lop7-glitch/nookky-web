"use client";

import { useRouter } from "next/navigation";
import { formatVnd, products } from "@/data/products";
import { track } from "@/lib/analytics";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import styles from "./ProductCatalog.module.css";

const COLLECTION_HERO = "https://drive.google.com/thumbnail?id=1pUnw74xRwg5aCjERwL_S5ul7op6ZweOu&sz=w2400";
const SECONDARY_HERO = "https://drive.google.com/thumbnail?id=1fjbvnuuTRjt4C9SGrbAySjIjrTf7o3ie&sz=w2000";

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
      <div className={styles.heroBanner}>
        <img src={COLLECTION_HERO} alt="Bộ sưu tập Book Nook Nook Ký" className={styles.heroImage} />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>NOOK KÝ · BỘ SƯU TẬP VIỆT NAM THU NHỎ</p>
          <h1>Những góc Việt Nam,<br />thu nhỏ để giữ lại.</h1>
          <p>
            Từ một con phố vừa lên đèn đến một mái nhà nép trên dốc,
            mỗi Nook là một lát cắt quen thuộc được dựng lại bằng ánh sáng, chi tiết và ký ức.
          </p>
          <a href="#catalog-products" className={styles.heroCta}>Khám phá 6 mẫu <span aria-hidden="true">↓</span></a>
        </div>
      </div>

      <figure className={styles.secondaryHero}>
        <div className={styles.secondaryHeroMedia}>
          <img src={SECONDARY_HERO} alt="Một góc khác của bộ sưu tập Nook Ký" loading="lazy" decoding="async" />
        </div>
        <figcaption>
          <span>NHỮNG GÓC NHÌN KHÁC NHAU</span>
          <p>Mỗi nơi chốn có một nhịp riêng, nhưng khi đặt cạnh nhau lại thành một lát cắt rất Việt Nam.</p>
        </figcaption>
      </figure>

      <div className={styles.editorialIntro}>
        <div className={styles.editorialHeading}>
          <p className={styles.eyebrow}>MỘT GÓC NHỎ, MỘT CÂU CHUYỆN RIÊNG</p>
          <h2>Không chỉ để trưng bày.</h2>
        </div>
        <div className={styles.editorialCopy}>
          <p>
            Nook Ký được làm để bạn có thể tự tay đi qua từng lớp không gian: ghép từng mảng nhỏ,
            đặt từng chi tiết vào đúng chỗ và bật ánh đèn đầu tiên sau khi hoàn thiện.
          </p>
          <p>
            Sáu mẫu là sáu nhịp sống khác nhau — Hội An, Huế, Hà Nội, Sài Gòn, Đà Lạt và Miền Tây —
            nhưng cùng chung một ý niệm: giữ lại một nơi chốn quen thuộc theo cách rất riêng.
          </p>
          <div className={styles.editorialMeta}>6 địa danh · 6 nhịp ánh sáng · 1 bộ sưu tập</div>
        </div>
      </div>

      <div className={styles.innerContainer} id="catalog-products">
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
