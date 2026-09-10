import { Header } from "@/components/site/Header";
import { Hero } from "@/components/home/Hero";
import { BrandStory } from "@/components/home/BrandStory";
import { CraftProcess } from "@/components/home/CraftProcess";
import { ContactCta } from "@/components/home/ContactCta";
import { TableOfContents } from "@/components/home/TableOfContents";

function HeritageSeam() {
  return (
    <div className="heritageSeamDivider" aria-hidden="true">
      <div className="heritageSeamInner">
        <div className="heritageSeamLine" />
        <span className="heritageSeamKnot">✧</span>
        <div className="heritageSeamLine" />
      </div>
    </div>
  );
}

/**
 * Nook Ký Homepage Flow:
 * 1. Hero Section
 * 2. Quà tặng doanh nghiệp & Custom Gifts (BrandStory)
 * 3. Hành trình tạo nên một Nook (CraftProcess)
 * 4. Kết nối & Đồng hành (ContactCta)
 * 5. Mục lục trang & Bản sắc văn hóa (TableOfContents)
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {/* 1. Hero Section */}
        <Hero />

        <HeritageSeam />

        {/* 2. Quà tặng doanh nghiệp & Custom Gifts */}
        <BrandStory />

        <HeritageSeam />

        {/* 3. Hành trình tạo nên một Nook (Crafting Process) */}
        <CraftProcess />

        <HeritageSeam />

        {/* 4. Kết nối & Đồng hành (Contact CTA Form) */}
        <ContactCta />

        <HeritageSeam />

        {/* 5. Mục lục trang & Bản sắc văn hóa */}
        <TableOfContents />
      </main>
    </>
  );
}
