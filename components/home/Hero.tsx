"use client";

import { useState, useRef, useEffect } from "react";
import { track } from "@/lib/analytics";
import styles from "./Hero.module.css";

const LANDSCAPES = [
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
    lead: "Khoảng sân Huế rêu phong và những nhịp mái ngói xưa được thu nhỏ thành một góc bình yên.",
  },
  {
    id: "sai-gon",
    name: "TP. Hồ Chí Minh",
    sub: "Hẻm còn sáng đèn",
    posterSrc: "/media/editorial/hero-sai-gon.webp",
    thumbSrc: "/media/editorial/thumb-hero-sai-gon.webp",
    headlineMain: "Góc hẻm thức cùng",
    headlineAccent: "thành phố.",
    lead: "Nhịp sống quen thuộc của phố thị được giữ lại trong một góc nhỏ.",
  },
  {
    id: "ha-noi",
    name: "Hà Nội",
    sub: "Phố cũ lên đèn",
    posterSrc: "/media/editorial/hero-ha-noi.webp",
    thumbSrc: "/media/editorial/thumb-hero-ha-noi.webp",
    headlineMain: "Phố cũ lưu trong",
    headlineAccent: "một vệt nắng.",
    lead: "Những mái nhà cũ và nhịp phố thân quen được thu lại trong một khung cảnh ấm sáng.",
  },
];

export function Hero() {
  const [activeLandscape, setActiveLandscape] = useState("hoi-an");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  const current = LANDSCAPES.find((item) => item.id === activeLandscape) || LANDSCAPES[0];

  useEffect(() => {
    if (videoRef.current && current.videoSrc) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [current]);

  return (
    <section className={styles.heroSection} aria-labelledby="nk-hero-title">
      <div className={styles.mediaContainer} aria-hidden="true">
        {current.videoSrc ? (
          <video ref={videoRef} className={styles.bgVideo} autoPlay loop muted playsInline preload="metadata" poster={current.posterSrc} src={current.videoSrc} />
        ) : (
          <img className={styles.bgImage} src={current.posterSrc} alt="" />
        )}
      </div>

      <div className={styles.vignetteOverlay} aria-hidden="true" />

      <div className={styles.contentContainer}>
        <div className={styles.centerDossier}>
          <h1 id="nk-hero-title" className={styles.mainTitle}>
            <span className={styles.titleLine}>{current.headlineMain}</span>
            <span className={styles.titleAccent}>{current.headlineAccent}</span>
          </h1>
          <p className={styles.leadText}>{current.lead}</p>
          <div className={styles.ctaRow}>
            <a className={styles.primaryCta} href="#shop-all" onClick={() => track("hero_primary_click", { destination: "shop-all" })}>Khám phá bộ sưu tập →</a>
            <a className={styles.secondaryCta} href="/studio">Tự ráp Nook (Studio)</a>
          </div>
        </div>

        <div className={styles.carouselBarWrapper}>
          <div className={styles.carouselTrack} ref={railRef}>
            {LANDSCAPES.map((land) => (
              <button key={land.id} type="button" className={`${styles.cardItem} ${land.id === activeLandscape ? styles.activeCard : ""}`} onClick={() => { setActiveLandscape(land.id); track("hero_landscape_change", { landscape: land.id }); }}>
                <div className={styles.cardThumbWrap}><img src={land.thumbSrc} alt={land.name} className={styles.cardThumbImg} /></div>
                <div className={styles.cardMeta}><span className={styles.cardTitle}>{land.name}</span><span className={styles.cardSub}>{land.sub}</span></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
