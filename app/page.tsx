import { Header } from "@/components/site/Header";
import { Hero } from "@/components/home/Hero";
import { BrandStory } from "@/components/home/BrandStory";
import { CraftProcess } from "@/components/home/CraftProcess";
import { ContactCta } from "@/components/home/ContactCta";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <BrandStory />
        <CraftProcess />
        <ContactCta />
      </main>
    </>
  );
}
