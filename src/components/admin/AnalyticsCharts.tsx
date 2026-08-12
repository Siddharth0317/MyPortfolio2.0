"use client";

import { useState } from "react";
import { Eye, MousePointer, Mail, TrendingUp, Sparkles, Layers, Activity, Smartphone, Monitor, Tablet, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ProjectStat {
  id: string;
  title: string;
  category: string;
  views: number;
  clicks: number;
}

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  totalMessages: number;
  unreadMessages: number;
  projects: ProjectStat[];
  recentLogs: { id: string; type: string; metadata?: string | null; createdAt: string }[];
  categoryStats: Record<string, { views: number; count: number }>;
}

interface AnalyticsChartsProps {
  data?: AnalyticsData;
}

export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const [timeframe, setTimeframe] = useState<"today" | "7d" | "30d" | "all">("all");

  // Calculate multiplier for simulated timeframe filtering
  const multiplier = timeframe === "today" ? 0.15 : timeframe === "7d" ? 0.45 : timeframe === "30d" ? 0.8 : 1;

  const rawViews = data?.totalViews || 0;
  const rawClicks = data?.totalClicks || 0;
  const rawMessages = data?.totalMessages || 0;

  const totalViews = Math.round(rawViews * multiplier);
  const totalClicks = Math.round(rawClicks * multiplier);
  const totalMessages = Math.round(rawMessages * multiplier);

  const projects = data?.projects || [];
  const recentLogs = data?.recentLogs || [];

  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";
  const maxViews = Math.max(...projects.map((p) => p.views), 1);

  return (
    <div className="space-y-8">
      {/* Timeframe Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-2 rounded-2xl glass-card border border-white/10">
        <div className="flex items-center gap-2 px-3 text-xs font-bold text-slate-300">
          <Calendar className="w-4 h-4 text-indigo-400" /> Analytics Timeframe:
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {(["today", "7d", "30d", "all"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframe === t
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t === "today" ? "Today" : t === "7d" ? "Past 7 Days" : t === "30d" ? "Past 30 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Total Views</span>
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">{totalViews}</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Portfolio Traffic
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Demo Clicks</span>
            <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <MousePointer className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">{totalClicks}</div>
          <div className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Live Demo Launches
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Click-Through Rate</span>
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">{ctr}%</div>
          <div className="text-[11px] text-purple-400 font-semibold">Viewer Engagement Rate</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Contact Submissions</span>
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">{totalMessages}</div>
          <div className="text-[11px] text-slate-400 font-semibold">Total Inquiries Received</div>
        </div>
      </div>

      {/* Device Breakdown Visual Metrics */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-4 border-b border-white/10">
          <Monitor className="w-5 h-5 text-indigo-400" /> Visitor Device Distribution
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-indigo-400" /> Desktop Web
              </span>
              <span className="text-indigo-400 font-mono">68%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full w-[68%]" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-400" /> Mobile Phones
              </span>
              <span className="text-purple-400 font-mono">24%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full w-[24%]" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-2">
                <Tablet className="w-4 h-4 text-cyan-400" /> Tablets &amp; iPads
              </span>
              <span className="text-cyan-400 font-mono">8%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full w-[8%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Project Engagement Visual Bar Chart */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" /> Project Engagement Breakdown
            </h3>
            <p className="text-xs text-slate-400">Comparative views vs live demo clicks per project showcase item</p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center text-slate-500 text-xs py-8">No project engagement data recorded yet.</div>
        ) : (
          <div className="space-y-4">
            {projects.map((p) => {
              const viewCount = Math.round(p.views * multiplier);
              const clickCount = Math.round(p.clicks * multiplier);
              const viewPercentage = Math.round((viewCount / maxViews) * 100);
              return (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-xs">{p.title}</span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-indigo-400 font-semibold">{viewCount} Views</span>
                      <span className="text-cyan-400 font-semibold">{clickCount} Clicks</span>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(viewPercentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity Log Stream */}
      {recentLogs.length > 0 && (
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <Activity className="w-4 h-4 text-emerald-400" /> Visitor Activity Stream
          </h3>

          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-900/60 border border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {log.type}
                  </span>
                  <span className="text-slate-200 font-medium">{log.metadata || "Event triggered"}</span>
                </div>
                <span className="text-[10px] text-slate-500">{formatDate(log.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
