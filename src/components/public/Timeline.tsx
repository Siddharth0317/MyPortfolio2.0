"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Award, GraduationCap, Calendar, ExternalLink, Sparkles, Code2, BookOpen } from "lucide-react";

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string | null;
  certificateUrl?: string | null;
  category: string;
  isHidden?: boolean;
  order?: number;
}

interface TimelineProps {
  achievements?: Achievement[];
}

export const defaultAchievements: Achievement[] = [
  // Cloud & AI Certifications
  {
    id: "1",
    title: "Certificate of Project Completion: Build Your Own AI Automation Platform Workshop",
    issuer: "NxtWave Academy",
    date: "12-Sep-2026",
    description: "Showcased practical skills in workflow generation, multi-agent AI systems, real-world integrations, and automation monitoring.",
    certificateUrl: "/certificates/nxtwave-ai-automation-platform.jpg",
    category: "Cloud & AI",
    order: 1,
  },
  {
    id: "2",
    title: "AWS Cloud Practitioner Essentials",
    issuer: "AWS Training & Certification",
    date: "August 16, 2025",
    description: "Foundational mastery in AWS cloud architecture, security, compute models, database systems, and global serverless infrastructure.",
    certificateUrl: "/certificates/aws-cloud-practitioner.pdf",
    category: "Cloud & AI",
    order: 2,
  },
  {
    id: "3",
    title: "Certificate of Project Completion: Generative AI Mega Workshop 2.0",
    issuer: "NXT WAVE / CCBP 4.0 Academy",
    date: "18-Sep-2024",
    description: "Built a pitch-ready product successfully using 10+ AI tools in workshop hosted by Mr Tezan Sahu (SDE II at Microsoft).",
    certificateUrl: "/certificates/nxtwave-genai-workshop.jpg",
    category: "Cloud & AI",
    order: 3,
  },
  {
    id: "4",
    title: "Certificate of Completion: NxtCode - AI-Powered Challenge: 25 Under 5",
    issuer: "NXT WAVE / CCBP 4.0 Academy",
    date: "08-Feb-2025",
    description: "Successfully achieved the 5 Day Milestone, showcasing the skills of a Modern Age Developer.",
    certificateUrl: null,
    category: "Cloud & AI",
    order: 4,
  },

  // Programming & Data Structures Certifications
  {
    id: "5",
    title: "TECHNORBIT Certified Programmer For The C++",
    issuer: "TECHNORBIT INFOSYSTEMS",
    date: "May 15, 2023",
    description: "Certified C++ Programmer with ISO 9001:2015 certification. Credential ID: TORBITSEP2022PPA1203147.",
    certificateUrl: "/certificates/technorbit-cpp.pdf",
    category: "Programming",
    order: 5,
  },
  {
    id: "6",
    title: "TECHNORBIT Certified Programmer For The Data Structure Using C",
    issuer: "TECHNORBIT INFOSYSTEMS",
    date: "February 15, 2023",
    description: "Certified Programmer for Data Structures Using C with ISO 9001:2015 certification. Credential ID: TORBITSEP2022PPA1202147.",
    certificateUrl: "/certificates/technorbit-dsa-c.pdf",
    category: "Programming",
    order: 6,
  },
  {
    id: "7",
    title: "DSA CodeVerse: Bi-Weekly Contest #16 (BEGINNER)",
    issuer: "NXT WAVE",
    date: "24-July-2025",
    description: "Achieved Rank 98, demonstrating exceptional performance and problem-solving skills in competitive algorithmic challenges.",
    certificateUrl: null,
    category: "Programming",
    order: 7,
  },

  // Masterclasses & Professional Development
  {
    id: "8",
    title: 'Masterclass: "Skills You Can\'t Ignore to get Exciting AI Jobs"',
    issuer: "NXT WAVE / CCBP 4.0 Academy",
    date: "20-Feb-2025",
    description: "Masterclass focused on strategic skills, tools, and technical roadmaps essential for high-impact AI engineering roles.",
    certificateUrl: null,
    category: "Professional Development",
    order: 8,
  },
  {
    id: "9",
    title: "Masterclass: 'The Interview Game Changer: What Employers Really Want'",
    issuer: "NXT WAVE / CCBP 4.0 Academy",
    date: "30-Oct-2024",
    description: "In-depth masterclass on cracking modern software engineering interviews, architectural storytelling, and technical evaluations.",
    certificateUrl: null,
    category: "Professional Development",
    order: 9,
  },
  {
    id: "10",
    title: "Masterclass: 'Beyond Tech: Skills that make you unstoppable'",
    issuer: "NXT WAVE / CCBP 4.0 Academy",
    date: "09-Oct-2024",
    description: "Executive session on critical thinking, agile mindset, cross-functional engineering, and career acceleration.",
    certificateUrl: null,
    category: "Professional Development",
    order: 10,
  },

  // Education Milestones
  {
    id: "11",
    title: "Skillups (NxtWave CCBP 4.0 Academy)",
    issuer: "NxtWave CCBP 4.0 Academy",
    date: "Ongoing",
    description: "Intensive ongoing specialization in Python, Full Stack Web Development (MERN), Databases, and AI skills with hands-on project and coding-based assessments.",
    certificateUrl: null,
    category: "Education",
    order: 11,
  },
  {
    id: "12",
    title: "Bachelor of Engineering (Information Technology)",
    issuer: "Amrutvahini College of Engineering, Sangamner (SPPU, Pune)",
    date: "2021 – 2026",
    description: "Specialized in Software Systems, Machine Learning Workflows, Data Structures & Algorithms, and Cloud Systems. Final CGPA: 8.02.",
    certificateUrl: null,
    category: "Education",
    order: 12,
  },
  {
    id: "13",
    title: "Higher Secondary Certificate (HSC - 12th)",
    issuer: "Shramik Junior College, Sangamner",
    date: "2021",
    description: "Completed Higher Secondary Certificate with 83.33% in Science stream with focus on Physics, Chemistry, and Mathematics.",
    certificateUrl: null,
    category: "Education",
    order: 13,
  },
  {
    id: "14",
    title: "Secondary School Certificate (SSC - 10th)",
    issuer: "I.E.M.S. Chandanapuri",
    date: "2019",
    description: "Completed Secondary School Certificate with 82.80% with strong analytical, science, and mathematics fundamentals.",
    certificateUrl: null,
    category: "Education",
    order: 14,
  },
];

export default function Timeline({ achievements = defaultAchievements }: TimelineProps) {
  const activeAchievements = achievements && achievements.length > 0 ? achievements : defaultAchievements;
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(activeAchievements.map((a) => a.category)))];

  const filteredItems = activeCategory === "All"
    ? activeAchievements
    : activeAchievements.filter((a) => a.category.toLowerCase() === activeCategory.toLowerCase());

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "cloud & ai":
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case "programming":
        return <Code2 className="w-5 h-5 text-emerald-400" />;
      case "professional development":
      case "masterclass":
        return <BookOpen className="w-5 h-5 text-purple-400" />;
      case "certification":
        return <Award className="w-5 h-5 text-amber-400" />;
      case "education":
        return <GraduationCap className="w-5 h-5 text-cyan-400" />;
      default:
        return <Briefcase className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case "cloud & ai":
        return "bg-indigo-500/10 text-indigo-300 border-indigo-500/30";
      case "programming":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      case "professional development":
      case "masterclass":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30";
      case "certification":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "education":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
      default:
        return "bg-indigo-500/10 text-indigo-300 border-indigo-500/30";
    }
  };

  return (
    <section id="timeline" className="py-24 relative overflow-hidden bg-slate-950/60">
      <div className="bg-glow-purple top-20 -left-36 animate-pulse-slow pointer-events-none" />
      <div className="bg-glow-cyan bottom-20 -right-36 animate-pulse-slow pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 mb-4">
            <Award className="w-3.5 h-3.5" /> Verified Credentials &amp; Milestones
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Certifications <span className="text-indigo-500">&amp;</span> Achievements
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Professional certifications, cloud credentials, AI workshops, and engineering milestones.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500"
                  : "glass-card text-slate-400 hover:text-white hover:bg-white/5 border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Timeline Items */}
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-32 space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id || item.title}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="relative pl-8 sm:pl-10"
              >
                {/* Timeline Icon Marker */}
                <div className="absolute -left-[17px] top-1.5 p-2 rounded-full glass-card border border-white/10 bg-slate-900 shadow-md shadow-indigo-950/50">
                  {getCategoryIcon(item.category)}
                </div>

                {/* Date Marker for Larger Displays */}
                <div className="hidden sm:flex absolute -left-36 top-2 text-right w-28 text-xs font-semibold text-slate-400 items-center justify-end gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{item.date}</span>
                </div>

                {/* Content Card */}
                <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all duration-200 group">
                  
                  {/* Date for Mobile */}
                  <div className="sm:hidden flex items-center gap-1 text-xs font-semibold text-indigo-400 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </div>

                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-[200px]">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h3>
                      <div className="text-sm font-semibold text-slate-300">
                        {item.issuer}
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${getCategoryBadgeClass(item.category)}`}>
                      {item.category}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {item.certificateUrl && item.certificateUrl !== "#" && (
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-3">
                      <a
                        href={item.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-3.5 py-1.5 rounded-lg transition-colors"
                      >
                        View Verified Credential <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
