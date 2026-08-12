"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderGit2,
  Wrench,
  Award,
  Inbox,
  User,
  Key,
  ExternalLink,
  LogOut,
  Shield,
  Terminal,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Projects CRUD", href: "/admin/projects", icon: FolderGit2 },
    { label: "Skills Matrix", href: "/admin/skills", icon: Wrench },
    { label: "Timeline & Certs", href: "/admin/timeline", icon: Award },
    { label: "Message Inbox", href: "/admin/messages", icon: Inbox },
    { label: "Profile & Bio", href: "/admin/profile", icon: User },
    { label: "Security & Credentials", href: "/admin/security", icon: Key },
  ];

  return (
    <aside className="w-64 glass-card border-r border-white/10 min-h-screen p-6 flex flex-col justify-between hidden md:flex shrink-0">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white text-base">Admin Panel</span>
            <div className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold">Single User Mode</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 border-t border-white/10 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" /> View Live Site
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out Admin
        </button>
      </div>
    </aside>
  );
}
