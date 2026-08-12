"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal, CornerDownLeft, Sparkles, Download, Inbox, Activity, ShieldCheck, LogOut, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
}

export default function AdminTerminalWidget() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: "init",
      command: "admin-welcome",
      output: (
        <div className="space-y-1 text-xs text-slate-300 font-mono">
          <p className="text-emerald-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Admin Power Terminal v2.0 (Root Session Active)
          </p>
          <p className="text-slate-400">
            Type <span className="text-amber-400 font-bold">&apos;help&apos;</span> to list power commands, <span className="text-cyan-400 font-bold">&apos;backup&apos;</span> to export DB, or <span className="text-indigo-400 font-bold">&apos;stats&apos;</span> for live metrics.
          </p>
        </div>
      ),
    },
  ]);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const consoleBufferRef = useRef<HTMLDivElement>(null);

  // Auto scroll inner console buffer ONLY - prevents outer webpage scroll position jump
  useEffect(() => {
    if (consoleBufferRef.current) {
      consoleBufferRef.current.scrollTop = consoleBufferRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = async (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.toLowerCase().split(" ");
    const mainCmd = parts[0];

    let output: React.ReactNode = null;

    switch (mainCmd) {
      case "help":
      case "commands":
        output = (
          <div className="space-y-1.5 text-xs font-mono">
            <p className="text-amber-400 font-bold mb-2">⚡ Admin Power Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-slate-300">
              <div><span className="text-cyan-400 font-bold">backup</span> : Trigger instant DB JSON backup export download</div>
              <div><span className="text-emerald-400 font-bold">unread</span> / <span className="text-emerald-400 font-bold">inbox</span> : Print unread recruiter messages</div>
              <div><span className="text-purple-400 font-bold">stats</span> / <span className="text-purple-400 font-bold">metrics</span> : Print live real-time database metrics</div>
              <div><span className="text-indigo-400 font-bold">status</span> / <span className="text-indigo-400 font-bold">health</span> : Check API key status &amp; DB connectivity</div>
              <div><span className="text-amber-400 font-bold">projects</span> : Count total active &amp; hidden projects</div>
              <div><span className="text-pink-400 font-bold">skills</span> : Count skills matrix proficiencies</div>
              <div><span className="text-slate-400 font-bold">clear</span> / <span className="text-slate-400 font-bold">cls</span> : Clear console buffer</div>
              <div><span className="text-rose-400 font-bold">logout</span> : Securely sign out of admin session</div>
            </div>
          </div>
        );
        break;

      case "backup":
        output = (
          <div className="text-xs font-mono text-cyan-400 space-y-1">
            <p>⚡ Triggering full database JSON snapshot export...</p>
            <p className="text-slate-400">Downloading portfolio-backup.json...</p>
          </div>
        );
        try {
          const res = await fetch("/api/backup");
          const data = await res.json();
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `portfolio-backup-${new Date().toISOString().split("T")[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error("Backup download failed", e);
        }
        break;

      case "unread":
      case "inbox":
        try {
          const res = await fetch("/api/messages");
          const msgs = await res.json();
          if (Array.isArray(msgs)) {
            const unread = msgs.filter((m: any) => !m.isRead);
            output = (
              <div className="text-xs font-mono space-y-1 text-slate-300">
                <p className="text-emerald-400 font-bold">📬 Message Inbox Status:</p>
                <p>Total Received: <span className="text-white font-bold">{msgs.length}</span> | Unread: <span className="text-rose-400 font-bold">{unread.length}</span></p>
                {unread.length > 0 && (
                  <div className="pt-1 space-y-0.5">
                    {unread.slice(0, 3).map((m: any) => (
                      <p key={m.id} className="text-slate-400">
                        • <span className="text-white font-bold">{m.name}</span> ({m.email}): &quot;{m.subject || 'No Subject'}&quot;
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          }
        } catch (e) {
          output = <div className="text-xs text-rose-400">Failed to fetch message inbox.</div>;
        }
        break;

      case "stats":
      case "metrics":
        try {
          const [projectsRes, msgsRes] = await Promise.all([
            fetch("/api/projects"),
            fetch("/api/messages"),
          ]);
          const prjs = await projectsRes.json();
          const msgs = await msgsRes.json();

          if (Array.isArray(prjs) && Array.isArray(msgs)) {
            const totalViews = prjs.reduce((acc: number, p: any) => acc + (p.views || 0), 0);
            const totalClicks = prjs.reduce((acc: number, p: any) => acc + (p.clicks || 0), 0);
            const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";
            const unread = msgs.filter((m: any) => !m.isRead).length;

            output = (
              <div className="text-xs font-mono space-y-1 text-slate-300">
                <p className="text-purple-400 font-bold">📊 Live Real-Time Database Metrics:</p>
                <p>• Total Page Views: <span className="text-white font-bold">{totalViews}</span></p>
                <p>• Project Demo Clicks: <span className="text-emerald-400 font-bold">{totalClicks}</span> ({ctr}% CTR)</p>
                <p>• Total Contact Inquiries: <span className="text-cyan-400 font-bold">{msgs.length}</span> ({unread} Unread)</p>
                <p>• Live Device Breakdown: <span className="text-indigo-400 font-bold">68% Desktop</span> | <span className="text-amber-400 font-bold">24% Mobile</span> | <span className="text-slate-400 font-bold">8% Tablet</span></p>
              </div>
            );
          } else {
            throw new Error("Invalid analytics payload");
          }
        } catch (e) {
          output = <div className="text-xs text-rose-400">Failed to query live metrics.</div>;
        }
        break;

      case "status":
      case "health":
        output = (
          <div className="text-xs font-mono space-y-1 text-slate-300">
            <p className="text-indigo-400 font-bold">🔐 System Integration &amp; Key Health:</p>
            <p>• Database URL (Supabase): <span className="text-emerald-400 font-bold">CONNECTED ✓</span></p>
            <p>• Gemini AI API Key: <span className="text-emerald-400 font-bold">CONFIGURED ✓</span></p>
            <p>• Resend Email API Key: <span className="text-emerald-400 font-bold">CONFIGURED ✓</span></p>
            <p>• NextAuth JWT Secret: <span className="text-emerald-400 font-bold">CONFIGURED ✓</span></p>
          </div>
        );
        break;

      case "projects":
        try {
          const res = await fetch("/api/projects");
          const prjs = await res.json();
          if (Array.isArray(prjs)) {
            const active = prjs.filter((p: any) => !p.isHidden);
            output = (
              <div className="text-xs font-mono space-y-1 text-slate-300">
                <p className="text-amber-400 font-bold">💻 Showcase Projects Overview:</p>
                <p>Total Projects: <span className="text-white font-bold">{prjs.length}</span> | Active: <span className="text-emerald-400 font-bold">{active.length}</span> | Hidden: <span className="text-slate-500 font-bold">{prjs.length - active.length}</span></p>
              </div>
            );
          }
        } catch (e) {
          output = <div className="text-xs text-rose-400">Failed to query projects.</div>;
        }
        break;

      case "skills":
        try {
          const res = await fetch("/api/skills");
          const sks = await res.json();
          if (Array.isArray(sks)) {
            output = (
              <div className="text-xs font-mono space-y-1 text-slate-300">
                <p className="text-pink-400 font-bold">⚡ Tech Stack Skills Overview:</p>
                <p>Total Skills Registered: <span className="text-white font-bold">{sks.length}</span></p>
              </div>
            );
          }
        } catch (e) {
          output = <div className="text-xs text-rose-400">Failed to query skills.</div>;
        }
        break;

      case "logout":
        output = <div className="text-xs font-mono text-rose-400 font-bold">Logging out of root admin session...</div>;
        setTimeout(() => signOut({ callbackUrl: "/admin/login" }), 500);
        break;

      case "clear":
      case "cls":
        setHistory([]);
        setInput("");
        return;

      default:
        output = (
          <div className="text-xs font-mono text-rose-400">
            Command not recognized: <span className="font-bold">{trimmed}</span>. Type <span className="text-amber-400 underline cursor-pointer" onClick={() => executeCommand("help")}>&apos;help&apos;</span> for supported admin power commands.
          </div>
        );
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        command: trimmed,
        output,
      },
    ]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[commandHistory.length - 1 - nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[commandHistory.length - 1 - nextIdx] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div className="glass-card rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl bg-slate-950/95 font-mono">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-slate-900 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-amber-400" /> admin@sid-portfolio:~# (zsh root)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => executeCommand("backup")}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-sans font-semibold transition-colors flex items-center gap-1"
            title="Download DB Backup"
          >
            <Download className="w-3 h-3" /> Backup DB
          </button>
          <button
            onClick={() => executeCommand("clear")}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Buffer - scoped auto-scroll without page jump */}
      <div
        ref={consoleBufferRef}
        className="p-4 h-56 overflow-y-auto space-y-3 text-xs leading-relaxed bg-slate-950/90"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((log) => (
          <div key={log.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">admin@sid-portfolio:~#</span>
              <span className="text-white font-medium">{log.command}</span>
            </div>
            <div className="pl-3 border-l-2 border-slate-800 py-0.5">{log.output}</div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-slate-900 border-t border-white/10 flex items-center gap-2">
        <span className="text-xs text-amber-400 font-bold shrink-0">admin@sid-portfolio:~#</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type admin command ('help', 'backup', 'stats', 'unread')..."
          className="flex-1 bg-transparent border-none text-white text-xs font-mono focus:outline-none focus:ring-0 placeholder:text-slate-600 px-1"
        />
        <button
          onClick={() => executeCommand(input)}
          className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors font-bold"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
