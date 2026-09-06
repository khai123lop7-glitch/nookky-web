import { Header } from "@/components/site/Header";
import { BrandClose } from "@/components/home/BrandClose";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="nk-inner-page">
        <section className="nk-about-intro nk-container">
          <p className="nk-eyebrow">VỀ NOOK KÝ</p>
          <h1>Thu nhỏ một nơi chốn để có thể nhìn gần hơn.</h1>
          <p>
            Nook Ký tạo ra những Book Nook lấy cảm hứng từ các chi tiết Việt Nam quen thuộc, rồi biến chúng thành một vật thể décor để người dùng tự tay hoàn thiện và giữ lại trong không gian sống.
          </p>
        </section>
        <BrandClose />
      </main>
    </>
  );
}
