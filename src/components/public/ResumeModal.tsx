"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  ExternalLink,
  FileText,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  Mail,
  Phone,
  Code,
  Layers,
  Terminal,
  Eye,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/common/SocialIcons";

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
  const [viewMode, setViewMode] = useState<"interactive" | "pdf">("interactive");

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      const evt = new CustomEvent("unlock-badge", { detail: "recruiter_vip" });
      window.dispatchEvent(evt);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const name = "Siddharth Popat Rahane";
  const title = profile?.title || "Full Stack Engineer and AI Enthusiast";
  const resumeUrl = (profile?.resumeUrl && profile.resumeUrl !== "#") ? profile.resumeUrl : "/resume.pdf";
  const hasPdfFile = true;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = `Siddharth_Rahane_Resume.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="glass-card max-w-4xl w-full rounded-3xl overflow-hidden border border-white/10 flex flex-col max-h-[92vh] shadow-2xl shadow-indigo-950/60"
        >
          {/* Header */}
          <div className="px-5 sm:px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg leading-tight">
                  {name}
                </h3>
                <p className="text-xs text-indigo-300 font-medium">{title}</p>
              </div>
            </div>

            {/* View Mode Toggle & Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-white/10 text-xs font-semibold">
                <button
                  onClick={() => setViewMode("interactive")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === "interactive"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Interactive View
                </button>
                <button
                  onClick={() => setViewMode("pdf")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === "pdf"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> PDF Document
                </button>
              </div>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
                title="Download verified resume PDF"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl glass-card hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors hidden sm:flex items-center"
                title="Open PDF directly in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={onClose}
                className="p-2 rounded-xl glass-card text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/80">
            {viewMode === "pdf" ? (
              <div className="space-y-4">
                <div className="w-full h-[70vh] rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-inner">
                  <object
                    data={`${resumeUrl}#view=FitH`}
                    type="application/pdf"
                    className="w-full h-full"
                  >
                    <iframe
                      src={`${resumeUrl}#view=FitH`}
                      className="w-full h-full border-none"
                      title={`${name} Resume`}
                    >
                      <div className="p-8 text-center text-slate-300">
                        <p className="mb-4">Your browser doesn&apos;t support direct PDF embedding.</p>
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold inline-flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" /> Open Resume in New Tab
                        </a>
                      </div>
                    </iframe>
                  </object>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => setViewMode("interactive")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold"
                  >
                    Switch to Interactive Web Resume View
                  </button>
                </div>
              </div>
            ) : (
              /* Rich Interactive Resume View */
              <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-8 bg-slate-900/80 max-w-3xl mx-auto shadow-xl">
                
                {/* Header Information */}
                <div className="border-b border-white/10 pb-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                        {name}
                      </h2>
                      <p className="text-indigo-400 font-semibold text-sm sm:text-base">
                        {title}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      <Sparkles className="w-3.5 h-3.5" /> Verified Candidate Profile
                    </div>
                  </div>

                  {/* Contact Chips */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-2">
                    <a
                      href="tel:+917666321126"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-white/5 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-indigo-400" /> +91 7666321126
                    </a>
                    <a
                      href="mailto:siddharth3172003@gmail.com"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-white/5 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-indigo-400" /> siddharth3172003@gmail.com
                    </a>
                    <a
                      href="https://github.com/Siddharth0317"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-white/5 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5 text-indigo-400" /> github.com/Siddharth0317
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-white/5 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-colors"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5 text-indigo-400" /> LinkedIn Profile
                    </a>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Professional Summary
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Full-Stack AI Engineering graduate with hands-on experience in building intelligent automation systems using Python, FastAPI, NLP, and Selenium. Developed AI-driven test automation and anomaly detection platforms with practical exposure to backend APIs, machine learning workflows, and agent-based orchestration. Strong foundation in software development, problem-solving, and scalable application design.
                  </p>
                </div>

                {/* Technical Skills Matrix */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <Code className="w-4 h-4 text-indigo-400" /> Technical Skills Matrix
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                      <span className="font-bold text-white block mb-1">Programming Languages</span>
                      <span className="text-slate-400">Python, JavaScript (ES6+), SQL, Java (Basic), DSA</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                      <span className="font-bold text-white block mb-1">Web Development</span>
                      <span className="text-slate-400">React.js, Node.js, Express.js, FastAPI, REST APIs, Streamlit</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                      <span className="font-bold text-white block mb-1">Artificial Intelligence &amp; ML</span>
                      <span className="text-slate-400">NLP, BERT, spaCy, Prompt Engineering, Agentic AI, MCP, LLM Basics</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                      <span className="font-bold text-white block mb-1">Databases &amp; Tooling</span>
                      <span className="text-slate-400">MongoDB, SQL, Pandas, NumPy, Scikit-learn, Git, Postman, Selenium</span>
                    </div>
                  </div>
                </div>

                {/* Internship Experience */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-400" /> Professional Experience
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h5 className="font-bold text-white text-sm">Full Stack Development Intern</h5>
                        <p className="text-xs text-indigo-300 font-semibold">Sumago Infotech Pvt. Ltd., Nashik</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold border border-indigo-500/20">
                        Jan 2025 – April 2025
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 leading-relaxed">
                      <li>Worked on scalable web applications using MERN stack architecture.</li>
                      <li>Developed robust backend REST APIs and improved frontend-backend integration workflows.</li>
                    </ul>
                  </div>
                </div>

                {/* Flagship Projects */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" /> Flagship Engineering Projects
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h5 className="font-bold text-white text-sm">AI-Powered Test Automation Platform</h5>
                        <span className="text-xs font-semibold text-slate-400">Sep 2025 – Mar 2026</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 leading-relaxed">
                        <li>Designed and built an AI-driven test automation platform for generating, executing, and exporting test cases from user requirements.</li>
                        <li>Implemented NLP-based action extraction for converting requirements into structured test scenarios.</li>
                        <li>Built MCP-style agent orchestration for intelligent modular workflow execution and Selenium integration for UI/API validation.</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h5 className="font-bold text-white text-sm">NetGuard AI - Anomaly Detection System</h5>
                        <span className="text-xs font-semibold text-slate-400">May 2025 – Aug 2025</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 leading-relaxed">
                        <li>Built a real-time network anomaly detection system using machine learning models.</li>
                        <li>Trained Isolation Forest model on CICIDS2017 dataset for intrusion detection.</li>
                        <li>Developed backend APIs with FastAPI and interactive dashboard using Streamlit.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-cyan-400" /> Education &amp; Academic Qualifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                      <span className="text-xs font-bold text-white block">Bachelor of Engineering</span>
                      <p className="text-[11px] text-slate-400">Amrutvahini COE (SPPU Pune)</p>
                      <p className="text-xs font-bold text-indigo-400">CGPA: 8.02 (2021 – 2026)</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                      <span className="text-xs font-bold text-white block">Higher Secondary (HSC)</span>
                      <p className="text-[11px] text-slate-400">Shramik Junior College</p>
                      <p className="text-xs font-bold text-cyan-400">Score: 83.33% (2021)</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                      <span className="text-xs font-bold text-white block">Secondary School (SSC)</span>
                      <p className="text-[11px] text-slate-400">I.E.M.S. Chandanapuri</p>
                      <p className="text-xs font-bold text-emerald-400">Score: 82.80% (2019)</p>
                    </div>
                  </div>
                </div>

                {/* Key Certifications */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" /> Certifications &amp; Accreditations
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[
                      "AWS Cloud Practitioner Essentials",
                      "Build Your Own AI Automation Platform (NxtWave)",
                      "Generative AI Mega Workshop 2.0 (NXT WAVE)",
                      "IBM Artificial Intelligence",
                      "NxtWave Python Programming and SQL",
                      "NxtWave MCP Project",
                      "TECHNORBIT Certified C++ Programmer",
                      "TECHNORBIT Certified Data Structures in C",
                    ].map((cert) => (
                      <span
                        key={cert}
                        className="px-3 py-1.5 rounded-xl bg-slate-950/80 text-amber-300 border border-amber-500/20 font-medium"
                      >
                        • {cert}
                      </span>
                    ))}
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
