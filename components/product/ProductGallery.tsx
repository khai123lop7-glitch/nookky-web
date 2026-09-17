"use client";

import { useMemo } from "react";
import styles from "./ProductGallery.module.css";

type ProductGalleryProps = {
  images: string[];
  labels?: string[];
  name: string;
};

export function ProductGallery({ images, labels = [], name }: ProductGalleryProps) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);

  if (!safeImages.length) {
    return (
      <div className={styles.empty}>
        <span>Đang cập nhật bộ ảnh sản phẩm</span>
      </div>
    );
  }

  return (
    <div className={styles.gallery} aria-label="Thư viện ảnh sản phẩm">
      {safeImages.map((image, index) => (
        <figure className={styles.frame} key={`${image}-${index}`}>
          <img
            src={image}
            alt={`${name} — ${labels[index] ?? `ảnh ${index + 1}`}`}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
          <figcaption>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{labels[index] ?? `Ảnh ${index + 1}`}</strong>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
