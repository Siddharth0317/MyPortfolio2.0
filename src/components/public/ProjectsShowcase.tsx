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

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "AI-Powered Analytics Dashboard",
    description: "Real-time analytics portal with custom chart visualizer and automated AI insights generation.",
    longDescription: "A high-performance analytics dashboard built for enterprise data exploration. Integrates real-time WebSocket streams, custom chart canvas rendering, and AI metric summaries.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    category: "Full Stack",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Supabase", "Chart.js"],
    githubUrl: "https://github.com/example/analytics-dashboard",
    liveUrl: "https://analytics-demo.example.com",
    featured: true,
  },
  {
    id: "2",
    title: "Cloud Native E-Commerce Engine",
    description: "Headless e-commerce platform with microservices architecture and automated stripe checkout flow.",
    longDescription: "Scalable headless commerce solution with sub-second page loads, automated inventory synchronization, multi-currency support, and Stripe payments integration.",
    imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    category: "Full Stack",
    techStack: ["React", "Node.js", "PostgreSQL", "Tailwind CSS", "Stripe API", "Docker"],
    githubUrl: "https://github.com/example/ecommerce-engine",
    liveUrl: "https://store-demo.example.com",
    featured: true,
  },
  {
    id: "3",
    title: "Developer Documentation & CLI Hub",
    description: "Sleek MDX documentation engine with instant search, interactive code runner, and CLI tooling.",
    longDescription: "Documentation framework featuring Algolia instant search, syntax highlighting, multi-tab code snippets, and automated API doc generation from OpenAPI schemas.",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    category: "Frontend",
    techStack: ["Next.js", "MDX", "Tailwind CSS", "Framer Motion", "Algolia"],
    githubUrl: "https://github.com/example/doc-hub",
    liveUrl: "https://docs-demo.example.com",
    featured: false,
  },
];

export default function ProjectsShowcase({ projects = defaultProjects }: ProjectsShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ["All", "Full Stack", "Frontend", "Backend", "AI / ML"];

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
                    onClick={() => setSelectedProject(project)}
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
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
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
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/30"
                    >
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                  {selectedProject.githubUrl && (
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
