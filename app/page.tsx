import { Header } from "@/components/site/Header";
import { Hero } from "@/components/home/Hero";
import { CraftProcess } from "@/components/home/CraftProcess";
import { ContactCta } from "@/components/home/ContactCta";
import { FeaturedNooks } from "@/components/home/FeaturedNooks";
import { GiftToCraftChapter } from "@/components/home/GiftToCraftChapter";
import { HomeScrollDirector } from "@/components/home/HomeScrollDirector";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} data-nk-home>
        <HomeScrollDirector />
        <div className="nk-home-hero-stage" data-nk-hero-stage>
          <Hero />
        </div>
        <FeaturedNooks />
        <GiftToCraftChapter />
        <CraftProcess />
        <ContactCta />
      </main>
    </>
  );
}
