"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [, startTransition] = useTransition();

  // Complete progress on route change
  useEffect(() => {
    if (visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 240);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept click on internal links to give instant feedback
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Ignore modified clicks or non-left clicks
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore hash-only links or external links
      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || target.target === "_blank") {
        return;
      }

      // Check if it is an internal route
      const currentUrl = new URL(window.location.href);
      const targetUrl = new URL(target.href, window.location.href);

      if (targetUrl.origin === currentUrl.origin) {
        // If navigating to the exact same pathname + search, don't trigger progress
        if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search) {
          return;
        }

        // Trigger instant progress
        startTransition(() => {
          setVisible(true);
          setProgress(25);
        });

        // Creep forward while waiting for route payload
        const creepTimer = setTimeout(() => {
          setProgress((prev) => (prev < 80 ? prev + 45 : prev));
        }, 120);

        return () => clearTimeout(creepTimer);
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => document.removeEventListener("click", handleLinkClick, { capture: true });
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: "2.5px",
        background: "linear-gradient(90deg, #d9953b 0%, #e4a853 60%, #c93b2b 100%)",
        boxShadow: "0 0 10px rgba(228, 168, 83, 0.7), 0 0 5px rgba(201, 59, 43, 0.5)",
        zIndex: 999999,
        pointerEvents: "none",
        transition: progress === 100 ? "width 0.15s ease-out, opacity 0.25s ease-in" : "width 0.25s ease-out",
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
