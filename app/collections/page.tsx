import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { PlaceSelector } from "@/components/home/PlaceSelector";
import { FeaturedNooks } from "@/components/home/FeaturedNooks";

export const metadata: Metadata = {
  title: "Bộ Sưu Tập 3 Miền",
  description: "Khám phá các góc phố và di sản kiến trúc ba miền Bắc - Trung - Nam thu nhỏ trong từng tác phẩm Nook Ký.",
};

export default function CollectionsPage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="nk-inner-page">
        <PlaceSelector />
        <FeaturedNooks />
      </main>
    </>
  );
}
