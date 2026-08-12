"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Award, Briefcase, GraduationCap, Eye, EyeOff, X, Check } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string | null;
  certificateUrl?: string | null;
  category: string;
  isHidden: boolean;
  order: number;
}

export default function AdminTimelinePage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    date: "",
    description: "",
    certificateUrl: "",
    category: "Experience",
    isHidden: false,
    order: "0",
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/achievements?includeHidden=true");
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (err) {
      console.error("Failed to fetch timeline items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      issuer: "",
      date: "",
      description: "",
      certificateUrl: "",
      category: "Experience",
      isHidden: false,
      order: (items.length + 1).toString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Achievement) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      issuer: item.issuer,
      date: item.date,
      description: item.description || "",
      certificateUrl: item.certificateUrl || "",
      category: item.category,
      isHidden: item.isHidden,
      order: item.order.toString(),
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingItem ? `/api/achievements/${editingItem.id}` : "/api/achievements";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchItems();
      }
    } catch (err) {
      console.error("Failed to save achievement:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Delete this timeline milestone?")) return;
    try {
      const res = await fetch(`/api/achievements/${id}`, { method: "DELETE" });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error("Failed to delete milestone:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Timeline &amp; Achievements</h1>
          <p className="text-sm text-slate-400">Manage career experience, degree milestones, and verified certifications.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Milestone
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> Loading timeline...
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center text-slate-400 border border-white/10">
          No achievements recorded yet. Click &quot;Add Milestone&quot; to build your timeline.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`glass-card p-6 rounded-2xl border border-white/10 flex items-start justify-between gap-4 transition-all duration-200 ${
                item.isHidden ? "opacity-60 bg-slate-950/40" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">({item.date})</span>
                </div>
                <div className="text-sm font-semibold text-slate-300 mb-2">{item.issuer}</div>
                {item.description && <p className="text-xs text-slate-400 max-w-2xl">{item.description}</p>}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-lg w-full rounded-3xl border border-white/10 p-6 sm:p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-white mb-6">
              {editingItem ? "Edit Milestone" : "Add New Milestone"}
            </h2>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Title / Role *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  placeholder="Senior Full-Stack Engineer / AWS Solutions Architect"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Company / Issuer *</label>
                <input
                  type="text"
                  required
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  placeholder="TechCorp Global / Amazon Web Services"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Date / Period *</label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    placeholder="2023 - Present"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-slate-900 text-white"
                  >
                    <option value="Experience">Experience</option>
                    <option value="Certification">Certification</option>
                    <option value="Education">Education</option>
                    <option value="Award">Award</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
                  placeholder="Key responsibilities and achievements..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Credential URL (Optional)</label>
                <input
                  type="url"
                  value={formData.certificateUrl}
                  onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  placeholder="https://..."
                />
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
                  {editingItem ? "Save Milestone" : "Add Milestone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
