"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatVnd, products } from "@/data/products";
import { track } from "@/lib/analytics";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import styles from "./ProductCatalog.module.css";

const displayFont = '"NookOrtland", "Be Vietnam Pro", sans-serif';

const driveImage = (id: string, width = 2200) => `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;\n\nconst COLLECTION_HERO = "https://drive.google.com/thumbnail?id=1pUnw74xRwg5aCjERwL_S5ul7op6ZweOu&sz=w2400";
const LIFESTYLE_IMAGE = driveImage("1Nb_AB08zHjaLh1gLDPn66ytachTA4Ggz");
const ASSEMBLY_IMAGE = driveImage("1yhaIiJNzz2SvXWSVd-RNvjWSQb0Oj18b");
const UNBOX_IMAGE = driveImage("1jeMDp9bMDkwgMMF9hFGf4uBKU2azVOsf");
const DETAILS_IMAGE = driveImage("1POxkGUfPAE8W4Bp6zAIi251AvpZPYRc4");
const FULL_SET_IMAGE = driveImage("1FHOi9OjKM4HFNzVRLT4GjdW0CeMWPxc5");

export function ProductGrid() {
  const router = useRouter();

  // Prefetch top products in background when catalog loads
  useEffect(() => {
    products.forEach((p) => {
      router.prefetch(`/product/${p.slug}`);
    });
  }, [router]);

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
          <h1 style={{ fontFamily: displayFont }}>Những góc Việt Nam,<br />thu nhỏ để giữ lại.</h1>
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
            <h2 id="nk-shop-title" className={styles.title} style={{ fontFamily: displayFont }}>Sáu Nơi Chốn, Sáu Nhịp Ánh Sáng.</h2>
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
              onMouseEnter={() => router.prefetch(`/product/${product.slug}`)}
              onTouchStart={() => router.prefetch(`/product/${product.slug}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter") openProduct(product);
              }}
            >
              <div className={styles.catalogImageWrap}>
                <img src={product.media.lifestyle} alt={product.name} className={styles.catalogImage} loading="lazy" decoding="async" />
              </div>

              <div className={styles.catalogBody}>
                <div>
                  <p className={styles.catalogLocation}>{product.location}</p>
                  <h3 className={styles.catalogName} style={{ fontFamily: displayFont }}>{product.name}</h3>
                </div>

                <div className={styles.catalogFooter}>
                  <div className={styles.catalogPrice}>
                    {product.regularPrice ? <del>{formatVnd(product.regularPrice)}</del> : null}
                    <strong>{formatVnd(product.price)}</strong>
                  </div>
                  <div className={styles.catalogCart} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
                    <AddToCartButton slug={product.slug} className={styles.miniCartBtn} label="🛒" addedLabel="✓" stopPropagation={true} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <section className={styles.storyFeature}>
        <div className={styles.storyFeatureMedia}>
          <img src={LIFESTYLE_IMAGE} alt="Các Nook Ký được trưng bày trong góc đọc sách" loading="lazy" decoding="async" />
        </div>
        <div className={styles.storyFeatureCopy}>
          <p className={styles.eyebrow}>KHÔNG CHỈ ĐỂ TRƯNG BÀY</p>
          <h2 style={{ fontFamily: displayFont }}>Một góc nhỏ có thể làm căn phòng đổi nhịp.</h2>
          <p>
            Khi đứng riêng, mỗi Nook là một mô hình. Khi đặt giữa sách, đèn bàn và những món đồ bạn dùng mỗi ngày,
            nó trở thành một phần của không gian sống — một điểm sáng đủ nhỏ để không lấn át, nhưng đủ đặc biệt để khiến bạn muốn nhìn lại.
          </p>
          <p>
            Nook Ký được thiết kế để giữ cảm giác ấy: ấm, có chiều sâu và có chút hoài niệm, giống như mang một nơi quen thuộc về gần mình hơn.
          </p>
        </div>
      </section>

      <section className={`${styles.storySplit} ${styles.storySplitReverse}`}>
        <div className={styles.storySplitMedia}>
          <img src={ASSEMBLY_IMAGE} alt="Quá trình lắp ráp một mẫu Nook Ký" loading="lazy" decoding="async" />
        </div>
        <div className={styles.storySplitCopy}>
          <p className={styles.eyebrow}>TỰ TAY HOÀN THIỆN</p>
          <h2 style={{ fontFamily: displayFont }}>Phần hay nhất là lúc mọi thứ dần thành hình.</h2>
          <p>
            Từ những tấm gỗ phẳng, chi tiết rời và bộ đèn nhỏ, bạn ghép từng lớp không gian cho đến khi con phố bắt đầu có chiều sâu.
            Đây không phải trải nghiệm “mở hộp rồi đặt lên kệ” — mà là vài giờ chậm lại để tự tay dựng nên thành phẩm của chính mình.
          </p>
          <div className={styles.storyStats}>
            <div><span>Thời gian</span><strong>4–10 giờ</strong></div>
            <div><span>Mức độ</span><strong>Dễ → Khá</strong></div>
            <div><span>Ánh sáng</span><strong>LED tích hợp</strong></div>
          </div>
        </div>
      </section>

      <section className={styles.storySplit}>
        <div className={styles.storySplitMedia}>
          <img src={UNBOX_IMAGE} alt="Bộ chi tiết, hướng dẫn và phụ kiện trong một bộ Nook Ký" loading="lazy" decoding="async" />
        </div>
        <div className={styles.storySplitCopy}>
          <p className={styles.eyebrow}>TRONG HỘP CÓ GÌ?</p>
          <h2 style={{ fontFamily: displayFont }}>Mở hộp là có thể bắt đầu.</h2>
          <p>
            Mỗi bộ được chuẩn bị để bạn đi từ những chi tiết cơ bản đến thành phẩm hoàn chỉnh mà không phải tự tìm thêm quá nhiều thứ bên ngoài.
            Những nhóm phụ kiện nhỏ được tách rõ để quá trình lắp ráp dễ theo dõi hơn.
          </p>
          <ul className={styles.storyList}>
            <li>Tấm gỗ cắt sẵn theo từng lớp không gian</li>
            <li>Chi tiết in màu và phụ kiện trang trí</li>
            <li>Bộ LED và cụm cấp nguồn</li>
            <li>Hướng dẫn lắp ráp theo từng bước</li>
          </ul>
        </div>
      </section>

      <section className={styles.detailStory}>
        <div className={styles.detailStoryCopy}>
          <p className={styles.eyebrow}>NHỮNG CHI TIẾT NHỎ GIỮ LẠI CẢM GIÁC</p>
          <h2 style={{ fontFamily: displayFont }}>Không phải nơi chốn nào cũng cần kể bằng toàn cảnh.</h2>
          <p>
            Có khi chỉ một chiếc đèn lồng, bậc thềm ướt, ban công cũ hay một con dốc đầy hoa cũng đủ khiến ta nhận ra nơi mình từng đi qua.
            Vì vậy mỗi mẫu đều dành nhiều chỗ cho những chi tiết nhỏ — thứ làm nên ký ức hơn là chỉ làm đầy mô hình.
          </p>
        </div>
        <div className={styles.detailStoryMedia}>
          <img src={DETAILS_IMAGE} alt="Các chi tiết cận cảnh trong bộ sưu tập Nook Ký" loading="lazy" decoding="async" />
        </div>
      </section>

      <section className={styles.collectionClose}>
        <img src={FULL_SET_IMAGE} alt="Sáu mẫu trong bộ sưu tập Nook Ký" loading="lazy" decoding="async" />
        <div className={styles.collectionCloseCopy}>
          <p className={styles.eyebrow}>6 ĐỊA DANH · 6 NHỊP ÁNH SÁNG</p>
          <h2 style={{ fontFamily: displayFont }}>Đặt cạnh nhau, thành một Việt Nam nhỏ.</h2>
          <p>
            Hội An, Huế, Hà Nội, Sài Gòn, Đà Lạt và Miền Tây — mỗi nơi giữ một nhịp riêng nhưng cùng chung chất liệu ấm áp,
            nhiều lớp không gian và cảm giác được tự tay hoàn thiện từng chi tiết.
          </p>
          <a href="#catalog-products">Xem lại bộ sưu tập ↑</a>
        </div>
      </section>
    </section>
  );
}
