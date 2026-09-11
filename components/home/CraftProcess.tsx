"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import styles from "./CraftProcess.module.css";

interface ProcessStep {
  index: string;
  phase: string;
  copy: string;
  subLabel: string;
  cardMedia: string;
  masterMedia: string;
}

const processSteps: ProcessStep[] = [
  {
    index: "01",
    phase: "Ý tưởng & Ký ức",
    copy: "Khảo sát thực địa, tìm kiếm những góc phố, kiến trúc và câu chuyện đặc trưng của từng vùng đất Việt Nam.",
    subLabel: "Từ những chuyến đi, ký ức dần hình thành.",
    cardMedia: "/media/editorial/brand-close.webp",
    masterMedia: "/media/editorial/brand-close.webp",
  },
  {
    index: "02",
    phase: "Thiết kế & Kiến trúc",
    copy: "Phác thảo ý tưởng, dựng mô hình 3D và tính toán tỉ lệ để tái hiện không gian chân thực trong kích thước thu nhỏ.",
    subLabel: "Biến cảm xúc thành bản thiết kế chi tiết.",
    cardMedia: "/media/products/01-pho-vua-len-den-hoi-an/detail.webp",
    masterMedia: "/media/products/01-pho-vua-len-den-hoi-an/detail.webp",
  },
  {
    index: "03",
    phase: "Chế tác mô hình",
    copy: "Cắt laser, lắp ráp thủ công và hoàn thiện từng chi tiết nhỏ từ gỗ, giấy, vải, nhựa... để tạo nên chiều sâu và cảm xúc thật.",
    subLabel: "Tỉ mỉ trong từng chi tiết, tạo nên hồn cốt.",
    cardMedia: "/media/products/01-pho-vua-len-den-hoi-an/lifestyle.webp",
    masterMedia: "/media/products/01-pho-vua-len-den-hoi-an/lifestyle.webp",
  },
  {
    index: "04",
    phase: "Hoàn thiện & Thắp sáng",
    copy: "Lắp đặt hệ thống đèn LED, kiểm tra nét cuối cùng và đóng gói cẩn thận, sẵn sàng đến với không gian của bạn.",
    subLabel: "Một tác phẩm hoàn chỉnh, sẵn sàng kể câu chuyện của riêng bạn.",
    cardMedia: "/media/products/01-pho-vua-len-den-hoi-an/cover.webp",
    masterMedia: "/media/products/01-pho-vua-len-den-hoi-an/cover.webp",
  },
];

export function CraftProcess() {
  const [active, setActive] = useState(2); // Step 03 default active like image
  const [switching, setSwitching] = useState(false);
  const currentStep = processSteps[active];

  const selectStep = (index: number) => {
    if (index === active) return;
    track("craft_process_select", {
      step: processSteps[index].index,
      phase: processSteps[index].phase,
    });
    setSwitching(true);
    setTimeout(() => {
      setActive(index);
      setTimeout(() => setSwitching(false), 50);
    }, 120);
  };

  return (
    <section
      className={styles.craftSection}
      id="quy-trinh-che-tac"
      aria-labelledby="nk-process-title"
    >
      {/* Background craft film with a still fallback while loading */}
      <div className={styles.bgWrapper} aria-hidden="true">
        <video
          className={styles.bgImage}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/media/editorial/craft-process-poster.webp"
          src="/media/editorial/craft-process.mp4"
        />
        <div className={styles.bgOverlay} />
      </div>

      <div className={styles.innerContainer}>
        {/* ── TOP REGION: Story Intro & Calligraphy Quote ── */}
        <div className={styles.topRegion}>
          {/* Top-Left: Story Intro */}
          <div className={styles.introCol} data-nk-reveal="left" data-nk-delay="1">
            <div className={styles.eyebrowWrap}>
              <span className={styles.eyebrow}>HÀNH TRÌNH TẠO NÊN MỘT NOOK</span>
            </div>
            <h2 id="nk-process-title" className={styles.title}>
              <span className={styles.titleLine1}>Từ Lát Cắt Ký Ức</span>
              <span className={styles.titleLine2}>
                Đến <em>Tác Phẩm</em> Trên Kệ Sách.
              </span>
            </h2>
            <p className={styles.lead}>
              Hơn 120 giờ nghiên cứu và thực nghiệm để tái hiện
              <br />
              chân thực những góc phố, kiến trúc và cảm xúc Việt Nam
              <br />
              trong một không gian thu nhỏ.
            </p>
          </div>

          {/* Top-Right: Calligraphy Quote Box */}
          <div className={styles.quoteWrapper} aria-hidden="true" data-nk-reveal="right" data-nk-delay="2">
            <p className={styles.quoteCalligraphy}>
              “Những điều nhỏ bé
              <br />
              cũng có thể lưu giữ
              <br />
              cả một thời thanh xuân.”
            </p>
          </div>
        </div>

        {/* ── BOTTOM REGION: 4 Process Step Cards with Staggered Reveal ── */}
        <div
          className={styles.stepsGrid}
          role="group"
          aria-label="4 bước quy trình tạo nên một Nook"
        >
          {processSteps.map((step, idx) => {
            const isActive = active === idx;
            return (
              <div
                key={step.index}
                className={`${styles.stepCard} ${
                  isActive ? styles.activeCard : ""
                }`}
                onClick={() => selectStep(idx)}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                data-nk-reveal
                data-nk-delay={(idx + 1).toString()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    selectStep(idx);
                  }
                }}
              >
                {/* Step Header */}
                <div className={styles.stepHeader}>
                  <div className={styles.stepNumWrap}>
                    <span className={styles.stepNum}>{step.index}</span>
                  </div>
                  <h3 className={styles.stepTitle}>{step.phase}</h3>
                </div>

                {/* Step Copy */}
                <p className={styles.stepCopy}>{step.copy}</p>

                {/* Step Image */}
                <div className={styles.stepImgWrap}>
                  <img
                    src={step.cardMedia}
                    alt={step.phase}
                    className={styles.stepImg}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Step Caption / Sub-label */}
                <p className={styles.stepSubLabel}>{step.subLabel}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
