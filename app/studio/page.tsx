import type { Metadata } from "next";
import { Header } from "@/components/site/Header";

export const metadata: Metadata = {
  title: "Tự Ráp Nook | Nook Ký Studio",
  description: "Trải nghiệm tự tạo và tùy biến Book Nook mang dấu ấn phong cách riêng của bạn.",
};

export default function StudioPage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="nk-inner-page nk-studio-shell">
        <section className="nk-studio-intro nk-container">
          <p className="nk-eyebrow">NOOK KÝ STUDIO</p>
          <h1>Tự tạo một nơi chốn của riêng bạn.</h1>
          <p>
            Nook Ký Studio sẽ cho phép bạn chọn nơi chốn, kiến trúc, ánh sáng, đồ trang trí và dấu ký để tạo một phiên bản mang dấu ấn riêng.
          </p>
          <div className="nk-studio-status">
            <span>Trạng thái</span>
            <strong>Trải nghiệm tùy chỉnh đang được hoàn thiện</strong>
          </div>
        </section>
      </main>
    </>
  );
}
