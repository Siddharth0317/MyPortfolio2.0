"use client";

import { motion } from "framer-motion";
import { Briefcase, Award, GraduationCap, Calendar, ExternalLink } from "lucide-react";

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

const defaultAchievements: Achievement[] = [
  {
    id: "1",
    title: "Lead Full-Stack Architect",
    issuer: "TechCorp Global",
    date: "2023 - Present",
    description: "Spearheaded cloud architecture migration, reduced API response latency by 45%, and mentored 8 engineers across React and Node.js microservices.",
    category: "Experience",
  },
  {
    id: "2",
    title: "Senior Software Engineer",
    issuer: "Innovate AI Labs",
    date: "2021 - 2023",
    description: "Engineered scalable web interfaces and real-time inference processing systems for enterprise AI applications.",
    category: "Experience",
  },
  {
    id: "3",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    description: "Validation of expertise in designing distributed AWS systems, serverless architectures, and cloud security best practices.",
    certificateUrl: "https://aws.amazon.com",
    category: "Certification",
  },
  {
    id: "4",
    title: "B.S. in Computer Science",
    issuer: "State University",
    date: "2017 - 2021",
    description: "Graduated with Honors. Specialized in Software Systems, Algorithms, and Database Management.",
    category: "Education",
  },
];

export default function Timeline({ achievements = defaultAchievements }: TimelineProps) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Career <span className="text-indigo-500">&amp;</span> Achievements Timeline
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            A chronological timeline of professional experience, key milestones, and verified technical certifications.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-32 space-y-12">
          {achievements.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative pl-8 sm:pl-10"
            >
              {/* Timeline Icon Marker */}
              <div className="absolute -left-[17px] top-1.5 p-2 rounded-full glass-card border border-white/10 bg-slate-900 shadow-md shadow-indigo-950/50">
                {getCategoryIcon(item.category)}
              </div>

              {/* Date Marker for Larger Displays */}
              <div className="hidden sm:block absolute -left-36 top-2 text-right w-28 text-xs font-semibold text-slate-400 flex items-center justify-end gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {item.date}
              </div>

              {/* Content Card */}
              <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all duration-200">
                
                {/* Date for Mobile */}
                <div className="sm:hidden flex items-center gap-1 text-xs font-semibold text-indigo-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date}
                </div>

                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    <div className="text-sm font-semibold text-slate-300">
                      {item.issuer}
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryBadgeClass(item.category)}`}>
                    {item.category}
                  </span>
                </div>

                {item.description && (
                  <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {item.certificateUrl && (
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <a
                      href={item.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      View Verified Credential <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
