"use client";

import { useEffect, useRef } from "react";
import { BrandStory } from "./BrandStory";
import styles from "./GiftToCraftChapter.module.css";

export function GiftToCraftChapter() {
  const chapterRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const workshopRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const wordOneRef = useRef<HTMLSpanElement>(null);
  const wordTwoRef = useRef<HTMLSpanElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const mobileIntroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let revert: (() => void) | undefined;

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !chapterRef.current || !sceneRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const chapter = chapterRef.current;
      const scene = sceneRef.current;
      const overlay = overlayRef.current;
      const workshop = workshopRef.current;
      const paper = paperRef.current;
      const first = wordOneRef.current;
      const second = wordTwoRef.current;
      const final = finalRef.current;
      const path = pathRef.current;
      const mobileIntro = mobileIntroRef.current;
      if (!overlay || !workshop || !paper || !first || !second || !final || !path) return;

      const context = gsap.context(() => {
        const media = gsap.matchMedia();
        const build = (mobile: boolean) => {
          gsap.set(overlay, { autoAlpha: 1 });
          gsap.set(workshop, { scale: 1.15, opacity: 1 });
          gsap.set(paper, { xPercent: -100, opacity: 0 });
          gsap.set(first, { autoAlpha: 0, xPercent: 20, scale: 1.1 });
          gsap.set(second, { autoAlpha: 0, xPercent: 20, scale: 1.1 });
          gsap.set(final, { autoAlpha: 0, y: 25 });
          gsap.set(path, { strokeDasharray: 1300, strokeDashoffset: 1300 });
          if (mobileIntro) gsap.set(mobileIntro, { autoAlpha: mobile ? 1 : 0 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: chapter,
              start: "top top+=60",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          // Phase 1 (0% -> 22%): "TỪ KÝ ỨC" xuất hiện và dẫn lối
          timeline.to(first, { autoAlpha: 1, xPercent: 0, scale: 1, duration: 0.15, ease: "power2.out" }, 0.02);
          timeline.to(path, { strokeDashoffset: 650, duration: 0.25, ease: "power1.inOut" }, 0.05);
          timeline.to(first, { autoAlpha: 0, xPercent: -25, scale: 0.92, duration: 0.12, ease: "power2.in" }, 0.20);

          // Phase 2 (22% -> 42%): "ĐẾN TÁC PHẨM" xuất hiện và vẽ hoàn tất nét vẽ
          timeline.to(second, { autoAlpha: 1, xPercent: 0, scale: 1, duration: 0.15, ease: "power2.out" }, 0.22);
          timeline.to(path, { strokeDashoffset: 0, duration: 0.2, ease: "power1.inOut" }, 0.22);
          timeline.to(workshop, { scale: 1, duration: 0.45, ease: "none" }, 0);
          timeline.to(second, { autoAlpha: 0, yPercent: -25, scale: 0.92, duration: 0.12, ease: "power2.in" }, 0.38);

          // Phase 3 (40% -> 58%): Hiệu ứng mở màn tan biến (dissolve/reveal), mở ra nội dung BrandStory
          if (mobileIntro && mobile) {
            timeline.to(mobileIntro, { autoAlpha: 0, x: -30, duration: 0.15 }, 0.35);
          }
          timeline.to(overlay, { autoAlpha: 0, duration: 0.25, ease: "power2.inOut" }, 0.42);

          // Phase 4 (58% -> 100%): Toàn bộ nội dung Quà tặng Doanh nghiệp (BrandStory) hiện rõ hoàn toàn
          timeline.to({}, { duration: 0.4 });

          return () => timeline.scrollTrigger?.kill();
        };
        media.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => build(false));
        media.add("(max-width: 760px) and (prefers-reduced-motion: no-preference)", () => build(true));
        return () => media.revert();
      }, chapter);
      revert = () => context.revert();
      ScrollTrigger.refresh();
    };

    void setup();
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <div className={styles.chapter} ref={chapterRef} id="qua-tang-doanh-nghiep">
      <div className={styles.stage}>
        <BrandStory />
        <div className={styles.scene} ref={sceneRef} aria-hidden="true">
          <div className={styles.overlay} ref={overlayRef}>
            <div className={styles.workshop} ref={workshopRef} />
            <div className={styles.paper} ref={paperRef}>
              <span className={styles.paperEdge} />
            </div>
            <div className={styles.mobileIntro} ref={mobileIntroRef}>
              <span>TỪ KÝ ỨC</span><strong>ĐẾN TÁC PHẨM.</strong>
            </div>
            <div className={styles.light} />
            <span className={styles.wordOne} ref={wordOneRef}>TỪ KÝ ỨC</span>
            <span className={styles.wordTwo} ref={wordTwoRef}>ĐẾN TÁC PHẨM</span>
            <svg className={styles.drawing} viewBox="0 0 1600 900" preserveAspectRatio="none">
              <path ref={pathRef} d="M 95 610 C 310 425, 385 590, 540 410 S 795 235, 920 370 S 1120 630, 1310 370 S 1450 255, 1550 240" />
            </svg>
            <div className={styles.final} ref={finalRef}>
              <span className={styles.kicker}>HÀNH TRÌNH TẠO NÊN MỘT NOOK</span>
              <strong>Từ lát cắt ký ức<br />đến tác phẩm trên kệ sách.</strong>
              <span className={styles.hint}>TIẾP TỤC CUỘN ĐỂ KHÁM PHÁ &nbsp; ↓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
