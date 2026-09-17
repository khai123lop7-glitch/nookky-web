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

/**
 * Tự động đồng bộ toàn bộ danh mục sản phẩm từ data/products.ts vào Knowledge Base của AI.
 * Mỗi khi website thêm, sửa hoặc xóa sản phẩm, Chatbot sẽ TỰ ĐỘNG CẬP NHẬT KIẾN THỨC
 * mà không cần phải can thiệp hay cấu hình lại mã nguồn của bot.
 */
function getDynamicSystemPrompt(): string {
  const productCatalog = products
    .map((p, idx) => {
      const priceStr = formatVnd(p.price);
      const originalStr = p.regularPrice ? ` (Giá gốc: ${formatVnd(p.regularPrice)})` : "";
      return `${idx + 1}. "${p.name}" (${p.location}) - Slug: ${p.slug}
   - Giá: ${priceStr}${originalStr} | Khu vực: ${p.region} | Độ khó: ${p.difficulty} | Thời gian: ${p.buildTime} | Số mảnh: ${p.pieces || "300-450"} | Đèn LED: ${p.hasLed ? "Có" : "Không"}
   - Mô tả: ${p.description}`;
    })
    .join("\n");

  return `Bạn là "Nghệ nhân Nook Ký" — người đại diện tư vấn và chăm sóc khách hàng của xưởng thủ công Nook Ký (nookky.shop).
Khẩu hiệu thương hiệu: "Xây một góc nhỏ, giữ một ký ức riêng".

QUY TẮC PHẢN HỒI BẮT BUỘC (QUAN TRỌNG NHẤT):
1. LUÔN TRẢ LỜI ĐÚNG TRỌNG TÂM: Khi khách hỏi về một tác phẩm cụ thể (ví dụ: "mình muốn xem mẫu Sông Vừa Thức Giấc", "mẫu Hội An giá bao nhiêu"), bạn PHẢI đi thẳng vào thông tin tác phẩm đó (giá bán, đặc điểm, độ khó, thời gian hoàn thành), TUYỆT ĐỐI KHÔNG mở đầu bằng lời chào dài dòng lan man.
2. Khi giới thiệu bất kỳ tác phẩm nào, hãy kèm đường dẫn định dạng markdown: [Xem chi tiết tác phẩm {Tên} →](/product/{slug}) để khách hàng bấm xem ảnh và đặt hàng được ngay.
3. Xưng hô: Em / Nook Ký với Anh/Chị (hoặc Bạn), giữ giọng điềm đạm, ấm áp, nhã nhặn, tôn trọng và am hiểu sâu sắc về văn hoá Việt Nam.
4. Luôn trung thực, không bịa đặt. Không dùng từ ngữ quảng cáo thô thiển ("giá sốc", "sale sập sàn").

DỮ LIỆU SẢN PHẨM HIỆN CÓ CỦA NOOK KÝ (TỰ ĐỘNG ĐỒNG BỘ TỪ HỆ THỐNG):
${productCatalog}

CHÍNH SÁCH BÁN HÀNG & PHỤ KIỆN:
- Bộ sản phẩm bao gồm đầy đủ 100%: Các vỉ gỗ ép laser cao cấp, dây điện và bóng đèn LED ánh vàng ấm, khay pin mini (an toàn, tiện để kệ sách), keo dán chuyên dụng, nhíp gắp chi tiết nhỏ, giấy ráp chà mịn và sách hướng dẫn minh hoạ chi tiết từng bước bằng tiếng Việt. Khách KHÔNG cần mua thêm bất kỳ phụ kiện nào từ bên ngoài.
- Chính sách vận chuyển: Miễn phí giao hàng toàn quốc cho đơn từ 1.000.000₫ (hoặc từ 2 bộ). Giao hỏa tốc 2–3 ngày tại TP.HCM/Hà Nội, 3–5 ngày tại các tỉnh thành. Đóng gói hộp quà kraft vintage dày dặn, bọc chống sốc 3 lớp.
- Bảo hành: Miễn phí gửi bù 1 đổi 1 trong 30 ngày nếu trong quá trình lắp ráp bạn vô tình làm gãy hoặc thất lạc mảnh chi tiết gỗ.

TRA CỨU ĐƠN HÀNG:
- Khi khách hỏi về tiến độ đơn hàng hoặc cung cấp mã đơn (dạng NK-...) hoặc số điện thoại, bạn PHẢI sử dụng công cụ 'lookup_order' để tra cứu dữ liệu thực tế từ Google Sheets trước khi trả lời.`;
}

function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

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
        order_placed: "Đã tiếp nhận đơn hàng, xưởng đang chuẩn bị đóng gói",
        payment_reported: "Khách đã báo chuyển khoản, xưởng đang đối soát ngân hàng",
        confirmed: "Đã xác nhận đơn hàng thành công",
        paid: "Đã thanh toán thành công, đang hoàn thiện đóng gói thủ công",
        shipping: "Đang được đơn vị vận chuyển giao tới bạn",
        completed: "Đã giao hàng thành công",
      };

      const friendlyStatus = statusMap[o.status] || o.status || "Đang xử lý";
      const totalFormatted = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(o.total);

      return `• **Đơn hàng #${o.orderId}**:
  - Ngày đặt: ${new Date(o.orderDate).toLocaleString("vi-VN")}
  - Trạng thái: **${friendlyStatus}**
  - Tác phẩm: ${o.itemsSummary || "Mô hình Nook Ký"}
  - Tổng tiền: ${totalFormatted} (${o.paymentMethod.toUpperCase()})
  - Người nhận: ${o.customerNameMasked} (${o.phoneMasked})`;
    });

    return `Dạ, em đã tìm thấy thông tin đơn hàng của bạn trên hệ thống:\n\n${orderSummaries.join("\n\n")}\n\nNếu bạn cần hỗ trợ thêm thông tin gì về việc giao nhận, bạn cứ nhắn cho em nhé ạ!`;
  } catch (err: any) {
    return `Lỗi khi tra cứu đơn hàng: ${err?.message || String(err)}`;
  }
}

/**
 * Bộ máy phản hồi trực tiếp & thông minh (Native Fallback Engine).
 * Tự động đồng bộ và quét động từ mảng `products` trong data/products.ts.
 */
async function generateSmartFallbackResponse(
  userText: string,
  context?: ChatContext
): Promise<string> {
  const text = userText.trim();
  const norm = removeVietnameseTones(text);

  // 1. Ý định TRA CỨU ĐƠN HÀNG (Chứa mã NK- hoặc số điện thoại)
  const orderIdMatch = text.match(/NK-[A-Za-z0-9-]+/i);
  const phoneMatch = text.match(/\b(0\d{8,10}|\d{9,11})\b/);

  if (orderIdMatch) {
    return await handleLookupOrder(orderIdMatch[0]);
  }
  if (
    norm.includes("tra cuu") ||
    norm.includes("kiem tra don") ||
    norm.includes("don hang") ||
    norm.includes("ma don") ||
    norm.includes("tinh trang don")
  ) {
    if (phoneMatch) {
      return await handleLookupOrder(phoneMatch[0]);
    }
    if (context?.lastOrderId) {
      return await handleLookupOrder(context.lastOrderId);
    }
    return `Dạ, để em kiểm tra tình trạng đơn hàng cho mình, bạn vui lòng cho em xin **Mã đơn hàng** (dạng NK-2026...) hoặc **Số điện thoại** đã dùng khi đặt hàng nhé ạ!`;
  }

  // 2. TỰ ĐỘNG KHỚP SẢN PHẨM TỪ DANH MỤC DATA/PRODUCTS.TS (KỂ CẢ KHI THÊM MỚI)
  const matchedProduct = products.find((p) => {
    const normName = removeVietnameseTones(p.name);
    const normLocation = removeVietnameseTones(p.location);
    const normSlug = p.slug.replace(/-/g, " ");

    if (norm.includes(normName) || norm.includes(normLocation) || norm.includes(normSlug)) {
      return true;
    }

    // Kiểm tra từ khoá cụm từ chính (ví dụ: "song vua thuc giac", "sang tren pho cu", "mua qua san gach")
    const words = normName.split(" ").filter((w) => w.length > 2);
    if (words.length >= 2 && words.every((w) => norm.includes(w))) {
      return true;
    }

    return false;
  });

  if (matchedProduct) {
    const priceFormatted = formatVnd(matchedProduct.price);
    const originalPriceFormatted = matchedProduct.regularPrice ? formatVnd(matchedProduct.regularPrice) : null;
    const priceText = originalPriceFormatted
      ? `mức giá ưu đãi **${priceFormatted}** (giá gốc ${originalPriceFormatted})`
      : `mức giá **${priceFormatted}**`;

    return `Dạ, tác phẩm **"${matchedProduct.name}" (${matchedProduct.location})** hiện đang có sẵn tại xưởng với ${priceText}:\n\n• **Độ khó**: ${matchedProduct.difficulty} (${matchedProduct.pieces ? `khoảng ${matchedProduct.pieces} mảnh, ` : ""}hoàn thành trong ${matchedProduct.buildTime}).\n• **Nét đặc sắc**: ${matchedProduct.description}\n• **Bộ phụ kiện**: Đã bao gồm đủ vỉ gỗ ép laser cao cấp, hệ thống đèn LED vàng ấm, khay pin mini an toàn, keo dán chuyên dụng, nhíp gắp và sách hướng dẫn chi tiết tiếng Việt.\n\n👉 Bạn có thể xem ảnh chi tiết từng góc và đặt mua tại đây nhé ạ:\n[Xem chi tiết tác phẩm ${matchedProduct.name} →](/product/${matchedProduct.slug})`;
  }

  // 3. Ý định TƯ VẤN QUÀ TẶNG (Tặng bạn gái, bạn trai, người yêu, sinh nhật)
  if (
    norm.includes("tang ban gai") ||
    norm.includes("tang nguoi yeu") ||
    norm.includes("tang ban trai") ||
    norm.includes("qua sinh nhat") ||
    norm.includes("qua tang") ||
    norm.includes("tang ban")
  ) {
    return `Dạ, để làm quà tặng ý nghĩa và tinh tế, Nook Ký gợi ý bạn các lựa chọn phù hợp nhất theo từng đối tượng:\n\n1. **Tặng bạn gái / người yêu (Lãng mạn & Ấm áp)**:\n   • **"Phố Vừa Lên Đèn" (Hội An)** (899.000₫): Tường vàng hoa giấy, đèn lồng bên sông rất thơ mộng.\n   • **"Đèn Ấm Trên Dốc" (Đà Lạt)** (849.000₫): Ngôi nhà gỗ ấm cúng giữa sương mờ rất dễ thương.\n\n2. **Tặng bạn trai / người thích thử thách (Ấn tượng & Chi tiết)**:\n   • **"Hẻm Còn Sáng Đèn" (Sài Gòn)** (1.099.000₫): Biển hiệu retro, nhiều tầng chiều sâu sống động.\n\n3. **Tặng người mới / thư giãn nhẹ nhàng**:\n   • **"Sông Vừa Thức Giấc" (Miền Tây)** (749.000₫): Nhẹ nhàng, dễ lắp ráp.\n\n🎁 Toàn bộ tác phẩm đều được đóng gói sẵn trong **hộp quà kraft vintage** bọc chống sốc trang trọng, bạn chỉ cần ghi thiệp là có thể trao gửi ngay ạ!`;
  }

  // 4. Ý định TƯ VẤN NGƯỜI MỚI / ĐỘ KHÓ
  if (
    norm.includes("nguoi moi") ||
    norm.includes("chua tung") ||
    norm.includes("lan dau") ||
    norm.includes("moi bat dau") ||
    norm.includes("de lap") ||
    norm.includes("co kho khong") ||
    norm.includes("kho lap khong")
  ) {
    return `Dạ, nếu bạn là **người mới bắt đầu**, bạn hoàn toàn có thể an tâm:\n\n• **Mẫu dễ nhất**: **"Sông Vừa Thức Giấc" (Miền Tây)** (749.000₫) — chỉ khoảng 300–360 mảnh, lắp 4–6 giờ thư giãn.\n• **Độ khó trung bình**: **"Sáng Trên Phố Cũ" (Hà Nội)** (849.000₫) hoặc **"Đèn Ấm Trên Dốc" (Đà Lạt)** (849.000₫) — khoảng 5–7 giờ.\n\nMọi bộ sản phẩm của Nook Ký đều có **sách hướng dẫn in màu từng bước bằng tiếng Việt**, các mảnh gỗ đã được cắt sẵn chính xác chỉ cần nhẹ nhàng tách ra và ghép nối. Ngoài ra, xưởng có chính sách **Bảo hành bù mảnh vỡ miễn phí trong 30 ngày**, nên bạn cứ thỏa sức sáng tạo nhé ạ!`;
  }

  // 5. Ý định HỎI VỀ PHỤ KIỆN / ĐÈN LED / PIN / KEO
  if (
    norm.includes("den") ||
    norm.includes("led") ||
    norm.includes("pin") ||
    norm.includes("keo") ||
    norm.includes("phu kien") ||
    norm.includes("dung cu") ||
    norm.includes("kem theo")
  ) {
    return `Dạ, bạn **KHÔNG CẦN mua thêm bất cứ dụng cụ nào** từ bên ngoài đâu ạ! Mỗi hộp sản phẩm Nook Ký gửi tới bạn đều đã bao gồm trọn vẹn 100%:\n\n1. Các vỉ gỗ ép laser cao cấp, cắt chính xác tới từng milimet.\n2. Dây điện và bóng đèn LED ánh vàng ấm đã tính toán vị trí thẩm mỹ.\n3. Khay pin mini an toàn (tiện để kệ sách, bàn làm việc, không dây điện vướng víu).\n4. Keo dán mô hình chuyên dụng độ dính cao.\n5. Nhíp gắp chi tiết nhỏ & giấy ráp chà mịn mép gỗ.\n6. Sách hướng dẫn minh hoạ chi tiết từng bước bằng tiếng Việt!`;
  }

  // 6. Ý định HỎI VỀ BẢO HÀNH & GÃY MẢNH
  if (
    norm.includes("bao hanh") ||
    norm.includes("gay manh") ||
    norm.includes("thieu manh") ||
    norm.includes("hu hong") ||
    norm.includes("doi tra")
  ) {
    return `Dạ, Nook Ký có chính sách **Bảo hành Ký Ức** an tâm tuyệt đối cho bạn:\n\nTrong vòng **30 ngày** kể từ khi nhận hàng, nếu bạn vô tình làm gãy hoặc thất lạc bất kỳ mảnh chi tiết gỗ nào trong quá trình lắp ráp, bạn chỉ cần chụp ảnh trang hướng dẫn vị trí mảnh đó và gửi cho xưởng. Nook Ký sẽ gia công lại và gửi bù mảnh mới **hoàn toàn miễn phí** về tận nhà cho mình ạ!`;
  }

  // 7. Ý định HỎI VỀ VẬN CHUYỂN & PHÍ SHIP
  if (
    norm.includes("ship") ||
    norm.includes("giao hang") ||
    norm.includes("van chuyen") ||
    norm.includes("bao lau") ||
    norm.includes("phi van chuyen")
  ) {
    return `Dạ, chính sách giao hàng của Nook Ký như sau:\n\n• **Miễn phí vận chuyển toàn quốc** cho đơn hàng từ 1.000.000₫ (hoặc từ 2 bộ mô hình trở lên). Đơn dưới 1.000.000₫ phí ship đồng giá 30.000₫ toàn quốc.\n• **Thời gian giao hàng**:\n  - Nội thành TP.HCM & Hà Nội: 2–3 ngày làm việc.\n  - Các tỉnh thành khác: 3–5 ngày làm việc.\n• Tác phẩm được đóng trong hộp quà kraft vintage dày dặn, bọc chống sốc đa tầng để đảm bảo an toàn tuyệt đối khi vận chuyển!`;
  }

  // 8. Ý định HỎI BẢNG GIÁ / CÁC MẪU HIỆN CÓ (TỰ ĐỘNG SINH TỪ DATA/PRODUCTS.TS)
  if (
    norm.includes("gia") ||
    norm.includes("bao nhieu") ||
    norm.includes("cac mau") ||
    norm.includes("danh sach") ||
    norm.includes("bo suu tap") ||
    norm.includes("co nhung mau nao") ||
    norm.includes("co nhung tac pham nao")
  ) {
    const listText = products
      .map(
        (p, i) =>
          `${i + 1}. **"${p.name}" (${p.location})**: ${formatVnd(p.price)}${
            p.regularPrice ? ` (Giá gốc: ${formatVnd(p.regularPrice)})` : ""
          } — ${p.difficulty}, ${p.buildTime}`
      )
      .join("\n");

    return `Dạ, hiện tại Nook Ký có ${products.length} tác phẩm mô hình thủ công tương ứng với các miền ký ức Việt Nam:\n\n${listText}\n\n👉 Bạn muốn tìm hiểu kỹ hơn về tác phẩm nào trong các mẫu trên để em tư vấn chi tiết cho mình nhé ạ?`;
  }

  // 9. Ngữ cảnh khách đang xem trang cụ thể
  if (context?.lastViewedProduct) {
    return `Dạ, em thấy bạn đang quan tâm tới tác phẩm **"${context.lastViewedProduct.name}"** (${formatVnd(context.lastViewedProduct.price)}). Bạn đang băn khoăn về độ khó, thời gian hoàn thành hay chi tiết nào của tác phẩm này, cứ chia sẻ với em nhé ạ!`;
  }

  // 10. Chào hỏi mặc định nếu không khớp từ khóa
  return `Dạ, Nook Ký xin chào bạn! Em có thể giúp bạn chọn mẫu mô hình phù hợp, tư vấn quà tặng ý nghĩa, hoặc tra cứu tiến độ đơn hàng đã đặt. Bạn đang quan tâm đến mẫu mô hình hoặc khu vực nào (Hội An, Huế, Hà Nội, Sài Gòn, Đà Lạt, Miền Tây) ạ?`;
}

/**
 * Gọi OpenAI API gpt-4o-mini với Tool Calling tra cứu đơn hàng và System Prompt động
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

  const dynamicSystemPrompt = getDynamicSystemPrompt();

  const systemMessage: ChatMessage = {
    role: "system",
    content: `${dynamicSystemPrompt}${contextPrompt}`,
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
