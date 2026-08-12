"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, User, Loader2, CornerDownLeft, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export default function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hi! 👋 I'm Alex's AI Twin. I have real-time access to Alex's current projects, technical skills, and career background. Ask me anything!",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const triggerBadgeUnlock = () => {
    if (typeof window !== "undefined") {
      const evt = new CustomEvent("unlock-badge", { detail: "ai_collaborator" });
      window.dispatchEvent(evt);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    triggerBadgeUnlock();

    const userMsg: Message = { id: Math.random().toString(), sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { id: Math.random().toString(), sender: "ai", text: data.reply },
        ]);
      } else {
        throw new Error(data.error || "No response");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ai",
          text: "Sorry, I ran into an error connecting to the AI knowledge engine. Please try asking again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "What are Alex's top Next.js projects?",
    "Summarize Alex's tech stack",
    "Is Alex available for hire?",
  ];

  return (
    <>
      {/* Floating AI Bot Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          triggerBadgeUnlock();
        }}
        className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-xl shadow-purple-600/40 hover:scale-105 transition-all duration-200 border border-purple-400/30 flex items-center justify-center relative group"
        title="Ask Alex's AI Twin"
        aria-label="AI Assistant"
      >
        <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
        </span>
      </button>

      {/* AI Assistant Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center sm:items-end sm:justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="glass-card w-full max-w-md h-[550px] rounded-3xl overflow-hidden border border-white/10 flex flex-col shadow-2xl shadow-purple-950/80 bg-slate-950/95"
            >
              {/* Drawer Header */}
              <div className="px-5 py-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-1.5 leading-tight">
                      Alex&apos;s AI Twin <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    </h3>
                    <p className="text-[11px] text-slate-400">Powered by Live Database Knowledge</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages Buffer */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 font-bold ${
                        m.sender === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                      }`}
                    >
                      {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div
                      className={`p-3 rounded-2xl max-w-[80%] whitespace-pre-wrap ${
                        m.sender === "user"
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-9">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" /> AI Twin is thinking...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Prompts */}
              <div className="px-4 py-2 bg-slate-950/60 border-t border-white/5 flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/20 transition-colors text-left truncate max-w-full"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 bg-slate-900/90 border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything about Alex..."
                  className="flex-1 bg-transparent border-none text-white text-xs focus:outline-none placeholder:text-slate-500 px-2"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={loading || !input.trim()}
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
