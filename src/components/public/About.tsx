"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Server, Database, Cpu, Wrench, CheckCircle2, Award, Zap, Layers } from "lucide-react";

interface Skill {
  id?: string;
  name: string;
  category: string;
  iconName?: string;
  proficiency: number;
}

interface AboutProps {
  bio?: string;
  skills?: Skill[];
  yearsExperience?: string;
  codeQuality?: string;
  customProjectsCount?: string;
  customCertsCount?: string;
  totalProjectsInDb?: number;
  totalCertsInDb?: number;
}

const defaultSkills: Skill[] = [
  { name: "TypeScript", category: "Frontend", proficiency: 95 },
  { name: "Next.js (App Router)", category: "Frontend", proficiency: 95 },
  { name: "React", category: "Frontend", proficiency: 92 },
  { name: "Tailwind CSS", category: "Frontend", proficiency: 95 },
  { name: "Node.js & Express", category: "Backend", proficiency: 90 },
  { name: "REST & GraphQL APIs", category: "Backend", proficiency: 88 },
  { name: "PostgreSQL & Prisma", category: "Database", proficiency: 88 },
  { name: "Supabase", category: "Database", proficiency: 90 },
  { name: "Redis Caching", category: "Database", proficiency: 80 },
  { name: "Docker & Containers", category: "DevOps", proficiency: 85 },
  { name: "AWS & Cloud Infrastructure", category: "DevOps", proficiency: 82 },
  { name: "Git & CI/CD Pipelines", category: "DevOps", proficiency: 90 },
];

export default function About({
  bio,
  skills = defaultSkills,
  yearsExperience = "6+",
  codeQuality = "99%",
  customProjectsCount,
  customCertsCount,
  totalProjectsInDb,
  totalCertsInDb,
}: AboutProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Frontend", "Backend", "Database", "DevOps"];

  const filteredSkills = selectedCategory === "All"
    ? skills
    : skills.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "frontend": return <Code2 className="w-4 h-4 text-indigo-400" />;
      case "backend": return <Server className="w-4 h-4 text-purple-400" />;
      case "database": return <Database className="w-4 h-4 text-cyan-400" />;
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
    { label: "Years Experience", value: yearsExperience || "6+", icon: <Zap className="w-5 h-5 text-indigo-400" /> },
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

        {/* Skills Filter Tabs */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
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
              transition={{ duration: 0.3, delay: idx * 0.05 }}
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
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                  {skill.proficiency}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
