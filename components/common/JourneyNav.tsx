"use client";

import { useEffect, useState } from "react";

interface JourneyItem {
  id: string;
  name: string;
}

const JOURNEY_SECTIONS: JourneyItem[] = [
  { id: "hero", name: "01. Ký ức Việt Nam" },
  { id: "qua-tang-doanh-nghiep", name: "02. Quà tặng & Dấu ấn" },
  { id: "quy-trinh-che-tac", name: "03. Hành trình chế tác" },
  { id: "san-pham-tieu-bieu", name: "04. Tác phẩm tiêu biểu" },
  { id: "lien-he-tu-van", name: "05. Kết nối & Tư vấn" },
  { id: "muc-luc", name: "06. Mục lục & Bản sắc" },
];

export function JourneyNav() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // Check which section is in view
      for (const section of JOURNEY_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className="nk-journey-rail"
      aria-label="Định vị hành trình trải nghiệm"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {JOURNEY_SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            type="button"
            className={`nk-journey-dot ${isActive ? "is-active" : ""}`}
            onClick={() => scrollTo(sec.id)}
            aria-label={sec.name}
            aria-current={isActive ? "step" : undefined}
          >
            <span className="nk-journey-tooltip">{sec.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
