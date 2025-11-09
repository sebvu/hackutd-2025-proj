"use client";

import React, { useEffect, useRef, useState } from "react";

interface ChatbotBubbleProps {
  onAIUpdate?: (filters: any) => void;
  cars?: any[];
}

const ChatbotBubble: React.FC<ChatbotBubbleProps> = ({ onAIUpdate, cars = [] }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { id: number; from: "user" | "bot"; text: string }[]
  >([
    {
      id: 1,
      from: "bot",
      text: "Hi! I'm Matchmaker — your car expert assistant. Tell me what kind of car you’re looking for!",
    },
  ]);

  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesRef.current)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, open]);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { id: Date.now(), from: "user" as const, text: trimmed };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, cars }),
      });

      const data = await res.json();

      // 🧠 If AI detects a filter-related message
      if (data.type === "filter") {
        if (data.filters && onAIUpdate) onAIUpdate(data.filters);

        setMessages((p) => [
          ...p,
          {
            id: Date.now() + 1,
            from: "bot" as const,
            text:
              `${data.reply}\n\n` +
              (data.highlightedCars?.length
                ? `🚗 Matching cars: ${data.highlightedCars.join(", ")}.\n`
                : "") +
              (data.reviewSummary
                ? `💬 ${data.reviewSummary}`
                : ""),
          },
        ]);
      } else {
        // 🗣 Casual chat
        setMessages((p) => [
          ...p,
          {
            id: Date.now() + 1,
            from: "bot",
            text: data.reply || "Sure thing! Tell me more.",
          },
        ]);
      }
    } catch (err) {
      console.error("Chatbot Error:", err);
      setMessages((p) => [
        ...p,
        {
          id: Date.now() + 1,
          from: "bot",
          text: "Oops! Something went wrong, try again?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="chatbot-bubble"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        title={open ? "Close chat" : "Open chat"}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className={`chatbot-modal ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!open}>
        <div className="chatbot-modal-header">
          <strong>Matchmaker</strong>
          <button className="chatbot-close" onClick={() => setOpen(false)}>×</button>
        </div>

        <div className="chatbot-messages" ref={messagesRef}>
          {messages.map((m) => (
            <div key={m.id} className={`chat-message ${m.from}`}>
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="chat-message bot"><em>Thinking...</em></div>
          )}
        </div>

        <form className="chatbot-input" onSubmit={sendMessage}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit" disabled={loading}>Send</button>
        </form>
      </div>
    </>
  );
};

export default ChatbotBubble;
