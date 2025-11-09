"use client";

import React, { useEffect, useRef, useState } from "react";

const ChatbotBubble: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{
    id: number;
    from: "user" | "bot";
    text: string;
  }[]>([
    { id: 1, from: "bot", text: "Hi! I  help you find cars or answer questions. Try typing something. I will be of no help yet! uwu" },
  ]);

  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { id: Date.now(), from: "user" as const, text: trimmed };
    setMessages((p) => [...p, userMsg]);
    setInput("");

    //stubbed bot reply for demo
    setTimeout(() => {
      setMessages((p) => [
        ...p,
        { id: Date.now() + 1, from: "bot" as const, text: `"${trimmed}" — lol this is a demo` },
      ]);
    }, 600);
  };

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
          <button className="chatbot-close" aria-label="Close chat" onClick={() => setOpen(false)}>
            ×
          </button>
        </div>

        <div className="chatbot-messages" ref={messagesRef}>
          {messages.map((m) => (
            <div key={m.id} className={`chat-message ${m.from}`}>
              {m.text}
            </div>
          ))}
        </div>

        <form className="chatbot-input" onSubmit={send}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            aria-label="Type a message"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
};

export default ChatbotBubble;
