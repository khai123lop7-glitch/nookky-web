"use client";

import { useState } from "react";
import styles from "./JournalGuides.module.css";

interface ArticleItem {
  id: string;
  category: "Câu chuyện địa điểm" | "Hậu trường sản xuất" | "Hướng dẫn lắp ráp" | "Cảm hứng trang trí";
  title: string;
  excerpt: string;
  readTime: string;
  image: string;
  href: string;
}

const articles: ArticleItem[] = [
  {
    id: "hoi-an-memories",
    category: "Câu chuyện địa điểm",
    title: "Ký ức Hội An qua những chiếc đèn lồng hoa đăng chạng vạng",
    excerpt: "Đi tìm nguồn cảm hứng màu tường vàng rêu phong và kiến trúc mái âm dương đặc trưng bên dòng sông Hoài thơ mộng.",
    readTime: "5 phút đọc",
    image: "/media/products/01-pho-vua-len-den-hoi-an/cover.webp",
    href: "/product/pho-vua-len-den-hoi-an",
  },
  {
    id: "backstage-woodcraft",
    category: "Hậu trường sản xuất",
    title: "Nghệ thuật xử lý vân gỗ và ánh sáng chiều sâu trong Book Nook",
    excerpt: "Khám phá quy trình cắt laser chính xác và kỹ thuật bố trí đèn LED giấu mộng giúp không gian 20cm có chiều sâu vô cực.",
    readTime: "7 phút đọc",
    image: "/media/editorial/brand-close.webp",
    href: "/about",
  },
  {
    id: "assembly-guide",
    category: "Hướng dẫn lắp ráp",
    title: "Cẩm nang 5 bước cho người mới bắt đầu tự tay ráp chiếc Nook đầu tiên",
    excerpt: "Những lưu ý quan trọng về cách phân loại mảnh mộng, kiểm tra nguồn điện trước khi dán và bảo quản lớp sơn mài hoàn hảo.",
    readTime: "6 phút đọc",
    image: "/media/products/05-den-am-tren-doc-da-lat/detail.webp",
    href: "/studio",
  },
  {
    id: "decor-inspiration",
    category: "Cảm hứng trang trí",
    title: "Biến kệ sách và bàn làm việc thành bảo tàng văn hóa thu nhỏ",
    excerpt: "Gợi ý phối cảnh ánh sáng ấm áp, kết hợp giữa tiểu thuyết văn học và những góc phố Việt Nam phát sáng trong đêm.",
    readTime: "4 phút đọc",
    image: "/media/products/04-hem-con-sang-den-sai-gon/lifestyle.webp",
    href: "/collections",
  },
];

export function JournalGuides() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [switching, setSwitching] = useState(false);
  const current = articles[activeIdx];

  const handleSelect = (idx: number) => {
    if (idx === activeIdx) return;
    setSwitching(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setTimeout(() => setSwitching(false), 50);
    }, 120);
  };

  return (
    <section className={styles.journalSection} id="journal-guides" aria-labelledby="nk-journal-title">
      <div className={styles.innerContainer}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>BÀI VIẾT & CẨM NANG</p>
            <h2 id="nk-journal-title" className={styles.title}>
              Ký Sự & Cảm Hứng Sáng Tạo.
            </h2>
          </div>
          <p className={styles.lead}>
            Những câu chuyện phía sau bản vẽ, kinh nghiệm lắp ráp và phong cách sống cùng mô hình kiến trúc Việt Nam.
          </p>
        </header>

        {/* Magazine Grid */}
        <div className={styles.magazineGrid}>
          {/* Left: Spotlight */}
          <article className={styles.spotlightCard}>
            <div className={styles.spotlightMedia}>
              <img
                src={current.image}
                alt={current.title}
                className={`${styles.spotlightImg} ${switching ? styles.switching : ""}`}
                loading="lazy"
                decoding="async"
              />
              <span className={styles.categoryBadge}>{current.category}</span>
            </div>
            <div className={styles.spotlightBody}>
              <div>
                <div className={styles.metaRow}>
                  <span>Thời lượng: {current.readTime}</span>
                </div>
                <h3 className={styles.spotlightTitle}>{current.title}</h3>
                <p className={styles.spotlightExcerpt}>{current.excerpt}</p>
              </div>
              <a href={current.href} className={styles.readLink}>
                Đọc bài viết <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>

          {/* Right: Companion Articles List */}
          <div className={styles.articleList} role="tablist" aria-label="Danh sách bài viết">
            {articles.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={activeIdx === idx}
                onClick={() => handleSelect(idx)}
                className={`${styles.listItem} ${activeIdx === idx ? styles.activeItem : ""}`}
              >
                <span className={styles.itemNum}>0{idx + 1}</span>
                <div className={styles.itemInfo}>
                  <span className={styles.itemCat}>{item.category}</span>
                  <p className={styles.itemTitle}>{item.title}</p>
                </div>
                <span className={styles.itemTime}>{item.readTime}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
