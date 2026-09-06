export function BrandClose() {
  return (
    <section className="nk-brand-close" aria-labelledby="nk-brand-close-title">
      <div className="nk-brand-close__media" aria-hidden="true">
        <img src="/media/editorial/brand-close.webp" alt="" loading="lazy" decoding="async" />
      </div>
      <div className="nk-brand-close__shade" aria-hidden="true" />
      <div className="nk-container nk-brand-close__inner">
        <p className="nk-eyebrow">NOOK KÝ</p>
        <h2 id="nk-brand-close-title">Xây một góc nhỏ,<br />giữ một ký ức riêng.</h2>
        <p>Mỗi Nook Ký bắt đầu từ một nơi chốn quen thuộc và kết thúc ở một góc rất riêng trong căn phòng của bạn.</p>
        <a className="nk-button nk-button--light" href="/about">
          Câu chuyện Nook Ký
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5"/></svg>
        </a>
      </div>
    </section>
  );
}
