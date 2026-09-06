"use client";

import { useState } from "react";
import { spotlightProduct } from "@/data/products";

const steps = [
  { index: "01", title: "Mở hộp", copy: "Làm quen với từng mảng kiến trúc, vật liệu và các chi tiết nhỏ trước khi bắt đầu.", image: spotlightProduct.media.cover },
  { index: "02", title: "Lắp từng lớp", copy: "Đi từ khung chính tới các chi tiết tạo chiều sâu, theo một nhịp lắp ráp có thể theo dõi được.", image: spotlightProduct.media.detail },
  { index: "03", title: "Bật đèn", copy: "Khoảnh khắc toàn bộ cảnh thu nhỏ đổi nhịp khi ánh sáng được bật lên.", image: spotlightProduct.media.lifestyle },
];

export function BuildExperience() {
  const [active, setActive] = useState(0);
  const [switching, setSwitching] = useState(false);
  const step = steps[active];

  const selectStep = (index: number) => {
    if (index === active) return;
    setSwitching(true);
    window.setTimeout(() => {
      setActive(index);
      window.setTimeout(() => setSwitching(false), 30);
    }, 150);
  };

  return (
    <section className="nk-build" aria-labelledby="nk-build-title">
      <div className="nk-container nk-build__header">
        <div>
          <p className="nk-eyebrow">TRẢI NGHIỆM LẮP RÁP</p>
          <h2 id="nk-build-title">Tự tay dựng nên một nơi chốn.</h2>
        </div>
        <p>Book Nook không chỉ là vật trang trí hoàn thiện. Phần thú vị nằm ở quá trình từng chi tiết dần trở thành một không gian có ánh sáng và chiều sâu.</p>
      </div>

      <div className="nk-container nk-build__grid">
        <div className={`nk-build__visual ${switching ? "is-switching" : ""}`}>
          <img src={step.image} alt="Trải nghiệm lắp ráp Nook Ký" loading="lazy" />
          <span className="nk-build__counter">{step.index} / 03</span>
        </div>

        <div className="nk-build__steps">
          {steps.map((item, index) => (
            <button
              type="button"
              key={item.index}
              onClick={() => selectStep(index)}
              className={`nk-build__step ${active === index ? "is-active" : ""}`}
              aria-pressed={active === index}
            >
              <span>{item.index}</span>
              <div><strong>{item.title}</strong><p>{item.copy}</p></div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
