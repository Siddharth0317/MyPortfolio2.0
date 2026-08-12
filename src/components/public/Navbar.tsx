"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, Shield, Menu, X, Code2 } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Timeline", href: "#timeline" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav py-3 shadow-lg shadow-indigo-950/20" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <Terminal className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-400 transition-colors">
            Alex<span className="text-indigo-500">.dev</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 glass-card px-4 py-1.5 rounded-full border border-white/10">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-indigo-400 rounded-full hover:bg-white/5 transition-all duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Admin Portal Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-indigo-600/80 border border-slate-700/60 hover:border-indigo-500/50 rounded-lg transition-all duration-200 shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400 group-hover:text-white" />
            Admin Panel
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-white/10 px-4 py-5 space-y-3 mt-2 mx-4 rounded-2xl animate-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:text-indigo-400 hover:bg-white/5 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-3 border-t border-white/10">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-lg shadow-indigo-600/30"
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
