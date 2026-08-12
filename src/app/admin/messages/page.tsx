"use client";

import { useState, useEffect } from "react";
import { Inbox, Mail, MailOpen, Trash2, Loader2, CheckCircle2, Clock, X, Send, Sparkles, FileText } from "lucide-react";
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

  // Direct Reply Drawer State
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyStatus, setReplyStatus] = useState<string | null>(null);

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
        setIsReplyOpen(false);
        fetchMessages();
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const openMessageDetail = (msg: Message) => {
    setSelectedMessage(msg);
    setIsReplyOpen(false);
    setReplyStatus(null);
    if (!msg.isRead) {
      handleToggleRead(msg);
    }
  };

  const handleOpenReplyDrawer = () => {
    if (!selectedMessage) return;
    setReplySubject(`Re: ${selectedMessage.subject || "Portfolio Inquiry"}`);
    setReplyText(`Hi ${selectedMessage.name},\n\nThank you for reaching out regarding "${selectedMessage.subject || 'your inquiry'}". I would love to connect!\n\nBest regards,\nSid`);
    setIsReplyOpen(true);
    setReplyStatus(null);
  };

  const applyTemplate = (templateType: "interview" | "resume" | "quote") => {
    if (!selectedMessage) return;
    if (templateType === "interview") {
      setReplyText(`Hi ${selectedMessage.name},\n\nThank you for reaching out! I reviewed your message regarding the engineering role. I am very interested in learning more and would love to schedule a brief introductory call this week.\n\nPlease let me know a few dates and times that work best for your team!\n\nBest regards,\nSid`);
    } else if (templateType === "resume") {
      setReplyText(`Hi ${selectedMessage.name},\n\nThank you for your interest in my background! You can view and download my full, updated technical resume here: https://sid.dev/resume.pdf\n\nFeel free to ask if you have any questions about my past experience or AI project architecture.\n\nBest regards,\nSid`);
    } else if (templateType === "quote") {
      setReplyText(`Hi ${selectedMessage.name},\n\nThank you for sharing the details of your project! I specialize in full-stack Next.js, Supabase, and cloud architecture solutions. I have reviewed your requirements and would love to discuss scope, deliverables, and timelines.\n\nLet me know when you are free for a short discovery call!\n\nBest regards,\nSid`);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage) return;
    setSendingReply(true);
    setReplyStatus(null);

    try {
      const res = await fetch("/api/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          recipientEmail: selectedMessage.email,
          recipientName: selectedMessage.name,
          subject: replySubject,
          replyText,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReplyStatus(data.message || "Reply email dispatched successfully!");
        setTimeout(() => {
          setIsReplyOpen(false);
          setSelectedMessage(null);
          fetchMessages();
        }, 1500);
      } else {
        setReplyStatus("Error: " + (data.error || "Failed to send email"));
      }
    } catch (err: any) {
      setReplyStatus("Error sending email.");
    } finally {
      setSendingReply(false);
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
          <p className="text-sm text-slate-400">View and respond directly to inquiries submitted through your public portfolio contact form.</p>
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

      {/* Message Detail & Direct Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-xl w-full rounded-3xl border border-white/10 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
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

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap mb-6 max-h-48 overflow-y-auto">
              {selectedMessage.message}
            </div>

            {!isReplyOpen ? (
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={handleOpenReplyDrawer}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Direct Email Reply
                </button>

                <button
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="px-4 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold transition-colors"
                >
                  Delete Message
                </button>
              </div>
            ) : (
              /* Inline Reply & Template Builder Drawer */
              <form onSubmit={handleSendReply} className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Pre-Saved Response Templates:
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyTemplate("interview")}
                    className="px-3 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/20"
                  >
                    📅 Schedule Interview
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate("resume")}
                    className="px-3 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/20"
                  >
                    📄 Send Resume Link
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate("quote")}
                    className="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/20"
                  >
                    💼 Consulting Quote
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Email Body Response</label>
                  <textarea
                    required
                    rows={5}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none"
                  />
                </div>

                {replyStatus && (
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                    {replyStatus}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReplyOpen(false)}
                    className="px-4 py-2 rounded-xl glass-card hover:bg-white/10 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingReply}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
                  >
                    {sendingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Send Email Response
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
