"use client";

import { useState } from "react";
import styles from "./BrandStory.module.css";

interface Chapter {
  id: string;
  number: string;
  title: string;
  lead: string;
  sub: string;
}

const chapters: Chapter[] = [
  {
    id: "chap-1",
    number: "Chương I",
    title: "Linh Hồn Nơi Chốn",
    lead: "ook Ký sáng tạo những bộ mô hình Book Nook nghệ thuật, lấy cảm hứng từ những địa danh thân quen của Việt Nam. Đặt vào một khoảng không gian nhỏ, đó là cả một thế giới thu nhỏ — nơi những con phố, mái nhà, ánh đèn và ký ức được tái hiện qua từng chi tiết thủ công.",
    sub: "Từ mái ngói rêu phong của phố Hội, sân gạch cổ kính ở Huế, đến nhịp sống nhộn nhịp của Sài Gòn hay khung cảnh bình yên nơi miền Tây, mỗi mô hình là một lát cắt văn hóa, một câu chuyện được kể bằng đôi tay và tình yêu với Việt Nam.",
  },
  {
    id: "chap-2",
    number: "Chương II",
    title: "Chất Liệu Thời Gian",
    lead: "hững khối gỗ bạch dương tự nhiên được cắt gọt tinh xảo kết hợp kỹ thuật in màu phong sương tái hiện chân thực màu gạch cũ, mảng tường loang lổ rêu xanh và ánh đèn lồng rực rỡ lúc chạng vạng.",
    sub: "Mỗi chi tiết nhỏ — từ chậu cúc bên thềm nhà, bảng hiệu gỗ phố cổ đến ban công ngắm mưa — đều giữ trọn vẹn hơi thở mộc mạc và ký ức của một vùng đất.",
  },
  {
    id: "chap-3",
    number: "Chương III",
    title: "Nghệ Thuật Chậm Rãi",
    lead: "ành trình 6 đến 8 tiếng kiên nhẫn gài từng mối mộng gỗ, đấu nối hệ thống dây đèn Warm LED giấu kín là khoảng lặng quý giá để bạn tạm rời xa màn hình số và hòa mình vào sự tĩnh tại của đôi bàn tay.",
    sub: "Khi công tắc bật lên và con hẻm tí hon bừng sáng ánh đèn ấm áp giữa các trang sách, đó là khoảnh khắc niềm tự hào và ký ức tìm về vẹn nguyên.",
  },
];

export function BrandStory() {
  const [activeIdx, setActiveIdx] = useState(0);
  const currentChapter = chapters[activeIdx];

  return (
    <section
      className={styles.storySection}
      id="brand-story"
      aria-labelledby="nk-story-title"
    >
      {/* Background Video */}
      <div className={styles.videoBgWrap} aria-hidden="true">
        <video
          className={styles.videoBg}
          autoPlay
          muted
          loop
          playsInline
          poster="/media/editorial/brand-story-bg.png"
        >
          <source src="/media/editorial/section2.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoOverlay} />
      </div>

      {/* 1. Top-Left: Handwritten Scrapbook Note */}
      <div className={styles.noteTopLeft} aria-hidden="true">
        <p className={styles.noteText}>
          Một góc Việt Nam
          <br />
          thu nhỏ trong tầm tay
        </p>
      </div>

      {/* 2. Bottom-Right: Handwritten Location Note */}
      <div className={styles.noteBottomRight} aria-hidden="true">
        <p className={styles.locationText}>
          Hội An
          <br />
          Việt Nam
        </p>
      </div>

      {/* Main Inner Container */}
      <div className={styles.innerContainer}>
        {/* Left: Scrapbook Photo Composition */}
        <div className={styles.leftCol}>
          <div className={styles.collageWrapper}>
            {/* Torn Kraft Paper Layer Behind */}
            <div className={styles.tornPaperBackdrop} aria-hidden="true" />

            {/* Main Framed Photo */}
            <div className={styles.mainPhotoCard}>
              <div className={styles.mainPhotoInner}>
                <img
                  src="/media/editorial/brand-close.webp"
                  alt="Mô hình Book Nook Hội An trên kệ gỗ"
                  className={styles.mainPhotoImg}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Overlapping Polaroid Photo */}
            <div className={styles.polaroidCard}>
              <div className={styles.polaroidImgWrap}>
                <img
                  src="/media/products/01-pho-vua-len-den-hoi-an/detail.webp"
                  alt="Ánh đèn ấm áp trong mô hình"
                  className={styles.polaroidImg}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className={styles.polaroidCaption}>
                Những điều nhỏ bé
                <br />
                luôn ở lại lâu nhất.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Typography & Brand Content */}
        <div className={styles.rightCol}>
          {/* Header Block */}
          <div className={styles.headerBlock}>
            <div className={styles.headerMain}>
              <p className={styles.eyebrow}>CÂU CHUYỆN THƯƠNG HIỆU</p>
              <div className={styles.headerTick} aria-hidden="true" />
              <h2 id="nk-story-title" className={styles.mainHeadline}>
                Xây một góc nhỏ,
                <br />
                giữ một ký ức riêng.
              </h2>
            </div>

            {/* Right Margin Note */}
            <div className={styles.sideNote} aria-hidden="true">
              <div className={styles.sideNoteLine} />
              <span className={styles.sideNoteText}>
                Những
                <br />
                nơi chốn
                <br />
                đáng nhớ
              </span>
            </div>
          </div>

          {/* 3 Horizontal Chapter Tabs */}
          <div
            className={styles.chapterTabs}
            role="tablist"
            aria-label="Các chương ký sự"
          >
            {chapters.map((ch, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={ch.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIdx(idx)}
                  className={`${styles.chapterBtn} ${
                    isActive ? styles.activeChapter : ""
                  }`}
                >
                  <span className={styles.btnNum}>{ch.number}</span>
                  <span className={styles.btnTitle}>{ch.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Chapter Reading Body */}
          <div className={styles.chapterStoryBody} key={currentChapter.id}>
            <h3 className={styles.chapterTitle}>{currentChapter.title}</h3>

            <div className={styles.paragraphGroup}>
              <p className={styles.storyParagraph}>
                <span className={styles.dropCapN}>N</span>
                {currentChapter.lead}
              </p>
              <p className={styles.storyParagraph}>{currentChapter.sub}</p>
            </div>

            {/* Hairline divider & CTA link */}
            <div className={styles.ctaDivider} aria-hidden="true" />
            <div className={styles.ctaLinkWrap}>
              <a href="/shop" className={styles.ctaLink}>
                Khám phá bộ sưu tập <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
