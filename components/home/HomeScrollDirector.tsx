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
          const gallery = document.querySelector<HTMLElement>("#shop-all > div:first-child");
          const gift = document.querySelector<HTMLElement>("[data-nk-gift-scene]");
          const giftImage = gift?.querySelector<HTMLElement>("img");
          const contact = document.querySelector<HTMLElement>("#lien-he-tu-van");

          if (gallery) {
            gsap.fromTo(gallery,
              { clipPath: "circle(0% at 73% 53%)", scale: 1.14 },
              { clipPath: "circle(150% at 73% 53%)", scale: 1, ease: "none",
                scrollTrigger: { trigger: "#shop-all", start: "top bottom", end: "top top", scrub: .55 } },
            );
          }
          if (gift) {
            gsap.fromTo(gift,
              { clipPath: "circle(0% at 76% 50%)" },
              { clipPath: "circle(150% at 76% 50%)", ease: "none",
                scrollTrigger: { trigger: gift.parentElement?.parentElement ?? gift, start: "top bottom", end: "top top+=60", scrub: .55 } },
            );
          }
          if (giftImage) {
            gsap.fromTo(giftImage,
              { scale: 1.25, rotation: 3 },
              { scale: 1, rotation: 0, ease: "none",
                scrollTrigger: { trigger: gift, start: "top bottom", end: "top top+=60", scrub: .7 } },
            );
          }
          if (contact) {
            gsap.fromTo(contact,
              { clipPath: "circle(0% at 72% 20%)", scale: 1.06 },
              { clipPath: "circle(150% at 72% 20%)", scale: 1, ease: "none",
                scrollTrigger: { trigger: contact, start: "top bottom", end: "top top+=60", scrub: .7 } },
            );
          }
        });
        media.add("(max-width: 760px) and (prefers-reduced-motion: no-preference)", () => {
          const contact = document.querySelector<HTMLElement>("#lien-he-tu-van");
          if (!contact) return;
          gsap.fromTo(contact,
            { clipPath: "inset(12% 0% 0% round 70px 70px 0 0)" },
            { clipPath: "inset(0% 0% 0% round 0px)", ease: "none",
              scrollTrigger: { trigger: contact, start: "top bottom", end: "top 25%", scrub: .6 } },
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
