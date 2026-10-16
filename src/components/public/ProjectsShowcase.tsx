"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Sparkles, X, ArrowUpRight, Code } from "lucide-react";
import { GithubIcon } from "@/components/common/SocialIcons";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string | null;
  imageUrl?: string | null;
  category: string;
  techStack: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  isHidden?: boolean;
  order?: number;
}

interface ProjectsShowcaseProps {
  projects?: Project[];
}

export const defaultProjects: Project[] = [
  {
    id: "1",
    title: "MedBriefAI",
    description: "An AI-driven clinical triage platform that accelerates consultation prep by extracting patient symptoms and lab data into structured SOAP summaries using grounded RAG search.",
    longDescription: "An AI-driven clinical triage platform that accelerates consultation prep by extracting patient symptoms and lab data into structured SOAP summaries using grounded RAG search. Features secure JWT/Bcrypt authentication and real-time medical PDF report ingestion.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    category: "AI / ML",
    techStack: ["Next.js", "RAG", "AI/LLMs", "JWT/Bcrypt", "PDF Parsing"],
    githubUrl: "https://github.com/Siddharth0317/MedBriefAI",
    liveUrl: "http://med-brief-ai-three.vercel.app/",
    featured: true,
    order: 1,
  },
  {
    id: "2",
    title: "LedgerFlow_AI",
    description: "An autonomous financial operations platform leveraging a 5-agent AI pipeline to ingest, mathematically validate, and post invoices using natural language inputs.",
    longDescription: "An autonomous financial operations platform leveraging a 5-agent AI pipeline to ingest, mathematically validate, and post invoices using natural language inputs. Built with Next.js, React Flow canvas, Gemini API, BullMQ queues, MongoDB, and live Socket.IO events.",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    category: "AI / ML",
    techStack: ["Next.js", "Node.js", "React Flow", "Gemini API", "BullMQ", "MongoDB", "Socket.IO"],
    githubUrl: "https://github.com/Siddharth0317/LedgerFlow_AI",
    liveUrl: "https://ledger-flow-ai-drab.vercel.app/",
    featured: true,
    order: 2,
  },
  {
    id: "3",
    title: "AutoHealQA",
    description: "A self-healing autonomous QA engine that instantly translates natural language Jira requirements into comprehensive, multi-browser Playwright test scripts.",
    longDescription: "A self-healing autonomous QA engine that instantly translates natural language Jira requirements into comprehensive, multi-browser Playwright test scripts with visual regression verification and dynamic selector recovery.",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    category: "Automation / QA",
    techStack: ["Playwright", "AI Neural Engine (70B)", "BDD", "Multi-Browser Automation", "Visual Regression"],
    githubUrl: "https://github.com/Siddharth0317/AutoHealQA",
    liveUrl: "https://auto-heal-qa.vercel.app/",
    featured: true,
    order: 3,
  },
  {
    id: "4",
    title: "AI Analytics Dashboard",
    description: "A full-stack, real-time analytics portal that visualizes complex data and generates automated AI-driven business insights.",
    longDescription: "A full-stack, real-time analytics portal that visualizes complex data and generates automated AI-driven business insights using Next.js, Supabase PostgreSQL, Prisma ORM, and responsive Chart.js components.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    category: "Full Stack",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Supabase", "Chart.js"],
    githubUrl: "https://github.com/Siddharth0317/ai-analytics-dashboard",
    liveUrl: "https://vercel.com/siddharth-rahanes-projects/ai-analytics-dashboard",
    featured: true,
    order: 4,
  },
  {
    id: "5",
    title: "Netguard_AI",
    description: "An interactive, AI-powered network monitoring dashboard designed to analyze traffic patterns and identify potential security threats in real-time.",
    longDescription: "An interactive, AI-powered network monitoring dashboard designed to analyze traffic patterns and identify potential security threats in real-time with machine learning models and Streamlit.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    category: "AI / ML",
    techStack: ["Python", "Streamlit", "Machine Learning", "Network Security Analysis"],
    githubUrl: "https://github.com/Siddharth0317/Netgaurd_AI",
    liveUrl: "https://netgaurd.streamlit.app/",
    featured: false,
    order: 5,
  },
  {
    id: "6",
    title: "MyPortfolio2.0",
    description: "A high-performance, interactive personal developer portfolio featuring sleek animations, responsive design, and a comprehensive showcase of full-stack system architectures.",
    longDescription: "A high-performance, interactive personal developer portfolio featuring sleek animations, responsive design, interactive CLI terminal, Gemini AI twin, and a comprehensive showcase of full-stack system architectures.",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    category: "Frontend",
    techStack: ["Next.js (App Router)", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/Siddharth0317/MyPortfolio2.0",
    liveUrl: "https://my-portfolio2-0-seven.vercel.app/",
    featured: false,
    order: 6,
  },
  {
    id: "7",
    title: "CodeCheck",
    description: "An automated development tool that analyzes source code repositories to ensure code quality, catch early-stage bugs, and seamlessly enforce best practices.",
    longDescription: "An automated development tool that analyzes source code repositories to ensure code quality, catch early-stage bugs, and seamlessly enforce best practices across continuous integration pipelines.",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    category: "Backend",
    techStack: ["Python/Node.js", "LLM Integration", "Static Code Analysis", "CI/CD"],
    githubUrl: "https://github.com/Siddharth0317/codecheck",
    liveUrl: null,
    featured: false,
    order: 7,
  },
  {
    id: "8",
    title: "AetherStore",
    description: "A cloud-native, headless e-commerce engine featuring a robust microservices architecture and a secure, automated checkout pipeline.",
    longDescription: "A cloud-native, headless e-commerce engine featuring a robust microservices architecture, PostgreSQL database, Docker containerization, and a secure automated Stripe checkout pipeline.",
    imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    category: "Full Stack",
    techStack: ["React", "Node.js", "PostgreSQL", "Tailwind CSS", "Stripe API", "Docker"],
    githubUrl: "https://github.com/Siddharth0317/AetherStore",
    liveUrl: null,
    featured: false,
    order: 8,
  },
  {
    id: "9",
    title: "Test-Automation",
    description: "A comprehensive test automation framework built to integrate with CI/CD pipelines, ensuring software reliability through resilient end-to-end testing.",
    longDescription: "A comprehensive test automation framework built to integrate with CI/CD pipelines, ensuring software reliability through resilient end-to-end testing, cross-browser validation, and automated GitHub Actions workflows.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    category: "Automation / QA",
    techStack: ["Selenium/Playwright", "PyTest/Jest", "GitHub Actions", "Automated Frameworks"],
    githubUrl: "https://github.com/Siddharth0317/Test-Automation",
    liveUrl: null,
    featured: false,
    order: 9,
  },
];

export default function ProjectsShowcase({ projects = defaultProjects }: ProjectsShowcaseProps) {
  const activeProjects = projects && projects.length > 0 ? projects : defaultProjects;
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Dynamically compute unique categories from active projects
  const uniqueCategories = Array.from(new Set(activeProjects.map((p) => p.category)));
  const categories = ["All", ...uniqueCategories];

  const filteredProjects = activeCategory === "All"
    ? activeProjects
    : activeProjects.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  const trackEvent = (id: string, action: "view" | "click") => {
    fetch(`/api/projects/${id}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    }).catch(() => {});
  };

  const handleOpenDetails = (p: Project) => {
    setSelectedProject(p);
    trackEvent(p.id, "view");
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="bg-glow-purple -top-32 right-10 animate-pulse-slow pointer-events-none" />
      <div className="bg-glow-cyan bottom-10 -left-20 animate-pulse-slow pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Featured Work
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Interactive <span className="text-indigo-500">Projects</span> Showcase
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Explore a collection of web applications, cloud systems, and open-source tooling built with modern technologies.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500"
                  : "glass-card text-slate-400 hover:text-white hover:bg-white/5 border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between border border-white/10 group"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={project.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent opacity-90" />
                    
                    {/* Category Badge */}
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-indigo-400 border border-indigo-500/30">
                      {project.category}
                    </span>

                    {project.featured && (
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/90 text-slate-300 border border-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-6 pb-6 pt-2 border-t border-white/5 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleOpenDetails(project)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group/btn"
                  >
                    View Details
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                        title="GitHub Repository"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && project.liveUrl !== "N/A" && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent(project.id, "click")}
                        className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-md shadow-indigo-600/30"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card max-w-2xl w-full rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 mb-3 inline-block">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {selectedProject.title}
                  </h3>
                </div>

                <div className="rounded-2xl overflow-hidden mb-6 h-60 w-full bg-slate-900">
                  <img
                    src={selectedProject.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4 mb-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Project Overview
                  </h4>
                  <p className="text-slate-300 text-base leading-relaxed">
                    {selectedProject.longDescription || selectedProject.description}
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 text-indigo-300 border border-indigo-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                  {selectedProject.liveUrl && selectedProject.liveUrl !== "N/A" && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent(selectedProject.id, "click")}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/30"
                    >
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                  {selectedProject.githubUrl && selectedProject.githubUrl !== "N/A" && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass-card hover:bg-white/10 border border-slate-700 text-white font-semibold text-sm transition-colors"
                    >
                      <GithubIcon className="w-4 h-4" /> Source Code
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
