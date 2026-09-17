import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { HoiAnModel } from "@/components/preview/HoiAnModel";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Thử mô hình 3D Hội An | Nook Ký",
  robots: { index: false, follow: false },
};

export default function ThreeDPreviewPage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className={styles.page}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>NOOK KÝ · BẢN DỰNG THỬ 01</p>
          <h1>Một góc <em>Hội An</em>,<br />nhìn từ mọi phía.</h1>
          <p>Phác thảo 3D dựa trên ảnh “Phố vừa lên đèn Hội An”. Xoay mô hình, đến gần các lớp phố và thử bật tắt ánh đèn lồng.</p>
          <p className={styles.note}>Đây là mô hình ý tưởng để duyệt cảm giác không gian. Hình khối và chi tiết sẽ được chỉnh theo sản phẩm thật ở bước tiếp theo.</p>
        </div>
        <HoiAnModel />
        <div className={styles.after}>
          <span>01 / KHUNG CẢNH</span>
          <span>Gỗ · phố cổ · ánh đèn</span>
          <a href="/product/pho-vua-len-den-hoi-an">Xem sản phẩm thật ↗</a>
        </div>
      </main>
    </>
  );
}
