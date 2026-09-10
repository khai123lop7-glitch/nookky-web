"use client";

import { useState } from "react";
import { products } from "@/data/products";
import styles from "./RealNooks.module.css";

const realNooks = [
  { product: products[0], context: "Góc đọc sách ban đêm", label: "Phòng đọc & Thư phòng" },
  { product: products[2], context: "Bên cửa sổ đón nắng", label: "Khu vực cửa sổ phố cổ" },
  { product: products[4], context: "Bàn làm việc sáng tạo", label: "Bàn làm việc gỗ thông" },
  { product: products[5], context: "Kệ sách phòng khách", label: "Kệ sách chính giữa phòng" },
];

export function RealNooks() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [switching, setSwitching] = useState(false);
  const current = realNooks[activeIdx];

  const handleSelect = (idx: number) => {
    if (idx === activeIdx) return;
    setSwitching(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setTimeout(() => setSwitching(false), 50);
    }, 120);
  };

  return (
    <section className={styles.realSection} aria-labelledby="nk-real-title">
      <div className={styles.innerContainer}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>TRONG KHÔNG GIAN THẬT</p>
            <h2 id="nk-real-title" className={styles.title}>
              Nook Ký Trong Những Căn Phòng Thật.
            </h2>
          </div>
          <p className={styles.lead}>
            Một Book Nook chỉ thực sự hoàn chỉnh khi trở thành một phần thân thuộc của kệ sách và không gian sống của bạn.
          </p>
        </header>

        {/* Gallery Grid */}
        <div className={styles.galleryGrid}>
          {/* Left: Main Stage */}
          <div className={styles.stage}>
            <img
              src={current.product.media.lifestyle}
              alt={`${current.product.name} trong ${current.context.toLowerCase()}`}
              className={`${styles.stageImg} ${switching ? styles.switching : ""}`}
              loading="lazy"
              decoding="async"
            />
            <div className={styles.stageOverlay} />
            <div className={styles.stageCaption}>
              <div className={styles.captionLeft}>
                <span className={styles.roomTag}>{current.context}</span>
                <h3 className={styles.productTag}>{current.product.name}</h3>
              </div>
              <a href={`/product/${current.product.slug}`} className={styles.viewBtn}>
                Xem tác phẩm
              </a>
            </div>
          </div>

          {/* Right: Room Thumbnails */}
          <div className={styles.roomList} role="tablist" aria-label="Chọn không gian phòng">
            {realNooks.map((item, idx) => (
              <button
                key={item.product.slug}
                type="button"
                role="tab"
                aria-selected={activeIdx === idx}
                onClick={() => handleSelect(idx)}
                className={`${styles.roomCard} ${activeIdx === idx ? styles.activeRoom : ""}`}
              >
                <div className={styles.thumbWrap}>
                  <img
                    src={item.product.media.lifestyle}
                    alt=""
                    className={styles.thumbImg}
                    loading="lazy"
                  />
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.cardRoom}>{item.context}</span>
                  <span className={styles.cardProd}>{item.product.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
