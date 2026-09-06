import { Header } from "@/components/site/Header";
import { ProductGrid } from "@/components/home/ProductGrid";

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
