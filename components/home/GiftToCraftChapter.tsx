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
          gsap.set(overlay, { autoAlpha: mobile ? 1 : 0 });
          gsap.set(workshop, { clipPath: "circle(0% at 72% 54%)", scale: 1.35 });
          gsap.set(paper, { width: mobile ? "50%" : "49%" });
          gsap.set([first, second], { autoAlpha: 0 });
          gsap.set(final, { autoAlpha: 0, y: 55 });
          gsap.set(path, { strokeDasharray: 1300, strokeDashoffset: 1300 });
          if (mobileIntro) gsap.set(mobileIntro, { autoAlpha: mobile ? 1 : 0 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: mobile ? scene : chapter,
              start: "top top+=60",
              end: mobile ? "+=110%" : "bottom bottom",
              pin: mobile ? scene : false,
              scrub: 0.65,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          if (!mobile) timeline.to(overlay, { autoAlpha: 1, duration: .08 }, .05);
          if (mobileIntro && mobile) timeline.to(mobileIntro, { autoAlpha: 0, x: -30, duration: .26 }, .2);
          timeline.to(workshop, { clipPath: "circle(150% at 72% 54%)", scale: 1, duration: .7, ease: "none" }, .13);
          timeline.to(paper, { width: mobile ? "36%" : "29%", duration: .59, ease: "power2.inOut" }, .23);
          timeline.fromTo(first, { xPercent: 55, scale: 1.35, autoAlpha: 0 }, { xPercent: 0, scale: 1, autoAlpha: 1, duration: .19, ease: "power2.out" }, .16);
          timeline.to(first, { xPercent: -48, scale: 1.25, autoAlpha: 0, duration: .22 }, .41);
          timeline.fromTo(second, { xPercent: 48, scale: 1.4, autoAlpha: 0 }, { xPercent: 0, scale: 1, autoAlpha: 1, duration: .2, ease: "power2.out" }, .42);
          timeline.to(second, { yPercent: -75, scale: 1.2, autoAlpha: 0, duration: .2 }, .66);
          timeline.to(path, { strokeDashoffset: 0, duration: .56, ease: "none" }, .36);
          timeline.to(final, { autoAlpha: 1, y: 0, duration: .32, ease: "power2.out" }, mobile ? .56 : .36);
          timeline.to({}, { duration: .1 }, .96);
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
