"use client";

import { useState, useRef, useEffect } from "react";
import { track } from "@/lib/analytics";
import styles from "./Hero.module.css";

interface LandscapeStory {
  id: string;
  name: string;
  sub: string;
  videoSrc: string;
  posterSrc: string;
  badge: string;
  headline: string;
  lead: string;
}

const LANDSCAPES: LandscapeStory[] = [
  {
    id: "hoi-an",
    name: "Hội An",
    sub: "Phố cổ hoa đăng",
    videoSrc: "/media/editorial/hero-hoian.mp4",
    posterSrc: "/media/products/01-pho-vua-len-den-hoi-an/cover.webp",
    badge: "Book Nook · Hội An hoài niệm",
    headline: "Giữ lại một góc Việt Nam.",
    lead: "Những nơi chốn quen thuộc, thu nhỏ thành một góc sáng để bạn tự tay hoàn thiện và giữ lại trên kệ sách.",
  },
  {
    id: "ha-noi",
    name: "Hà Nội",
    sub: "Sáng trên phố cũ",
    videoSrc: "/media/editorial/ha-noi.mp4",
    posterSrc: "/media/products/03-sang-tren-pho-cu-ha-noi/cover.webp",
    badge: "Book Nook · Hà Nội 36 phố phường",
    headline: "Mái ngói rêu phong phố cũ.",
    lead: "Góc ban công Pháp cổ, dây điện đan lối và giọt nắng sớm len lỏi qua từng tán bàng mùa thay lá.",
  },
  {
    id: "ha-long",
    name: "Vịnh Hạ Long",
    sub: "Kỳ quan đá biếc",
    videoSrc: "/media/editorial/ha-long.mp4",
    posterSrc: "/media/editorial/collection-bg.png",
    badge: "Book Nook · Vịnh Hạ Long hùng vĩ",
    headline: "Non nước ngàn năm huyền ảo.",
    lead: "Những đảo đá vôi trập trùng trên làn nước xanh ngọc bích, cánh buồm nâu lướt nhẹ giữa mây trời biển biếc.",
  },
  {
    id: "ninh-binh",
    name: "Ninh Bình",
    sub: "Cố đô non nước",
    videoSrc: "/media/editorial/ninh-binh.mp4",
    posterSrc: "/media/editorial/brand-story-bg.png",
    badge: "Book Nook · Tràng An cổ kính",
    headline: "Non nước Tràng An hữu tình.",
    lead: "Dòng suối trong vắt uốn lượn quanh chân núi đá, mái đình làng cổ kính ẩn hiện giữa cánh đồng lúa chín vàng.",
  },
  {
    id: "hue",
    name: "Huế",
    sub: "Mưa qua sân gạch",
    videoSrc: "/media/editorial/hue.mp4",
    posterSrc: "/media/products/02-mua-qua-san-gach-hue/cover.webp",
    badge: "Book Nook · Cố đô trầm mặc",
    headline: "Khoảng sân trầm sau cơn mưa.",
    lead: "Khoảng sân Huế rêu phong, nhịp mái ngói âm dương và mảng tường gỗ trầm mặc mang lại sự an yên.",
  },
  {
    id: "da-lat",
    name: "Đà Lạt",
    sub: "Đèn ấm trên dốc",
    videoSrc: "/media/editorial/da-lat.mp4",
    posterSrc: "/media/products/05-den-am-tren-doc-da-lat/cover.webp",
    badge: "Book Nook · Đà Lạt mờ sương",
    headline: "Gió sương và ánh đèn ấm.",
    lead: "Căn gác gỗ mộc mạc bên triền dốc dã quỳ, thơm nồng mùi cà phê và những đêm sương lạnh yên bình.",
  },
  {
    id: "sai-gon",
    name: "TP. Hồ Chí Minh",
    sub: "Hẻm còn sáng đèn",
    videoSrc: "/media/editorial/sai-gon.mp4",
    posterSrc: "/media/products/04-hem-con-sang-den-sai-gon/cover.webp",
    badge: "Book Nook · Sài Gòn phố hẻm",
    headline: "Góc hẻm thức cùng thành phố.",
    lead: "Dây điện chằng chịt, xe hủ tiếu gõ và nhịp sống nghĩa tình không bao giờ ngủ của phố thị phương Nam.",
  },
];

export function Hero() {
  const [activeLandscape, setActiveLandscape] = useState<string>("hoi-an");
  const [cinemaMode, setCinemaMode] = useState<boolean>(false);
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [walkDirection, setWalkDirection] = useState<"forward" | "backward">("forward");

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentIndex = LANDSCAPES.findIndex((l) => l.id === activeLandscape);
  const current = LANDSCAPES[currentIndex] || LANDSCAPES[0];

  // Auto-play video on landscape switch
  useEffect(() => {
    if (videoRef.current && current.videoSrc) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [activeLandscape, current.videoSrc]);

  // ESC exits cinema mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && cinemaMode) setCinemaMode(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cinemaMode]);

  const handleLandscapeChange = (newId: string) => {
    const newIdx = LANDSCAPES.findIndex((l) => l.id === newId);
    if (newIdx === currentIndex) return;
    setWalkDirection(newIdx > currentIndex ? "forward" : "backward");
    setIsWalking(true);
    setActiveLandscape(newId);
    track("hero_landscape_change", { landscape: newId });
    setTimeout(() => setIsWalking(false), 700);
  };

  const toggleCinemaMode = () => {
    const next = !cinemaMode;
    setCinemaMode(next);
    track("cinema_mode_toggle", { enabled: next });
  };

  const numWaypoints = LANDSCAPES.length;
  // Traveler avatar horizontal center calculation for active waypoint
  const travelerPercent = ((currentIndex + 0.5) / numWaypoints) * 100;
  // Progress rail connects from 1st waypoint center to active waypoint center
  const progressPercent = (currentIndex / (numWaypoints - 1)) * 100;

  return (
    <section
      className={`nk-hero ${cinemaMode ? styles.cinemaActive : ""}`}
      aria-labelledby="nk-hero-title"
    >
      {/* Background Media */}
      <div className="nk-hero__media" aria-hidden="true">
        {current.videoSrc ? (
          <video
            ref={videoRef}
            className="nk-hero__video"
            autoPlay
            loop
            muted
            playsInline
            poster={current.posterSrc}
            src={current.videoSrc}
          />
        ) : (
          <picture>
            <img src={current.posterSrc} alt={current.name} />
          </picture>
        )}
      </div>

      {/* Shade overlay — softens in cinema mode */}
      <div
        className={`nk-hero__shade ${cinemaMode ? styles.shadeSoft : ""}`}
        aria-hidden="true"
        onClick={() => cinemaMode && setCinemaMode(false)}
      />

      {/* ── Cinema Mode Button ───────────────────────────── */}
      <button
        type="button"
        className={styles.cinemaToggle}
        onClick={toggleCinemaMode}
        aria-label={cinemaMode ? "Hiện lại thông tin" : "Ngắm phong cảnh"}
      >
        {cinemaMode ? (
          <>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span className={styles.cinemaToggleText}>Hiện thông tin</span>
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            <span className={styles.cinemaToggleText}>Ngắm phong cảnh</span>
          </>
        )}
      </button>

      {/* ── Main Content ────────────────────────────────── */}
      <div className={`nk-hero__inner nk-container-wide ${cinemaMode ? styles.uiHidden : ""}`}>
        {/* Story copy */}
        <div className="nk-hero__copy">
          <p className="nk-eyebrow">{current.badge}</p>

          <h1 id="nk-hero-title" className={styles.title}>
            {current.headline}
          </h1>

          <p className="nk-hero__lead">{current.lead}</p>

          <div className="nk-hero__actions">
            <a
              className="nk-button nk-button--light"
              href="#shop-all"
              onClick={() => track("hero_primary_click", { destination: "shop-all", landscape: current.id })}
            >
              Khám phá bộ sưu tập
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h13M14 7l5 5-5 5"/>
              </svg>
            </a>
            <a
              className={styles.secondaryButton}
              href="/studio"
              onClick={() => track("hero_secondary_click", { destination: "studio" })}
            >
              Tự ráp Nook (Studio)
            </a>
          </div>
        </div>

        {/* ── Cultural Journey Waypoints Rail ──────────────── */}
        <div className="nk-hero__rail" aria-label="Khám phá các miền ký ức">
          <div className={styles.journeySection}>
            {/* Waypoints grid with exact traveler alignment */}
            <div className={styles.waypointsWrapper}>
              {/* The connecting rail between waypoints */}
              <div className={styles.waypointsRail}>
                <div
                  className={styles.waypointsProgress}
                  style={{ width: `${progressPercent}%` }}
                />
                {/* Fixed dots directly on the rail */}
                <div className={styles.railDotsContainer}>
                  {LANDSCAPES.map((land, idx) => (
                    <div
                      key={land.id}
                      className={`${styles.railDot} ${idx <= currentIndex ? styles.railDotActive : ""}`}
                      style={{ left: `${(idx / (numWaypoints - 1)) * 100}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* The walking traveler, positioned directly above active waypoint center */}
              <div
                className={`${styles.travelerAvatar} ${isWalking ? styles.isWalking : ""} ${walkDirection === "backward" ? styles.walkBackward : ""}`}
                style={{ left: `${travelerPercent}%` }}
                title={`Lữ khách đang dừng chân tại ${current.name}`}
              >
                <svg className={styles.travelerSvg} viewBox="0 0 32 44" fill="none" aria-hidden="true">
                  {/* Nón lá (conical hat) */}
                  <polygon points="16,2 5,14 27,14" fill="#d9953b"/>
                  <path d="M6.5 14 Q16 12 25.5 14" stroke="rgba(252,244,233,0.7)" strokeWidth="0.8" fill="none"/>
                  <path d="M13 14 Q11 16 10 18" stroke="#d9953b" strokeWidth="0.7" fill="none"/>
                  {/* Head */}
                  <circle cx="16" cy="15" r="3" fill="#fcf4e9"/>
                  {/* Áo dài */}
                  <path d="M12.5 18 Q10.5 21 11 27 L21 27 Q21.5 21 19.5 18 Q18 17 16 17 Q14 17 12.5 18Z" fill="rgba(252,244,233,0.95)"/>
                  {/* Ba lô */}
                  <rect x="8.5" y="18" width="4.5" height="6.5" rx="1.5" fill="#715f53"/>
                  <rect x="9" y="19" width="3.5" height="1" rx="0.5" fill="#4d3b32"/>
                  {/* Walking stick */}
                  <line x1="22.5" y1="12" x2="24" y2="38" stroke="#d9953b" strokeWidth="1.4" strokeLinecap="round"/>
                  {/* Legs */}
                  <line className={styles.legLeft}  x1="13.5" y1="27" x2="12" y2="37" stroke="rgba(252,244,233,0.95)" strokeWidth="2" strokeLinecap="round"/>
                  <line className={styles.legRight} x1="18.5" y1="27" x2="20" y2="37" stroke="rgba(252,244,233,0.95)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div className={styles.travelerPulse}/>
              </div>

              {/* Waypoint buttons */}
              {LANDSCAPES.map((land) => {
                const active = land.id === activeLandscape;
                return (
                  <button
                    key={land.id}
                    type="button"
                    className={`${styles.waypointItem} ${active ? styles.activeWaypoint : ""}`}
                    onClick={() => handleLandscapeChange(land.id)}
                  >
                    {active && <span className={styles.sealBadge} title="Điểm dừng">Ký</span>}
                    <span className={styles.waypointName}>{land.name}</span>
                    <span className={styles.waypointSub}>{land.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
