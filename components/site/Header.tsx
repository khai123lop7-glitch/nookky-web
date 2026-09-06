"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const nav = [
  ["Trang chủ", "/"],
  ["Sản phẩm", "/shop"],
  ["Bộ sưu tập", "/collections"],
  ["Build Your Nook", "/studio"],
  ["Về Nook Ký", "/about"],
] as const;

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [compact, setCompact] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);
  const useDarkBrandAssets = compact || menuOpen;

  useEffect(() => {
    const sync = () => {
      if (!isHome) {
        setCompact(true);
        return;
      }

      const hero = document.querySelector<HTMLElement>(".nk-hero");
      if (hero) {
        const compactBoundary = 96;
        setCompact(hero.getBoundingClientRect().bottom <= compactBoundary);
        return;
      }

      setCompact(window.scrollY >= window.innerHeight - 96);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [isHome]);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const isNavActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/shop") return pathname.startsWith("/shop") || pathname.startsWith("/product/");
    return pathname.startsWith(href);
  };

  return (
    <header className={`nk-header ${compact ? "is-compact" : "is-overlay"} ${menuOpen ? "is-menu-open" : ""}`}>
      <div className="nk-announcement">Miễn phí vận chuyển cho đơn từ 1.000.000₫</div>

      <div className="nk-header__main nk-container-wide">
        <a className="nk-symbol" href="/" aria-label="Nook Ký trang chủ">
          <img
            src={useDarkBrandAssets ? "/media/brand/logo-symbol-dark.png" : "/media/brand/logo-symbol-light.png"}
            alt=""
            onError={(event) => { event.currentTarget.style.display = "none"; }}
          />
          <span className="nk-symbol__fallback" aria-hidden="true">NK</span>
        </a>

        <a className="nk-wordmark" href="/" aria-label="Nook Ký">
          <img
            src={useDarkBrandAssets ? "/media/brand/wordmark-dark.png" : "/media/brand/wordmark-light.png"}
            alt="Nook Ký"
            onError={(event) => { event.currentTarget.style.display = "none"; }}
          />
          <span className="nk-wordmark__fallback">NOOK KÝ</span>
        </a>

        <div className="nk-header__tools" aria-label="Tiện ích">
          <a className="nk-icon-button" href="/cart" aria-label="Giỏ hàng">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5h11l-1 11h-9l-1-11Z"/><path d="M9 9V6.5a3 3 0 0 1 6 0V9"/></svg>
          </a>
          <button
            className="nk-menu-toggle"
            type="button"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            aria-controls="nk-primary-nav"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span/><span/>
          </button>
        </div>
      </div>

      <nav id="nk-primary-nav" className="nk-nav" aria-label="Điều hướng chính">
        {nav.map(([label, href]) => {
          const active = isNavActive(href);
          return <a className={active ? "is-active" : ""} aria-current={active ? "page" : undefined} href={href} key={href}>{label}</a>;
        })}
      </nav>
    </header>
  );
}
