"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/commerce/CartProvider";
import styles from "./Header.module.css";

const nav = [
  ["Trang chủ", "/"],
  ["Sản phẩm", "/shop"],
  ["Bộ sưu tập", "/collections"],
  ["Build Your Nook", "/studio"],
  ["Về Nook Ký", "/about"],
] as const;

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const isHome = pathname === "/";
  const [compact, setCompact] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);
  const [symbolFailed, setSymbolFailed] = useState(false);
  const [wordmarkFailed, setWordmarkFailed] = useState(false);
  const useDarkBrandAssets = compact || menuOpen;

  useEffect(() => {
    const sync = () => {
      if (!isHome) {
        setCompact(true);
        return;
      }

      const hero = document.querySelector<HTMLElement>(".nk-hero");
      if (hero) {
        setCompact(hero.getBoundingClientRect().bottom <= 72);
        return;
      }

      setCompact(window.scrollY >= window.innerHeight - 72);
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
    setSymbolFailed(false);
    setWordmarkFailed(false);
  }, [useDarkBrandAssets]);

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

  const headerClass = [
    "nk-header",
    compact ? "is-compact" : "is-overlay",
    menuOpen ? "is-menu-open" : "",
    compact ? styles.compact : "",
  ].filter(Boolean).join(" ");

  return (
    <header className={headerClass}>
      <div className="nk-announcement">Miễn phí vận chuyển cho đơn từ 1.000.000₫</div>

      <div className="nk-header__main nk-container-wide">
        <div className="nk-header__brand">
          <a className="nk-symbol" href="/" aria-label="Nook Ký trang chủ">
            {!symbolFailed ? (
              <img
                src={useDarkBrandAssets ? "/media/brand/logo-symbol-dark.png" : "/media/brand/logo-symbol-light.png"}
                alt=""
                onError={() => setSymbolFailed(true)}
              />
            ) : (
              <span className="nk-symbol__fallback" aria-hidden="true">NK</span>
            )}
          </a>

          <a className="nk-wordmark" href="/" aria-label="Nook Ký">
            {!wordmarkFailed ? (
              <img
                src={useDarkBrandAssets ? "/media/brand/wordmark-dark.png" : "/media/brand/wordmark-light.png"}
                alt="Nook Ký"
                onError={() => setWordmarkFailed(true)}
              />
            ) : (
              <span className="nk-wordmark__fallback">NOOK KÝ</span>
            )}
          </a>
        </div>

        <nav id="nk-primary-nav" className="nk-nav" aria-label="Điều hướng chính">
          {nav.map(([label, href]) => {
            const active = isNavActive(href);
            return <a className={active ? "is-active" : ""} aria-current={active ? "page" : undefined} href={href} key={href}>{label}</a>;
          })}
        </nav>

        <div className="nk-header__tools" aria-label="Tiện ích">
          <a className="nk-icon-button nk-cart-link" href="/cart" aria-label={`Giỏ hàng, ${itemCount} sản phẩm`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5h11l-1 11h-9l-1-11Z"/><path d="M9 9V6.5a3 3 0 0 1 6 0V9"/></svg>
            {itemCount > 0 ? <span className="nk-cart-count" aria-hidden="true">{itemCount > 99 ? "99+" : itemCount}</span> : null}
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
    </header>
  );
}
