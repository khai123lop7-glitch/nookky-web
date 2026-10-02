import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { ProductGrid } from "@/components/home/ProductGrid";

export const metadata: Metadata = {
  title: "Tất Cả Sản Phẩm",
  description: "Khám phá các mẫu Book Nook thủ công Nook Ký lấy cảm hứng từ các địa danh văn hoá Việt Nam.",
};

export default function ShopPage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="nk-inner-page nk-inner-page--shop">
        <ProductGrid />
      </main>
    </>
  );
}
