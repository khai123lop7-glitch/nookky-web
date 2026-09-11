"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import styles from "./NookChatWidget.module.css";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

interface ViewedProduct {
  slug: string;
  name: string;
  price: number;
}

export function NookChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contextProduct, setContextProduct] = useState<ViewedProduct | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Dạ, Nook Ký xin chào bạn! 🏮 Em là người đồng hành tại xưởng thủ công Nook Ký.\n\nEm có thể giúp bạn chọn mẫu mô hình phù hợp, tư vấn thời gian lắp ráp, hoặc hỗ trợ tra cứu đơn hàng vừa đặt ạ.",
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  // Đọc ngữ cảnh từ sessionStorage & localStorage khi khởi động
  useEffect(() => {
    try {
      const rawCtx = window.sessionStorage.getItem("nookky_session_context");
      if (rawCtx) {
        const parsed = JSON.parse(rawCtx);
        if (parsed?.lastViewedProduct) {
          setContextProduct(parsed.lastViewedProduct);
        }
        if (parsed?.lastOrderId) {
          setLastOrderId(parsed.lastOrderId);
        }
      }

      const lastOrderRaw = window.localStorage.getItem("nookky_last_order");
      if (lastOrderRaw) {
        const parsedOrder = JSON.parse(lastOrderRaw);
        if (parsedOrder?.orderId) {
          setLastOrderId(parsedOrder.orderId);
        }
      }
    } catch {
      // Bỏ qua lỗi đọc storage
    }

    // Lắng nghe sự kiện đồng bộ từ Unified Tracking Hub (lib/analytics.ts)
    const handleSessionEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const ctx = customEvent.detail?.context;
      if (ctx?.lastViewedProduct) {
        setContextProduct(ctx.lastViewedProduct);
      }
      if (ctx?.lastOrderId) {
        setLastOrderId(ctx.lastOrderId);
      }
    };

    window.addEventListener("nook_session_event", handleSessionEvent);
    return () => {
      window.removeEventListener("nook_session_event", handleSessionEvent);
    };
  }, []);

  // Đóng khi bấm phím Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      track("chat_open", { page: typeof window !== "undefined" ? window.location.pathname : "" });
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsLoading(true);

    track("chat_message_sent", {
      message_length: query.length,
      has_order_keyword: query.includes("NK-") || query.toLowerCase().includes("đơn"),
    });

    try {
      const historyForApi = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const contextPayload = {
        currentPage: typeof window !== "undefined" ? window.location.pathname : "",
        lastViewedProduct: contextProduct || undefined,
        lastOrderId: lastOrderId || undefined,
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyForApi,
          context: contextPayload,
        }),
      });

      const data = await res.json();
      const botReply =
        data?.message || "Dạ, em đang gặp chút gián đoạn kết nối, bạn thử nhắn lại giúp em nhé ạ!";

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: botReply,
          time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-err-${Date.now()}`,
          role: "assistant",
          content:
            "Dạ, đường truyền đến xưởng thủ công tạm thời bận. Bạn vui lòng thử lại sau giây lát hoặc để lại thông tin để xưởng gọi lại nhé ạ.",
          time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: "🏮 Người mới nên chọn mẫu nào?", prompt: "Tôi là người mới bắt đầu, xưởng tư vấn giúp tôi nên chọn mẫu nào dễ lắp và đẹp nhé ạ!" },
    { label: "📦 Kiểm tra đơn hàng của tôi", prompt: lastOrderId ? `Kiểm tra giúp tôi đơn hàng #${lastOrderId}` : "Kiểm tra giúp tôi tình trạng đơn hàng của tôi" },
    { label: "💡 Có kèm sẵn LED & keo dán không?", prompt: "Bộ sản phẩm có kèm sẵn đèn LED, pin và keo dán chuyên dụng không ạ?" },
    { label: "🛡️ Chính sách bảo hành gãy mảnh?", prompt: "Nếu trong quá trình lắp ráp tôi vô tình làm gãy chi tiết thì có được đổi không?" },
  ];

  return (
    <div className={styles.widgetContainer} aria-label="Khung trò chuyện tư vấn Nook Ký">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          type="button"
          className={styles.fabButton}
          onClick={toggleOpen}
          aria-label="Mở khung tư vấn Nghệ nhân Nook Ký"
        >
          <span className={styles.fabPulseDot} />
          <span className={styles.fabIcon}>🏮</span>
          <span className={styles.fabLabel}>Tư vấn Nook Ký</span>
        </button>
      )}

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className={styles.chatWindow} role="dialog" aria-modal="true" aria-labelledby="chat-title">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.avatarBox}>🏮</div>
              <div className={styles.headerTitles}>
                <h3 id="chat-title" className={styles.title}>
                  Nghệ nhân Nook Ký
                </h3>
                <p className={styles.statusText}>
                  <span className={styles.onlineDot} /> Sẵn sàng lắng nghe & tra cứu
                </p>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={toggleOpen}
              aria-label="Đóng khung chat"
            >
              ✕
            </button>
          </div>

          {/* Context Banner nếu đang xem sản phẩm */}
          {contextProduct && (
            <div className={styles.contextBanner}>
              <span className={styles.contextText}>
                Đang xem: <strong>{contextProduct.name}</strong>
              </span>
              <button
                type="button"
                className={styles.contextAction}
                onClick={() => handleSendMessage(`Tôi muốn tìm hiểu thêm về tác phẩm ${contextProduct.name}`)}
              >
                Hỏi mẫu này
              </button>
            </div>
          )}

          {/* Messages Area */}
          <div className={styles.messagesArea}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${
                  msg.role === "assistant" ? styles.assistantRow : styles.userRow
                }`}
              >
                <div
                  className={`${styles.bubble} ${
                    msg.role === "assistant" ? styles.assistantBubble : styles.userBubble
                  }`}
                >
                  {msg.content}
                </div>
                <span className={styles.timeTag}>{msg.time}</span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className={`${styles.messageRow} ${styles.assistantRow}`}>
                <div className={styles.typingIndicator} aria-label="Nghệ nhân đang phản hồi">
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}

            {/* Quick Suggestion Chips (chỉ hiện khi có dưới 3 tin nhắn hoặc sau lời chào) */}
            {messages.length <= 2 && !isLoading && (
              <div className={styles.chipsContainer}>
                {quickPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={styles.chip}
                    onClick={() => handleSendMessage(item.prompt)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            className={styles.inputArea}
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className={styles.inputField}
              placeholder="Nhắn tin với xưởng, tra cứu đơn..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              aria-label="Nội dung tin nhắn"
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={!inputText.trim() || isLoading}
              aria-label="Gửi tin nhắn"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
