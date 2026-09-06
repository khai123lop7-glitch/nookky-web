export function Hero() {
  return (
    <section className="nk-hero" aria-labelledby="nk-hero-title">
      <div className="nk-hero__media" aria-hidden="true">
        <picture>
          <source media="(max-width: 800px)" srcSet="/media/editorial/hero-mobile.webp" />
          <img src="/media/editorial/hero-hanoi.jpg" alt="" />
        </picture>
      </div>
      <div className="nk-hero__shade" aria-hidden="true" />

      <div className="nk-hero__inner nk-container-wide">
        <div className="nk-hero__copy">
          <p className="nk-eyebrow">BOOK NOOK · VIỆT NAM</p>
          <h1 id="nk-hero-title">Giữ lại một góc Việt Nam.</h1>
          <p className="nk-hero__lead">
            Những nơi chốn quen thuộc, thu nhỏ thành một góc sáng để bạn tự tay hoàn thiện và giữ lại trên kệ sách.
          </p>
          <div className="nk-hero__actions">
            <a className="nk-button nk-button--light" href="#shop-all">Khám phá bộ sưu tập <span>→</span></a>
            <a className="nk-hero__secondary" href="/studio">Tự tạo Nook của bạn</a>
          </div>
        </div>

        <div className="nk-hero__rail">
          <a href="#featured-nooks"><span>Cuộn để khám phá</span><span>↓</span></a>
          <span>Nook Ký · Những nơi chốn thu nhỏ</span>
        </div>
      </div>
    </section>
  );
}
