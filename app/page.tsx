import { Header } from "@/components/site/Header";
import { Hero } from "@/components/home/Hero";
import { BrandStory } from "@/components/home/BrandStory";
import { ProductGrid } from "@/components/home/ProductGrid";
import { CraftProcess } from "@/components/home/CraftProcess";
import { JournalGuides } from "@/components/home/JournalGuides";
import { RealNooks } from "@/components/home/RealNooks";
import { ContactCta } from "@/components/home/ContactCta";

/**
 * Nook Ký Homepage Flow:
 * 1. Hero Video (6 destinations: Hoi An, Hue, Ha Noi, Da Lat, Sai Gon, Mien Tay)
 * 2. Brand Story (Cau chuyen thuong hieu, Y nghia, Triet ly)
 * 3. Featured Products (Danh sach Nook tieu bieu, gia, xem chi tiet, add to cart)
 * 4. Crafting Process (Qua trinh tao: Y tuong, Thiet ke, Che tac, Hoan thien)
 * 5. Journal & Guides (Bai viet: Cau chuyen, Hau truong, Huong dan, Cam hung)
 * 6. Real Spaces (Khong gian that: Ban lam viec, Ke sach, Goc phong)
 * 7. Contact & Community CTA (Form dang ky, nhan tin, hop tac)
 * 8. Footer (Logo, Menu, Thong tin lien he, Mang xa hoi, Chinh sach) -> in layout.tsx
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Câu chuyện thương hiệu */}
        <BrandStory />

        {/* 3. Sản phẩm tiêu biểu */}
        <ProductGrid />

        {/* 4. Quá trình tạo nên một Nook */}
        <CraftProcess />

        {/* 5. Bài viết / Cẩm nang */}
        <JournalGuides />

        {/* 6. Không gian thật / Khách hàng */}
        <RealNooks />

        {/* 7. CTA liên hệ & Nhận tin */}
        <ContactCta />
      </main>
    </>
  );
}
