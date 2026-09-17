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
  tagline?: string;
  storyTitle?: string;
  story?: string;
  featureNotes?: string[];
  boxContents?: string[];
  media: {
    cover: string;
    detail: string;
    lifestyle: string;
    gallery: string[];
    galleryLabels?: string[];
  };
};

const driveImage = (id: string, width = 1800) =>
  `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;

const galleryLabels = [
  "Lắp ráp",
  "Trong hộp",
  "Chi tiết",
  "Bên trong",
  "Trên kệ sách",
];

const defaultBoxContents = [
  "Các tấm chi tiết đã cắt sẵn",
  "Chi tiết in màu và phụ kiện trang trí",
  "Bộ đèn LED",
  "Phụ kiện lắp ráp",
  "Hướng dẫn lắp ráp",
];

const hoiAnGallery = [
  driveImage("1bgIUqZN7c3dsQA-VKe9xHrUVcIMbJHjl"),
  driveImage("1h6tFohah_6hHwjlVI0FRGsggZh2mywO2"),
  driveImage("1Q1wbHDDQhWP_e4ID3NHfWI93ldINEmQb"),
  driveImage("1_vQEx0WV8uxVsP3hXpLQvtZwpPmTO-6X"),
  driveImage("1JPMCTnEanjC_bev401JYxlRcrQ6g7MMv"),
];

const hueGallery = [
  driveImage("1hYWg3kQbbLHAOmIyMVw-H9Ihb2PD79-h"),
  driveImage("1q9URjqv-Msl5QGSCrWTzgKpVdUwiOq6p"),
  driveImage("1cnBz16f1lCJ7AWM9l6Z8pj821sVMsLCP"),
  driveImage("1CXAreI6NAvA1zxU_9IHYIf9NoZ3afR8x"),
  driveImage("1INBsS42eAmHp7jMKt7gAAXU1J0szeGcz"),
];

const haNoiGallery = [
  driveImage("1lC7DAsfyw-URy1SjlwhyUjx3HsMUk7N_"),
  driveImage("19Av5ZebsDRrDmpCtuNINcd_DIfned-JB"),
  driveImage("1Bxuba5VA4grtNMF-_8oQmIJSvxa79-gR"),
  driveImage("1wZtOe0FHkvwax7HxnIDPQenGGkkTfgKm"),
  driveImage("1_0sRSlX6QrxE9Dk4tddSJa2xn86_21qg"),
];

const saiGonGallery = [
  driveImage("1n_oowv_AptEIYgBLalOc7zN6TfH2th2Z"),
  driveImage("1H1iO-EwdluFq0sDZe4DIZegTIdnz7J2y"),
  driveImage("1kQSoxpGIUfAs8wOYfdfvB9Koer-otX6Q"),
  driveImage("194iXdE2-nTZ36YnMeubLr0IZXHnQ9rkU"),
  driveImage("1CDO397KStqNGZq5qn46MB9m-pc_OOl-l"),
];

const daLatGallery = [
  driveImage("1_ttrAsnme_zj9U9OillUsEKWUYTN0t2q"),
  driveImage("1ytGc7CJyeh1jy2-LX-CCvc_cO1Hwo4ki"),
  driveImage("1lKYeSbKrGf7lLRnIztkHkC_Qs4KbXQ6-"),
  driveImage("1NOebPO5d5ZWQD4mLAEk0ammHtsy1Tejn"),
  driveImage("177-xKOVbIjwKEg4Gp9lwFRbNKVHn6pol"),
];

const mienTayGallery = [
  driveImage("13iEp7hZkyohlIylPzsh7t2vDcg7W-adA"),
  driveImage("1S_ZBFnIpSxqYEL0NUUVQTfNCoQSZi8nV"),
  driveImage("1eoDpltNhIEFQErF7FVWxO-ine0yGavgw"),
  driveImage("1E9XAu6oER8hq3RZu4D_woX6et8Sw92Qg"),
  driveImage("1oATA_wLTCrslJZjtbgMgEW9OckeBzy01"),
];

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
    tagline: "Chạng vạng được giữ lại trong một khe phố nhỏ.",
    storyTitle: "Một buổi tối Hội An nằm gọn trên kệ sách",
    story:
      "Từ tường vàng, cửa chớp xanh đến những đốm đèn lồng, mô hình giữ lại cảm giác phố vừa lên đèn thay vì cố kể quá nhiều thứ cùng lúc.",
    featureNotes: [
      "Đèn lồng tạo nhịp sáng xuyên suốt chiều sâu mô hình",
      "Các lớp mặt tiền dẫn mắt về phía khoảng mở cuối phố",
      "Cây và ban công giúp khung cảnh bớt phẳng",
      "Ánh LED ấm làm mô hình nổi bật rõ hơn khi đặt lên kệ",
    ],
    boxContents: defaultBoxContents,
    media: {
      cover: hoiAnGallery[4],
      detail: hoiAnGallery[2],
      lifestyle: hoiAnGallery[4],
      gallery: hoiAnGallery,
      galleryLabels,
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
    tagline: "Một khoảng sân lặng sau khi mưa vừa đi qua.",
    storyTitle: "Huế được kể bằng khoảng lặng",
    story:
      "Không gian đi theo nhịp mái, gỗ sẫm và sân gạch thay vì nhiều chi tiết ồn ào. Khi bật đèn, phần kiến trúc sâu phía trong mới dần hiện ra.",
    featureNotes: [
      "Lớp mái ngói và kết cấu gỗ tạo cảm giác kiến trúc sâu",
      "Sân gạch là khoảng thở chính của bố cục",
      "Cây xanh được dùng vừa đủ để giữ vẻ trầm",
      "LED ấm tập trung vào các lớp nhà phía trong",
    ],
    boxContents: defaultBoxContents,
    media: {
      cover: hueGallery[4],
      detail: hueGallery[2],
      lifestyle: hueGallery[4],
      gallery: hueGallery,
      galleryLabels,
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
    tagline: "Ánh sáng len qua những lớp phố cũ.",
    storyTitle: "Một con ngõ có nhiều thứ để nhìn lại",
    story:
      "Ban công, dây điện, mái hiên và những vật dụng nhỏ xếp chồng thành nhiều lớp. Càng nhìn gần, mô hình càng cho cảm giác một con phố đã có người sống ở đó từ lâu.",
    featureNotes: [
      "Dây điện và mặt tiền tạo nhịp đặc trưng của phố cũ",
      "Ban công hẹp giúp tăng cảm giác chiều cao",
      "Các vật dụng nhỏ làm cảnh quan bớt sân khấu",
      "Ánh sáng len xuống ngõ thay vì chiếu đều toàn bộ mô hình",
    ],
    boxContents: defaultBoxContents,
    media: {
      cover: haNoiGallery[4],
      detail: haNoiGallery[2],
      lifestyle: haNoiGallery[4],
      gallery: haNoiGallery,
      galleryLabels,
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
    tagline: "Một con hẻm vẫn còn thức khi thành phố lên đèn.",
    storyTitle: "Sài Gòn trong một khoảng hẻm vừa đủ chật",
    story:
      "Cầu thang, cửa sổ, dây điện, xe máy và những khoảng sinh hoạt nhỏ đan vào nhau. Bố cục dày hơn những mẫu khác để giữ đúng cảm giác của một hẻm phố nhiều lớp.",
    featureNotes: [
      "Cầu thang và hành lang tạo trục nhìn mạnh từ dưới lên",
      "Hệ cửa, dây điện và hộp kỹ thuật làm khung cảnh có đời sống",
      "Xe máy và bàn ghế tạo tỉ lệ quen thuộc của một con hẻm",
      "Nhiều điểm LED nhỏ giúp cảnh đêm có chiều sâu",
    ],
    boxContents: defaultBoxContents,
    media: {
      cover: saiGonGallery[4],
      detail: saiGonGallery[2],
      lifestyle: saiGonGallery[4],
      gallery: saiGonGallery,
      galleryLabels,
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
    tagline: "Một căn nhà ấm giữa dốc, thông và sương.",
    storyTitle: "Đà Lạt được nhìn từ cuối một con dốc nhỏ",
    story:
      "Căn nhà, hàng thông, lối đi và những cụm hoa tạo nên một bố cục sâu nhưng yên. Ánh sáng vàng là điểm đối lập chính với nền xanh lạnh phía sau.",
    featureNotes: [
      "Lối dốc dẫn mắt từ cổng lên căn nhà",
      "Thông và các lớp cây tạo chiều sâu theo phương đứng",
      "Cụm hoa giúp cảnh quan mềm hơn phần kiến trúc",
      "LED vàng tạo cảm giác trú ẩn giữa không khí lạnh",
    ],
    boxContents: defaultBoxContents,
    media: {
      cover: daLatGallery[4],
      detail: daLatGallery[2],
      lifestyle: daLatGallery[4],
      gallery: daLatGallery,
      galleryLabels,
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
    tagline: "Buổi sớm trôi chậm theo mặt nước.",
    storyTitle: "Một nhịp sống ven sông vừa bắt đầu",
    story:
      "Nhà ven nước, cầu gỗ, ghe nhỏ và quầy hàng được xếp theo chiều sâu của dòng sông. Khi bật đèn, mặt nước trở thành phần phản chiếu giúp mô hình có cảm giác rộng hơn kích thước thật.",
    featureNotes: [
      "Mặt nước là trục chính xuyên suốt bố cục",
      "Nhà ven sông được dựng thành nhiều lớp trước sau",
      "Ghe và quầy hàng tạo điểm nhìn gần ở tiền cảnh",
      "LED ấm phản chiếu lên mặt nước và sàn gỗ",
    ],
    boxContents: defaultBoxContents,
    media: {
      cover: mienTayGallery[4],
      detail: mienTayGallery[2],
      lifestyle: mienTayGallery[4],
      gallery: mienTayGallery,
      galleryLabels,
    },
  },
];

export const featuredProducts = [products[0], products[2]];
export const spotlightProduct = products[0];

export function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
}
