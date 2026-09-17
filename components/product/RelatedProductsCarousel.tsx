"use client";

import { useRef } from "react";
import Link from "next/link";
import { formatVnd, type NookProduct } from "@/data/products";
import styles from "./RelatedProductsCarousel.module.css";

export function RelatedProductsCarousel({ products }: { products: NookProduct[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("article");
    const step = card ? card.offsetWidth + 18 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <div className={styles.carousel}>
      <div className={styles.controls} aria-label="Điều khiển sản phẩm liên quan">
        <button type="button" onClick={() => scroll(-1)} aria-label="Sản phẩm trước">←</button>
        <button type="button" onClick={() => scroll(1)} aria-label="Sản phẩm tiếp theo">→</button>
      </div>

      <div className={styles.track} ref={trackRef}>
        {products.map((item) => (
          <article className={styles.card} key={item.slug}>
            <Link href={`/product/${item.slug}`} className={styles.link}>
              <img src={item.media.cover} alt={item.name} loading="lazy" decoding="async" />
              <div className={styles.meta}>
                <div>
                  <p>{item.location}</p>
                  <h3>{item.name}</h3>
                </div>
                <strong>{formatVnd(item.price)}</strong>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
