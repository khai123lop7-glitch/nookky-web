export type Region = "north" | "central" | "south";

export type NookProduct = {
  slug: string;
  name: string;
  location: string;
  region: Region;
  price: number;
  regularPrice?: number;
  difficulty: string;
  buildTime: string;
  pieces?: string;
  hasLed: boolean;
  description: string;
  media: {
    cover: string;
    detail: string;
    lifestyle: string;
  };
};

export const products: NookProduct[] = [
  {
    slug: "pho-vua-len-den-hoi-an",
    name: "Phố Vừa Lên Đèn",
    location: "Hội An",
    region: "central",
    price: 899000,
    regularPrice: 949000,
    difficulty: "Trung bình",
    buildTime: "6–8 giờ",
    pieces: "390–430",
    hasLed: true,
    description:
      "Một khe phố Hội An lúc chạng vạng, nơi tường vàng, cửa chớp xanh, ban công gỗ và đèn lồng dẫn mắt về phía mặt sông đang lên đèn.",
    media: {
      cover: "/media/products/01-pho-vua-len-den-hoi-an/cover.webp",
      detail: "/media/products/01-pho-vua-len-den-hoi-an/detail.webp",
      lifestyle: "/media/products/01-pho-vua-len-den-hoi-an/lifestyle.webp",
    },
  },
  {
    slug: "mua-qua-san-gach-hue",
    name: "Mưa Qua Sân Gạch",
    location: "Huế",
    region: "central",
    price: 929000,
    difficulty: "Trung bình",
    buildTime: "6–8 giờ",
    pieces: "350–410",
    hasLed: true,
    description:
      "Một khoảng sân Huế trầm và sâu, với nhịp mái, mảng gỗ và nền gạch tạo cảm giác yên tĩnh sau một cơn mưa.",
    media: {
      cover: "/media/products/02-mua-qua-san-gach-hue/cover.webp",
      detail: "/media/products/02-mua-qua-san-gach-hue/detail.webp",
      lifestyle: "/media/products/02-mua-qua-san-gach-hue/lifestyle.webp",
    },
  },
  {
    slug: "sang-tren-pho-cu-ha-noi",
    name: "Sáng Trên Phố Cũ",
    location: "Hà Nội",
    region: "north",
    price: 849000,
    regularPrice: 899000,
    difficulty: "Trung bình",
    buildTime: "5–7 giờ",
    pieces: "380–430",
    hasLed: true,
    description:
      "Một lát cắt phố cũ Hà Nội với ban công hẹp, dây điện, mái hiên và ánh sáng len xuống con ngõ nhỏ.",
    media: {
      cover: "/media/products/03-sang-tren-pho-cu-ha-noi/cover.webp",
      detail: "/media/products/03-sang-tren-pho-cu-ha-noi/detail.webp",
      lifestyle: "/media/products/03-sang-tren-pho-cu-ha-noi/lifestyle.webp",
    },
  },
  {
    slug: "hem-con-sang-den-sai-gon",
    name: "Hẻm Còn Sáng Đèn",
    location: "Sài Gòn",
    region: "south",
    price: 1099000,
    difficulty: "Khá",
    buildTime: "8–10 giờ",
    pieces: "430–500",
    hasLed: true,
    description:
      "Một con hẻm Sài Gòn khi đêm xuống, nhiều lớp mặt tiền, bảng hiệu và ánh đèn tạo chiều sâu cho không gian thu nhỏ.",
    media: {
      cover: "/media/products/04-hem-con-sang-den-sai-gon/cover.webp",
      detail: "/media/products/04-hem-con-sang-den-sai-gon/detail.webp",
      lifestyle: "/media/products/04-hem-con-sang-den-sai-gon/lifestyle.webp",
    },
  },
  {
    slug: "den-am-tren-doc-da-lat",
    name: "Đèn Ấm Trên Dốc",
    location: "Đà Lạt",
    region: "south",
    price: 849000,
    difficulty: "Trung bình",
    buildTime: "5–7 giờ",
    pieces: "340–400",
    hasLed: true,
    description:
      "Một căn nhà nhỏ trên dốc Đà Lạt, nơi gỗ, cây xanh và ánh đèn ấm tạo nên cảm giác trú ẩn giữa không khí se lạnh.",
    media: {
      cover: "/media/products/05-den-am-tren-doc-da-lat/cover.webp",
      detail: "/media/products/05-den-am-tren-doc-da-lat/detail.webp",
      lifestyle: "/media/products/05-den-am-tren-doc-da-lat/lifestyle.webp",
    },
  },
  {
    slug: "song-vua-thuc-giac-mien-tay",
    name: "Sông Vừa Thức Giấc",
    location: "Miền Tây",
    region: "south",
    price: 749000,
    regularPrice: 799000,
    difficulty: "Dễ",
    buildTime: "4–6 giờ",
    pieces: "300–360",
    hasLed: true,
    description:
      "Một góc miền Tây ven sông khi ngày mới bắt đầu, với nhịp nhà, cây và mặt nước tạo cảm giác thoáng và gần gũi.",
    media: {
      cover: "/media/products/06-song-vua-thuc-giac-mien-tay/cover.webp",
      detail: "/media/products/06-song-vua-thuc-giac-mien-tay/detail.webp",
      lifestyle: "/media/products/06-song-vua-thuc-giac-mien-tay/lifestyle.webp",
    },
  },
];

export const featuredProducts = [products[0], products[2]];
export const spotlightProduct = products[0];

export function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
}
