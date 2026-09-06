const nav = [
  ["Trang chủ", "/"],
  ["Sản phẩm", "/shop"],
  ["Bộ sưu tập", "/collections"],
  ["Build Your Nook", "/studio"],
  ["Về Nook Ký", "/about"],
] as const;

export function Header() {
  return (
    <header className="nk-header">
      <div className="nk-announcement">Miễn phí vận chuyển cho đơn từ 1.000.000₫</div>
      <div className="nk-header__main nk-container-wide">
        <a className="nk-symbol" href="/" aria-label="Nook Ký trang chủ">
          <span aria-hidden="true">NK</span>
        </a>
        <a className="nk-wordmark" href="/">NOOK KÝ</a>
        <div className="nk-header__tools" aria-label="Tiện ích">
          <button type="button" aria-label="Tìm kiếm">⌕</button>
          <a href="/cart" aria-label="Giỏ hàng">Bag</a>
        </div>
      </div>
      <nav className="nk-nav" aria-label="Điều hướng chính">
        {nav.map(([label, href]) => (
          <a href={href} key={href}>{label}</a>
        ))}
      </nav>
    </header>
  );
}
