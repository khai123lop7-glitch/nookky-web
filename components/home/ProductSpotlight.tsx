"use client";

import { useEffect, useState } from "react";
import { formatVnd, spotlightProduct as product } from "@/data/products";

const gallery = [product.media.cover, product.media.detail, product.media.lifestyle];

export function ProductSpotlight() {
  const [slide, setSlide] = useState(0);
  const [zoom, setZoom] = useState(false);

  const go = (next: number) => setSlide((next + gallery.length) % gallery.length);

  useEffect(() => {
    if (!zoom) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setZoom(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [zoom]);

  return (
    <section className="nk-spotlight" aria-labelledby="nk-spotlight-title">
      <div className="nk-container-wide nk-spotlight__grid">
        <div className="nk-spotlight__media">
          <div className="nk-spotlight__stage">
            {gallery.map((src, index) => (
              <img
                key={src}
                className={`nk-spotlight__image ${slide === index ? "is-active" : ""}`}
                src={src}
                alt={`${product.name} - ảnh ${index + 1}`}
                loading="lazy"
              />
            ))}
            <button className="nk-spotlight__zoom" type="button" onClick={() => setZoom(true)} aria-label="Phóng to ảnh sản phẩm">
              <span aria-hidden="true">＋</span><span>Phóng to</span>
            </button>
          </div>

          <div className="nk-spotlight__media-rail">
            <div className="nk-spotlight__dots" aria-label="Chọn ảnh sản phẩm">
              {gallery.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  className={slide === index ? "is-active" : ""}
                  onClick={() => setSlide(index)}
                  aria-label={`Xem ảnh ${index + 1}`}
                  aria-current={slide === index}
                />
              ))}
            </div>
            <div className="nk-spotlight__arrows">
              <button className="nk-spotlight__nav" type="button" onClick={() => go(slide - 1)} aria-label="Ảnh trước">←</button>
              <button className="nk-spotlight__nav" type="button" onClick={() => go(slide + 1)} aria-label="Ảnh tiếp theo">→</button>
            </div>
          </div>
        </div>

        <div className="nk-spotlight__content-wrap">
          <div className="nk-spotlight__content">
            <p className="nk-eyebrow">{product.location}</p>
            <h2 id="nk-spotlight-title">{product.name}</h2>
            <div className="nk-spotlight__description"><p>{product.description}</p></div>

            <dl className="nk-spotlight__facts">
              <div><dt>Độ khó</dt><dd>{product.difficulty}</dd></div>
              <div><dt>Thời gian lắp</dt><dd>{product.buildTime}</dd></div>
            </dl>

            <div className="nk-spotlight__price">
              {product.regularPrice ? <del>{formatVnd(product.regularPrice)}</del> : null}
              <strong>{formatVnd(product.price)}</strong>
            </div>

            <div className="nk-spotlight__actions">
              <a className="nk-button" href={`/product/${product.slug}`}>
                Xem chi tiết sản phẩm
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5"/></svg>
              </a>
              <a className="nk-text-link" href="/shop">Xem toàn bộ bộ sưu tập</a>
            </div>

            <ul className="nk-spotlight__trust">
              <li>Miễn phí vận chuyển cho đơn từ 1.000.000₫</li>
              <li>Hướng dẫn lắp và thông số nằm trên trang sản phẩm</li>
            </ul>
          </div>
        </div>
      </div>

      {zoom ? (
        <div className="nk-zoom-modal" role="dialog" aria-modal="true" aria-label="Ảnh sản phẩm phóng to" onClick={() => setZoom(false)}>
          <button type="button" className="nk-zoom-modal__close" onClick={() => setZoom(false)} aria-label="Đóng ảnh phóng to">×</button>
          <img src={gallery[slide]} alt={product.name} onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </section>
  );
}
