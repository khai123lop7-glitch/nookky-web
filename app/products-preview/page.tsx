import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { ProductGrid } from "@/components/home/ProductGrid";

export const metadata: Metadata = {
  title: "Product Preview | Nook Ký",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProductsPreviewPage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <ProductGrid />
      </main>
    </>
  );
}
