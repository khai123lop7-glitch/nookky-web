"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ProductGallery.module.css";

type ProductGalleryProps = {
  images: string[];
  labels?: string[];
  name: string;
};

export function ProductGallery({ images, labels = [], name }: ProductGalleryProps) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  if (!safeImages.length) {
    return (
      <div className={styles.empty}>
        <span>Đang cập nhật bộ ảnh sản phẩm</span>
      </div>
    );
  }

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + safeImages.length) % safeImages.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % safeImages.length);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 45) return;
    if (delta > 0) showPrevious();
    else showNext();
  };

  const activeImage = safeImages[activeIndex];
  const activeLabel = labels[activeIndex] ?? `Ảnh ${activeIndex + 1}`;

  return (
    <div
      className={styles.gallery}
      aria-label="Thư viện ảnh sản phẩm"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") showPrevious();
        if (event.key === "ArrowRight") showNext();
      }}
    >
      <div
        className={styles.mainStage}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          key={activeImage}
          src={activeImage}
          alt={`${name} — ${activeLabel}`}
          className={styles.mainImage}
          loading="eager"
          decoding="async"
        />

        {safeImages.length > 1 ? (
          <>
            <button
              type="button"
              className={`${styles.arrowButton} ${styles.arrowPrevious}`}
              onClick={showPrevious}
              aria-label="Ảnh trước"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              type="button"
              className={`${styles.arrowButton} ${styles.arrowNext}`}
              onClick={showNext}
              aria-label="Ảnh tiếp theo"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </>
        ) : null}

        <div className={styles.counter} aria-live="polite">
          {activeIndex + 1} / {safeImages.length}
        </div>
      </div>

      <div className={styles.thumbnailRow} aria-label="Chọn ảnh sản phẩm">
        {safeImages.map((image, index) => {
          const label = labels[index] ?? `Ảnh ${index + 1}`;
          const isActive = index === activeIndex;

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              className={`${styles.thumbnailButton} ${isActive ? styles.thumbnailActive : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Hiển thị ${label}`}
              aria-current={isActive ? "true" : undefined}
            >
              <img src={image} alt="" loading="lazy" decoding="async" />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.caption}>
        <span>{String(activeIndex + 1).padStart(2, "0")}</span>
        <strong>{activeLabel}</strong>
      </div>
    </div>
  );
}
