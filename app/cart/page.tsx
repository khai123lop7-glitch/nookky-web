import { Header } from "@/components/site/Header";

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="nk-inner-page">
        <section className="nk-cart-shell nk-container">
          <p className="nk-eyebrow">GIỎ HÀNG</p>
          <h1>Giỏ hàng mới sẽ nối vào Commerce Adapter.</h1>
          <p>
            Route này đã tách khỏi WooCommerce. Ở phase commerce, cart state sẽ được nối vào backend thật thay vì hardcode trong giao diện.
          </p>
          <a className="nk-button" href="/shop">Tiếp tục xem sản phẩm →</a>
        </section>
      </main>
    </>
  );
}
