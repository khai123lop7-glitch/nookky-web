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

function renderTextWithBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function formatMessageContent(content: string): React.ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(content)) !== null) {
    if (match.index > lastIdx) {
      nodes.push(...renderTextWithBold(content.substring(lastIdx, match.index)));
    }
    const text = match[1];
    const url = match[2];
    nodes.push(
      <a key={`link-${match.index}`} href={url} className={styles.chatLink}>
        {text}
      </a>
    );
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < content.length) {
    nodes.push(...renderTextWithBold(content.substring(lastIdx)));
  }

  return nodes;
}

type PositionPreset = "bottom-right" | "bottom-left" | "top-right" | "top-left";
type PositionMode = PositionPreset | "custom";

const STORAGE_KEY = "nookky_chat_pos";

export function NookChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contextProduct, setContextProduct] = useState<ViewedProduct | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  // Quản lý vị trí linh hoạt (Góc hoặc Tự do kéo thả)
  const [positionMode, setPositionMode] = useState<PositionMode>("bottom-right");
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPosMenu, setShowPosMenu] = useState(false);

  const widgetRef = useRef<HTMLDivElement>(null);
  const justDraggedRef = useRef(false);
  const dragRef = useRef<{
    isDown: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    hasMoved: boolean;
    elementWidth: number;
    elementHeight: number;
  }>({
    isDown: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    hasMoved: false,
    elementWidth: 0,
    elementHeight: 0,
  });

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

  // Khôi phục vị trí lưu trước đó từ localStorage
  useEffect(() => {
    try {
      const savedPos = window.localStorage.getItem(STORAGE_KEY);
      if (savedPos) {
        const parsed = JSON.parse(savedPos);
        if (parsed.mode === "custom" && parsed.coords) {
          const maxX = Math.max(10, window.innerWidth - 180);
          const maxY = Math.max(10, window.innerHeight - 180);
          const clampedX = Math.min(Math.max(10, parsed.coords.x), maxX);
          const clampedY = Math.min(Math.max(10, parsed.coords.y), maxY);
          setCoords({ x: clampedX, y: clampedY });
          setPositionMode("custom");
        } else if (["bottom-right", "bottom-left", "top-right", "top-left"].includes(parsed.mode)) {
          setPositionMode(parsed.mode);
        }
      }
    } catch {
      // Bỏ qua lỗi truy cập storage
    }
  }, []);

  // Điều chỉnh toạ độ nếu người dùng đổi kích cỡ cửa sổ
  useEffect(() => {
    const handleResize = () => {
      if (positionMode === "custom" && coords && widgetRef.current) {
        const rect = widgetRef.current.getBoundingClientRect();
        const maxX = Math.max(10, window.innerWidth - rect.width - 10);
        const maxY = Math.max(10, window.innerHeight - rect.height - 10);
        const clampedX = Math.min(Math.max(10, coords.x), maxX);
        const clampedY = Math.min(Math.max(10, coords.y), maxY);
        if (clampedX !== coords.x || clampedY !== coords.y) {
          setCoords({ x: clampedX, y: clampedY });
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [positionMode, coords]);

  // Tự động đóng menu chọn vị trí khi click ra ngoài
  useEffect(() => {
    if (!showPosMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(`.${styles.headerActions}`)) {
        setShowPosMenu(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [showPosMenu]);

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

  // Logic kéo thả mượt mà (Pointer Events)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest(`.${styles.headerActions}`)) return;

    const container = widgetRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    dragRef.current = {
      isDown: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: rect.left,
      originY: rect.top,
      hasMoved: false,
      elementWidth: rect.width,
      elementHeight: rect.height,
    };

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.isDown) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (!dragRef.current.hasMoved && Math.hypot(dx, dy) > 6) {
      dragRef.current.hasMoved = true;
      setIsDragging(true);
    }

    if (dragRef.current.hasMoved) {
      const newX = dragRef.current.originX + dx;
      const newY = dragRef.current.originY + dy;
      const maxX = Math.max(10, window.innerWidth - (dragRef.current.elementWidth || 160) - 10);
      const maxY = Math.max(10, window.innerHeight - (dragRef.current.elementHeight || 160) - 10);
      const clampedX = Math.min(Math.max(10, newX), maxX);
      const clampedY = Math.min(Math.max(10, newY), maxY);

      setCoords({ x: clampedX, y: clampedY });
      setPositionMode("custom");
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current.isDown) return;
    const hadMoved = dragRef.current.hasMoved;
    dragRef.current.isDown = false;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Bỏ qua lỗi capture
    }

    if (hadMoved) {
      justDraggedRef.current = true;
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 120);

      const newX = dragRef.current.originX + (e.clientX - dragRef.current.startX);
      const newY = dragRef.current.originY + (e.clientY - dragRef.current.startY);
      const maxX = Math.max(10, window.innerWidth - (dragRef.current.elementWidth || 160) - 10);
      const maxY = Math.max(10, window.innerHeight - (dragRef.current.elementHeight || 160) - 10);
      const clampedX = Math.min(Math.max(10, newX), maxX);
      const clampedY = Math.min(Math.max(10, newY), maxY);

      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ mode: "custom", coords: { x: clampedX, y: clampedY } })
        );
      } catch {
        // Bỏ qua lỗi storage
      }
    }
  };

  const selectPreset = (preset: PositionPreset) => {
    setPositionMode(preset);
    setCoords(null);
    setShowPosMenu(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: preset }));
    } catch {
      // Bỏ qua lỗi storage
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

  const isRightAligned =
    positionMode === "bottom-right" ||
    positionMode === "top-right" ||
    (positionMode === "custom" && coords
      ? coords.x > (typeof window !== "undefined" ? window.innerWidth / 2 : 500)
      : true);

  const isBottomAligned =
    positionMode === "bottom-right" ||
    positionMode === "bottom-left" ||
    (positionMode === "custom" && coords
      ? coords.y > (typeof window !== "undefined" ? window.innerHeight / 2 : 400)
      : true);

  let positionClass = "";
  if (positionMode === "bottom-right") positionClass = styles.posBottomRight;
  else if (positionMode === "bottom-left") positionClass = styles.posBottomLeft;
  else if (positionMode === "top-right") positionClass = styles.posTopRight;
  else if (positionMode === "top-left") positionClass = styles.posTopLeft;

  const customStyle: React.CSSProperties =
    positionMode === "custom" && coords
      ? {
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          right: "auto",
          bottom: "auto",
        }
      : {};

  return (
    <div
      ref={widgetRef}
      className={`${styles.widgetContainer} ${positionClass} ${isDragging ? styles.isDragging : ""}`}
      style={customStyle}
      aria-label="Khung trò chuyện tư vấn Nook Ký"
    >
      {/* Floating Action Button - Mascot 3D & Speech Bubble */}
      {!isOpen && (
        <div className={`${styles.fabWrapper} ${isRightAligned ? styles.alignRight : styles.alignLeft}`}>
          <div
            className={`${styles.fabSpeechBubble} ${
              isBottomAligned ? styles.bubbleBottom : styles.bubbleTop
            } ${isRightAligned ? styles.bubbleRight : styles.bubbleLeft}`}
          >
            Bạn cần Nook Ký tư vấn gì nè? 🏮
          </div>
          <button
            type="button"
            className={styles.fabButtonImage}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={() => {
              if (justDraggedRef.current) {
                justDraggedRef.current = false;
                return;
              }
              toggleOpen();
            }}
            aria-label="Mở khung tư vấn Nghệ nhân Nook Ký (Nhấn để mở, kéo thả để đổi vị trí)"
            title="Bấm để mở, giữ chuột để kéo đổi vị trí"
          >
            <span className={styles.dragHintBadge}>Kéo để đổi vị trí ✦</span>
            <img
              src="/media/chat-button-full.webp"
              alt="Tư vấn Nook Ký"
              className={styles.fabMascotImg}
              draggable={false}
            />
          </button>
        </div>
      )}

      {/* Chat Window Dialog */}
      {isOpen && (
        <div
          className={`${styles.chatWindow} ${
            isBottomAligned
              ? isRightAligned
                ? styles.chatAnchorBottomRight
                : styles.chatAnchorBottomLeft
              : isRightAligned
              ? styles.chatAnchorTopRight
              : styles.chatAnchorTopLeft
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-title"
        >
          {/* Header - Kéo thả để di chuyển */}
          <div
            className={styles.header}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            title="Giữ chuột tại đây để kéo thả di chuyển khung chat"
          >
            <div className={styles.headerLeft}>
              <div className={styles.avatarBox}>
                <img
                  src="/media/chat-mascot-avatar.webp"
                  alt="Linh vật Nghệ nhân Nook Ký"
                  className={styles.avatarImg}
                />
              </div>
              <div className={styles.headerTitles}>
                <h3 id="chat-title" className={styles.title}>
                  Nghệ nhân Nook Ký ✥
                </h3>
                <p className={styles.statusText}>
                  <span className={styles.onlineDot} /> Sẵn sàng lắng nghe & tra cứu
                </p>
              </div>
            </div>

            <div className={styles.headerActions}>
              {/* Nút chỉnh vị trí góc */}
              <button
                type="button"
                className={styles.posBtn}
                onClick={() => setShowPosMenu((prev) => !prev)}
                title="Đổi vị trí góc màn hình"
                aria-label="Tuỳ chỉnh vị trí khung chat"
              >
                📍
              </button>

              {/* Menu chọn góc / preset */}
              {showPosMenu && (
                <div className={styles.posMenu}>
                  <div className={styles.posMenuTitle}>Vị trí hiển thị</div>
                  <button
                    type="button"
                    className={`${styles.posMenuItem} ${positionMode === "bottom-right" ? styles.posMenuItemActive : ""}`}
                    onClick={() => selectPreset("bottom-right")}
                  >
                    ↘ Dưới cùng bên phải
                  </button>
                  <button
                    type="button"
                    className={`${styles.posMenuItem} ${positionMode === "bottom-left" ? styles.posMenuItemActive : ""}`}
                    onClick={() => selectPreset("bottom-left")}
                  >
                    ↙ Dưới cùng bên trái
                  </button>
                  <button
                    type="button"
                    className={`${styles.posMenuItem} ${positionMode === "top-right" ? styles.posMenuItemActive : ""}`}
                    onClick={() => selectPreset("top-right")}
                  >
                    ↗ Trên cùng bên phải
                  </button>
                  <button
                    type="button"
                    className={`${styles.posMenuItem} ${positionMode === "top-left" ? styles.posMenuItemActive : ""}`}
                    onClick={() => selectPreset("top-left")}
                  >
                    ↖ Trên cùng bên trái
                  </button>
                  <div className={styles.posMenuHint}>
                    💡 Bạn có thể giữ chuột vào linh vật hoặc thanh tiêu đề để kéo thả tự do!
                  </div>
                </div>
              )}

              <button
                type="button"
                className={styles.closeButton}
                onClick={toggleOpen}
                aria-label="Đóng khung chat"
              >
                ✕
              </button>
            </div>
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
                  {formatMessageContent(msg.content)}
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
