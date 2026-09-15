"use client";

import { useState } from "react";
import { formatVnd, products } from "@/data/products";
import { track } from "@/lib/analytics";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import styles from "./ProductGrid.module.css";

export function ProductGrid() {
  // Default to Hanoi ("sang-tren-pho-cu-ha-noi")
  const defaultIdx = products.findIndex((p) => p.slug === "sang-tren-pho-cu-ha-noi");
  const [activeIdx, setActiveIdx] = useState(defaultIdx >= 0 ? defaultIdx : 2);
  const [switching, setSwitching] = useState(false);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  const product = products[activeIdx];

  const handleSelectProduct = (index: number) => {
    if (index === activeIdx) return;
    setSwitching(true);
    setSelectedGalleryImg(null); // reset gallery selection to new product cover
    setTimeout(() => {
      setActiveIdx(index);
      setTimeout(() => setSwitching(false), 50);
    }, 120);

    const nextProd = products[index];
    track("select_item", {
      item_id: nextProd.slug,
      item_name: nextProd.name,
      location: nextProd.location,
      value: nextProd.price,
    });
  };

  const handleScrollToDetail = () => {
    document.getElementById("product-detail")?.scrollIntoView({ behavior: "smooth" });
  };

  const miniProducts = products.map((p, idx) => ({ ...p, originalIdx: idx }));

  const currentGalleryImg = selectedGalleryImg || (product.media.gallery && product.media.gallery[0]) || product.media.cover;
  const galleryList = (product.media.gallery && product.media.gallery.length > 0
    ? product.media.gallery
    : [product.media.cover, product.media.detail, product.media.lifestyle]
  ).map((src, idx) => ({
    src,
    label: idx === 0 ? "Ảnh bìa chính (01)" : `Góc nhìn (${String(idx + 1).padStart(2, "0")})`,
  }));

  return (
    <>
      {/* ── 1. MASTER SHOWCASE SECTION ── */}
      <section
        className={styles.showcaseSection}
        id="shop-all"
        aria-labelledby="nk-shop-title"
      >
        {/* Background handwritten note */}
        <div className={styles.noteBottomLeft} aria-hidden="true">
          <p className={styles.bottomNoteText}>Việt Nam trong tim ta.</p>
        </div>

        <div className={styles.innerContainer}>
          {/* Top Header Bar */}
          <header className={styles.header}>
            <div className={styles.titleArea}>
              <p className={styles.eyebrow}>BỘ SƯU TẬP TIÊU BIỂU</p>
              <h2 id="nk-shop-title" className={styles.title}>
                Sáu Nơi Chốn, Sáu Nhịp Ánh Sáng.
              </h2>
              <p className={styles.subtitle}>
                Những miền ký ức Việt Nam, thu nhỏ trong từng chi tiết.
              </p>
            </div>
            <div className={styles.headerAside}>
              <a className={styles.allLink} href="/collections">
                Xem toàn bộ bộ sưu tập <span aria-hidden="true">→</span>
              </a>
            </div>
          </header>

          {/* Main 3-Column Work Area */}
          <div className={styles.showcaseLayout}>
            {/* ── LEFT: Spotlight Framed Card ── */}
            <div className={styles.spotlightCol}>
              <div className={styles.spotlightCard}>
                <div className={styles.spotlightInner}>
                  <img
                    src={product.media.cover}
                    alt={product.name}
                    className={`${styles.spotlightImg} ${
                      switching ? styles.switching : ""
                    }`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              {/* Overlapping Polaroid Note */}
              <div className={styles.polaroidNote} aria-hidden="true">
                <p className={styles.polaroidText}>
                  Một góc Việt Nam
                  <br />
                  thu nhỏ trong tầm tay.
                </p>
              </div>
            </div>

            {/* ── CENTER: Product Dossier & Specs ── */}
            <div className={styles.dossierCol}>
              {/* Location & Region Badge */}
              <div className={styles.metaRow}>
                <span className={styles.locName}>{product.location}</span>
                <span className={styles.regionBadge}>
                  {product.region === "north"
                    ? "MIỀN BẮC"
                    : product.region === "central"
                    ? "MIỀN TRUNG"
                    : "MIỀN NAM"}
                </span>
              </div>

              {/* Product Title & Description */}
              <h3 className={styles.prodTitle}>{product.name}</h3>
              <p className={styles.prodDesc}>{product.description}</p>

              {/* Specs Items */}
              <div className={styles.specsList}>
                <div className={styles.specItem}>
                  <span className={styles.specIcon} aria-hidden="true">
                    🧩
                  </span>
                  <div className={styles.specText}>
                    <span className={styles.specLabel}>ĐỘ KHÓ</span>
                    <strong className={styles.specValue}>
                      {product.difficulty}
                    </strong>
                  </div>
                </div>

                <div className={styles.specItem}>
                  <span className={styles.specIcon} aria-hidden="true">
                    ⏱
                  </span>
                  <div className={styles.specText}>
                    <span className={styles.specLabel}>THỜI GIAN RÁP</span>
                    <strong className={styles.specValue}>
                      {product.buildTime}
                    </strong>
                  </div>
                </div>

                <div className={styles.specItem}>
                  <span className={styles.specIcon} aria-hidden="true">
                    📦
                  </span>
                  <div className={styles.specText}>
                    <span className={styles.specLabel}>MẢNH GHÉP</span>
                    <strong className={styles.specValue}>
                      {product.pieces || "380–430"} mảnh
                    </strong>
                  </div>
                </div>
              </div>

              {/* Price Row */}
              <div className={styles.priceRow}>
                {product.regularPrice && (
                  <del className={styles.regularPrice}>
                    {formatVnd(product.regularPrice)}
                  </del>
                )}
                <span className={styles.priceValue}>
                  {formatVnd(product.price)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionRow}>
                <AddToCartButton
                  slug={product.slug}
                  className={styles.addCartBtn}
                  label="🛒 Thêm vào giỏ"
                  addedLabel="Đã thêm vào giỏ"
                  stopPropagation={true}
                />
                <button
                  type="button"
                  onClick={handleScrollToDetail}
                  className={styles.detailBtn}
                >
                  Xem chi tiết <span aria-hidden="true">↓</span>
                </button>
              </div>

              {/* Quote */}
              <p className={styles.quoteText}>
                “Ánh đèn vàng, giữ lại những điều bình yên.”
              </p>
            </div>

            {/* ── RIGHT: Mini Catalog Grid (6 Cards) ── */}
            <div className={styles.miniGridCol}>
              <div className={styles.miniCardsGrid}>
                {miniProducts.map((item) => {
                  const isCurrent = activeIdx === item.originalIdx;
                  return (
                    <div
                      key={item.slug}
                      className={`${styles.miniCard} ${
                        isCurrent ? styles.activeMiniCard : ""
                      }`}
                      onClick={() => handleSelectProduct(item.originalIdx)}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isCurrent}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleSelectProduct(item.originalIdx);
                        }
                      }}
                    >
                      <div className={styles.miniImgWrap}>
                        <img
                          src={item.media.cover}
                          alt={item.name}
                          className={styles.miniImg}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className={styles.miniInfo}>
                        <span className={styles.miniLoc}>{item.location}</span>
                        <h4 className={styles.miniName}>{item.name}</h4>
                        <div className={styles.miniBottom}>
                          <span className={styles.miniPrice}>
                            {formatVnd(item.price)}
                          </span>
                          <div
                            className={styles.miniCartBtnWrap}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <AddToCartButton
                              slug={item.slug}
                              className={styles.miniCartBtn}
                              label="🛒"
                              addedLabel="✓"
                              stopPropagation={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. DYNAMIC PRODUCT DETAIL SECTION BELOW ── */}
      <section
        className={styles.productDetailSection}
        id="product-detail"
        aria-labelledby="product-detail-title"
      >
        <div className={styles.innerContainer}>
          <div className={styles.detailHeader}>
            <div className={styles.metaRow}>
              <span className={styles.locName}>{product.location}</span>
              <span className={styles.regionBadge}>
                {product.region === "north"
                  ? "MIỀN BẮC"
                  : product.region === "central"
                  ? "MIỀN TRUNG"
                  : "MIỀN NAM"}
              </span>
            </div>
            <h2 id="product-detail-title" className={styles.detailTitle}>
              {product.name}
            </h2>
            <p className={styles.detailSub}>
              Khám phá không gian chi tiết và thông số lắp ráp hoàn chỉnh của nơi chốn này.
            </p>
          </div>

          <div className={styles.detailMainGrid}>
            {/* Gallery Column */}
            <div className={styles.detailGalleryCol}>
              <div className={styles.detailMainMediaWrap}>
                <img
                  src={currentGalleryImg}
                  alt={`${product.name} - ${product.location}`}
                  className={styles.detailMainImg}
                  loading="lazy"
                />
              </div>

              {/* Thumbnails */}
              <div className={styles.detailThumbList}>
                {galleryList.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.detailThumbBtn} ${
                      currentGalleryImg === item.src ? styles.activeDetailThumb : ""
                    }`}
                    onClick={() => setSelectedGalleryImg(item.src)}
                    aria-label={item.label}
                  >
                    <img src={item.src} alt={item.label} />
                  </button>
                ))}
              </div>
            </div>

            {/* Information & Specs Column */}
            <div className={styles.detailInfoCol}>
              <div className={styles.storyCard}>
                <h3 className={styles.sectionSubHeading}>CÂU CHUYỆN & CẢM CẢM NHẬN</h3>
                <p className={styles.storyText}>{product.description}</p>
              </div>

              <div className={styles.specsGridCard}>
                <h3 className={styles.sectionSubHeading}>THÔNG SỐ KỸ THUẬT</h3>
                <div className={styles.detailSpecsGrid}>
                  <div className={styles.specBox}>
                    <span className={styles.specBoxLabel}>ĐỘ KHÓ</span>
                    <span className={styles.specBoxValue}>{product.difficulty}</span>
                  </div>
                  <div className={styles.specBox}>
                    <span className={styles.specBoxLabel}>THỜI GIAN RÁP</span>
                    <span className={styles.specBoxValue}>{product.buildTime}</span>
                  </div>
                  <div className={styles.specBox}>
                    <span className={styles.specBoxLabel}>SỐ MẢNH GHÉP</span>
                    <span className={styles.specBoxValue}>{product.pieces || "380–430"} mảnh</span>
                  </div>
                  <div className={styles.specBox}>
                    <span className={styles.specBoxLabel}>ĐÈN LED INTEGRATED</span>
                    <span className={styles.specBoxValue}>
                      {product.hasLed ? "Có (Ánh sáng ấm)" : "Không"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Commerce Box */}
              <div className={styles.detailCommerceBox}>
                <div className={styles.detailPriceRow}>
                  {product.regularPrice && (
                    <del className={styles.detailRegularPrice}>
                      {formatVnd(product.regularPrice)}
                    </del>
                  )}
                  <span className={styles.detailPriceValue}>
                    {formatVnd(product.price)}
                  </span>
                </div>

                <div className={styles.detailCtaRow}>
                  <AddToCartButton
                    slug={product.slug}
                    className={styles.detailAddCartBtn}
                    label="🛒 Thêm vào giỏ hàng"
                    addedLabel="✓ Đã thêm vào giỏ"
                  />
                </div>

                <ul className={styles.trustBadges}>
                  <li>Miễn phí vận chuyển toàn quốc cho đơn từ 500k</li>
                  <li>Bảo hành mảnh ghép hư hỏng / hỏng hóc do vận chuyển</li>
                  <li>Hỗ trợ hướng dẫn lắp ráp 24/7</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

