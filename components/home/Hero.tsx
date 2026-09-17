"use client";

import { useRef, useEffect } from "react";
import { track } from "@/lib/analytics";
import styles from "./Hero.module.css";

const HERO = {
  id: "hoi-an",
  videoSrc: "/media/editorial/hero-hoian.mp4",
  posterSrc: "/media/products/01-pho-vua-len-den-hoi-an/cover.webp",
  headlineMain: "Giữ lại một",
  headlineAccent: "góc Việt Nam.",
  lead: "Những nơi chốn quen thuộc, thu nhỏ thành một góc sáng để bạn tự tay hoàn thiện và giữ lại trên kệ sách.",
};

export function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <section className={styles.heroSection} aria-labelledby="nk-hero-title">
      <div className={styles.mediaContainer} aria-hidden="true">
        <video
          ref={videoRef}
          className={styles.bgVideo}
          autoPlay
          loop
          muted
          playsInline
          poster={HERO.posterSrc}
          src={HERO.videoSrc}
        />
      </div>

      <div className={styles.vignetteOverlay} aria-hidden="true" />

      <div className={styles.contentContainer}>
        <div className={styles.centerDossier}>
          <h1 id="nk-hero-title" className={styles.mainTitle}>
            <span className={styles.titleLine}>{HERO.headlineMain}</span>
            <span className={styles.titleAccent}>{HERO.headlineAccent}</span>
          </h1>

          <p className={styles.leadText}>{HERO.lead}</p>

          <div className={styles.ctaRow}>
            <a
              className={styles.primaryCta}
              href="#shop-all"
              onClick={() => track("hero_primary_click", { destination: "shop-all" })}
            >
              <span>Khám phá bộ sưu tập</span>
              <span className={styles.ctaArrow}>→</span>
            </a>

            <a
              className={styles.secondaryCta}
              href="/studio"
              onClick={() => track("hero_secondary_click", { destination: "studio" })}
            >
              <span>Tự ráp Nook (Studio)</span>
              <span className={styles.playIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
