"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import styles from "./CraftProcess.module.css";

const steps = [
  {
    number: "01",
    title: "Ý tưởng & Ký ức",
    description: "Khảo sát thực địa, tìm kiếm những góc phố, kiến trúc và câu chuyện đặc trưng của từng vùng đất Việt Nam.",
    image: "/media/products/Hoi-An-4-anh-gen-moi/Hoi-An-01-Product.webp",
    alt: "Tư liệu kiến trúc và ký ức Việt",
  },
  {
    number: "02",
    title: "Thiết kế & Kiến trúc",
    description: "Phác thảo ý tưởng, dựng mô hình 3D và tính toán tỉ lệ để tái hiện không gian trong kích thước thu nhỏ.",
    image: "/media/products/Hoi-An-4-anh-gen-moi/Hoi-An-02-Transparent-Roof.webp",
    alt: "Chi tiết kiến trúc mô hình Hội An",
  },
  {
    number: "03",
    title: "Chế tác mô hình",
    description: "Cắt laser, lắp ráp thủ công và hoàn thiện từng chi tiết nhỏ để tạo nên chiều sâu và cảm xúc thật.",
    image: "/media/products/Hoi-An-4-anh-gen-moi/Hoi-An-03-Details.webp",
    alt: "Công đoạn chế tác mô hình thủ công",
  },
  {
    number: "04",
    title: "Hoàn thiện & Thắp sáng",
    description: "Lắp đặt đèn, kiểm tra nét cuối cùng và đóng gói cẩn thận, sẵn sàng đến với không gian của bạn.",
    image: "/media/products/Hoi-An-4-anh-gen-moi/Hoi-An-04-Assembly.webp",
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
        const quoteCards = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(`.${styles.quoteCard}`));
        const scene = section.querySelector<HTMLElement>(`.${styles.backdrop}`);
        const drawing = section.querySelector<HTMLElement>(`.${styles.sketchImage}`);
        const directions = [{ x: -80, y: -30, rotation: -3 }, { x: -40, y: 40, rotation: 2 }, { x: 40, y: -30, rotation: -2 }, { x: 80, y: 40, rotation: 3 }];
        const quoteOffsets = [{ y: 35, rotation: 2 }, { y: -30, rotation: -2 }, { y: 35, rotation: 2 }, { y: -30, rotation: -2 }];

        gsap.set(cards, { opacity: 0 });
        cards.forEach((card, index) => gsap.set(card, { ...directions[index], scale: .85 }));

        gsap.set(quoteCards, { opacity: 0 });
        quoteCards.forEach((qCard, index) => gsap.set(qCard, { ...quoteOffsets[index], scale: .88 }));

        const timeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top+=60",
            end: "bottom bottom",
            scrub: .6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              section.style.setProperty("--craft-progress", self.progress.toFixed(3));
              if (Date.now() > manualUntil.current) {
                const nextActive = Math.min(3, Math.floor(self.progress * 4));
                setActive((prev) => (prev !== nextActive ? nextActive : prev));
              }
            },
          },
        });

        timeline.fromTo(scene, { scale: 1.18, xPercent: -5, opacity: 0.75 }, { scale: 1, xPercent: 0, opacity: 1, duration: 4 }, 0);
        if (drawing) timeline.fromTo(drawing, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1.5 }, .15);

        // Xuất hiện từng cặp Card bước và QuoteCard tương ứng theo nhịp cuộn
        cards.forEach((card, index) => {
          const startTime = .4 + index * .85;
          timeline.to(card, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 1 }, startTime);
          timeline.fromTo(card.querySelector("img"), { scale: 1.15 }, { scale: 1, duration: 1.2 }, startTime);

          if (quoteCards[index]) {
            timeline.to(quoteCards[index], { opacity: 1, y: 0, rotation: 0, scale: 1, duration: 0.9, ease: "back.out(1.4)" }, startTime + 0.2);
          }
        });

        timeline.to({}, { duration: .4 });
        return () => {
          timeline.kill();
          gsap.set([scene, drawing, ...cards, ...quoteCards, ...cards.map(card => card.querySelector("img"))], { clearProps: "all" });
        };
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
              <img className={styles.sketchImage} src="/media/editorial/craft-process-poster.webp" alt="Phác thảo ý tưởng" loading="lazy" />
              <span className={styles.sketchNote}>Những góc phố nhỏ<br />làm nên Việt Nam</span>
            </div>
            <a className={styles.discover} href="/shop">KHÁM PHÁ BỘ SƯU TẬP <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className={styles.workshop}>
          <div className={styles.backdrop} aria-hidden="true" />
          <div className={styles.product} role="img" aria-label="Book nook Hội An tỏa ánh sáng vàng ấm trên bàn chế tác" />
          {/* 4 Câu Quote nghệ thuật xen kẽ so le hài hòa cùng 4 bước */}
          <div className={`${styles.quoteCard} ${styles.quote01}`} aria-hidden="true">
            <span className={styles.quoteMark}>“</span>
            <p>Chắt chiu từng lát cắt<br />ký ức của phố xưa.</p>
          </div>

          <div className={`${styles.quoteCard} ${styles.quote02}`} aria-hidden="true">
            <span className={styles.quoteMark}>“</span>
            <p>Những điều nhỏ bé<br />cũng có thể lưu giữ<br />cả một thời thanh xuân.</p>
          </div>

          <div className={`${styles.quoteCard} ${styles.quote03}`} aria-hidden="true">
            <span className={styles.quoteMark}>“</span>
            <p>Tỉ mỉ lắp ghép những vụn vặt<br />thành hình hài ký ức.</p>
          </div>

          <div className={`${styles.quoteCard} ${styles.quote04}`} aria-hidden="true">
            <span className={styles.quoteMark}>“</span>
            <p>Khi ánh đèn vàng bật lên,<br />cả một vùng trời sống lại.</p>
          </div>

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
