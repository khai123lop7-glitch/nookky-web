import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { formatVnd, products } from "@/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="nk-inner-page nk-pdp">
        <section className="nk-container-wide nk-pdp__grid">
          <div className="nk-pdp__gallery">
            {[product.media.cover, product.media.detail, product.media.lifestyle].map((src, index) => (
              <div className="nk-pdp__media" key={src}>
                <img src={src} alt={`${product.name} - ảnh ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
              </div>
            ))}
          </div>
          <aside className="nk-pdp__summary">
            <p className="nk-eyebrow">{product.location}</p>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <dl>
              <div><dt>Độ khó</dt><dd>{product.difficulty}</dd></div>
              <div><dt>Thời gian lắp</dt><dd>{product.buildTime}</dd></div>
              {product.pieces ? <div><dt>Số mảnh</dt><dd>{product.pieces}</dd></div> : null}
              <div><dt>LED</dt><dd>{product.hasLed ? "Có" : "Không"}</dd></div>
            </dl>
            <div className="nk-pdp__price">
              {product.regularPrice ? <s>{formatVnd(product.regularPrice)}</s> : null}
              <strong>{formatVnd(product.price)}</strong>
            </div>
            <a className="nk-button" href="/shop">Xem thêm sản phẩm</a>
          </aside>
        </section>
      </main>
    </>
  );
}
