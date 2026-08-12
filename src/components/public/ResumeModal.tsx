"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ExternalLink, FileText, CheckCircle2, Briefcase, GraduationCap, Award, Sparkles } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: {
    name?: string;
    title?: string;
    bio?: string;
    resumeUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
  };
}

export default function ResumeModal({ isOpen, onClose, profile }: ResumeModalProps) {
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      const evt = new CustomEvent("unlock-badge", { detail: "recruiter_vip" });
      window.dispatchEvent(evt);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const name = profile?.name || "Alex Dev";
  const title = profile?.title || "Senior Full-Stack Engineer & System Architect";
  const bio = profile?.bio || "Senior Full-Stack Engineer with 6+ years of experience building high-scale web applications, microservices, and interactive developer tooling.";
  const resumeUrl = profile?.resumeUrl;

  const hasPdfFile = resumeUrl && resumeUrl !== "#" && (resumeUrl.endsWith(".pdf") || resumeUrl.includes("drive.google.com") || resumeUrl.includes("http"));

  const handleDownload = () => {
    if (hasPdfFile) {
      window.open(resumeUrl, "_blank");
    } else {
      const element = document.createElement("a");
      const file = new Blob([
        `RESUME - ${name}\nTitle: ${title}\nBio: ${bio}\nGitHub: ${profile?.githubUrl || "https://github.com"}\nLinkedIn: ${profile?.linkedinUrl || "https://linkedin.com"}`
      ], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${name.replace(/\s+/g, "_")}_Resume.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="glass-card max-w-4xl w-full rounded-3xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh] shadow-2xl shadow-indigo-950/50"
        >
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  {name} - Curated Resume
                </h3>
                <p className="text-xs text-slate-400">{title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>

              {hasPdfFile && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-xl glass-card text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-950/60">
            {hasPdfFile ? (
              <div className="w-full h-[65vh] rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
                <iframe
                  src={resumeUrl}
                  className="w-full h-full border-none"
                  title={`${name} Resume`}
                />
              </div>
            ) : (
              <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-8 bg-slate-900/60">
                <div className="border-b border-white/10 pb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/30 mb-3">
                    <Sparkles className="w-3.5 h-3.5" /> Verified Candidate Profile
                  </div>
                  <h2 className="text-3xl font-extrabold text-white">{name}</h2>
                  <p className="text-indigo-400 font-semibold text-base mb-3">{title}</p>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">{bio}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Core Strengths &amp; Competencies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Next.js App Router",
                      "TypeScript & React",
                      "Distributed Systems",
                      "PostgreSQL & Prisma",
                      "Supabase Architecture",
                      "REST & GraphQL APIs",
                      "Docker & Containerization",
                      "CI/CD & Cloud Deployment",
                    ].map((comp) => (
                      <span
                        key={comp}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-400" /> Experience Highlights
                  </h4>
                  
                  <div className="space-y-4 text-sm">
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-white">Lead Full-Stack Architect</span>
                        <span className="text-xs text-indigo-400 font-semibold">2023 - Present</span>
                      </div>
                      <div className="text-xs text-slate-400 mb-2">TechCorp Global</div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Architected modern Next.js micro-frontends, reduced API response latency by 45%, and mentored 8 engineers in React and Node.js best practices.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-white">Senior Software Engineer</span>
                        <span className="text-xs text-indigo-400 font-semibold">2021 - 2023</span>
                      </div>
                      <div className="text-xs text-slate-400 mb-2">Innovate AI Labs</div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Engineered real-time analytics web applications and streaming data dashboards with automated metrics calculation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-white text-xs mb-1">
                      <GraduationCap className="w-4 h-4 text-cyan-400" /> B.S. in Computer Science
                    </div>
                    <div className="text-[11px] text-slate-400">State University • Graduated with Honors</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-white text-xs mb-1">
                      <Award className="w-4 h-4 text-amber-400" /> AWS Certified Solutions Architect
                    </div>
                    <div className="text-[11px] text-slate-400">Amazon Web Services • Cloud System Design</div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
