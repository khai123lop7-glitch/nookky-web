import { Header } from "@/components/site/Header";

export default function CartPage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="nk-inner-page">
        <section className="nk-cart-shell nk-container">
          <p className="nk-eyebrow">GIỎ HÀNG</p>
          <h1>Giỏ hàng đang được hoàn thiện.</h1>
          <p>
            Bạn vẫn có thể xem toàn bộ bộ sưu tập và thông tin chi tiết của từng Nook trong lúc trải nghiệm mua hàng được hoàn thiện.
          </p>
          <a className="nk-button" href="/shop">Tiếp tục xem sản phẩm →</a>
        </section>
      </main>
    </>
  );
}
