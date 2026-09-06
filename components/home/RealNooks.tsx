const realNooks = [
  { src: "/media/editorial/real-hoi-an.webp", name: "Phố Vừa Lên Đèn", context: "Góc đọc sách", className: "nk-real__card--tall" },
  { src: "/media/editorial/real-ha-noi.webp", name: "Sáng Trên Phố Cũ", context: "Bên cửa sổ", className: "" },
  { src: "/media/editorial/real-da-lat.webp", name: "Đèn Ấm Trên Dốc", context: "Góc nghỉ", className: "" },
  { src: "/media/editorial/real-mien-tay.webp", name: "Sông Vừa Thức Giấc", context: "Không gian sống", className: "nk-real__card--wide" },
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
        {realNooks.map((item) => (
          <figure className={`nk-real__card ${item.className}`} key={item.src}>
            <img src={item.src} alt={`${item.name} trong ${item.context.toLowerCase()}`} loading="lazy" />
            <figcaption><span>{item.name}</span><span>{item.context}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
