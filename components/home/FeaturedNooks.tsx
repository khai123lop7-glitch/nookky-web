import { featuredProducts, formatVnd } from "@/data/products";

export function FeaturedNooks() {
  return (
    <section className="nk-featured" id="featured-nooks" aria-labelledby="featured-title">
      <div className="nk-container">
        <header className="nk-section-head nk-section-head--dark">
          <div>
            <p className="nk-eyebrow">NOOK KÝ TUYỂN CHỌN</p>
            <h2 id="featured-title">Những góc được giữ lại.</h2>
          </div>
          <p>Hai nơi chốn mở đầu cho thế giới Nook Ký: một góc sáng để ngắm, một mô hình để tự tay hoàn thiện.</p>
        </header>

        <div className="nk-featured__grid">
          {featuredProducts.map((product, index) => (
            <article className="nk-featured-card" key={product.slug}>
              <a href={`/product/${product.slug}`}>
                <div className="nk-featured-card__media">
                  <img src={product.media.cover} alt={product.name} />
                </div>
                <div className="nk-featured-card__body">
                  <div className="nk-featured-card__identity">
                    <span>0{index + 1}</span>
                    <div><h3>{product.name}</h3><p>{product.location}</p></div>
                  </div>
                  <div className="nk-featured-card__commerce">
                    <strong>{formatVnd(product.price)}</strong>
                    <span>Khám phá →</span>
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
