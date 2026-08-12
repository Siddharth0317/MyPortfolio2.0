import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import DataBackupManager from "@/components/admin/DataBackupManager";
import AdminNotesWidget from "@/components/admin/AdminNotesWidget";
import AdminTerminalWidget from "@/components/admin/AdminTerminalWidget";
import Link from "next/link";
import { FolderGit2, Cpu, Award, Mail, ArrowUpRight, Plus, Shield } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  const [projectCount, skillCount, achievementCount, messageCount, unreadMessageCount, projects, recentLogs] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.achievement.count(),
    prisma.message.count(),
    prisma.message.count({ where: { isRead: false } }),
    prisma.project.findMany({
      select: { id: true, title: true, category: true, views: true, clicks: true },
      orderBy: { views: "desc" },
      take: 5,
    }),
    prisma.analyticsLog.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalViews = projects.reduce((acc, p) => acc + p.views, 0);
  const totalClicks = projects.reduce((acc, p) => acc + p.clicks, 0);

  const analyticsData = {
    totalViews,
    totalClicks,
    totalMessages: messageCount,
    unreadMessages: unreadMessageCount,
    projects: projects.map((p) => ({ ...p, views: p.views || 0, clicks: p.clicks || 0 })),
    recentLogs: recentLogs.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() })),
    categoryStats: {},
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Welcome back, {session?.user?.email || "Admin"}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" /> Add Project
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass-card hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
          >
            Live Site <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Navigation Management Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Link href="/admin/projects" className="glass-card glass-card-hover p-5 rounded-2xl border border-white/10 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Projects</span>
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{projectCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Manage Showcase Items →</div>
        </Link>

        <Link href="/admin/skills" className="glass-card glass-card-hover p-5 rounded-2xl border border-white/10 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Skills</span>
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{skillCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Manage Tech Matrix →</div>
        </Link>

        <Link href="/admin/timeline" className="glass-card glass-card-hover p-5 rounded-2xl border border-white/10 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Certificates</span>
            <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{achievementCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Manage Timeline →</div>
        </Link>

        <Link href="/admin/messages" className="glass-card glass-card-hover p-5 rounded-2xl border border-white/10 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Inbox</span>
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-extrabold text-white">{messageCount}</div>
            {unreadMessageCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {unreadMessageCount} new
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">View Messages →</div>
        </Link>
      </div>

      {/* Analytics Insights Charts Section */}
      <AnalyticsCharts data={analyticsData} />

      {/* Admin Power Command Terminal */}
      <AdminTerminalWidget />

      {/* Admin Quick Notes & To-Do Scratchpad */}
      <AdminNotesWidget />

      {/* 1-Click Data Backup & Restore Section */}
      <DataBackupManager />
    </div>
  );
}
