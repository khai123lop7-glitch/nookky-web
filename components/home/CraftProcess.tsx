"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import styles from "./CraftProcess.module.css";

const steps = [
  {
    number: "01",
    title: "Ý tưởng & Ký ức",
    description: "Khảo sát thực địa, tìm kiếm những góc phố, kiến trúc và câu chuyện đặc trưng của từng vùng đất Việt Nam.",
    image: "/media/editorial/craft-step-01.webp",
    alt: "Tư liệu kiến trúc và ký ức Việt",
  },
  {
    number: "02",
    title: "Thiết kế & Kiến trúc",
    description: "Phác thảo ý tưởng, dựng mô hình 3D và tính toán tỉ lệ để tái hiện không gian trong kích thước thu nhỏ.",
    image: "/media/editorial/craft-step-02.webp",
    alt: "Chi tiết kiến trúc mô hình Hội An",
  },
  {
    number: "03",
    title: "Chế tác mô hình",
    description: "Cắt laser, lắp ráp thủ công và hoàn thiện từng chi tiết nhỏ để tạo nên chiều sâu và cảm xúc thật.",
    image: "/media/editorial/craft-step-03.webp",
    alt: "Công đoạn chế tác mô hình thủ công",
  },
  {
    number: "04",
    title: "Hoàn thiện & Thắp sáng",
    description: "Lắp đặt đèn, kiểm tra nét cuối cùng và đóng gói cẩn thận, sẵn sàng đến với không gian của bạn.",
    image: "/media/editorial/craft-step-04.webp",
    alt: "Tác phẩm Hội An sau khi hoàn thiện và thắp sáng",
  },
] as const;

export function CraftProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const manualUntil = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let disposed = false;
    let teardown = () => {};
    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"), import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(`.${styles.step}`));
        const scene = section.querySelector<HTMLElement>(`.${styles.backdrop}`);
        const drawing = section.querySelector<HTMLElement>(`.${styles.sketchImage}`);
        const quote = section.querySelector<HTMLElement>(`.${styles.quote}`);
        const directions = [{ x: -150, y: -35, rotation: -8 }, { x: 150, y: -35, rotation: 8 }, { x: -150, y: 60, rotation: 7 }, { x: 150, y: 60, rotation: -7 }];
        gsap.set(cards, { opacity: 0 });
        cards.forEach((card, index) => gsap.set(card, { ...directions[index], scale: .78 }));
        const timeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top+=60",
            end: "bottom bottom",
            scrub: .8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              section.style.setProperty("--craft-progress", self.progress.toFixed(3));
              if (Date.now() > manualUntil.current) setActive(Math.min(3, Math.floor(self.progress * 4)));
            },
          },
        });
        timeline.fromTo(scene, { scale: 1.26, xPercent: -8, filter: "brightness(.56)" }, { scale: 1, xPercent: 0, filter: "brightness(.9)", duration: 4 }, 0);
        if (drawing) timeline.fromTo(drawing, { opacity: 0, y: 36, clipPath: "inset(100% 0 0 0)" }, { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: 1.7 }, .15);
        cards.forEach((card, index) => {
          timeline.to(card, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 1 }, .45 + index * .75);
          timeline.fromTo(card.querySelector("img"), { scale: 1.28 }, { scale: 1, duration: 1.3 }, .45 + index * .75);
        });
        if (quote) timeline.fromTo(quote, { opacity: 0, y: -45, scale: .88 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, 2.15);
        timeline.to({}, { duration: .4 });
        return () => { timeline.kill(); gsap.set([scene, drawing, quote, ...cards, ...cards.map(card => card.querySelector("img"))], { clearProps: "all" }); };
      });
      teardown = () => media.revert();
    };
    void setup();
    return () => {
      disposed = true;
      teardown();
    };
  }, []);

  const selectStep = (index: number) => {
    manualUntil.current = Date.now() + 4500;
    setActive(index);
    track("craft_process_select", { step: steps[index].number, phase: steps[index].title });
  };

  return (
    <section ref={sectionRef} className={styles.section} id="quy-trinh-che-tac" aria-labelledby="nk-process-title">
      <div className={styles.stage}>
        <div className={styles.paper}>
          <div className={styles.paperContent}>
            <p className={styles.eyebrow}>HÀNH TRÌNH TẠO NÊN MỘT NOOK</p>
            <h2 id="nk-process-title" className={styles.title}>
              Từ Lát Cắt Ký Ức<br />Đến <em>Tác Phẩm</em><br />Trên Kệ Sách.
            </h2>
            <p className={styles.lead}>Hơn 120 giờ nghiên cứu và thực nghiệm để tái hiện chân thực những góc phố, kiến trúc và cảm xúc Việt Nam trong một không gian thu nhỏ.</p>
            <div className={styles.stat}><strong>120+</strong><span>GIỜ NGHIÊN CỨU<br />& THỰC NGHIỆM</span></div>
            <div className={styles.sketch} aria-hidden="true">
              <img className={styles.sketchImage} src="/media/editorial/craft-sketch.webp" alt="" loading="lazy" />
              <span className={styles.sketchNote}>Những góc phố nhỏ<br />làm nên Việt Nam</span>
            </div>
            <a className={styles.discover} href="/shop">KHÁM PHÁ BỘ SƯU TẬP <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className={styles.workshop}>
          <div className={styles.backdrop} aria-hidden="true" />
          <div className={styles.product} role="img" aria-label="Book nook Hội An tỏa ánh sáng vàng ấm trên bàn chế tác" />
          <p className={styles.quote}><span aria-hidden="true">“</span>Những điều nhỏ bé<br />cũng có thể lưu giữ<br />cả một thời thanh xuân.</p>
          <div className={styles.thread} aria-hidden="true" />
          <div className={styles.steps} role="group" aria-label="Bốn bước tạo nên một Nook">
            {steps.map((step, index) => (
              <button
                className={`${styles.step} ${styles[`step${step.number}`]} ${active === index ? styles.active : ""}`}
                key={step.number}
                type="button"
                onClick={() => selectStep(index)}
                aria-pressed={active === index}
              >
                <span className={styles.stepHeading}><span className={styles.number}>{step.number}</span><span className={styles.stepText}><strong>{step.title}</strong><small>{step.description}</small></span></span>
                <span className={styles.photo}><img src={step.image} alt={step.alt} loading="lazy" decoding="async" /></span>
              </button>
            ))}
          </div>
          <span className={styles.index} aria-hidden="true">0{active + 1} / 04</span>
        </div>
      </div>
    </section>
  );
}
