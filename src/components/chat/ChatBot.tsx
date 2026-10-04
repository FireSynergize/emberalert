"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Flame, Bot, User, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What should I have in a wildfire go-bag?",
  "How do I read an air quality index?",
  "What causes wildfires to spread so fast?",
  "How do I find evacuation routes near me?",
  "What is the most destructive wildfire in US history?",
];

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    const aiMsgId = (Date.now() + 1).toString();

    setMessages((prev) => [...prev, userMsg, { id: aiMsgId, role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);
    setShowSuggestions(false);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, content: accumulated } : m))
        );
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? { ...m, content: "Sorry, I encountered an error. Please check your API key configuration and try again." }
              : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-[rgba(255,69,0,0.15)]">
        <div className="relative mr-2.5">
          <div className="p-2 rounded-lg bg-[rgba(255,69,0,0.15)]">
            <Flame className="h-4 w-4 text-[#ff4500]" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#ff4500] animate-pulse" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#f5f0ea]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Wildfire AI Assistant
          </p>
          <p className="text-xs text-[rgba(245,240,234,0.4)]">
            Claude · Anthropic
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="p-4 rounded-2xl bg-[rgba(255,69,0,0.08)] border border-[rgba(255,69,0,0.15)] mb-4">
              <Sparkles className="h-8 w-8 text-[#ff4500]" />
            </div>
            <p className="text-sm font-semibold text-[#f5f0ea] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Ask me anything about wildfires
            </p>
            <p className="text-xs text-[rgba(245,240,234,0.4)] max-w-xs">
              Safety guidance, damage assessment, air quality, escape routes, and historical data.
            </p>
          </div>
        )}

        {showSuggestions && messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[rgba(245,240,234,0.3)]">Suggested questions</p>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="w-full text-left text-xs px-3 py-2.5 rounded-lg border border-[rgba(255,69,0,0.15)] text-[rgba(245,240,234,0.6)] hover:text-[#f5f0ea] hover:border-[rgba(255,69,0,0.35)] hover:bg-[rgba(255,69,0,0.06)] transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
            {m.role === "assistant" && (
              <div className="flex-shrink-0 p-1.5 rounded-lg bg-[rgba(255,69,0,0.12)] self-start mt-0.5">
                <Bot className="h-3.5 w-3.5 text-[#ff4500]" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-gradient-to-br from-[#ff4500] to-[#ff6b00] text-white rounded-tr-sm"
                  : "glass-fire border border-[rgba(255,69,0,0.12)] text-[rgba(245,240,234,0.9)] rounded-tl-sm"
              )}
            >
              {m.role === "assistant" && m.content === "" && isStreaming ? (
                <div className="flex gap-1 items-center py-1">
                  <span className="h-1.5 w-1.5 bg-[#ff4500] rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 bg-[#ff4500] rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 bg-[#ff4500] rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }}
                />
              )}
            </div>
            {m.role === "user" && (
              <div className="flex-shrink-0 p-1.5 rounded-lg bg-[rgba(255,69,0,0.12)] self-start mt-0.5">
                <User className="h-3.5 w-3.5 text-[#ff7b35]" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[rgba(255,69,0,0.15)]">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about wildfires, safety, or damage..."
            className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,69,0,0.2)] rounded-xl px-4 py-2.5 text-sm text-[#f5f0ea] placeholder-[rgba(245,240,234,0.3)] focus:outline-none focus:border-[rgba(255,69,0,0.5)] focus:bg-[rgba(255,69,0,0.05)] transition-all"
          />
          <Button type="submit" size="sm" disabled={isStreaming || !input.trim()} className="h-[42px] w-[42px] p-0 flex-shrink-0">
            {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-[10px] text-[rgba(245,240,234,0.25)] mt-2 text-center">
          AI responses are informational only. In emergencies, call 911.
        </p>
      </form>
    </div>
  );
}

function formatMessage(content: string): string {
  return content
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, '<h3 style="font-size:0.85rem;font-weight:700;color:#ff7b35;margin:0.75rem 0 0.25rem">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:0.9rem;font-weight:700;color:#ff7b35;margin:0.75rem 0 0.25rem">$1</h2>')
    .replace(/^- (.+)$/gm, '<li style="margin:0.2rem 0;padding-left:0.5rem">• $1</li>')
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}
