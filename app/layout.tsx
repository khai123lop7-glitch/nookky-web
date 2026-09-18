import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { CartProvider } from "@/components/commerce/CartProvider";
import { CartToast } from "@/components/commerce/CartToast";
import { ScrollMotionSync } from "@/components/common/ScrollMotionSync";
import { NavigationProgressBar } from "@/components/common/NavigationProgressBar";
import { NookChatWidget } from "@/components/chat/NookChatWidget";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { TableOfContents } from "@/components/home/TableOfContents";
import "./globals.css";
import "./v3-migration.css";
import "./final-polish.css";
import "./scroll-transitions.css";

export const viewport: Viewport = {
  themeColor: "#2e1407",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nookky.shop"),
  title: {
    default: "Nook Ký",
    template: "%s | Nook Ký",
  },
  description: "Xây một góc nhỏ, giữ một ký ức riêng.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Nook Ký",
    description: "Xây một góc nhỏ, giữ một ký ức riêng.",
    url: "https://nookky.shop",
    siteName: "Nook Ký",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Nook Ký Logo",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        <AnalyticsTracker />
        <CartProvider>
          <a className="nk-skip-link" href="#main-content">Bỏ qua điều hướng</a>
          {children}
          <TableOfContents />
          <CartToast />
          <ScrollMotionSync />
          <NookChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
