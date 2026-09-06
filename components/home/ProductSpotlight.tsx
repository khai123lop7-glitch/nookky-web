"use client";

import { useState } from "react";
import { formatVnd, spotlightProduct as product } from "@/data/products";

const gallery = [product.media.cover, product.media.detail, product.media.lifestyle];

export function ProductSpotlight() {
  const [slide, setSlide] = useState(0);
  const [zoom, setZoom] = useState(false);

  const go = (next: number) => setSlide((next + gallery.length) % gallery.length);

  return (
    <section className="nk-spotlight" aria-labelledby="spotlight-title">
      <div className="nk-container-wide nk-spotlight__grid">
        <div className="nk-spotlight__media">
          <div className="nk-spotlight__stage">
            <img src={gallery[slide]} alt={`${product.name} - ảnh ${slide + 1}`} />
            <button className="nk-spotlight__zoom" type="button" onClick={() => setZoom(true)} aria-label="Phóng to ảnh">
              ＋ <span>Phóng to</span>
            </button>
          </div>
          <div className="nk-spotlight__rail">
            <div className="nk-dots" aria-label="Chọn ảnh sản phẩm">
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
              <button type="button" onClick={() => go(slide - 1)} aria-label="Ảnh trước">←</button>
              <button type="button" onClick={() => go(slide + 1)} aria-label="Ảnh tiếp theo">→</button>
            </div>
          </div>
        </div>

        <div className="nk-spotlight__content-wrap">
          <div className="nk-spotlight__content">
            <p className="nk-eyebrow">{product.location}</p>
            <h2 id="spotlight-title">{product.name}</h2>
            <p>{product.description}</p>
            <dl className="nk-spotlight__facts">
              <div><dt>Độ khó</dt><dd>{product.difficulty}</dd></div>
              <div><dt>Thời gian lắp</dt><dd>{product.buildTime}</dd></div>
              {product.pieces ? <div><dt>Số mảnh</dt><dd>{product.pieces}</dd></div> : null}
            </dl>
            <div className="nk-spotlight__price">
              {product.regularPrice ? <s>{formatVnd(product.regularPrice)}</s> : null}
              <strong>{formatVnd(product.price)}</strong>
            </div>
            <div className="nk-spotlight__actions">
              <button className="nk-button" type="button" disabled title="Commerce backend sẽ nối ở phase sau">Thêm vào giỏ</button>
              <a href={`/product/${product.slug}`}>Xem chi tiết sản phẩm</a>
            </div>
            <ul className="nk-spotlight__trust">
              <li>Có hệ đèn LED</li>
              <li>Miễn phí vận chuyển cho đơn từ 1.000.000₫</li>
              <li>Thông số và hướng dẫn lắp sẽ được đưa vào Product Data Layer</li>
            </ul>
          </div>
        </div>
      </div>

      {zoom ? (
        <div className="nk-zoom" role="dialog" aria-modal="true" aria-label="Ảnh sản phẩm phóng to">
          <button type="button" className="nk-zoom__close" onClick={() => setZoom(false)} aria-label="Đóng">×</button>
          <img src={gallery[slide]} alt={product.name} />
        </div>
      ) : null}
    </section>
  );
}
