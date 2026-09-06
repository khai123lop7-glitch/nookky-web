import { products } from "@/data/products";

const realNooks = [
  { product: products[0], context: "Góc đọc sách", className: "nk-real__card--tall" },
  { product: products[2], context: "Bên cửa sổ", className: "" },
  { product: products[4], context: "Góc nghỉ", className: "" },
  { product: products[5], context: "Không gian sống", className: "nk-real__card--wide" },
];

export function RealNooks() {
  return (
    <section className="nk-real" aria-labelledby="nk-real-title">
      <div className="nk-container nk-real__header">
        <div>
          <p className="nk-eyebrow">TRONG KHÔNG GIAN THẬT</p>
          <h2 id="nk-real-title">Nook Ký trong những căn phòng thật.</h2>
        </div>
        <p>Một Book Nook chỉ thật sự hoàn chỉnh khi nó trở thành một phần của kệ sách, bàn làm việc hoặc góc nghỉ của riêng bạn.</p>
      </div>

      <div className="nk-container nk-real__grid">
        {realNooks.map(({ product, context, className }) => (
          <figure className={`nk-real__card ${className}`} key={product.slug}>
            <img src={product.media.lifestyle} alt={`${product.name} trong ${context.toLowerCase()}`} loading="lazy" decoding="async" />
            <figcaption><span>{product.name}</span><span>{context}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
