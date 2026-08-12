import Link from "next/link";
import { Terminal, Shield, ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0f19] py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Copyright */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-white">Sid<span className="text-indigo-500">.dev</span></span>
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} All rights reserved. Built with Next.js, Prisma &amp; Tailwind CSS.</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <a href="#hero" className="hover:text-indigo-400 transition-colors">Home</a>
          <a href="#projects" className="hover:text-indigo-400 transition-colors">Projects</a>
          <a href="#timeline" className="hover:text-indigo-400 transition-colors">Timeline</a>
          <a href="#contact" className="hover:text-indigo-400 transition-colors">Contact</a>
          <Link href="/admin" className="hover:text-indigo-400 flex items-center gap-1 transition-colors">
            <Shield className="w-3.5 h-3.5 text-indigo-500" /> Admin
          </Link>
        </div>

        {/* Back to Top */}
        <a
          href="#hero"
          className="p-3 rounded-full glass-card hover:bg-white/10 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </a>

      </div>
    </footer>
  );
}
