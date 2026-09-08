import { Header } from "@/components/site/Header";
import { Hero } from "@/components/home/Hero";
import { FeaturedNooks } from "@/components/home/FeaturedNooks";
import { ProductGrid } from "@/components/home/ProductGrid";
import { ProductSpotlight } from "@/components/home/ProductSpotlight";
import { PlaceSelector } from "@/components/home/PlaceSelector";
import { BuildExperience } from "@/components/home/BuildExperience";
import { RealNooks } from "@/components/home/RealNooks";
import { BrandClose } from "@/components/home/BrandClose";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <FeaturedNooks />
        <ProductGrid />
        <ProductSpotlight />
        <PlaceSelector />
        <BuildExperience />
        <RealNooks />
        <BrandClose />
      </main>
    </>
  );
}
