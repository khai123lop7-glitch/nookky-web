"use client";

import { useState, useRef, useEffect } from "react";
import { track } from "@/lib/analytics";
import styles from "./Hero.module.css";

interface LandscapeStory {
  id: string;
  name: string;
  sub: string;
  videoSrc: string;
  posterSrc: string;
  thumbSrc: string;
  headlineMain: string;
  headlineAccent: string;
  lead: string;
}

const LANDSCAPES: LandscapeStory[] = [
  {
    id: "hoi-an",
    name: "Hội An",
    sub: "Phố cổ hoa đăng",
    videoSrc: "/media/editorial/hero-hoian.mp4",
    posterSrc: "/media/products/01-pho-vua-len-den-hoi-an/cover.webp",
    thumbSrc: "/media/editorial/hero-thumb-hoian.png",
    headlineMain: "Giữ lại một",
    headlineAccent: "góc Việt Nam.",
    lead: "Những nơi chốn quen thuộc, thu nhỏ thành một góc sáng để bạn tự tay hoàn thiện và giữ lại trên kệ sách.",
  },
  {
    id: "hue",
    name: "Huế",
    sub: "Mưa qua sân gạch",
    videoSrc: "/media/editorial/hue.mp4",
    posterSrc: "/media/products/02-mua-qua-san-gach-hue/cover.webp",
    thumbSrc: "/media/editorial/hero-thumb-hue.png",
    headlineMain: "Khoảng sân trầm",
    headlineAccent: "sau cơn mưa.",
    lead: "Khoảng sân Huế rêu phong, nhịp mái ngói âm dương và mảng tường gỗ trầm mặc mang lại sự an yên.",
  },
  {
    id: "sai-gon",
    name: "TP. Hồ Chí Minh",
    sub: "Hẻm còn sáng đèn",
    videoSrc: "/media/editorial/sai-gon.mp4",
    posterSrc: "/media/products/04-hem-con-sang-den-sai-gon/cover.webp",
    thumbSrc: "/media/editorial/hero-thumb-saigon.png",
    headlineMain: "Góc hẻm thức cùng",
    headlineAccent: "thành phố.",
    lead: "Dây điện chằng chịt, xe hủ tiếu gõ và nhịp sống nghĩa tình không bao giờ ngủ của phố thị phương Nam.",
  },
];

export function Hero() {
  const [activeLandscape, setActiveLandscape] = useState<string>("hoi-an");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  const currentIndex = LANDSCAPES.findIndex((l) => l.id === activeLandscape);
  const current = LANDSCAPES[currentIndex] || LANDSCAPES[0];

  // Auto-play video on landscape switch
  useEffect(() => {
    if (videoRef.current && current.videoSrc) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [activeLandscape, current.videoSrc]);

  const handleLandscapeChange = (newId: string) => {
    if (newId === activeLandscape) return;
    setActiveLandscape(newId);
    track("hero_landscape_change", { landscape: newId });
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % LANDSCAPES.length;
    handleLandscapeChange(LANDSCAPES[nextIdx].id);
  };

  return (
    <section className={styles.heroSection} aria-labelledby="nk-hero-title">
      {/* Background Video Media */}
      <div className={styles.mediaContainer} aria-hidden="true">
        {current.videoSrc ? (
          <video
            ref={videoRef}
            className={styles.bgVideo}
            autoPlay
            loop
            muted
            playsInline
            poster={current.posterSrc}
            src={current.videoSrc}
          />
        ) : (
          <img src={current.posterSrc} alt={current.name} className={styles.bgImage} />
        )}
      </div>

      {/* Cinematic Vignette Overlay */}
      <div className={styles.vignetteOverlay} aria-hidden="true" />

      {/* ── Main Center Content ─────────────────────────────── */}
      <div className={styles.contentContainer}>
        {/* Main Center Headline & Story */}
        <div className={styles.centerDossier}>
          <h1 id="nk-hero-title" className={styles.mainTitle}>
            <span className={styles.titleLine}>{current.headlineMain}</span>
            <span className={styles.titleAccent}>{current.headlineAccent}</span>
          </h1>

          <p className={styles.leadText}>{current.lead}</p>

          <div className={styles.ctaRow}>
            <a
              className={styles.primaryCta}
              href="#shop-all"
              onClick={() => track("hero_primary_click", { destination: "shop-all", landscape: current.id })}
            >
              <span>Khám phá bộ sưu tập</span>
              <span className={styles.ctaArrow} aria-hidden="true">→</span>
            </a>

            <a
              className={styles.secondaryCta}
              href="/studio"
              onClick={() => track("hero_secondary_click", { destination: "studio" })}
            >
              <span>Tự ráp Nook (Studio)</span>
              <span className={styles.playIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
            </a>
          </div>
        </div>

        {/* ── Bottom Floating Destination Carousel Bar ───────── */}
        <div className={styles.carouselBarWrapper}>
          <div className={styles.carouselTrack} ref={railRef}>
            {LANDSCAPES.map((land) => {
              const isActive = land.id === activeLandscape;
              return (
                <button
                  key={land.id}
                  type="button"
                  className={`${styles.cardItem} ${isActive ? styles.activeCard : ""}`}
                  onClick={() => handleLandscapeChange(land.id)}
                  aria-pressed={isActive}
                >
                  <div className={styles.cardThumbWrap}>
                    <img
                      src={land.thumbSrc}
                      alt={land.name}
                      className={styles.cardThumbImg}
                      loading="lazy"
                    />
                  </div>

                  <div className={styles.cardMeta}>
                    <span className={styles.cardTitle}>{land.name}</span>
                    <span className={styles.cardSub}>{land.sub}</span>
                  </div>

                  {isActive && (
                    <div className={styles.cardActiveArrow} aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Arrow Navigation Button */}
          <button
            type="button"
            className={styles.nextNavBtn}
            onClick={handleNext}
            aria-label="Điểm đến tiếp theo"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
