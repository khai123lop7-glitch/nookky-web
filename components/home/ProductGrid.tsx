"use client";

import { useState } from "react";
import { formatVnd, products } from "@/data/products";
import { track } from "@/lib/analytics";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import styles from "./ProductGrid.module.css";

export function ProductGrid() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [switching, setSwitching] = useState(false);

  const product = products[activeIdx];

  const handleSelectProduct = (index: number) => {
    if (index === activeIdx) return;
    setSwitching(true);
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

  // 5 mini cards on the right (excluding active product or all 5 other products)
  const miniProducts = products.map((p, idx) => ({ ...p, originalIdx: idx }));

  return (
    <section
      className={styles.showcaseSection}
      id="shop-all"
      aria-labelledby="nk-shop-title"
    >
      {/* Background handwritten note at bottom right: "Việt Nam trong tim ta." */}
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
            <a className={styles.allLink} href="/shop">
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

            {/* 3 Specs Items */}
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
                    {product.pieces || "390–430"} mảnh
                  </strong>
                </div>
              </div>
            </div>

            {/* Price Row */}
            <div className={styles.priceRow}>
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
              <a
                href={`/product/${product.slug}`}
                className={styles.detailBtn}
              >
                Xem chi tiết <span aria-hidden="true">→</span>
              </a>
            </div>

            {/* Quote */}
            <p className={styles.quoteText}>
              “Ánh đèn vàng, giữ lại những điều bình yên.”
            </p>
          </div>

          {/* ── RIGHT: Mini Catalog Grid (6 Cards, 3 cols x 2 rows) ── */}
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
  );
}
