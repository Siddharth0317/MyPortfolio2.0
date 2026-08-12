"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Award, Lock, CheckCircle2, Sparkles, X } from "lucide-react";

export interface VisitorBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const INITIAL_BADGES: VisitorBadge[] = [
  {
    id: "terminal_master",
    name: "Terminal Master",
    description: "Executed 3+ CLI commands in the interactive terminal.",
    icon: "⌨️",
    unlocked: false,
  },
  {
    id: "theme_explorer",
    name: "Theme Explorer",
    description: "Tested 3+ accent glow themes.",
    icon: "🎨",
    unlocked: false,
  },
  {
    id: "recruiter_special",
    name: "Recruiter Special",
    description: "Opened or downloaded candidate resume.",
    icon: "📄",
    unlocked: false,
  },
  {
    id: "ai_collaborator",
    name: "AI Collaborator",
    description: "Asked a question to Alex's AI Twin.",
    icon: "🤖",
    unlocked: false,
  },
  {
    id: "inquirer",
    name: "Inquirer",
    description: "Sent a message via the interactive contact form.",
    icon: "✉️",
    unlocked: false,
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Visited portfolio during late-night engineering hours (10 PM - 6 AM).",
    icon: "🌙",
    unlocked: false,
  },
  {
    id: "explorer_supreme",
    name: "Explorer Supreme",
    description: "Unlocked all other visitor achievements!",
    icon: "🌟",
    unlocked: false,
  },
];

export default function AchievementBadgesWidget() {
  const [badges, setBadges] = useState<VisitorBadge[]>(INITIAL_BADGES);
  const [toastBadge, setToastBadge] = useState<VisitorBadge | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check for Night Owl badge based on local time
    const currentHour = new Date().getHours();
    const isLateNight = currentHour >= 22 || currentHour < 6;

    // Load from localStorage
    const saved = localStorage.getItem("portfolio_badges");
    let unlockedIds: string[] = [];

    if (saved) {
      try {
        unlockedIds = JSON.parse(saved);
      } catch (e) {}
    }

    if (isLateNight && !unlockedIds.includes("night_owl")) {
      unlockedIds.push("night_owl");
      localStorage.setItem("portfolio_badges", JSON.stringify(unlockedIds));
    }

    let currentBadges = INITIAL_BADGES.map((b) => ({
      ...b,
      unlocked: unlockedIds.includes(b.id),
    }));

    // Check if Explorer Supreme should unlock
    const coreCount = currentBadges.filter((b) => b.id !== "explorer_supreme" && b.unlocked).length;
    if (coreCount >= 5 && !unlockedIds.includes("explorer_supreme")) {
      unlockedIds.push("explorer_supreme");
      localStorage.setItem("portfolio_badges", JSON.stringify(unlockedIds));
      currentBadges = currentBadges.map((b) => (b.id === "explorer_supreme" ? { ...b, unlocked: true } : b));
    }

    setBadges(currentBadges);

    // Event listener for badge unlocks
    const handleUnlock = (e: CustomEvent<string>) => {
      const badgeId = e.detail === "recruiter_vip" ? "recruiter_special" : e.detail;
      setBadges((prev) => {
        const target = prev.find((b) => b.id === badgeId);
        if (target && !target.unlocked) {
          const updated = prev.map((b) => (b.id === badgeId ? { ...b, unlocked: true } : b));
          const updatedUnlockedIds = updated.filter((b) => b.unlocked).map((b) => b.id);
          localStorage.setItem("portfolio_badges", JSON.stringify(updatedUnlockedIds));

          // Trigger toast
          setToastBadge(target);
          setTimeout(() => setToastBadge(null), 4500);

          return updated;
        }
        return prev;
      });
    };

    window.addEventListener("unlock-badge" as any, handleUnlock);
    return () => window.removeEventListener("unlock-badge" as any, handleUnlock);
  }, []);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <>
      {/* Floating Trophy Launcher */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full glass-card hover:bg-white/10 text-amber-400 hover:text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-950/40 transition-all duration-200 hover:scale-105 flex items-center justify-center relative group"
        title="Visitor Achievements"
        aria-label="Achievements"
      >
        <Trophy className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        {unlockedCount > 0 && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-extrabold bg-amber-500 text-slate-950 rounded-full border border-amber-300">
            {unlockedCount}
          </span>
        )}
      </button>

      {/* Unlock Toast Alert Notification */}
      <AnimatePresence>
        {toastBadge && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 right-6 z-50 glass-card p-4 rounded-2xl border border-amber-500/40 shadow-2xl shadow-amber-950/80 max-w-sm flex items-center gap-3 bg-slate-950/95"
          >
            <div className="p-3 rounded-xl bg-amber-500/20 text-2xl border border-amber-500/30">
              {toastBadge.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Sparkles className="w-3.5 h-3.5" /> Achievement Unlocked!
              </div>
              <div className="text-sm font-bold text-white leading-snug">{toastBadge.name}</div>
              <div className="text-[11px] text-slate-400">{toastBadge.description}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badges Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass-card max-w-md w-full rounded-3xl overflow-hidden border border-white/10 p-6 relative bg-slate-950/90"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Visitor Badges</h3>
                    <p className="text-xs text-slate-400">
                      {unlockedCount} of {badges.length} Unlocked
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {badges.map((b) => (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                      b.unlocked
                        ? "bg-slate-900/90 border-amber-500/30 text-white"
                        : "bg-slate-950/40 border-white/5 text-slate-500 opacity-60"
                    }`}
                  >
                    <div className="text-2xl p-2 rounded-xl bg-slate-900 border border-white/5 shrink-0">
                      {b.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-xs font-bold ${b.unlocked ? "text-white" : "text-slate-400"}`}>
                          {b.name}
                        </span>
                        {b.unlocked ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Unlocked
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-slate-500 border border-slate-800 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
