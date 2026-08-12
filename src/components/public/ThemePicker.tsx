"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, Sparkles } from "lucide-react";

export type ThemePreset = "indigo" | "emerald" | "violet" | "amber" | "ocean";

export interface ThemeOption {
  id: ThemePreset;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  badgeClass: string;
}

export const THEME_PRESETS: ThemeOption[] = [
  {
    id: "indigo",
    name: "Indigo Cyberpunk",
    primaryColor: "#6366f1",
    secondaryColor: "#a855f7",
    badgeClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
  },
  {
    id: "emerald",
    name: "Emerald Matrix",
    primaryColor: "#10b981",
    secondaryColor: "#06b6d4",
    badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
  {
    id: "violet",
    name: "Violet Neon",
    primaryColor: "#ec4899",
    secondaryColor: "#8b5cf6",
    badgeClass: "bg-pink-500/20 text-pink-300 border-pink-500/40",
  },
  {
    id: "amber",
    name: "Amber Sunset",
    primaryColor: "#f59e0b",
    secondaryColor: "#ef4444",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  {
    id: "ocean",
    name: "Ocean Deep",
    primaryColor: "#3b82f6",
    secondaryColor: "#06b6d4",
    badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  },
];

export function applyTheme(themeId: ThemePreset) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  THEME_PRESETS.forEach((t) => root.classList.remove(`theme-${t.id}`));
  root.classList.add(`theme-${themeId}`);
  localStorage.setItem("portfolio_theme", themeId);
}

export default function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<ThemePreset>("indigo");

  const triggerBadgeUnlock = () => {
    if (typeof window !== "undefined") {
      const evt = new CustomEvent("unlock-badge", { detail: "theme_explorer" });
      window.dispatchEvent(evt);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("portfolio_theme") as ThemePreset | null;
    if (saved && THEME_PRESETS.some((t) => t.id === saved)) {
      setActiveTheme(saved);
      applyTheme(saved);
    } else {
      applyTheme("indigo");
    }

    // Custom event listener for CLI theme changes
    const handleThemeEvent = (e: CustomEvent<ThemePreset>) => {
      if (e.detail) {
        setActiveTheme(e.detail);
        applyTheme(e.detail);
        triggerBadgeUnlock();
      }
    };
    window.addEventListener("portfolio-theme-change" as any, handleThemeEvent);
    return () => window.removeEventListener("portfolio-theme-change" as any, handleThemeEvent);
  }, []);

  const handleSelectTheme = (themeId: ThemePreset) => {
    setActiveTheme(themeId);
    applyTheme(themeId);
    triggerBadgeUnlock();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full glass-card hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 shadow-lg shadow-black/40 transition-all duration-200 hover:scale-105 flex items-center justify-center group"
        title="Customize Accent Glow Theme"
        aria-label="Theme picker"
      >
        <Palette className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
      </button>

      {/* Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-14 right-0 z-50 glass-card p-4 rounded-2xl border border-white/10 shadow-2xl shadow-indigo-950/60 w-64 space-y-2 bg-slate-950/90 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Accent Glow Theme
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Presets</span>
            </div>

            <div className="space-y-1.5">
              {THEME_PRESETS.map((t) => {
                const isSelected = activeTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTheme(t.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                      isSelected
                        ? "bg-slate-900 border-white/20 text-white shadow-sm"
                        : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
                          style={{ backgroundColor: t.primaryColor }}
                        />
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block opacity-75"
                          style={{ backgroundColor: t.secondaryColor }}
                        />
                      </div>
                      <span>{t.name}</span>
                    </div>

                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
