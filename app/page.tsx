import { Header } from "@/components/site/Header";
import { Hero } from "@/components/home/Hero";
import { BrandStory } from "@/components/home/BrandStory";
import { CraftProcess } from "@/components/home/CraftProcess";
import { FeaturedShowcase } from "@/components/home/FeaturedShowcase";
import { ContactCta } from "@/components/home/ContactCta";
import { TableOfContents } from "@/components/home/TableOfContents";

/**
 * Nook Ký Homepage Flow:
 * 1. Hero Section
 * 2. Quà tặng doanh nghiệp & Custom Gifts (BrandStory)
 * 3. Hành trình tạo nên một Nook (CraftProcess)
 * 4. Sản phẩm tiêu biểu (FeaturedShowcase)
 * 5. Kết nối & Đồng hành (ContactCta)
 * 6. Mục lục trang & Bản sắc văn hóa (TableOfContents)
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Quà tặng doanh nghiệp & Custom Gifts */}
        <BrandStory />

        {/* 3. Hành trình tạo nên một Nook (Crafting Process) */}
        <CraftProcess />

        {/* 4. Sản phẩm tiêu biểu (Featured Showcase) */}
        <FeaturedShowcase />

        {/* 5. Kết nối & Đồng hành (Contact CTA Form) */}
        <ContactCta />

        {/* 6. Mục lục trang & Bản sắc văn hóa */}
        <TableOfContents />
      </main>
    </>
  );
}
