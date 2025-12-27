"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! 👋 I'm your gaming assistant. What game are you looking for?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const webhookUrl = "https://tedic.app.n8n.cloud/webhook/steamrush";
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: getSessionId(),
          timestamp: userMessage.timestamp.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      let data;
      
      if (responseText && responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error("Invalid JSON response");
        }
      } else {
        data = { message: "✅ Got it! Let me help you find that game." };
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message || data.response || "How can I help you find games?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Oops! Connection issue. Please try again.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full p-3.5 sm:p-4 shadow-xl hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-200 z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg animate-pulse">
            AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-4 right-4 w-[min(90vw,340px)] sm:w-[380px] h-[min(80vh,550px)] sm:h-[600px] bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3.5 flex items-center justify-between border-b border-blue-500/20">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-xl">
                <MessageCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-[15px] tracking-tight">Gaming AI</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-blue-100 text-[11px] font-medium">Online</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-4.5 h-4.5" strokeWidth={2.5} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3.5 bg-slate-950/50 scroll-smooth">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom duration-200`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl shadow-lg ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                      : "bg-slate-800/90 backdrop-blur-sm text-slate-100 border border-slate-700/50 rounded-bl-md"
                  }`}
                >
                  <p className="text-[13px] sm:text-[14px] leading-relaxed font-normal antialiased" style={{ letterSpacing: '0.01em' }}>
                    {msg.content}
                  </p>
                  <span className={`text-[10px] font-medium mt-1.5 block ${
                    msg.role === "user" ? "text-blue-100" : "text-slate-400"
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="bg-slate-800/90 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-slate-700/50 shadow-lg rounded-bl-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" strokeWidth={2.5} />
                    <span className="text-[13px] text-slate-300 font-medium">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-3 py-2.5 bg-slate-900/50 border-t border-slate-700/30">
              <p className="text-[11px] text-slate-400 font-medium mb-2">Quick ask:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "GTA games", query: "Show GTA games" },
                  { label: "Under ₹300", query: "Games under ₹300" },
                  { label: "Best RPGs", query: "Best RPGs" }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setInput(item.query);
                      setTimeout(() => sendMessage(), 100);
                    }}
                    className="text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 px-3 py-1.5 rounded-full border border-slate-600/50 hover:border-blue-500/50 transition-all duration-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 bg-slate-900/80 border-t border-slate-700/30 backdrop-blur-sm">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about games..."
                disabled={isLoading}
                className="flex-1 bg-slate-800/80 border border-slate-600/50 rounded-xl px-3.5 py-2.5 text-[13px] sm:text-[14px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition-all font-normal antialiased"
                style={{ letterSpacing: '0.01em' }}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/30 active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin" strokeWidth={2.5} />
                ) : (
                  <Send className="w-4.5 h-4.5" strokeWidth={2.5} />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = localStorage.getItem("chatSessionId");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem("chatSessionId", sessionId);
  }
  return sessionId;
}
