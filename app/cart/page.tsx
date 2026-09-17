import { Header } from "@/components/site/Header";
import { CartView } from "@/components/commerce/CartView";

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
