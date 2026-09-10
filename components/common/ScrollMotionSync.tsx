"use client";

import { useEffect } from "react";

/**
 * ScrollMotionSync Hook / Component:
 * - Observes elements with [data-nk-reveal] and triggers fade-in-up animations.
 * - Adds a subtle parallax effect on elements with [data-nk-parallax].
 */
export function ScrollMotionSync() {
  useEffect(() => {
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

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          parallaxElements.forEach((el) => {
            const speed = parseFloat(el.getAttribute("data-nk-parallax-speed") || "0.15");
            const rect = el.getBoundingClientRect();
            // Calculate distance from viewport center
            const viewportCenter = window.innerHeight / 2;
            const elementCenter = rect.top + rect.height / 2;
            const distFromCenter = elementCenter - viewportCenter;
            const translateY = distFromCenter * speed;
            el.style.transform = `translate3d(0, ${translateY}px, 0) scale(1.08)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    if (parallaxElements.length > 0) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
