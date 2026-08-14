"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Server, Database, Cpu, Wrench, CheckCircle2, Award, Zap, Layers, Terminal, Binary, Bot, LayoutGrid, SlidersHorizontal } from "lucide-react";

interface Skill {
  id?: string;
  name: string;
  category: string;
  iconName?: string;
  proficiency: number;
  level?: string | null;
  isHidden?: boolean;
}

interface SkillCategory {
  id?: string;
  name: string;
  order: number;
}

interface AboutProps {
  bio?: string;
  skills?: Skill[];
  skillCategories?: SkillCategory[];
  yearsExperience?: string;
  codeQuality?: string;
  customProjectsCount?: string;
  customCertsCount?: string;
  totalProjectsInDb?: number;
  totalCertsInDb?: number;
}

const defaultSkills: Skill[] = [
  { name: "TypeScript", category: "Programming Languages", proficiency: 95 },
  { name: "Python", category: "Programming Languages", proficiency: 90 },
  { name: "JavaScript (ES6+)", category: "Programming Languages", proficiency: 95 },
  { name: "C++ / Systems Programming", category: "Programming Languages", proficiency: 85 },
  { name: "Data Structures & Algorithms", category: "CS Fundamentals", proficiency: 92 },
  { name: "System Design & Architecture", category: "CS Fundamentals", proficiency: 90 },
  { name: "Object-Oriented Programming (OOP)", category: "CS Fundamentals", proficiency: 95 },
  { name: "Gemini AI API & Multimodal LLMs", category: "AI Automations", proficiency: 95 },
  { name: "Autonomous AI Agents & Workflows", category: "AI Automations", proficiency: 90 },
  { name: "Next.js (App Router)", category: "Frontend", proficiency: 95 },
  { name: "React", category: "Frontend", proficiency: 92 },
  { name: "Tailwind CSS", category: "Frontend", proficiency: 95 },
  { name: "Node.js & Express", category: "Backend", proficiency: 90 },
  { name: "PostgreSQL & Prisma", category: "Database", proficiency: 88 },
  { name: "Supabase", category: "Database", proficiency: 90 },
  { name: "Docker & Containers", category: "DevOps", proficiency: 85 },
];

export default function About({
  bio,
  skills = defaultSkills,
  skillCategories = [],
  yearsExperience = "6+",
  codeQuality = "99%",
  customProjectsCount,
  customCertsCount,
  totalProjectsInDb,
  totalCertsInDb,
}: AboutProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"tabs" | "sections">("tabs");

  const activeSkills = skills.filter((s) => !s.isHidden);

  // Compute category order
  let categories: string[] = [];
  if (skillCategories && skillCategories.length > 0) {
    const sorted = [...skillCategories].sort((a, b) => a.order - b.order);
    categories = ["All", ...sorted.map((c) => c.name)];
  } else {
    categories = ["All", ...Array.from(new Set(activeSkills.map((s) => s.category)))];
  }

  const filteredSkills = selectedCategory === "All"
    ? activeSkills
    : activeSkills.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "programming languages": return <Terminal className="w-4 h-4 text-emerald-400" />;
      case "cs fundamentals": return <Binary className="w-4 h-4 text-cyan-400" />;
      case "ai automations": return <Bot className="w-4 h-4 text-amber-400" />;
      case "frontend": return <Code2 className="w-4 h-4 text-indigo-400" />;
      case "backend": return <Server className="w-4 h-4 text-purple-400" />;
      case "database": return <Database className="w-4 h-4 text-blue-400" />;
      case "devops": return <Cpu className="w-4 h-4 text-pink-400" />;
      default: return <Wrench className="w-4 h-4 text-slate-400" />;
    }
  };

  const displayProjectsCount = customProjectsCount && customProjectsCount.trim() !== ""
    ? customProjectsCount
    : (totalProjectsInDb !== undefined && totalProjectsInDb > 0 ? `${totalProjectsInDb}+` : "35+");

  const displayCertsCount = customCertsCount && customCertsCount.trim() !== ""
    ? customCertsCount
    : (totalCertsInDb !== undefined && totalCertsInDb > 0 ? `${totalCertsInDb}+` : "5+");

  const stats = [
    { label: "Hands-on Practice", value: yearsExperience || "2+ Years", icon: <Zap className="w-5 h-5 text-indigo-400" /> },
    { label: "Projects Completed", value: displayProjectsCount, icon: <Layers className="w-5 h-5 text-purple-400" /> },
    { label: "Code Quality & Tests", value: codeQuality || "99%", icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" /> },
    { label: "Certifications", value: displayCertsCount, icon: <Award className="w-5 h-5 text-amber-400" /> },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            About <span className="text-indigo-500">&amp;</span> Tech Stack
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Architecting robust full-stack software with precision engineering, clean code principles, and modern frontend aesthetics.
          </p>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-2xl text-center border border-white/5 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="inline-flex p-3 rounded-xl bg-slate-900 border border-slate-800 mb-3">
                {stat.icon}
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Bio Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="glass-card p-8 rounded-3xl mb-16 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            Engineering Philosophy
          </h3>
          <p className="text-slate-300 leading-relaxed text-base">
            {bio || "I specialize in bridging complex backend architecture with smooth, intuitive frontend interfaces. Whether designing database schemas with PostgreSQL & Prisma, optimizing Next.js server components, or animating micro-interactions with Framer Motion, I build resilient systems designed to scale gracefully."}
          </p>
        </motion.div>

        {/* Tech Stack Header & View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-400" /> Tech Matrix &amp; Proficiencies
          </h3>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode("tabs")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "tabs"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Tabs
            </button>
            <button
              onClick={() => setViewMode("sections")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "sections"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> All Sections
            </button>
          </div>
        </div>

        {viewMode === "tabs" ? (
          <div>
            {/* Sleek Non-Wrapping Horizontal Scroll Pill Bar */}
            <div className="mb-10 relative">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5 max-w-full">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      selectedCategory === cat
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500"
                        : "glass-card text-slate-400 hover:text-white hover:bg-white/5 border border-white/5"
                    }`}
                  >
                    {getCategoryIcon(cat)}
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSkills.map((skill, idx) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  viewport={{ once: true }}
                  className="glass-card p-5 rounded-2xl border border-white/5 hover:border-indigo-500/40 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        {getCategoryIcon(skill.category)}
                      </div>
                      <span className="font-semibold text-white text-sm">{skill.name}</span>
                    </div>
                    {skill.level && skill.level.trim() !== "" ? (
                      <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                        {skill.level}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                        {skill.proficiency}%
                      </span>
                    )}
                  </div>

                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        skill.level && skill.level.trim() !== ""
                          ? "bg-gradient-to-r from-cyan-500 to-emerald-500"
                          : "bg-gradient-to-r from-indigo-500 to-purple-500"
                      } rounded-full transition-all duration-500`}
                      style={{ width: `${skill.proficiency || 85}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Grouped Categorized Section Matrix View */
          <div className="space-y-8">
            {categories.filter((c) => c !== "All").map((catName) => {
              const catSkills = activeSkills.filter((s) => s.category === catName);
              if (catSkills.length === 0) return null;

              return (
                <div key={catName} className="glass-card p-6 rounded-3xl border border-white/10">
                  <h4 className="text-lg font-bold text-white mb-4 pb-2 border-b border-white/5 flex items-center gap-2">
                    {getCategoryIcon(catName)} {catName} ({catSkills.length})
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catSkills.map((skill) => (
                      <div
                        key={skill.name}
                        className="glass-card p-4 rounded-2xl border border-white/5 hover:border-indigo-500/40 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-white text-sm">{skill.name}</span>
                          {skill.level && skill.level.trim() !== "" ? (
                            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                              {skill.level}
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                              {skill.proficiency}%
                            </span>
                          )}
                        </div>

                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              skill.level && skill.level.trim() !== ""
                                ? "bg-gradient-to-r from-cyan-500 to-emerald-500"
                                : "bg-gradient-to-r from-indigo-500 to-purple-500"
                            } rounded-full`}
                            style={{ width: `${skill.proficiency || 85}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
