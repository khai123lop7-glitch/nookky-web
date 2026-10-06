"use client";

import { useEffect } from "react";

export function HomeScrollDirector() {
  useEffect(() => {
    let cancelled = false;
    let revert: (() => void) | undefined;

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
          const gift = document.querySelector<HTMLElement>("[data-nk-gift-scene]");
          const giftImage = gift?.querySelector<HTMLElement>("img");
          const contact = document.querySelector<HTMLElement>("#lien-he-tu-van");

          if (giftImage) {
            gsap.fromTo(giftImage,
              { scale: 1.12 },
              { scale: 1, ease: "none",
                scrollTrigger: { trigger: gift, start: "top bottom", end: "bottom top", scrub: .6 } },
            );
          }
          if (contact) {
            gsap.fromTo(contact,
              { opacity: 0.95, y: 25 },
              { opacity: 1, y: 0, ease: "none",
                scrollTrigger: { trigger: contact, start: "top bottom", end: "top 70%", scrub: .6 } },
            );
          }
        });
        media.add("(max-width: 760px) and (prefers-reduced-motion: no-preference)", () => {
          const contact = document.querySelector<HTMLElement>("#lien-he-tu-van");
          if (!contact) return;
          gsap.fromTo(contact,
            { opacity: 0.92, y: 20 },
            { opacity: 1, y: 0, ease: "none",
              scrollTrigger: { trigger: contact, start: "top bottom", end: "top 60%", scrub: .5 } },
          );
        });
        return () => media.revert();
      });
      revert = () => context.revert();
      ScrollTrigger.refresh();
    };

    void setup();
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return null;
}
