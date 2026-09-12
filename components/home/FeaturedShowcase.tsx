"use client";

import { useState } from "react";
import styles from "./FeaturedShowcase.module.css";
import { formatVnd } from "@/data/products";

interface FeaturedItem {
  id: string;
  location: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  mainMedia: string;
  detailMedia: string;
  thumbMedia: string;
}

const FEATURED_ITEMS: FeaturedItem[] = [
  {
    id: "01",
    location: "HỘI AN",
    name: "Nook Phố Cổ Hội An",
    description: "Một góc phố vàng, đèn lồng và những buổi chiều chậm rãi bên sông Hoài.",
    price: 890000,
    slug: "pho-vua-len-den-hoi-an",
    mainMedia: "/media/products/01-pho-vua-len-den-hoi-an/cover.webp",
    detailMedia: "/media/products/01-pho-vua-len-den-hoi-an/detail.webp",
    thumbMedia: "/media/products/01-pho-vua-len-den-hoi-an/lifestyle.webp",
  },
  {
    id: "02",
    location: "HUẾ",
    name: "Nook Mưa Qua Sân Gạch",
    description: "Một khoảng sân Huế trầm và sâu, với nhịp mái rêu phong và nền gạch yên ả sau cơn mưa.",
    price: 920000,
    slug: "mua-qua-san-gach-hue",
    mainMedia: "/media/products/02-mua-qua-san-gach-hue/cover.webp",
    detailMedia: "/media/products/02-mua-qua-san-gach-hue/detail.webp",
    thumbMedia: "/media/products/02-mua-qua-san-gach-hue/lifestyle.webp",
  },
  {
    id: "03",
    location: "HÀ NỘI",
    name: "Nook Sáng Trên Phố Cũ",
    description: "Một lát cắt phố cũ Hà Nội với ban công hoa sắt, vệt nắng nghiêng và mái ngói cổ kính.",
    price: 850000,
    slug: "sang-tren-pho-cu-ha-noi",
    mainMedia: "/media/products/03-sang-tren-pho-cu-ha-noi/cover.webp",
    detailMedia: "/media/products/03-sang-tren-pho-cu-ha-noi/detail.webp",
    thumbMedia: "/media/products/03-sang-tren-pho-cu-ha-noi/lifestyle.webp",
  },
  {
    id: "04",
    location: "SÀI GÒN",
    name: "Nook Hẻm Còn Sáng Đèn",
    description: "Con hẻm Sài Gòn rực rỡ khi đêm xuống, nhiều lớp mặt tiền và ánh đèn ấm áp nghĩa tình.",
    price: 1090000,
    slug: "hem-con-sang-den-sai-gon",
    mainMedia: "/media/products/04-hem-con-sang-den-sai-gon/cover.webp",
    detailMedia: "/media/products/04-hem-con-sang-den-sai-gon/detail.webp",
    thumbMedia: "/media/products/04-hem-con-sang-den-sai-gon/lifestyle.webp",
  },
];

export function FeaturedShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const currentItem = FEATURED_ITEMS[activeIndex];

  return (
    <section
      className={styles.showcaseSection}
      id="san-pham-tieu-bieu"
      aria-labelledby="featured-showcase-title"
    >
      <div className={styles.innerContainer}>
        {/* ── 3-Column Main Grid ── */}
        <div className={styles.mainGrid}>
          {/* Left Column: Heading & Snapshot Detail Card */}
          <div className={styles.leftCol} data-nk-reveal="left" data-nk-delay="1">
            <div className={styles.eyebrowWrap}>
              <span className={styles.eyebrowLine} aria-hidden="true" />
              <span className={styles.eyebrow}>SẢN PHẨM TIÊU BIỂU</span>
            </div>

            <h2 id="featured-showcase-title" className={styles.heading}>
              Những góc Việt,
              <br />
              thu nhỏ cho riêng bạn.
            </h2>

            <p className={styles.lead}>
              Từ phố cổ Hội An đến những góc ký ức Hà Nội, mỗi Nook là một không
              gian nhỏ để bạn tự tay lắp ráp và giữ lại một câu chuyện Việt Nam.
            </p>

            {/* Sub Detail Snapshot Card */}
            <div className={styles.detailCard} data-nk-reveal data-nk-delay="2" data-nk-tilt>
              <div className={styles.detailMediaWrap}>
                <img
                  src={currentItem.detailMedia}
                  alt={`Chi tiết ${currentItem.name}`}
                  className={styles.detailImg}
                  loading="lazy"
                />
              </div>

              <div className={styles.detailBody}>
                <div className={styles.locationTagWrap}>
                  <span className={styles.locationTag}>{currentItem.location}</span>
                  <span className={styles.tagLine} aria-hidden="true" />
                </div>

                <h3 className={styles.productName}>{currentItem.name}</h3>

                <p className={styles.productDesc}>{currentItem.description}</p>

                <div className={styles.priceAndCta}>
                  <span className={styles.priceLabel}>
                    Từ {formatVnd(currentItem.price)}
                  </span>

                  <a
                    href={`/product/${currentItem.slug}`}
                    className={styles.exploreLink}
                  >
                    <span>Khám phá Nook</span>
                    <span className={styles.arrowIcon} aria-hidden="true">
                      &rarr;
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: Hero Stage Frame with Zoom Feature */}
          <div className={styles.centerCol} data-nk-reveal="scale" data-nk-delay="2">
            <div className={styles.centerStageFrame} data-nk-tilt>
              <button
                type="button"
                className={styles.zoomBtn}
                onClick={() => setIsZoomOpen(true)}
                aria-label="Phóng to chi tiết tác phẩm"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              <img
                src={currentItem.mainMedia}
                alt={currentItem.name}
                className={styles.centerStageImg}
                loading="eager"
              />
            </div>
          </div>

          {/* Right Column: Thumbnail Selector & Vertical Pagination */}
          <div className={styles.rightCol} data-nk-reveal="right" data-nk-delay="3">
            <div className={styles.paginationCounter} aria-hidden="true">
              <span>02</span>
              <span className={styles.paginationSlash}>/</span>
              <span className={styles.paginationActive}>03</span>
              <span className={styles.paginationSlash}>/</span>
              <span>04</span>
            </div>

            <div
              className={styles.thumbList}
              role="tablist"
              aria-label="Chọn sản phẩm tiêu biểu"
            >
              {FEATURED_ITEMS.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Xem sản phẩm ${item.name}`}
                    className={`${styles.thumbBtn} ${
                      isActive ? styles.activeThumb : ""
                    }`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <img
                      src={item.thumbMedia || item.mainMedia}
                      alt={item.name}
                      className={styles.thumbImg}
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Bottom Section Footer Bar ── */}
        <div className={styles.bottomBar} data-nk-reveal data-nk-delay="4">
          <div className={styles.bottomLeft}>
            <span className={styles.bottomNum}>01</span>
            <span className={styles.bottomLine} aria-hidden="true" />
            <span className={styles.bottomSub}>
              VIỆT NAM THU NHỎ TRONG TỪNG CHI TIẾT
            </span>
          </div>

          <div className={styles.bottomRight}>
            <span className={styles.bottomRightDecorLine} aria-hidden="true" />
            <span className={styles.sloganLine1}>A SMALL NOOK</span>
            <span className={styles.sloganLine2}>A LASTING MEMORY</span>
          </div>
        </div>
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomOpen && (
        <div
          className={styles.zoomOverlay}
          onClick={() => setIsZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh phóng to chi tiết"
        >
          <div
            className={styles.zoomContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.zoomCloseBtn}
              onClick={() => setIsZoomOpen(false)}
              aria-label="Đóng cửa sổ phóng to"
            >
              &times;
            </button>
            <img
              src={currentItem.mainMedia}
              alt={currentItem.name}
              className={styles.zoomImg}
            />
            <p className={styles.zoomCaption}>
              {currentItem.name} &bull; {currentItem.location}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
