"use client";

import { useEffect, useRef, useState } from "react";
import { formatVnd, spotlightProduct as product } from "@/data/products";
import { track } from "@/lib/analytics";

const gallery = [product.media.cover, product.media.detail, product.media.lifestyle];

export function ProductSpotlight() {
  const [slide, setSlide] = useState(0);
  const [zoom, setZoom] = useState(false);
  const zoomTriggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const selectSlide = (next: number) => {
    const normalized = (next + gallery.length) % gallery.length;
    setSlide(normalized);
    track("spotlight_gallery_change", { product: product.slug, image_index: normalized + 1 });
  };

  const openZoom = () => {
    setZoom(true);
    track("spotlight_zoom_open", { product: product.slug, image_index: slide + 1 });
  };

  useEffect(() => {
    if (!zoom) return;

    const closeModal = () => setZoom(false);
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }
      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeydown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeydown);
      window.requestAnimationFrame(() => zoomTriggerRef.current?.focus());
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
                decoding="async"
              />
            ))}
            <button ref={zoomTriggerRef} className="nk-spotlight__zoom" type="button" onClick={openZoom} aria-label="Phóng to ảnh sản phẩm">
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
                  onClick={() => selectSlide(index)}
                  aria-label={`Xem ảnh ${index + 1}`}
                  aria-pressed={slide === index}
                />
              ))}
            </div>
            <div className="nk-spotlight__arrows">
              <button className="nk-spotlight__nav" type="button" onClick={() => selectSlide(slide - 1)} aria-label="Ảnh trước">←</button>
              <button className="nk-spotlight__nav" type="button" onClick={() => selectSlide(slide + 1)} aria-label="Ảnh tiếp theo">→</button>
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
        <div className="nk-zoom-modal" role="dialog" aria-modal="true" aria-label={`Ảnh phóng to ${product.name}`} onClick={() => setZoom(false)}>
          <button ref={closeButtonRef} type="button" className="nk-zoom-modal__close" onClick={() => setZoom(false)} aria-label="Đóng ảnh phóng to">×</button>
          <img src={gallery[slide]} alt={product.name} decoding="async" onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </section>
  );
}
