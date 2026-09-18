import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { ProductPurchaseSection } from "@/components/commerce/ProductPurchaseSection";
import { ProductGallery } from "@/components/product/ProductGallery";
import { RelatedProductsCarousel } from "@/components/product/RelatedProductsCarousel";
import { formatVnd, products } from "@/data/products";
import styles from "./ProductPage.module.css";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  const gallery = product.media.gallery;
  const labels = product.media.galleryLabels ?? [];
  const heroGallery = gallery.length >= 5
    ? [gallery[4], gallery[0], gallery[1], gallery[2], gallery[3]]
    : gallery;
  const heroLabels = labels.length >= 5
    ? [labels[4], labels[0], labels[1], labels[2], labels[3]]
    : labels;
  const related = products.filter((item) => item.slug !== product.slug);

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className={styles.page}>
        <section id="overview" className={styles.hero}>
          <div className={styles.galleryCol}>
            <ProductGallery images={heroGallery} labels={heroLabels} name={product.name} />
          </div>

          <aside id="buy" className={styles.summary}>
            <p className={styles.location}>{product.location}</p>
            <h1>{product.name}</h1>
            {product.tagline ? <p className={styles.tagline}>{product.tagline}</p> : null}
            <p className={styles.description}>{product.description}</p>

            <dl className={styles.facts}>
              <div><dt>Độ khó</dt><dd>{product.difficulty}</dd></div>
              <div><dt>Thời gian lắp</dt><dd>{product.buildTime}</dd></div>
              <div><dt>Số mảnh</dt><dd>{product.pieces ?? "—"}</dd></div>
              <div><dt>LED</dt><dd>{product.hasLed ? "Có" : "Không"}</dd></div>
            </dl>

            <div className={styles.price}>
              {product.regularPrice ? <s>{formatVnd(product.regularPrice)}</s> : null}
              <strong>{formatVnd(product.price)}</strong>
            </div>

            <ProductPurchaseSection slug={product.slug} name={product.name} price={product.price} />
          </aside>
        </section>

        <nav className={styles.subnav} aria-label="Điều hướng trang sản phẩm">
          <a href="#overview">Tổng quan</a>
          <a href="#details">Chi tiết</a>
          <a href="#build">Lắp ráp</a>
          <a href="#inside">Bên trong</a>
          <a href="#specs">Thông số</a>
        </nav>

        <section className={styles.story}>
          <div className={styles.storyInner}>
            <p className={styles.eyebrow}>Một góc Việt Nam thu nhỏ</p>
            <h2>{product.storyTitle ?? product.name}</h2>
            <p>{product.story ?? product.description}</p>
          </div>
        </section>

        <section id="details" className={styles.detailSection}>
          <div className={styles.detailImage}>
            <img src={gallery[2]} alt={`${product.name} — các chi tiết nổi bật`} loading="lazy" decoding="async" />
          </div>
          <div className={styles.detailNotes}>
            {(product.featureNotes ?? []).slice(0, 4).map((note, index) => (
              <article key={note}>
                <span>0{index + 1}</span>
                <p>{note}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="build" className={styles.split}>
          <div className={styles.splitMedia}>
            <img src={gallery[0]} alt={`${product.name} — trải nghiệm lắp ráp`} loading="lazy" decoding="async" />
          </div>
          <div className={styles.sectionCopy}>
            <p className={styles.eyebrow}>Build it yourself</p>
            <h2>Tự tay dựng nên một góc Việt Nam</h2>
            <p>
              Đây không chỉ là món decor hoàn thiện sẵn. Trải nghiệm nằm ở việc ghép từng lớp không gian,
              gắn các chi tiết nhỏ và bật ánh đèn lần đầu sau khi hoàn thành.
            </p>
            <div className={styles.specGrid}>
              <div><span>Thời gian</span><strong>{product.buildTime}</strong></div>
              <div><span>Độ khó</span><strong>{product.difficulty}</strong></div>
              <div><span>Số mảnh</span><strong>{product.pieces ?? "—"}</strong></div>
              <div><span>Ánh sáng</span><strong>{product.hasLed ? "LED tích hợp" : "Không LED"}</strong></div>
            </div>
          </div>
        </section>

        <section className={`${styles.split} ${styles.splitReverse}`}>
          <div className={styles.darkCopy}>
            <p className={styles.eyebrow}>What&apos;s in the box?</p>
            <h2>Mở hộp là có thể bắt đầu</h2>
            <p>Mọi nhóm chi tiết chính được gom theo một bộ để quá trình lắp ráp dễ theo dõi và có nhịp rõ ràng.</p>
            <ul className={styles.contents}>
              {(product.boxContents ?? []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className={styles.splitMedia}>
            <img src={gallery[1]} alt={`${product.name} — trong hộp có gì`} loading="lazy" decoding="async" />
          </div>
        </section>

        <section id="inside" className={styles.fullBleed}>
          <img src={gallery[3]} alt={`${product.name} — góc nhìn bên trong`} loading="lazy" decoding="async" />
          <div className={styles.fullShade} />
          <div className={styles.fullCopy}>
            <p className={styles.eyebrow}>Step inside</p>
            <h2>Nhìn sâu hơn vào từng lớp không gian</h2>
            <p>
              Các lớp trước, giữa và sau được xếp để tạo cảm giác chiều sâu thật khi nhìn từ chính diện,
              thay vì chỉ là một mặt phẳng trang trí.
            </p>
          </div>
        </section>

        <section className={styles.split}>
          <div className={styles.splitMedia}>
            <img src={gallery[4]} alt={`${product.name} — trưng bày trên kệ sách`} loading="lazy" decoding="async" />
          </div>
          <div className={styles.sectionCopy}>
            <p className={styles.eyebrow}>Made to display</p>
            <h2>Một góc nhỏ trên kệ sách</h2>
            <p>
              Sau khi hoàn thiện, mô hình trở thành một điểm sáng ấm giữa sách và đồ decor. Kích thước đứng giúp nó
              chiếm ít diện tích nhưng vẫn tạo cảm giác có một thế giới riêng bên trong.
            </p>
          </div>
        </section>

        <section id="specs" className={styles.specs}>
          <div className={styles.specsInner}>
            <p className={styles.eyebrow}>Specifications</p>
            <h2>Thông tin sản phẩm</h2>
            <div className={styles.specGrid}>
              <div><span>Địa danh</span><strong>{product.location}</strong></div>
              <div><span>Độ khó</span><strong>{product.difficulty}</strong></div>
              <div><span>Thời gian lắp</span><strong>{product.buildTime}</strong></div>
              <div><span>Số mảnh</span><strong>{product.pieces ?? "—"}</strong></div>
              <div><span>LED</span><strong>{product.hasLed ? "Có" : "Không"}</strong></div>
              <div><span>Phong cách</span><strong>Book nook DIY</strong></div>
              <div><span>Trưng bày</span><strong>Kệ sách / bàn làm việc</strong></div>
              <div><span>Bộ sưu tập</span><strong>Nook Ký Việt Nam</strong></div>
            </div>
          </div>
        </section>

        <section className={styles.related}>
          <div className={styles.relatedInner}>
            <p className={styles.eyebrow}>Khám phá thêm</p>
            <h2>Những góc Việt Nam khác</h2>
            <RelatedProductsCarousel products={related} />
          </div>
        </section>

        <div className={styles.mobileBuy}>
          <div>
            <span>{product.name}</span>
            <strong>{formatVnd(product.price)}</strong>
          </div>
          <a href="#buy">Mua ngay</a>
        </div>
      </main>
    </>
  );
}
