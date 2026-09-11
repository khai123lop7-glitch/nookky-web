"use client";

import { useState, useRef, useEffect } from "react";
import { track } from "@/lib/analytics";
import styles from "./Hero.module.css";

interface LandscapeStory {
  id: string;
  name: string;
  sub: string;
  videoSrc?: string;
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
    thumbSrc: "/media/editorial/thumb-hero-hoi-an.webp",
    headlineMain: "Giữ lại một",
    headlineAccent: "góc Việt Nam.",
    lead: "Những nơi chốn quen thuộc, thu nhỏ thành một góc sáng để bạn tự tay hoàn thiện và giữ lại trên kệ sách.",
  },
  {
    id: "hue",
    name: "Huế",
    sub: "Mưa qua sân gạch",
    posterSrc: "/media/editorial/hero-hue.webp",
    thumbSrc: "/media/editorial/thumb-hero-hue.webp",
    headlineMain: "Khoảng sân trầm",
    headlineAccent: "sau cơn mưa.",
    lead: "Khoảng sân Huế rêu phong, nhịp mái ngói âm dương và mảng tường gỗ trầm mặc mang lại sự an yên.",
  },
  {
    id: "sai-gon",
    name: "TP. Hồ Chí Minh",
    sub: "Hẻm còn sáng đèn",
    posterSrc: "/media/editorial/hero-sai-gon.webp",
    thumbSrc: "/media/editorial/thumb-hero-sai-gon.webp",
    headlineMain: "Góc hẻm thức cùng",
    headlineAccent: "thành phố.",
    lead: "Dây điện chằng chịt, xe hủ tiếu gõ và nhịp sống nghĩa tình không bao giờ ngủ của phố thị phương Nam.",
  },
  {
    id: "ha-noi",
    name: "Hà Nội",
    sub: "Phố cũ lên đèn",
    posterSrc: "/media/editorial/hero-ha-noi.webp",
    thumbSrc: "/media/editorial/thumb-hero-ha-noi.webp",
    headlineMain: "Phố cũ lưu trong",
    headlineAccent: "một vệt nắng.",
    lead: "Những ban công cũ, mái ngói trầm và nhịp phố thân quen được thu lại trong một khung cảnh ấm sáng.",
  },
  {
    id: "da-lat",
    name: "Đà Lạt",
    sub: "Đèn ấm trên dốc",
    posterSrc: "/media/editorial/hero-da-lat.webp",
    thumbSrc: "/media/editorial/thumb-hero-da-lat.webp",
    headlineMain: "Con dốc nép trong",
    headlineAccent: "chiều Đà Lạt.",
    lead: "Một thành phố trên cao với mái nhà nhỏ, triền hoa và ánh đèn vừa lên giữa buổi chiều se lạnh.",
  },
  {
    id: "sa-pa",
    name: "Sa Pa",
    sub: "Bậc núi trong sương",
    posterSrc: "/media/editorial/hero-sa-pa.webp",
    thumbSrc: "/media/editorial/thumb-hero-sa-pa.webp",
    headlineMain: "Miền sương giữ lại",
    headlineAccent: "sắc núi rừng.",
    lead: "Ruộng bậc thang, bản làng và những nếp nhà tựa vào sườn núi tạo nên một khoảng bình yên giữa mây.",
  },
  {
    id: "ha-long",
    name: "Hạ Long",
    sub: "Vịnh chiều đón gió",
    posterSrc: "/media/editorial/hero-ha-long.webp",
    thumbSrc: "/media/editorial/thumb-hero-ha-long.webp",
    headlineMain: "Một khoảng vịnh",
    headlineAccent: "nằm trong ánh đèn.",
    lead: "Cánh buồm, mặt nước và những dãy núi đá nối nhau đến cuối chiều, thu về trong một góc nhỏ.",
  },
  {
    id: "ninh-binh",
    name: "Ninh Bình",
    sub: "Non nước lên đèn",
    posterSrc: "/media/editorial/hero-ninh-binh.webp",
    thumbSrc: "/media/editorial/thumb-hero-ninh-binh.webp",
    headlineMain: "Non nước thu về",
    headlineAccent: "một góc nhỏ.",
    lead: "Dòng nước len giữa núi đá, mái nhà và những chiếc thuyền nhỏ tạo nên một nhịp cảnh vừa sâu vừa yên.",
  },
  {
    id: "lang-bien",
    name: "Làng biển",
    sub: "Bến nhỏ cuối ngày",
    posterSrc: "/media/editorial/hero-lang-bien.webp",
    thumbSrc: "/media/editorial/thumb-hero-lang-bien.webp",
    headlineMain: "Làng biển thức cùng",
    headlineAccent: "ngọn đèn khuya.",
    lead: "Thuyền neo sát bến, hiên nhà mở ra phía biển và ánh hoàng hôn còn đọng trên mặt nước.",
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

  useEffect(() => {
    const rail = railRef.current;
    const activeCard = rail?.querySelector<HTMLElement>(`[data-landscape-id="${activeLandscape}"]`);

    if (!rail || !activeCard) return;

    const centeredLeft = activeCard.offsetLeft - (rail.clientWidth - activeCard.clientWidth) / 2;
    rail.scrollTo({ left: Math.max(0, centeredLeft), behavior: "smooth" });
  }, [activeLandscape]);

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
            key={current.id}
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
          <img key={current.id} src={current.posterSrc} alt="" className={styles.bgImage} />
        )}
      </div>

      {/* Cinematic Vignette Overlay */}
      <div className={styles.vignetteOverlay} aria-hidden="true" />

      {/* ── Main Center Content ─────────────────────────────── */}
      <div className={styles.contentContainer}>
        {/* Main Center Headline & Story */}
        <div className={styles.centerDossier} aria-live="polite" aria-atomic="true">
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
                  data-landscape-id={land.id}
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
