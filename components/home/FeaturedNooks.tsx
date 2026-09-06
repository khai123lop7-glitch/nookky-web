import { featuredProducts, formatVnd } from "@/data/products";

export function FeaturedNooks() {
  return (
    <section className="nk-featured" id="featured-nooks" aria-labelledby="nk-featured-title">
      <div className="nk-container">
        <header className="nk-featured__header">
          <div>
            <p className="nk-eyebrow">NOOK KÝ TUYỂN CHỌN</p>
            <h2 id="nk-featured-title">Những góc được giữ lại.</h2>
          </div>
          <p>Hai nơi chốn mở đầu cho thế giới Nook Ký: một góc sáng để ngắm, một mô hình để tự tay hoàn thiện.</p>
        </header>

        <div className="nk-featured__grid">
          {featuredProducts.map((product, index) => (
            <article className="nk-featured-card" key={product.slug}>
              <a className="nk-featured-card__link" aria-label={`Khám phá ${product.name}`} href={`/product/${product.slug}`}>
                <picture className="nk-featured-card__media">
                  <img src={product.media.cover} alt={product.name} loading="lazy" decoding="async" />
                </picture>
                <div className="nk-featured-card__body">
                  <div className="nk-featured-card__identity">
                    <p className="nk-featured-card__index">0{index + 1}</p>
                    <div>
                      <h3>{product.name}</h3>
                      <p className="nk-featured-card__location">{product.location}</p>
                    </div>
                  </div>
                  <div className="nk-featured-card__commerce">
                    <span className="nk-featured-card__price">
                      {product.regularPrice ? <del>{formatVnd(product.regularPrice)}</del> : null}
                      <strong>{formatVnd(product.price)}</strong>
                    </span>
                    <span className="nk-featured-card__cta">Khám phá <span aria-hidden="true">→</span></span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
