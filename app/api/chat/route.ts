import { NextResponse } from "next/server";
import { lookupOrderRows, CleanedOrderRecord } from "@/lib/googleSheets";
import { products, formatVnd } from "@/data/products";

export const runtime = "nodejs";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatContext {
  currentPage?: string;
  lastViewedProduct?: {
    slug: string;
    name: string;
    price: number;
  };
  lastCartAction?: {
    name: string;
    quantity: number;
  };
  lastOrderId?: string;
  lastOrderTotal?: number;
}

const BRAND_SYSTEM_PROMPT = `Bạn là "Nghệ nhân Nook Ký" — người đại diện tư vấn và chăm sóc khách hàng của xưởng thủ công Nook Ký (nookky.shop).
Khẩu hiệu thương hiệu: "Xây một góc nhỏ, giữ một ký ức riêng".

TÍNH CÁCH VÀ VĂN PHONG:
- Xưng hô: Em / Nook Ký với Anh/Chị (hoặc Bạn tuỳ theo đối tượng), giữ giọng điềm đạm, ấm áp, nhã nhặn, tôn trọng và giàu cảm xúc hoài niệm về văn hoá Việt Nam.
- Luôn trung thực, không bịa đặt hay nói quá. Không dùng các từ quảng cáo thô thiển ("giá sốc", "sale sập sàn").
- Hiểu biết sâu sắc về cấu tạo mô hình book nook gỗ ghép thủ công: các chi tiết cắt laser tinh xảo, ánh sáng đèn LED vàng ấm, độ bền của gỗ plywood cao cấp đã xử lý chống ẩm mốc.

DỮ LIỆU SẢN PHẨM CHÍNH THỨC CỦA NOOK KÝ (6 TÁC PHẨM):
1. "Phố Vừa Lên Đèn" (Hội An) - Giá: 899.000₫ (Giá gốc: 949.000₫)
   - Khu vực: Miền Trung | Độ khó: Trung bình | Thời gian lắp ráp: 6–8 giờ | Số mảnh: 390–430 mảnh | Có hệ thống đèn LED ấm.
   - Mô tả: Khe phố Hội An lúc chạng vạng, tường vàng, cửa chớp xanh, ban công gỗ và đèn lồng bên mặt sông hoài niệm.
2. "Mưa Qua Sân Gạch" (Huế) - Giá: 929.000₫
   - Khu vực: Miền Trung | Độ khó: Trung bình | Thời gian lắp ráp: 6–8 giờ | Số mảnh: 350–410 mảnh | Có đèn LED ấm.
   - Mô tả: Khoảng sân Huế trầm mặc, nhịp ngói âm dương, mảng gỗ và nền gạch sau cơn mưa chiều.
3. "Sáng Trên Phố Cũ" (Hà Nội) - Giá: 849.000₫ (Giá gốc: 899.000₫)
   - Khu vực: Miền Bắc | Độ khó: Trung bình | Thời gian lắp ráp: 5–7 giờ | Số mảnh: 380–430 mảnh | Có đèn LED ấm.
   - Mô tả: Lát cắt phố cũ Hà Nội, ban công hẹp, mái hiên cổ kính và ánh nắng sớm len xuống con ngõ nhỏ.
4. "Hẻm Còn Sáng Đèn" (Sài Gòn) - Giá: 1.099.000₫
   - Khu vực: Miền Nam | Độ khó: Khá (Dành cho người thích thử thách) | Thời gian lắp ráp: 8–10 giờ | Số mảnh: 430–500 mảnh | Có đèn LED ấm.
   - Mô tả: Hẻm phố Sài Gòn về đêm với nhiều tầng mặt tiền, biển hiệu rực rỡ và ánh đèn tạo chiều sâu không gian.
5. "Đèn Ấm Trên Dốc" (Đà Lạt) - Giá: 849.000₫
   - Khu vực: Tây Nguyên / Miền Nam | Độ khó: Trung bình | Thời gian lắp ráp: 5–7 giờ | Số mảnh: 340–400 mảnh | Có đèn LED ấm.
   - Mô tả: Căn nhà gỗ nhỏ trên dốc Đà Lạt trong sương chiều, thông xanh và ánh đèn ấm áp giữa không khí se lạnh.
6. "Sông Vừa Thức Giấc" (Miền Tây) - Giá: 749.000₫ (Giá gốc: 799.000₫)
   - Khu vực: Miền Nam | Độ khó: Dễ (Rất phù hợp cho người mới bắt đầu) | Thời gian lắp ráp: 4–6 giờ | Số mảnh: 300–360 mảnh | Có đèn LED ấm.
   - Mô tả: Góc nhà ven sông miền Tây thanh bình lúc sớm mai, nhịp thuyền ghe, tán cây và rặng dừa nước hiền hòa.

CHÍNH SÁCH BÁN HÀNG & PHỤ KIỆN:
- Bộ sản phẩm bao gồm đầy đủ: Các vỉ gỗ ép laser cao cấp, dây điện và bóng đèn LED ánh vàng ấm, khay pin mini (an toàn, tiện để kệ sách), keo dán chuyên dụng, nhíp gắp chi tiết nhỏ, giấy ráp chà mịn và sách hướng dẫn minh hoạ chi tiết từng bước bằng tiếng Việt.
- Chính sách vận chuyển: Miễn phí giao hàng toàn quốc cho đơn hàng từ 1.000.000₫ (hoặc từ 2 bộ). Giao hỏa tốc 2–3 ngày tại TP.HCM/Hà Nội, 3–5 ngày tại các tỉnh thành.
- Đóng gói: Hộp quà kraft vintage dày dặn, bọc chống sốc nhiều lớp, sẵn sàng làm quà tặng trang trọng.
- Bảo hành: Miễn phí gửi bù 1 đổi 1 trong 30 ngày nếu trong quá trình lắp ráp bạn vô tình làm gãy hoặc thất lạc mảnh chi tiết gỗ.

TRA CỨU ĐƠN HÀNG:
- Khi khách hàng hỏi về tiến độ đơn hàng hoặc cung cấp mã đơn (dạng NK-...) hoặc số điện thoại, bạn PHẢI sử dụng công cụ 'lookup_order' để tra cứu dữ liệu thực tế từ hệ thống trước khi trả lời. Tuyệt đối không tự suy đoán thông tin đơn hàng nếu chưa tra cứu.`;

/**
 * Tra cứu đơn hàng từ Google Sheet
 */
async function handleLookupOrder(query: string): Promise<string> {
  try {
    const res = await lookupOrderRows(query);
    if (!res.ok) {
      return `Hiện tại hệ thống tra cứu đang tạm bận hoặc chưa kết nối bảng dữ liệu: ${res.reason || res.error || "Không rõ nguyên nhân"}. Bạn vui lòng nhắn lại số điện thoại để em nhờ bộ phận thủ công kiểm tra trực tiếp cho mình nhé ạ.`;
    }

    if (!res.orders || res.orders.length === 0) {
      return `Em đã kiểm tra trên hệ thống với thông tin "${query}" nhưng chưa tìm thấy đơn hàng tương ứng. Bạn vui lòng kiểm tra lại xem có nhầm mã đơn hoặc số điện thoại đặt hàng không nhé ạ.`;
    }

    const orderSummaries = res.orders.map((o: CleanedOrderRecord) => {
      const statusMap: Record<string, string> = {
        order_placed: "Đã tiếp nhận đơn hàng, đang chuẩn bị đóng gói",
        payment_reported: "Khách đã báo chuyển khoản, xưởng đang đối soát ngân hàng",
        confirmed: "Đã xác nhận đơn hàng thành công",
        paid: "Đã thanh toán thành công, đang hoàn thiện đóng gói thủ công",
        shipping: "Đang được đơn vị vận chuyển giao tới bạn",
        completed: "Đã giao hàng thành công",
      };

      const friendlyStatus = statusMap[o.status] || o.status || "Đang xử lý";
      const totalFormatted = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(o.total);

      return `• Đơn hàng #${o.orderId}:
  - Ngày đặt: ${new Date(o.orderDate).toLocaleString("vi-VN")}
  - Trạng thái: ${friendlyStatus}
  - Tác phẩm: ${o.itemsSummary || "Mô hình Nook Ký"}
  - Tổng tiền: ${totalFormatted} (Thanh toán: ${o.paymentMethod.toUpperCase()})
  - Người nhận: ${o.customerNameMasked} (${o.phoneMasked})`;
    });

    return `Dạ, em đã tìm thấy thông tin đơn hàng của bạn trên hệ thống Nook Ký:\n\n${orderSummaries.join("\n\n")}\n\nNếu bạn cần hỗ trợ thêm thông tin gì về việc giao nhận, bạn cứ nhắn cho em nhé ạ!`;
  } catch (err: any) {
    return `Lỗi khi tra cứu đơn hàng: ${err?.message || String(err)}`;
  }
}

/**
 * Bộ máy phản hồi dự phòng thông minh (Native Fallback Engine).
 * Tự động phân tích từ khoá, ngữ cảnh giỏ hàng, và tra cứu dữ liệu thật
 * khi chưa cấu hình OPENAI_API_KEY hoặc khi API bên ngoài bị lỗi/hết quota.
 */
async function generateSmartFallbackResponse(
  userText: string,
  context?: ChatContext
): Promise<string> {
  const lower = userText.toLowerCase().trim();

  // 1. Nhận diện ý định tra cứu đơn hàng (chứa mã NK- hoặc chuỗi số điện thoại)
  const orderIdMatch = userText.match(/NK-[A-Za-z0-9-]+/i);
  const phoneMatch = userText.match(/\b(0\d{8,10}|\d{9,11})\b/);

  if (orderIdMatch) {
    return await handleLookupOrder(orderIdMatch[0]);
  }
  if (lower.includes("tra cứu") || lower.includes("kiểm tra đơn") || lower.includes("đơn hàng") || lower.includes("mã đơn")) {
    if (phoneMatch) {
      return await handleLookupOrder(phoneMatch[0]);
    }
    if (context?.lastOrderId) {
      return await handleLookupOrder(context.lastOrderId);
    }
    return `Dạ, để em kiểm tra tình trạng đơn hàng cho mình, bạn vui lòng cho em xin **Mã đơn hàng** (dạng NK-2026...) hoặc **Số điện thoại** đã dùng khi đặt hàng nhé ạ!`;
  }

  // 2. Nhận diện hỏi về người mới bắt đầu (Beginner recommendation)
  if (
    lower.includes("người mới") ||
    lower.includes("chưa từng") ||
    lower.includes("lần đầu") ||
    lower.includes("mới bắt đầu") ||
    lower.includes("dễ lắp")
  ) {
    return `Chào bạn, nếu đây là lần đầu tiên bạn thử sức với bộ môn ghép mô hình book nook gỗ thủ công, Nook Ký trân trọng gợi ý cho bạn tác phẩm **"Sông Vừa Thức Giấc" (Miền Tây)** (749.000₫):\n\n• **Độ khó**: Dễ, khoảng 300–360 mảnh.\n• **Thời gian hoàn thành**: 4–6 giờ thư giãn vào cuối tuần.\n• **Nét đặc sắc**: Tái hiện nhịp sống bình yên ven sông miền Tây với ánh đèn LED ấm dịu len qua mái hiên lá dừa.\n\nNgoài ra, bạn cũng có thể tham khảo mẫu **"Sáng Trên Phố Cũ" (Hà Nội)** (849.000₫, 5–7 giờ) mang màu sắc cổ kính rất thanh lịch. Mọi bộ sản phẩm đều có kèm sách hướng dẫn bằng hình ảnh từng bước rất chi tiết, nên bạn hoàn toàn yên tâm nhé ạ!`;
  }

  // 3. Nhận diện hỏi theo từng sản phẩm cụ thể
  if (lower.includes("hội an") || lower.includes("phố vừa lên đèn")) {
    return `Dạ, tác phẩm **"Phố Vừa Lên Đèn" (Hội An)** là một trong những góc ký ức được yêu thích nhất tại Nook Ký:\n\n• **Giá ưu đãi**: 899.000₫ (Giá gốc: 949.000₫)\n• **Quy mô**: 390–430 mảnh gỗ cắt laser chính xác.\n• **Độ khó**: Trung bình (6–8 giờ hoàn thành).\n• **Điểm nhấn**: Tái hiện một góc ngõ Hội An lúc chạng vạng với tường vàng cổ kính, cửa chớp xanh, hoa giấy và đèn lồng dẫn mắt về phía bờ sông lung linh ánh đèn LED vàng ấm.\n\nBộ sản phẩm đã kèm đầy đủ đèn LED, khay pin, keo dán và nhíp gắp. Bạn có muốn em hướng dẫn đặt hàng tác phẩm này không ạ?`;
  }

  if (lower.includes("sài gòn") || lower.includes("hẻm còn sáng đèn")) {
    return `Dạ, tác phẩm **"Hẻm Còn Sáng Đèn" (Sài Gòn)** là mô hình có độ chi tiết và thử thách cao nhất trong bộ sưu tập Nook Ký:\n\n• **Giá**: 1.099.000₫\n• **Quy mô**: 430–500 mảnh chi tiết.\n• **Độ khó**: Khá (8–10 giờ lắp ráp).\n• **Điểm nhấn**: Tái hiện con hẻm Sài Gòn rực rỡ lúc đêm muộn với biển hiệu retro nhiều lớp, ban công hẹp và ánh sáng đa tầng có chiều sâu ấn tượng.\n\nNếu bạn yêu thích cảm giác kiên nhẫn chinh phục từng mảnh ghép tỉ mỉ, đây chắc chắn là một góc nhỏ rất đáng để lưu giữ!`;
  }

  if (lower.includes("huế") || lower.includes("mưa qua sân gạch")) {
    return `Dạ, tác phẩm **"Mưa Qua Sân Gạch" (Huế)** mang đậm mỹ cảm trầm mặc và hoài niệm:\n\n• **Giá**: 929.000₫\n• **Quy mô**: 350–410 mảnh ghép.\n• **Độ khó**: Trung bình (6–8 giờ).\n• **Điểm nhấn**: Tái hiện khoảng sân Huế tĩnh lặng sau cơn mưa rào, nhịp ngói âm dương rêu phong và ánh đèn ấm phản chiếu trên nền gạch hoa cổ điển.`;
  }

  if (lower.includes("hà nội") || lower.includes("sáng trên phố cũ")) {
    return `Dạ, tác phẩm **"Sáng Trên Phố Cũ" (Hà Nội)** mang vẻ đẹp thanh lịch của buổi sáng sớm thủ đô:\n\n• **Giá ưu đãi**: 849.000₫ (Giá gốc: 899.000₫)\n• **Quy mô**: 380–430 mảnh ghép.\n• **Độ khó**: Trung bình (5–7 giờ).\n• **Điểm nhấn**: Lát cắt phố cũ với ban công sắt hẹp, dây điện, gánh hàng rong và ánh sáng len lỏi qua từng kẽ lá xuống con ngõ nhỏ.`;
  }

  if (lower.includes("đà lạt") || lower.includes("đèn ấm trên dốc")) {
    return `Dạ, tác phẩm **"Đèn Ấm Trên Dốc" (Đà Lạt)** đưa ta về cảm giác se lạnh bình yên của phố núi:\n\n• **Giá**: 849.000₫\n• **Quy mô**: 340–400 mảnh ghép.\n• **Độ khó**: Trung bình (5–7 giờ).\n• **Điểm nhấn**: Căn nhà gỗ trên triền dốc dốc bao quanh bởi những rặng thông và ánh đèn vàng ấm áp như một nơi trú ẩn an yên giữa sương chiều.`;
  }

  // 4. Nhận diện hỏi về phụ kiện, LED, pin, keo
  if (lower.includes("led") || lower.includes("đèn") || lower.includes("pin") || lower.includes("keo") || lower.includes("phụ kiện") || lower.includes("kèm theo")) {
    return `Dạ, bạn hoàn toàn không cần mua thêm bất cứ dụng cụ nào từ bên ngoài đâu ạ. Mỗi hộp sản phẩm Nook Ký gửi tới bạn đều đã bao gồm trọn vẹn:\n\n1. Các vỉ gỗ ép laser cao cấp, cắt chính xác tới từng milimet.\n2. Dây điện & bóng đèn LED ánh vàng ấm đã được tính toán vị trí.\n3. Khay pin mini (an toàn, không cần cắm điện rườm rà, tiện để kệ sách).\n4. Keo dán mô hình chuyên dụng độ kết dính cao.\n5. Nhíp gắp chi tiết nhỏ & giấy ráp chà mịn mép gỗ.\n6. Sách hướng dẫn từng bước bằng tiếng Việt có hình ảnh minh hoạ màu rõ nét!`;
  }

  // 5. Nhận diện hỏi về bảo hành & gãy mảnh
  if (lower.includes("bảo hành") || lower.includes("gãy") || lower.includes("thiếu mảnh") || lower.includes("hư")) {
    return `Dạ, Nook Ký có chính sách **Bảo hành Ký Ức** rất an tâm cho bạn:\n\nTrong vòng **30 ngày** kể từ khi nhận hàng, nếu bạn chẳng may làm gãy hoặc thất lạc bất kỳ mảnh chi tiết nào trong quá trình lắp ráp, bạn chỉ cần chụp ảnh vị trí mảnh đó trong sách hướng dẫn và gửi cho xưởng. Nook Ký sẽ gia công lại và gửi bù mảnh mới **hoàn toàn miễn phí** về tận nhà cho mình ạ!`;
  }

  // 6. Nhận diện hỏi về giao hàng & phí ship
  if (lower.includes("ship") || lower.includes("giao hàng") || lower.includes("vận chuyển") || lower.includes("bao lâu")) {
    return `Dạ, về chính sách vận chuyển của Nook Ký:\n\n• **Miễn phí vận chuyển toàn quốc** cho đơn hàng từ 1.000.000₫ (hoặc từ 2 bộ mô hình bất kỳ).\n• **Thời gian giao hàng**:\n  - Nội thành TP.HCM & Hà Nội: 2–3 ngày làm việc.\n  - Các tỉnh thành khác: 3–5 ngày làm việc.\n• Tác phẩm được đóng trong hộp quà kraft vintage dày dặn, bọc chống sốc 3 lớp để đảm bảo an toàn tuyệt đối khi vận chuyển đường dài ạ!`;
  }

  // 7. Nhận diện theo ngữ cảnh khách đang xem
  if (context?.lastViewedProduct) {
    return `Dạ, em thấy bạn đang quan tâm tới tác phẩm **"${context.lastViewedProduct.name}"** (${formatVnd(context.lastViewedProduct.price)}). Tác phẩm này mang rất nhiều cảm xúc về một góc phố thân thuộc. Bạn đang băn khoăn về độ khó, thời gian lắp hay chi tiết nào của mẫu này, cứ chia sẻ với em nhé ạ!`;
  }

  // 8. Chào hỏi chung ấm áp
  return `Dạ, Nook Ký xin chào bạn! Em là người đồng hành tại xưởng thủ công Nook Ký.\n\nTại đây, mỗi bộ mô hình book nook gỗ không chỉ là một món đồ trang trí kệ sách, mà là một lát cắt ký ức về những góc phố thân thương của Việt Nam. Bạn đang muốn tìm một tác phẩm cho riêng mình hay muốn làm quà tặng cho một người đặc biệt ạ?`;
}

/**
 * Gọi OpenAI API gpt-4o-mini với Tool Calling tra cứu đơn hàng
 */
async function callOpenAI(messages: ChatMessage[], context?: ChatContext): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const contextPrompt = context
    ? `\nNGỮ CẢNH TRÌNH DUYỆT CỦA KHÁCH HÀNG:
- Trang hiện tại: ${context.currentPage || "Trang chủ"}
- Sản phẩm vừa xem: ${context.lastViewedProduct ? `${context.lastViewedProduct.name} (${formatVnd(context.lastViewedProduct.price)})` : "Chưa có"}
- Sản phẩm vừa thêm giỏ: ${context.lastCartAction ? `${context.lastCartAction.name} x${context.lastCartAction.quantity}` : "Chưa có"}
- Đơn hàng gần nhất trên máy khách: ${context.lastOrderId || "Chưa có"}`
    : "";

  const systemMessage: ChatMessage = {
    role: "system",
    content: `${BRAND_SYSTEM_PROMPT}${contextPrompt}`,
  };

  const tools = [
    {
      type: "function",
      function: {
        name: "lookup_order",
        description: "Tra cứu thông tin và trạng thái thực tế của đơn hàng từ Google Sheet của xưởng Nook Ký qua Mã đơn hàng (NK-...) hoặc Số điện thoại.",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Mã đơn hàng (ví dụ: NK-20260908-1234) hoặc số điện thoại khách hàng (ví dụ: 0909283678).",
            },
          },
          required: ["query"],
        },
      },
    },
  ];

  const payload: any = {
    model: "gpt-4o-mini",
    messages: [systemMessage, ...messages],
    tools,
    tool_choice: "auto",
    temperature: 0.7,
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error: ${errText}`);
  }

  const data = await res.json();
  const choice = data.choices?.[0];
  const responseMsg = choice?.message;

  // Nếu model yêu cầu gọi tool lookup_order
  if (responseMsg?.tool_calls && responseMsg.tool_calls.length > 0) {
    const toolCall = responseMsg.tool_calls[0];
    if (toolCall.function?.name === "lookup_order") {
      let args: any = {};
      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch {
        args = { query: "" };
      }

      const lookupResultText = await handleLookupOrder(args.query || "");

      // Gọi lại OpenAI với kết quả từ tool để hoàn thiện câu trả lời
      const secondRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            systemMessage,
            ...messages,
            responseMsg,
            {
              role: "tool",
              tool_call_id: toolCall.id,
              content: lookupResultText,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (secondRes.ok) {
        const secondData = await secondRes.json();
        return secondData.choices?.[0]?.message?.content || lookupResultText;
      }
      return lookupResultText;
    }
  }

  return responseMsg?.content || "Dạ, em có thể giúp gì thêm cho góc ký ức của bạn?";
}

export async function POST(request: Request) {
  let body: { messages: ChatMessage[]; context?: ChatContext };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const messages = body?.messages || [];
  const context = body?.context;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ ok: false, error: "Thiếu danh sách tin nhắn" }, { status: 400 });
  }

  const latestUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";

  // Thử gọi OpenAI API nếu có OPENAI_API_KEY
  if (process.env.OPENAI_API_KEY) {
    try {
      const answer = await callOpenAI(messages, context);
      return NextResponse.json({ ok: true, message: answer, source: "openai" });
    } catch (err) {
      console.warn("[Chatbot] Lỗi gọi OpenAI, tự động kích hoạt bộ máy phản hồi dự phòng:", err);
    }
  }

  // Graceful Fallback Engine (Luôn luôn đảm bảo hoạt động 100%)
  const fallbackAnswer = await generateSmartFallbackResponse(latestUserMsg, context);
  return NextResponse.json({ ok: true, message: fallbackAnswer, source: "native_engine" });
}
