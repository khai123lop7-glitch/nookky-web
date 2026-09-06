import { Header } from "@/components/site/Header";
import { PlaceSelector } from "@/components/home/PlaceSelector";
import { FeaturedNooks } from "@/components/home/FeaturedNooks";

export default function CollectionsPage() {
  return (
    <>
      <Header />
      <main className="nk-inner-page">
        <PlaceSelector />
        <FeaturedNooks />
      </main>
    </>
  );
}
