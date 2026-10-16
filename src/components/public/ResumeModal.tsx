"use client";

import { useEffect, useState, useRef } from "react";
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
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Loader2,
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

function PdfCanvasViewer({
  pdfUrl,
  title,
  onSwitchToInteractive,
}: {
  pdfUrl: string;
  title: string;
  onSwitchToInteractive: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-fit scale on mount according to container width
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      if (containerWidth < 650) {
        const responsiveScale = Math.max(0.65, (containerWidth - 32) / 600);
        setScale(+responsiveScale.toFixed(2));
      } else {
        setScale(1.25);
      }
    }
  }, []);

  // 1. Load PDF.js engine and fetch document
  useEffect(() => {
    let isCancelled = false;

    const initPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Ensure window.pdfjsLib is loaded
        if (!(window as any).pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const existingScript = document.querySelector('script[data-pdfjs="true"]');
            if (existingScript) {
              if ((window as any).pdfjsLib) {
                resolve();
              } else {
                existingScript.addEventListener("load", () => resolve());
                existingScript.addEventListener("error", () => reject(new Error("Failed to load PDF script")));
              }
              return;
            }
            const script = document.createElement("script");
            script.src = "/pdfjs/pdf.min.js";
            script.dataset.pdfjs = "true";
            script.onload = () => resolve();
            script.onerror = () => {
              // CDN fallback if local asset is unreachable
              const cdnScript = document.createElement("script");
              cdnScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
              cdnScript.onload = () => resolve();
              cdnScript.onerror = () => reject(new Error("Failed to load PDF viewer engine"));
              document.head.appendChild(cdnScript);
            };
            document.head.appendChild(script);
          });
        }

        const pdfjs = (window as any).pdfjsLib;
        if (!pdfjs) throw new Error("PDF engine unavailable");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";

        const loadingTask = pdfjs.getDocument(pdfUrl);
        const doc = await loadingTask.promise;

        if (isCancelled) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages || 1);
        setPageNum(1);
      } catch (err: any) {
        if (!isCancelled) {
          console.error("PDF.js initialization error:", err);
          setError("Direct PDF visual rendering could not be loaded in your browser.");
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    initPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl]);

  // 2. Render Page on Canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let isCancelled = false;

    const render = async () => {
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {}
        }

        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const viewport = page.getViewport({ scale });
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        const renderContext = {
          canvasContext: ctx,
          viewport,
        };

        const task = page.render(renderContext);
        renderTaskRef.current = task;
        await task.promise;
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.error("PDF page render error:", err);
        }
      }
    };

    render();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
      }
    };
  }, [pdfDoc, pageNum, scale]);

  const handleZoomIn = () => setScale((s) => Math.min(2.5, +(s + 0.15).toFixed(2)));
  const handleZoomOut = () => setScale((s) => Math.max(0.6, +(s - 0.15).toFixed(2)));
  const handleResetZoom = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const fitScale = Math.min(1.4, Math.max(0.6, (containerWidth - 48) / 600));
      setScale(+fitScale.toFixed(2));
    } else {
      setScale(1.25);
    }
  };

  return (
    <div ref={containerRef} className="space-y-4 max-w-4xl mx-auto">
      {/* PDF Controls Floating Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-card bg-slate-900/90 border border-white/10 shadow-lg">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-white/5">
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.6}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-40 transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-300 px-2 min-w-[3.5rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={scale >= 2.5}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-40 transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-600/20 transition-colors ml-1"
            title="Fit to Width"
            aria-label="Fit Width"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Page navigation (if multi-page) */}
        {numPages > 1 && (
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/5 text-xs text-slate-300 font-semibold">
            <button
              onClick={() => setPageNum((p) => Math.max(1, p - 1))}
              disabled={pageNum <= 1}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-40"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {pageNum} of {numPages}
            </span>
            <button
              onClick={() => setPageNum((p) => Math.min(numPages, p + 1))}
              disabled={pageNum >= numPages}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-40"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Links */}
        <div className="flex items-center gap-2">
          <a
            href={pdfUrl}
            download="Siddharth_Rahane_Resume.pdf"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF
          </a>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card text-slate-300 hover:text-white text-xs font-semibold border border-white/10"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open in New Tab
          </a>
        </div>
      </div>

      {/* PDF Canvas View Area */}
      <div className="min-h-[500px] flex items-center justify-center p-3 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 shadow-inner overflow-x-auto">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <p className="text-xs font-semibold">Rendering verified PDF resume...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12 px-6 max-w-md space-y-4">
            <p className="text-sm text-amber-300">{error}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" /> Open Resume in New Tab
              </a>
              <button
                onClick={onSwitchToInteractive}
                className="px-4 py-2 rounded-xl glass-card text-slate-200 hover:text-white text-xs font-bold"
              >
                Switch to Interactive View
              </button>
            </div>
          </div>
        )}

        <div className={`transition-opacity duration-300 ${isLoading || error ? "hidden" : "block"}`}>
          <canvas
            ref={canvasRef}
            className="rounded-lg shadow-2xl bg-white mx-auto block max-w-full"
            style={{ display: isLoading || error ? "none" : "block" }}
          />
        </div>
      </div>

      {/* Footer Switcher */}
      <div className="text-center pt-2">
        <button
          onClick={onSwitchToInteractive}
          className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold transition-colors"
        >
          Switch to Interactive Web Resume View
        </button>
      </div>
    </div>
  );
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
              <PdfCanvasViewer
                pdfUrl={resumeUrl}
                title={`${name} Resume`}
                onSwitchToInteractive={() => setViewMode("interactive")}
              />
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
                      href={profile?.githubUrl || "https://github.com/Siddharth0317"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-white/5 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5 text-indigo-400" /> github.com/Siddharth0317
                    </a>
                    <a
                      href={profile?.linkedinUrl || "https://www.linkedin.com/in/siddharth-031s"}
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
