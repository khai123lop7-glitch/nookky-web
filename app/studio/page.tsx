import { Header } from "@/components/site/Header";

export default function StudioPage() {
  return (
    <>
      <Header />
      <main className="nk-inner-page nk-studio-shell">
        <section className="nk-studio-intro nk-container">
          <p className="nk-eyebrow">NOOK KÝ STUDIO</p>
          <h1>Tự tạo một nơi chốn của riêng bạn.</h1>
          <p>
            Đây là route nền cho configurator mới: Chọn nơi chốn → kiến trúc → ánh sáng → đồ trang trí → dấu ký → lưu/mua.
          </p>
          <div className="nk-studio-status">
            <span>Phase hiện tại</span>
            <strong>Frontend foundation · chưa nối data/commerce</strong>
          </div>
        </section>
      </main>
    </>
  );
}
