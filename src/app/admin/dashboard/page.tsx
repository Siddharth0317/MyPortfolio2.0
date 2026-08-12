import Link from "next/link";
import { FolderGit2, Wrench, Award, Inbox, User, ArrowRight, ShieldCheck, EyeOff, MailCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getStats() {
  try {
    const totalProjects = await prisma.project.count();
    const hiddenProjects = await prisma.project.count({ where: { isHidden: true } });
    const totalSkills = await prisma.skill.count();
    const totalAchievements = await prisma.achievement.count();
    const totalMessages = await prisma.message.count();
    const unreadMessages = await prisma.message.count({ where: { isRead: false } });

    return { totalProjects, hiddenProjects, totalSkills, totalAchievements, totalMessages, unreadMessages };
  } catch (error) {
    return { totalProjects: 3, hiddenProjects: 0, totalSkills: 8, totalAchievements: 4, totalMessages: 0, unreadMessages: 0 };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      title: "Projects Showcase",
      value: `${stats.totalProjects} Total`,
      subtitle: `${stats.hiddenProjects} hidden from public`,
      href: "/admin/projects",
      icon: FolderGit2,
      color: "from-indigo-600/20 to-purple-600/20 text-indigo-400 border-indigo-500/30",
    },
    {
      title: "Skills Matrix",
      value: `${stats.totalSkills} Skills`,
      subtitle: "Categorized stack badges",
      href: "/admin/skills",
      icon: Wrench,
      color: "from-purple-600/20 to-pink-600/20 text-purple-400 border-purple-500/30",
    },
    {
      title: "Timeline & Certs",
      value: `${stats.totalAchievements} Milestones`,
      subtitle: "Experience & certifications",
      href: "/admin/timeline",
      icon: Award,
      color: "from-amber-600/20 to-orange-600/20 text-amber-400 border-amber-500/30",
    },
    {
      title: "Message Inbox",
      value: `${stats.totalMessages} Messages`,
      subtitle: `${stats.unreadMessages} unread inquiries`,
      href: "/admin/messages",
      icon: Inbox,
      color: "from-emerald-600/20 to-teal-600/20 text-emerald-400 border-emerald-500/30",
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} New` : undefined,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Admin Session
          </div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard Overview</h1>
          <p className="text-sm text-slate-400">Manage your developer portfolio content and review visitor communications.</p>
        </div>

        <Link
          href="/admin/projects"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 flex items-center gap-2"
        >
          + Add New Project
        </Link>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="glass-card glass-card-hover p-6 rounded-3xl border border-white/10 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-br border ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {card.badge && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {card.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                  {card.title}
                </h3>
                <div className="text-2xl font-extrabold text-slate-100 mb-1">{card.value}</div>
                <div className="text-xs text-slate-400">{card.subtitle}</div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-indigo-400">
                Manage Section
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Info Banner */}
      <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <h3 className="text-xl font-bold text-white mb-2">Live Content Management</h3>
        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed mb-6">
          All modifications made through this Admin Panel update the database immediately and revalidate the public portfolio view in real time.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/profile"
            className="px-4 py-2.5 rounded-xl glass-card hover:bg-white/10 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <User className="w-4 h-4 text-indigo-400" /> Edit Bio &amp; Resume URL
          </Link>
          <Link
            href="/admin/messages"
            className="px-4 py-2.5 rounded-xl glass-card hover:bg-white/10 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <MailCheck className="w-4 h-4 text-emerald-400" /> Check Contact Messages ({stats.unreadMessages})
          </Link>
        </div>
      </div>

    </div>
  );
}
