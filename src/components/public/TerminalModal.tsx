"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, Minimize2, Maximize2, Sparkles, CornerDownLeft } from "lucide-react";
import { ThemePreset, THEME_PRESETS } from "@/components/public/ThemePicker";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResume?: () => void;
  profile?: {
    name?: string;
    title?: string;
    bio?: string;
  };
}

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
}

export default function TerminalModal({ isOpen, onClose, onOpenResume, profile }: TerminalModalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: "init",
      command: "welcome",
      output: (
        <div className="space-y-1 text-xs text-slate-300">
          <p className="text-indigo-400 font-bold">Welcome to Alex.dev Interactive Terminal v1.0.4</p>
          <p className="text-slate-400">Type <span className="text-emerald-400 font-semibold">&apos;help&apos;</span> to see all available commands, or <span className="text-emerald-400 font-semibold">&apos;theme [name]&apos;</span> to switch glow presets.</p>
        </div>
      ),
    },
  ]);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isExpanded, setIsExpanded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const triggerBadgeUnlock = () => {
    if (typeof window !== "undefined") {
      const evt = new CustomEvent("unlock-badge", { detail: "terminal_master" });
      window.dispatchEvent(evt);
    }
  };

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    triggerBadgeUnlock();

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.toLowerCase().split(" ");
    const mainCmd = parts[0];
    const flag = parts[1];

    let output: React.ReactNode = null;

    switch (mainCmd) {
      case "help":
      case "commands":
        output = (
          <div className="space-y-1.5 text-xs">
            <p className="text-indigo-400 font-bold mb-2">Available Terminal Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-slate-300">
              <div><span className="text-emerald-400 font-bold">about</span> / <span className="text-emerald-400 font-bold">bio</span> : Developer overview</div>
              <div><span className="text-emerald-400 font-bold">skills</span> : Tech stack matrix &amp; proficiencies</div>
              <div><span className="text-emerald-400 font-bold">projects</span> : List all showcase projects</div>
              <div><span className="text-emerald-400 font-bold">projects --featured</span> : List only featured work</div>
              <div><span className="text-emerald-400 font-bold">timeline</span> / <span className="text-emerald-400 font-bold">exp</span> : Career &amp; cert milestones</div>
              <div><span className="text-emerald-400 font-bold">resume</span> : Open in-page PDF Resume viewer</div>
              <div><span className="text-emerald-400 font-bold">theme [indigo|emerald|violet|amber|ocean]</span> : Accent glow theme</div>
              <div><span className="text-emerald-400 font-bold">contact</span> : Contact form info &amp; scroll</div>
              <div><span className="text-emerald-400 font-bold">whoami</span> : Print visitor session data</div>
              <div><span className="text-emerald-400 font-bold">sudo</span> : Administrative privileges test</div>
              <div><span className="text-emerald-400 font-bold">clear</span> / <span className="text-emerald-400 font-bold">cls</span> : Clear terminal history</div>
            </div>
          </div>
        );
        break;

      case "theme":
        if (flag && (["indigo", "emerald", "violet", "amber", "ocean"] as ThemePreset[]).includes(flag as ThemePreset)) {
          const evt = new CustomEvent("portfolio-theme-change", { detail: flag });
          window.dispatchEvent(evt);
          output = (
            <div className="text-xs text-emerald-400 font-semibold">
              Switched accent glow theme to: <span className="uppercase font-bold">{flag}</span>
            </div>
          );
        } else {
          output = (
            <div className="text-xs text-slate-300 space-y-1">
              <p className="text-indigo-400 font-bold">Available Theme Presets:</p>
              {THEME_PRESETS.map((t) => (
                <p key={t.id}>
                  • <span className="text-white font-bold">{t.id}</span> — {t.name}
                </p>
              ))}
              <p className="text-slate-400 italic mt-1">Usage: <span className="text-emerald-400 font-mono">theme emerald</span></p>
            </div>
          );
        }
        break;

      case "about":
      case "bio":
        output = (
          <div className="text-xs text-slate-300 space-y-1">
            <p className="text-white font-bold">{profile?.name || "Alex Dev"} — {profile?.title || "Senior Full-Stack Engineer"}</p>
            <p className="text-slate-400">{profile?.bio || "Passionate engineer with 6+ years of experience building high-scale web apps, Next.js microservices, and interactive web tooling."}</p>
          </div>
        );
        break;

      case "skills":
        output = (
          <div className="text-xs space-y-1 text-slate-300">
            <p className="text-indigo-400 font-bold">Technical Stack Matrix:</p>
            <p><span className="text-cyan-400 font-semibold">[Frontend]</span> TypeScript, Next.js, React, Tailwind CSS, Framer Motion</p>
            <p><span className="text-purple-400 font-semibold">[Backend]</span> Node.js, Express, REST APIs, GraphQL, Microservices</p>
            <p><span className="text-amber-400 font-semibold">[Database]</span> PostgreSQL, Prisma ORM, Supabase, Redis Caching</p>
            <p><span className="text-pink-400 font-semibold">[DevOps]</span> Docker, CI/CD, AWS Cloud Architecture, Vercel</p>
          </div>
        );
        break;

      case "projects":
        if (flag === "--featured") {
          output = (
            <div className="text-xs space-y-1 text-slate-300">
              <p className="text-amber-400 font-bold">★ Featured Projects:</p>
              <p>1. <span className="text-white font-semibold">AI-Powered Analytics Dashboard</span> (Next.js, Supabase, Chart.js)</p>
              <p>2. <span className="text-white font-semibold">Cloud Native E-Commerce Engine</span> (React, Node.js, Stripe, Docker)</p>
            </div>
          );
        } else {
          output = (
            <div className="text-xs space-y-1 text-slate-300">
              <p className="text-indigo-400 font-bold">All Showcase Projects:</p>
              <p>• <span className="text-white font-semibold">AI Analytics Portal</span> — Real-time metrics &amp; AI insights</p>
              <p>• <span className="text-white font-semibold">Headless E-Commerce Engine</span> — Microservices &amp; Stripe checkout</p>
              <p>• <span className="text-white font-semibold">Developer Documentation Hub</span> — MDX &amp; Algolia search</p>
              <p className="text-slate-500 italic mt-1">Scroll to #projects on page to view full interactive grid.</p>
            </div>
          );
        }
        break;

      case "timeline":
      case "exp":
        output = (
          <div className="text-xs space-y-1 text-slate-300">
            <p className="text-indigo-400 font-bold">Career &amp; Milestone Timeline:</p>
            <p>• <span className="text-white font-semibold">Lead Architect</span> @ TechCorp Global (2023 - Present)</p>
            <p>• <span className="text-white font-semibold">Senior Software Engineer</span> @ Innovate AI Labs (2021 - 2023)</p>
            <p>• <span className="text-amber-400 font-semibold">AWS Solutions Architect</span> Certified (2023)</p>
            <p>• <span className="text-cyan-400 font-semibold">B.S. Computer Science</span> (2017 - 2021)</p>
          </div>
        );
        break;

      case "resume":
        output = (
          <div className="text-xs text-emerald-400 font-semibold">
            Opening in-page PDF Resume Preview Drawer...
          </div>
        );
        if (onOpenResume) {
          setTimeout(onOpenResume, 300);
        }
        break;

      case "contact":
        output = (
          <div className="text-xs text-slate-300">
            <p className="text-indigo-400 font-semibold">Scrolling to interactive contact section...</p>
            <p className="text-slate-400">Or email directly via the public form below.</p>
          </div>
        );
        const contactSec = document.getElementById("contact");
        if (contactSec) contactSec.scrollIntoView({ behavior: "smooth" });
        break;

      case "whoami":
        output = (
          <div className="text-xs text-slate-300 space-y-0.5">
            <p><span className="text-slate-500">Session User:</span> Visitor / Recruiter</p>
            <p><span className="text-slate-500">Execution Env:</span> Next.js App Router + V8 Web Runtime</p>
            <p><span className="text-slate-500">Timestamp:</span> {new Date().toLocaleTimeString()}</p>
          </div>
        );
        break;

      case "sudo":
        output = (
          <div className="text-xs text-rose-400 font-semibold">
            [ACCESS DENIED] User is not in the sudoers file. Log in at /admin with authorized credentials.
          </div>
        );
        break;

      case "clear":
      case "cls":
        setHistory([]);
        setInput("");
        return;

      default:
        output = (
          <div className="text-xs text-rose-400">
            Command not recognized: <span className="font-bold">{trimmed}</span>. Type <span className="text-emerald-400 underline cursor-pointer" onClick={() => executeCommand("help")}>&apos;help&apos;</span> for supported commands.
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`glass-card w-full rounded-3xl overflow-hidden border border-white/10 flex flex-col shadow-2xl shadow-indigo-950/60 font-mono transition-all duration-300 ${
            isExpanded ? "max-w-6xl h-[90vh]" : "max-w-3xl h-[600px]"
          }`}
        >
          <div className="px-4 py-3 bg-slate-950 border-b border-white/10 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center group"
                title="Close"
              >
                <X className="w-2 h-2 text-rose-950 opacity-0 group-hover:opacity-100" />
              </button>
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 transition-colors"
                title="Minimize"
              />
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors"
                title="Toggle expand"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              alex@dev-machine:~ (zsh)
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded text-slate-400 hover:text-white transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div
            className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/90 text-sm leading-relaxed"
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((log) => (
              <div key={log.id} className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-400 font-bold">alex.dev@portfolio:~$</span>
                  <span className="text-white font-medium">{log.command}</span>
                </div>
                <div className="pl-4 border-l-2 border-slate-800 py-1">{log.output}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 bg-slate-900/90 border-t border-white/10 flex items-center gap-3">
            <span className="text-xs text-emerald-400 font-bold shrink-0">alex.dev@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command ('help', 'theme emerald', 'resume')..."
              className="flex-1 bg-transparent border-none text-white text-xs font-mono focus:outline-none focus:ring-0 placeholder:text-slate-600"
            />
            <button
              onClick={() => executeCommand(input)}
              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
