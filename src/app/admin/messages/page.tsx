"use client";

import { useState, useEffect } from "react";
import { Inbox, Mail, MailOpen, Trash2, Loader2, CheckCircle2, Clock, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msg: Message) => {
    try {
      const res = await fetch(`/api/messages/${msg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !msg.isRead }),
      });
      if (res.ok) fetchMessages();
    } catch (err) {
      console.error("Failed to toggle read status:", err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this contact message?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSelectedMessage(null);
        fetchMessages();
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const openMessageDetail = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      handleToggleRead(msg);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold text-white">Contact Message Inbox</h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400">View and respond to inquiries submitted through your public portfolio contact form.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> Loading inbox messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center text-slate-400 border border-white/10">
          <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          No messages received yet. Visitor contact form submissions will appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => openMessageDetail(msg)}
              className={`glass-card p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                msg.isRead
                  ? "border-white/5 opacity-75 hover:opacity-100"
                  : "border-indigo-500/40 bg-indigo-950/20 shadow-lg shadow-indigo-950/20"
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`p-2.5 rounded-xl shrink-0 ${msg.isRead ? "bg-slate-900 text-slate-500" : "bg-indigo-600 text-white"}`}>
                  {msg.isRead ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-white text-sm truncate">{msg.name}</span>
                    <span className="text-xs text-indigo-400 truncate">({msg.email})</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-300 truncate mb-1">
                    {msg.subject || "No Subject"}
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-xl">{msg.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[11px] text-slate-500 hidden sm:inline-block">
                  {formatDate(msg.createdAt)}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMessage(msg.id);
                  }}
                  className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-lg w-full rounded-3xl border border-white/10 p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-semibold text-indigo-400 block mb-1">
                {formatDate(selectedMessage.createdAt)}
              </span>
              <h3 className="text-xl font-bold text-white mb-1">
                {selectedMessage.subject || "No Subject"}
              </h3>
              <div className="text-sm font-medium text-slate-300">
                From: <span className="text-white font-bold">{selectedMessage.name}</span> &lt;{selectedMessage.email}&gt;
              </div>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap mb-6 max-h-60 overflow-y-auto">
              {selectedMessage.message}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" /> Reply via Email
              </a>

              <button
                onClick={() => handleDeleteMessage(selectedMessage.id)}
                className="px-4 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold transition-colors"
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
