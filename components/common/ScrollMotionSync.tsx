"use client";

import { useEffect, useState } from "react";
import { JourneyNav } from "./JourneyNav";

/**
 * ScrollMotionSync (Bản đã sửa lỗi mờ chữ & kích hoạt lặp lại 2 chiều mượt mà):
 * 1. IntersectionObserver with bi-directional repeat (khi cuộn lên/xuống đều có animation mượt mà).
 * 2. Parallax engine cho các ảnh & video nền nhiều tầng.
 * 3. 3D Perspective Card Tilt handler cho các thẻ và khối sản phẩm.
 * 4. Ambient Cursor Spotlight glow follower.
 * 5. Page Reading Scroll progress bar.
 */
export function ScrollMotionSync() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // 1. Reveal on scroll using IntersectionObserver (Lặp lại khi cuộn vào / ra khỏi màn hình)
    const revealElements = document.querySelectorAll("[data-nk-reveal]");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("nk-revealed");
          } else {
            // Khi cuộn ra khỏi viewport thì gỡ class để khi cuộn lại sẽ kích hoạt hiệu ứng xuất hiện tiếp
            const rect = entry.target.getBoundingClientRect();
            // Chỉ reset nếu phần tử ở dưới đáy hoặc trên hẳn màn hình
            if (rect.top > window.innerHeight || rect.bottom < 0) {
              entry.target.classList.remove("nk-revealed");
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.08,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // 2. Parallax and Scroll Progress Tracker
    let ticking = false;
    const parallaxElements = document.querySelectorAll<HTMLElement>(
      "[data-nk-parallax]"
    );

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;
          if (maxScroll > 0) {
            setScrollProgress((scrollY / maxScroll) * 100);
          }

          parallaxElements.forEach((el) => {
            const speed = parseFloat(
              el.getAttribute("data-nk-parallax-speed") || "0.15"
            );
            const rect = el.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const elementCenter = rect.top + rect.height / 2;
            const distFromCenter = elementCenter - viewportCenter;
            const translateY = distFromCenter * speed;
            el.style.transform = `translate3d(0, ${translateY}px, 0) scale(1.06)`;
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // 3. 3D Interactive Perspective Tilt on elements with [data-nk-tilt]
    const tiltElements = document.querySelectorAll<HTMLElement>("[data-nk-tilt]");

    const handleMouseMove = (e: MouseEvent, el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;
    };

    const handleMouseLeave = (el: HTMLElement) => {
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    };

    tiltElements.forEach((el) => {
      el.addEventListener("mousemove", (e) => handleMouseMove(e as MouseEvent, el));
      el.addEventListener("mouseleave", () => handleMouseLeave(el));
    });

    // 4. Cursor Spotlight Glow Movement
    const cursorGlow = document.getElementById("nk-cursor-glow");
    const onWindowMouseMove = (e: MouseEvent) => {
      if (cursorGlow) {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", onWindowMouseMove, { passive: true });

    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", onWindowMouseMove);
      tiltElements.forEach((el) => {
        el.removeEventListener("mousemove", (e) =>
          handleMouseMove(e as MouseEvent, el)
        );
        el.removeEventListener("mouseleave", () => handleMouseLeave(el));
      });
    };
  }, []);

  return (
    <>
      {/* Reading Progress Top Bar */}
      <div
        className="nk-scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Cursor Spotlight Glow */}
      <div id="nk-cursor-glow" className="nk-cursor-glow" aria-hidden="true" />

      {/* Right Journey Rail */}
      <JourneyNav />
    </>
  );
}
