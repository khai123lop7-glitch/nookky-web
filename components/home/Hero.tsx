"use client";

import { track } from "@/lib/analytics";

export function Hero() {
  return (
    <section className="nk-hero" aria-labelledby="nk-hero-title">
      <div className="nk-hero__media" aria-hidden="true">
        <picture>
          <source media="(max-width: 800px)" srcSet="/media/editorial/hero-mobile.webp" />
          <img src="/media/editorial/hero-hanoi.jpg" alt="" fetchPriority="high" />
        </picture>
      </div>
      <div className="nk-hero__shade" aria-hidden="true" />

      <div className="nk-hero__inner nk-container-wide">
        <div className="nk-hero__copy">
          <p className="nk-eyebrow">BOOK NOOK · VIỆT NAM</p>
          <h1 id="nk-hero-title">Giữ lại một góc Việt Nam.</h1>
          <p className="nk-hero__lead">
            Những nơi chốn quen thuộc, thu nhỏ thành một góc sáng để bạn tự tay hoàn thiện và giữ lại trên kệ sách.
          </p>
          <div className="nk-hero__actions">
            <a className="nk-button nk-button--light" href="#shop-all" onClick={() => track("hero_primary_click", { destination: "shop-all" })}>
              Khám phá bộ sưu tập
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5"/></svg>
            </a>
          </div>
        </div>

        <div className="nk-hero__rail" aria-label="Khám phá tiếp">
          <a className="nk-hero__scroll" href="#featured-nooks"><span>Cuộn để khám phá</span><span className="nk-hero__chevron" aria-hidden="true">↓</span></a>
          <span className="nk-hero__rail-note">Nook Ký · Những nơi chốn thu nhỏ</span>
        </div>
      </div>
    </section>
  );
}
