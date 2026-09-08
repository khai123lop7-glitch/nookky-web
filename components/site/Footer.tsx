const groups = [
  {
    title: "Khám phá",
    links: [
      ["Sản phẩm", "/shop"],
      ["Bộ sưu tập", "/collections"],
      ["Về Nook Ký", "/about"],
    ],
  },
  {
    title: "Trải nghiệm",
    links: [
      ["Build Your Nook", "/studio"],
      ["Giỏ hàng", "/cart"],
      ["Trang chủ", "/"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="nk-footer">
      <div className="nk-container-wide nk-footer__top">
        <div className="nk-footer__brand">
          <p className="nk-eyebrow">NOOK KÝ · VIỆT NAM</p>
          <h2>Xây một góc nhỏ,<br />giữ một ký ức riêng.</h2>
          <p>Book Nook lấy cảm hứng từ những nơi chốn Việt Nam quen thuộc, được thu nhỏ để bạn tự tay hoàn thiện và giữ lại trong không gian sống.</p>
        </div>

        <div className="nk-footer__nav" aria-label="Liên kết cuối trang">
          {groups.map((group) => (
            <div className="nk-footer__group" key={group.title}>
              <p>{group.title}</p>
              {group.links.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
            </div>
          ))}
        </div>
      </div>

      <div className="nk-container-wide nk-footer__bottom">
        <span>© 2026 Nook Ký</span>
        <span>Thiết kế và phát triển tại Việt Nam</span>
      </div>
    </footer>
  );
}
