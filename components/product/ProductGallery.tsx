"use client";

import { useMemo, useState } from "react";
import styles from "./ProductGallery.module.css";

type ProductGalleryProps = {
  images: string[];
  labels?: string[];
  name: string;
};

export function ProductGallery({ images, labels = [], name }: ProductGalleryProps) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!safeImages.length) {
    return (
      <div className={styles.empty}>
        <span>Đang cập nhật bộ ảnh sản phẩm</span>
      </div>
    );
  }

  const activeImage = safeImages[Math.min(activeIndex, safeImages.length - 1)];

  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => {
      const next = current + direction;
      if (next < 0) return safeImages.length - 1;
      if (next >= safeImages.length) return 0;
      return next;
    });
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.stage}>
        <img
          key={activeImage}
          src={activeImage}
          alt={`${name} — ${labels[activeIndex] ?? `ảnh ${activeIndex + 1}`}`}
          className={styles.mainImage}
          loading={activeIndex === 0 ? "eager" : "lazy"}
          decoding="async"
        />

        {safeImages.length > 1 ? (
          <>
            <button
              className={`${styles.arrow} ${styles.arrowLeft}`}
              type="button"
              onClick={() => move(-1)}
              aria-label="Ảnh trước"
            >
              ←
            </button>
            <button
              className={`${styles.arrow} ${styles.arrowRight}`}
              type="button"
              onClick={() => move(1)}
              aria-label="Ảnh tiếp theo"
            >
              →
            </button>
          </>
        ) : null}

        <div className={styles.counter} aria-live="polite">
          {activeIndex + 1} / {safeImages.length}
        </div>
      </div>

      <div className={styles.thumbnails} aria-label="Thư viện ảnh sản phẩm">
        {safeImages.map((image, index) => (
          <button
            type="button"
            key={`${image}-${index}`}
            className={`${styles.thumbnail} ${activeIndex === index ? styles.thumbnailActive : ""}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Xem ${labels[index] ?? `ảnh ${index + 1}`}`}
            aria-pressed={activeIndex === index}
          >
            <img src={image} alt="" loading="lazy" decoding="async" />
            <span>{labels[index] ?? `${index + 1}`}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
