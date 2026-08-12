"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Search, ExternalLink, Loader2, Sparkles, X, Check } from "lucide-react";
import { GithubIcon } from "@/components/common/SocialIcons";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string | null;
  imageUrl?: string | null;
  category: string;
  techStack: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured: boolean;
  isHidden: boolean;
  order: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    imageUrl: "",
    category: "Full Stack",
    techStack: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    isHidden: false,
    order: "0",
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects?includeHidden=true");
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      longDescription: "",
      imageUrl: "",
      category: "Full Stack",
      techStack: "Next.js, TypeScript, Tailwind CSS",
      githubUrl: "",
      liveUrl: "",
      featured: false,
      isHidden: false,
      order: (projects.length + 1).toString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Project) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      description: p.description,
      longDescription: p.longDescription || "",
      imageUrl: p.imageUrl || "",
      category: p.category,
      techStack: p.techStack.join(", "),
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || "",
      featured: p.featured,
      isHidden: p.isHidden,
      order: p.order.toString(),
    });
    setIsModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      techStack: formData.techStack.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProjects();
      }
    } catch (err) {
      console.error("Failed to save project:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleHide = async (p: Project) => {
    try {
      const res = await fetch(`/api/projects/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !p.isHidden }),
      });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error("Failed to toggle hide:", err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Project Manager</h1>
          <p className="text-sm text-slate-400">Add, edit, reorder, or hide portfolio projects dynamically.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search projects by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
        />
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> Loading projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center text-slate-400 border border-white/10">
          No projects found. Click &quot;Add Project&quot; to create your first portfolio project.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className={`glass-card p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-200 ${
                p.isHidden ? "opacity-60 bg-slate-950/40" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80"}
                  alt={p.title}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white">{p.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {p.category}
                    </span>
                    {p.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Featured
                      </span>
                    )}
                    {p.isHidden && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">{p.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.techStack.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleToggleHide(p)}
                  className={`p-2 rounded-lg text-xs font-semibold border transition-colors ${
                    p.isHidden
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                      : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                  }`}
                  title={p.isHidden ? "Unhide from Public View" : "Hide from Public View"}
                >
                  {p.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleOpenEditModal(p)}
                  className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-colors"
                  title="Edit Project"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProject(p.id)}
                  className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-2xl w-full rounded-3xl border border-white/10 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-extrabold text-white mb-6">
              {editingProject ? "Edit Portfolio Project" : "Add New Portfolio Project"}
            </h2>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  placeholder="AI-Powered Analytics Portal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-slate-900 text-white"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
                  placeholder="A high-performance analytics platform..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Long Description (Detailed Overview)</label>
                <textarea
                  rows={4}
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
                  placeholder="In-depth details, architecture highlights, metrics..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Tech Stack Tags (Comma separated)</label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  placeholder="Next.js, TypeScript, Tailwind CSS, Prisma"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    placeholder="https://demo.example.com"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded accent-indigo-600"
                  />
                  Featured Project
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isHidden}
                    onChange={(e) => setFormData({ ...formData, isHidden: e.target.checked })}
                    className="w-4 h-4 rounded accent-indigo-600"
                  />
                  Hide from Public Portfolio
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl glass-card hover:bg-white/10 text-slate-300 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
