"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import styles from "./CraftProcess.module.css";

interface ProcessStep {
  index: string;
  phase: string;
  copy: string;
  cardMedia: string;
  masterMedia: string;
}

const processSteps: ProcessStep[] = [
  {
    index: "01",
    phase: "Ý tưởng & Ký ức",
    copy: "Khảo sát thực địa, tìm kiếm những góc phố, kiến trúc và câu chuyện đặc trưng của từng vùng đất Việt Nam.",
    cardMedia: "/media/editorial/brand-close.webp",
    masterMedia: "/media/editorial/brand-close.webp",
  },
  {
    index: "02",
    phase: "Thiết kế & Kiến trúc",
    copy: "Phác thảo ý tưởng, dựng mô hình 3D và tính toán tỉ lệ để tái hiện không gian chân thực trong kích thước thu nhỏ.",
    cardMedia: "/media/products/01-pho-vua-len-den-hoi-an/detail.webp",
    masterMedia: "/media/products/01-pho-vua-len-den-hoi-an/detail.webp",
  },
  {
    index: "03",
    phase: "Chế tác mô hình",
    copy: "Cắt laser, lắp ráp thủ công và hoàn thiện từng chi tiết nhỏ từ gỗ, giấy, vải, nhựa... để tạo nên chiều sâu và cảm xúc thật.",
    cardMedia: "/media/products/01-pho-vua-len-den-hoi-an/lifestyle.webp",
    masterMedia: "/media/products/01-pho-vua-len-den-hoi-an/lifestyle.webp",
  },
  {
    index: "04",
    phase: "Hoàn thiện & Thắp sáng",
    copy: "Lắp đặt hệ thống đèn LED, kiểm tra nét cuối cùng và đóng gói cẩn thận, sẵn sàng đến với không gian của bạn.",
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
      id="crafting-process"
      aria-labelledby="nk-process-title"
    >
      {/* Background Video */}
      <div className={styles.videoBgWrap} aria-hidden="true">
        <video
          className={styles.videoBg}
          autoPlay
          muted
          loop
          playsInline
          poster="/media/editorial/craft-bg.png"
        >
          <source src="/media/editorial/section4.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoOverlay} />
      </div>

      <div className={styles.innerContainer}>
        {/* ── TOP REGION: Story Intro & Master Artisan Photo ── */}
        <div className={styles.topRegion}>
          {/* Top-Left: Story Intro */}
          <div className={styles.introCol}>
            <p className={styles.eyebrow}>QUÁ TRÌNH TẠO NÊN MỘT NOOK</p>
            <h2 id="nk-process-title" className={styles.title}>
              Từ Lát Cắt Ký Ức
              <br />
              Đến Tác Phẩm Trên Kệ Sách.
            </h2>
            <p className={styles.lead}>
              Hơn 120 giờ nghiên cứu và thử nghiệm để tái hiện công trình trăm
              năm trong một không gian thu nhỏ sống động.
            </p>
          </div>

          {/* Top-Right: Master Photo Frame + Calligraphy Quote */}
          <div className={styles.masterPhotoCol}>
            <div className={styles.masterPhotoCard}>
              <div className={styles.masterPhotoInner}>
                <img
                  src={currentStep.masterMedia}
                  alt={`Quy trình chế tác - ${currentStep.phase}`}
                  className={`${styles.masterImg} ${
                    switching ? styles.switching : ""
                  }`}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Taped Kraft Sticky Note */}
              <div className={styles.stickyNote} aria-hidden="true">
                <p className={styles.stickyText}>
                  Tỉ mỉ
                  <br />
                  trong từng
                  <br />
                  chi tiết
                </p>
              </div>
            </div>

            {/* Right Calligraphy Quote */}
            <div className={styles.quoteWrapper} aria-hidden="true">
              <p className={styles.quoteCalligraphy}>
                “Những điều nhỏ bé
                <br />
                cũng có thể lưu giữ
                <br />
                cả một thời thanh xuân.”
              </p>
              <div className={styles.quoteLine} />
            </div>
          </div>
        </div>

        {/* ── BOTTOM REGION: 4 Process Step Cards ── */}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    selectStep(idx);
                  }
                }}
              >
                {/* Step Header */}
                <div className={styles.stepHeader}>
                  <span className={styles.stepNum}>
                    {step.index}
                    {isActive ? " •" : ""}
                  </span>
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
