"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./FeaturedNooks.module.css";

const featured = [
  { number: "01", place: "HỘI AN · CHẠNG VẠNG", name: "Phố Vừa Lên Đèn", note: "Một con phố nhỏ, một buổi chiều chưa muốn khép lại.", image: "/media/products/01-pho-vua-len-den-hoi-an/cover.webp", href: "/product/pho-vua-len-den-hoi-an", color: "#dfb990" },
  { number: "02", place: "HUẾ · SAU CƠN MƯA", name: "Mưa Qua Sân Gạch", note: "Khoảng lặng của mái ngói và sân gạch ở lại trên kệ sách.", image: "/media/products/02-mua-qua-san-gach-hue/cover.webp", href: "/product/mua-qua-san-gach-hue", color: "#b9d1c4" },
  { number: "03", place: "HÀ NỘI · SỚM MAI", name: "Sáng Trên Phố Cũ", note: "Nắng đi qua những ban công và len xuống một con ngõ.", image: "/media/products/03-sang-tren-pho-cu-ha-noi/cover.webp", href: "/product/sang-tren-pho-cu-ha-noi", color: "#dfc2ac" },
];

type Pose = { x: number; y: number; rotate: number; scale: number; opacity: number };
type Frame = { at: number; poses: Pose[] };
const frames: Frame[] = [
  { at: 0, poses: [
    { x: -13, y: 3, rotate: -15, scale: .83, opacity: 1 },
    { x: 0, y: -1, rotate: 0, scale: .9, opacity: 1 },
    { x: 13, y: 3, rotate: 15, scale: .83, opacity: 1 },
  ] },
  { at: .17, poses: [
    { x: 0, y: 0, rotate: -2, scale: 1.12, opacity: 1 },
    { x: 34, y: -12, rotate: 18, scale: .7, opacity: .45 },
    { x: 52, y: 12, rotate: 26, scale: .6, opacity: .15 },
  ] },
  { at: .31, poses: [
    { x: 0, y: 0, rotate: 0, scale: 1.12, opacity: 1 },
    { x: 35, y: -12, rotate: 18, scale: .7, opacity: .35 },
    { x: 52, y: 12, rotate: 26, scale: .6, opacity: .1 },
  ] },
  { at: .49, poses: [
    { x: -43, y: 10, rotate: -22, scale: .65, opacity: 0 },
    { x: 0, y: 0, rotate: 1, scale: 1.12, opacity: 1 },
    { x: 43, y: -10, rotate: 22, scale: .65, opacity: .2 },
  ] },
  { at: .63, poses: [
    { x: -43, y: 10, rotate: -22, scale: .65, opacity: 0 },
    { x: 0, y: 0, rotate: 0, scale: 1.12, opacity: 1 },
    { x: 43, y: -10, rotate: 22, scale: .65, opacity: .2 },
  ] },
  { at: .81, poses: [
    { x: -52, y: 12, rotate: -26, scale: .6, opacity: 0 },
    { x: -34, y: -12, rotate: -18, scale: .7, opacity: 0 },
    { x: 0, y: 0, rotate: 2, scale: 1.12, opacity: 1 },
  ] },
  { at: 1, poses: [
    { x: -52, y: 12, rotate: -26, scale: .6, opacity: 0 },
    { x: -34, y: -12, rotate: -18, scale: .7, opacity: 0 },
    { x: 0, y: 0, rotate: 0, scale: 1.12, opacity: 1 },
  ] },
];
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function FeaturedNooks() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let lastActive = -1;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      section.style.setProperty("--gallery-progress", String(progress));
      let from = frames[0], to = frames[1];
      for (let i = 0; i < frames.length - 1; i++) {
        if (progress >= frames[i].at) { from = frames[i]; to = frames[i + 1]; }
      }
      const t = Math.max(0, Math.min(1, (progress - from.at) / (to.at - from.at)));
      const current = progress < .38 ? 0 : progress < .72 ? 1 : 2;
      if (current !== lastActive) { lastActive = current; setActive(current); }
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const a = from.poses[i], b = to.poses[i];
        card.style.transform = `translate(-50%, -50%) translate3d(${mix(a.x,b.x,t)}vw, ${mix(a.y,b.y,t)}vh, 0) rotate(${mix(a.rotate,b.rotate,t)}deg) scale(${mix(a.scale,b.scale,t)})`;
        card.style.opacity = String(mix(a.opacity,b.opacity,t));
        card.style.zIndex = i === current ? "3" : i === 1 ? "2" : "1";
        card.style.pointerEvents = i === current ? "auto" : "none";
        card.tabIndex = i === current ? 0 : -1;
      });
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className={styles.section} id="shop-all" aria-labelledby="featured-title" ref={sectionRef}>
      <div className={styles.stage}>
        <div className={styles.ambient} aria-hidden="true" style={{ background: featured[active].color }} />
        <div className={styles.inner}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>NOOK KÝ / NHỮNG NƠI CHỐN THU NHỎ</p>
            <h2 id="featured-title" className={styles.title}>Mỗi chiếc nook.<br /><em>Một nơi để nhớ.</em></h2>
            <div className={styles.activeCopy} key={active} aria-live="polite">
              <span className={styles.place}>{featured[active].number} / 03 &nbsp; {featured[active].place}</span>
              <h3>{featured[active].name}</h3>
              <p>{featured[active].note}</p>
              <Link href={featured[active].href} className={styles.productLink}>Xem mẫu này <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.progress} aria-hidden="true"><span /></div>
            <p className={styles.scrollHint}>CUỘN ĐỂ XOAY QUA TỪNG GÓC PHỐ &nbsp; ↓</p>
          </div>
          <div className={styles.gallery}>
            {featured.map((item, i) => (
              <Link className={styles.artwork} href={item.href} key={item.number}
                ref={(node) => { cardRefs.current[i] = node; }}
                aria-label={`Xem chi tiết ${item.name}`} style={{ background: item.color }}>
                <img src={item.image} alt={`Book nook ${item.name}`} loading="lazy" decoding="async" />
                <span className={styles.artworkNumber}>{item.number} / 03</span>
              </Link>
            ))}
          </div>
          <Link href="/shop" className={styles.allLink}>Xem cả bộ sưu tập <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </section>
  );
}
