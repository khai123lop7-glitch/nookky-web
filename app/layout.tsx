import type { Metadata } from "next";
import { CartProvider } from "@/components/commerce/CartProvider";
import { CartToast } from "@/components/commerce/CartToast";
import { ScrollMotionSync } from "@/components/common/ScrollMotionSync";
import { NookChatWidget } from "@/components/chat/NookChatWidget";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import "./globals.css";
import "./v3-migration.css";
import "./final-polish.css";
import "./scroll-transitions.css";

export const metadata: Metadata = {
  title: "Nook Ký",
  description: "Xây một góc nhỏ, giữ một ký ức riêng.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <AnalyticsTracker />
        <CartProvider>
          <a className="nk-skip-link" href="#main-content">Bỏ qua điều hướng</a>
          {children}
          <CartToast />
          <ScrollMotionSync />
          <NookChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
