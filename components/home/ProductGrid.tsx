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

      <section className={styles.editorialIntro} aria-labelledby="nk-editorial-title">
        <figure className={styles.editorialVisual}>
          <img
            src={SECONDARY_HERO}
            alt="Các mẫu Nook Ký được đặt cạnh nhau"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className={styles.editorialContent}>
          <p className={styles.eyebrow}>MỘT GÓC NHỎ, MỘT CÂU CHUYỆN RIÊNG</p>
          <h2 id="nk-editorial-title">Không chỉ để trưng bày.</h2>

          <div className={styles.editorialCopy}>
            <p className={styles.editorialLead}>
              Mỗi Nook bắt đầu từ một nơi chốn có thật trong ký ức: một mặt tiền cũ, một con hẻm hẹp,
              một hàng hiên sáng đèn hay một lối dốc đầy hoa. Nook Ký không cố sao chép nguyên xi,
              mà giữ lại những chi tiết khiến ta nhận ra nơi ấy ngay từ cái nhìn đầu tiên.
            </p>
            <p>
              Trải nghiệm không dừng ở lúc đặt mô hình lên kệ. Bạn sẽ tự đi qua từng lớp không gian,
              ghép từng mảng nhỏ, sắp từng món phụ kiện và nhìn tổng thể dần thành hình trong tay mình.
              Khoảnh khắc bật đèn lần đầu cũng là lúc một cảnh quen bỗng có đời sống riêng.
            </p>
            <p>
              Sáu mẫu là sáu nhịp khác nhau — Hội An ấm và chậm, Huế trầm, Hà Nội cũ kỹ,
              Sài Gòn chật mà sống động, Đà Lạt dịu và Miền Tây thoáng mở. Đặt cạnh nhau,
              chúng tạo thành một bộ sưu tập thống nhất mà vẫn giữ được cá tính riêng của từng nơi.
            </p>
          </div>

          <div className={styles.editorialPoints}>
            <article>
              <span>01</span>
              <div>
                <strong>Ánh sáng tạo cảm xúc</strong>
                <p>LED được dùng như một phần của câu chuyện, không chỉ để làm mô hình sáng hơn.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <strong>Nhiều lớp không gian</strong>
                <p>Mặt tiền, lớp giữa và hậu cảnh tạo chiều sâu khi nhìn trực diện trên kệ sách.</p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <strong>Tự tay hoàn thiện</strong>
                <p>Phần thú vị nằm ở quá trình lắp, chỉnh và biến bộ chi tiết thành một góc của riêng bạn.</p>
              </div>
            </article>
          </div>

          <div className={styles.editorialMeta}>6 địa danh · 6 nhịp ánh sáng · 1 bộ sưu tập</div>
        </div>
      </section>
    </section>
  );
}
