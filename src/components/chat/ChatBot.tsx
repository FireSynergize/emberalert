"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Flame, Bot, User, Loader2 } from "lucide-react";
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
              ? { ...m, content: "Sorry, something went wrong. Check your API key and try again." }
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
      <div className="flex items-center gap-2.5 p-3 border-b border-[#2e2e2e]">
        <Flame className="h-4 w-4 text-[#e84c1a]" />
        <div>
          <p className="text-sm font-medium text-[#e0e0e0]">Wildfire AI Assistant</p>
          <p className="text-[10px] text-[#555]">Claude · Anthropic</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-6">
            <Flame className="h-8 w-8 text-[#e84c1a] mb-3" />
            <p className="text-sm font-medium text-[#e0e0e0] mb-1">Ask me about wildfires</p>
            <p className="text-xs text-[#666] max-w-xs">Safety tips, air quality, escape routes, damage estimates, and historical data.</p>
          </div>
        )}

        {showSuggestions && messages.length === 0 && (
          <div className="space-y-1.5 mt-2">
            <p className="text-[10px] text-[#555] uppercase tracking-widest">Suggestions</p>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="w-full text-left text-xs px-3 py-2 rounded border border-[#2e2e2e] text-[#888] hover:text-[#e0e0e0] hover:border-[#444] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
            {m.role === "assistant" && (
              <div className="flex-shrink-0 mt-0.5">
                <Bot className="h-4 w-4 text-[#e84c1a]" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[85%] rounded px-3 py-2 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-[#e84c1a] text-white"
                  : "bg-[#242424] border border-[#2e2e2e] text-[#d0d0d0]"
              )}
            >
              {m.role === "assistant" && m.content === "" && isStreaming ? (
                <div className="flex gap-1 items-center py-0.5">
                  <span className="h-1.5 w-1.5 bg-[#e84c1a] rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 bg-[#e84c1a] rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 bg-[#e84c1a] rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }} />
              )}
            </div>
            {m.role === "user" && (
              <div className="flex-shrink-0 mt-0.5">
                <User className="h-4 w-4 text-[#666]" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[#2e2e2e]">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about wildfires, safety, or damage..."
            className="flex-1 bg-[#242424] border border-[#2e2e2e] rounded px-3 py-2 text-sm text-[#e0e0e0] placeholder-[#555] focus:outline-none focus:border-[#444] transition-colors"
          />
          <Button type="submit" size="sm" disabled={isStreaming || !input.trim()} className="h-[38px] w-[38px] p-0 flex-shrink-0">
            {isStreaming ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          </Button>
        </div>
        <p className="text-[10px] text-[#444] mt-1.5 text-center">In emergencies, call 911.</p>
      </form>
    </div>
  );
}

function formatMessage(content: string): string {
  return content
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, '<h3 style="font-size:0.8rem;font-weight:600;color:#e84c1a;margin:0.6rem 0 0.2rem">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:0.85rem;font-weight:600;color:#e84c1a;margin:0.6rem 0 0.2rem">$2</h2>')
    .replace(/^- (.+)$/gm, '<li style="margin:0.15rem 0;padding-left:0.5rem">• $1</li>')
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}
