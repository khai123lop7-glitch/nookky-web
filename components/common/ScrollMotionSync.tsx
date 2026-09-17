"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollMotionSync Hook / Component:
 * - Observes elements with [data-nk-reveal] and triggers fade-in-up animations.
 * - Adds a subtle parallax effect on elements with [data-nk-parallax].
 */
export function ScrollMotionSync() {
  const pathname = usePathname();

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    document.documentElement.classList.add("nk-motion-ready");

    // 1. Reveal on scroll using IntersectionObserver
    const revealElements = document.querySelectorAll("[data-nk-reveal]");
    
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("nk-revealed");
            // Unobserve after revealing once for performance
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.1,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // 2. Subtle Parallax Effect on Scroll
    let ticking = false;
    const parallaxElements = document.querySelectorAll<HTMLElement>("[data-nk-parallax]");
    const heroStage = document.querySelector<HTMLElement>("[data-nk-hero-stage]");
    const scenes = document.querySelectorAll<HTMLElement>("[data-nk-scene]");

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          parallaxElements.forEach((el) => {
            const speed = parseFloat(el.getAttribute("data-nk-parallax-speed") || "0.15");
            const rect = el.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            // Calculate distance from viewport center
            const viewportCenter = window.innerHeight / 2;
            const elementCenter = rect.top + rect.height / 2;
            const distFromCenter = elementCenter - viewportCenter;
            const translateY = Math.max(-80, Math.min(80, distFromCenter * speed));
            el.style.transform = `translate3d(0, ${translateY}px, 0) scale(1.08)`;
          });

          if (heroStage) {
            const travel = Math.max(1, heroStage.offsetHeight - window.innerHeight);
            const progress = Math.max(0, Math.min(1, -heroStage.getBoundingClientRect().top / travel));
            heroStage.style.setProperty("--nk-hero-progress", progress.toFixed(3));
          }

          scenes.forEach((scene) => {
            const top = scene.getBoundingClientRect().top;
            if (top > window.innerHeight || top < -scene.offsetHeight) return;
            const progress = Math.max(0, Math.min(1, (window.innerHeight - top) / (window.innerHeight * 0.85)));
            scene.style.setProperty("--nk-scene-inset", `${((1 - progress) * 8).toFixed(2)}%`);
            scene.style.setProperty("--nk-scene-scale", (1.12 - progress * 0.12).toFixed(3));
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    if (parallaxElements.length > 0 || heroStage || scenes.length > 0) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll);
      handleScroll();
    }

    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      document.documentElement.classList.remove("nk-motion-ready");
    };
  }, [pathname]);

  return null;
}
