import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { CartView } from "@/components/commerce/CartView";

export const metadata: Metadata = {
  title: "Giỏ Hàng",
  description: "Xem lại các tác phẩm Nook Ký bạn đã chọn và tiến hành đặt hàng.",
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="nk-inner-page nk-cart-page">
        <CartView />
      </main>
    </>
  );
}
