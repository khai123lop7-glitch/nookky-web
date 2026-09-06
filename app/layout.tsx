import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import "./globals.css";
import "./v3-migration.css";
import "./final-polish.css";

export const metadata: Metadata = {
  title: "Nook Ký",
  description: "Xây một góc nhỏ, giữ một ký ức riêng.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <a className="nk-skip-link" href="#main-content">Bỏ qua điều hướng</a>
        {children}
        <Footer />
      </body>
    </html>
  );
}
