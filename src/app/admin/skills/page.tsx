"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Wrench, X, Check, ArrowUp, ArrowDown, Eye, EyeOff, Layers, ArrowLeft, ArrowRight } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  iconName?: string | null;
  proficiency: number;
  level?: string | null;
  isHidden?: boolean;
  order: number;
}

interface SkillCategory {
  id?: string;
  name: string;
  order: number;
  isHidden?: boolean;
}

const DEFAULT_CATEGORIES = [
  "Programming Languages",
  "CS Fundamentals",
  "AI Automations",
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Tools",
];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categoriesList, setCategoriesList] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Programming Languages",
    proficiency: "85",
    levelMode: "rating" as "rating" | "level",
    level: "",
    isHidden: false,
    order: "0",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [skillsRes, catRes] = await Promise.all([
        fetch(`/api/skills?all=true&t=${Date.now()}`, { cache: "no-store" }),
        fetch(`/api/skill-categories?t=${Date.now()}`, { cache: "no-store" }),
      ]);

      const skillsData = await skillsRes.json();
      const catData = await catRes.json();

      if (Array.isArray(skillsData)) setSkills(skillsData);
      if (Array.isArray(catData)) setCategoriesList(catData);
    } catch (err) {
      console.error("Failed to fetch skills/categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Category Section Reordering
  const handleReorderCategory = async (catIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? catIndex - 1 : catIndex + 1;
    if (targetIndex < 0 || targetIndex >= categoriesList.length) return;

    const updated = [...categoriesList];
    const temp = updated[catIndex];
    updated[catIndex] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reorderedItems = updated.map((c, idx) => ({ name: c.name, order: idx + 1 }));
    setCategoriesList(updated.map((c, idx) => ({ ...c, order: idx + 1 })));

    try {
      await fetch("/api/skill-categories/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: reorderedItems }),
      });
    } catch (err) {
      console.error("Failed to reorder categories:", err);
      fetchData();
    }
  };

  // Skill Item Reordering within Category
  const handleReorder = async (category: string, index: number, direction: "up" | "down") => {
    const categorySkills = skills.filter((s) => s.category === category);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categorySkills.length) return;

    const temp = categorySkills[index];
    categorySkills[index] = categorySkills[targetIndex];
    categorySkills[targetIndex] = temp;

    const updatedItems = categorySkills.map((s, idx) => ({ id: s.id, order: idx + 1 }));

    const updatedSkills = skills.map((s) => {
      const match = updatedItems.find((u) => u.id === s.id);
      return match ? { ...s, order: match.order } : s;
    });
    setSkills(updatedSkills);

    try {
      await fetch("/api/skills/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems }),
      });
    } catch (err) {
      console.error("Failed to reorder skills:", err);
      fetchData();
    }
  };

  const handleToggleHideSkill = async (s: Skill) => {
    try {
      const updated = !s.isHidden;
      const res = await fetch(`/api/skills/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: updated }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Failed to toggle skill visibility:", err);
    }
  };

  const handleToggleCategoryHide = async (category: string, hide: boolean) => {
    const categorySkills = skills.filter((s) => s.category === category);
    try {
      await Promise.all(
        categorySkills.map((s) =>
          fetch(`/api/skills/${s.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isHidden: hide }),
          })
        )
      );
      fetchData();
    } catch (err) {
      console.error("Failed to toggle category visibility:", err);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Delete this skill from matrix?")) return;
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Failed to delete skill:", err);
    }
  };

  const handleOpenAddModal = (catName?: string | any) => {
    const selectedCat = typeof catName === "string" ? catName : (categoriesList[0]?.name || "Programming Languages");
    setEditingSkill(null);
    setFormData({
      name: "",
      category: selectedCat,
      proficiency: "85",
      levelMode: "rating",
      level: "",
      isHidden: false,
      order: (skills.length + 1).toString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (s: Skill) => {
    setEditingSkill(s);
    setFormData({
      name: s.name,
      category: s.category,
      proficiency: s.proficiency.toString(),
      levelMode: s.level && s.level.trim() !== "" ? "level" : "rating",
      level: s.level || "",
      order: s.order.toString(),
      isHidden: Boolean(s.isHidden),
    });
    setIsModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingSkill ? `/api/skills/${editingSkill.id}` : "/api/skills";
      const method = editingSkill ? "PUT" : "POST";

      const payload = {
        name: formData.name,
        category: formData.category,
        proficiency: parseInt(formData.proficiency) || 80,
        level: formData.levelMode === "level" ? formData.level.trim() : null,
        isHidden: formData.isHidden,
        order: parseInt(formData.order) || 0,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to save skill:", err);
    } finally {
      setSaving(false);
    }
  };

  // Determine ordered category list
  const categoryNamesOrdered = categoriesList.length > 0
    ? categoriesList.map((c) => c.name)
    : DEFAULT_CATEGORIES;

  // Add any unexpected category names from skills that aren't in categoryNamesOrdered
  const allCategoryNames = Array.from(new Set([...categoryNamesOrdered, ...skills.map((s) => s.category)]));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Skills Matrix &amp; Section Order Manager</h1>
          <p className="text-sm text-slate-400">Reorder category sections (1st, 2nd, 3rd), set proficiency rating % or handwritten levels, and control visibility.</p>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> Loading skills &amp; sections...
        </div>
      ) : skills.length === 0 && allCategoryNames.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center text-slate-400 border border-white/10">
          No skills added yet. Click &quot;Add Skill&quot; to populate your tech matrix.
        </div>
      ) : (
        <div className="space-y-8">
          {allCategoryNames.map((cat, catIdx) => {
            const categorySkills = skills.filter((s) => s.category === cat);
            const isAllHidden = categorySkills.length > 0 && categorySkills.every((s) => s.isHidden);
            return (
              <div key={cat} className="glass-card p-6 rounded-3xl border border-white/10 relative group">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
                  
                  {/* Category Title & Section Reorder Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                      <button
                        disabled={catIdx === 0}
                        onClick={() => handleReorderCategory(catIdx, "up")}
                        className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-800 transition-colors"
                        title="Move Category Section Up"
                      >
                        <ArrowUp className="w-4 h-4 text-indigo-400" />
                      </button>
                      <button
                        disabled={catIdx === allCategoryNames.length - 1}
                        onClick={() => handleReorderCategory(catIdx, "down")}
                        className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-800 transition-colors"
                        title="Move Category Section Down"
                      >
                        <ArrowDown className="w-4 h-4 text-indigo-400" />
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-indigo-400" /> {cat}
                      <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                        {categorySkills.length} skills
                      </span>
                      {isAllHidden && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          Section Hidden
                        </span>
                      )}
                    </h3>
                  </div>

                  {/* Section Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleCategoryHide(cat, !isAllHidden)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold glass-card hover:bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1.5 transition-colors"
                    >
                      {isAllHidden ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-400" /> Show Section
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-rose-400" /> Hide Section
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {categorySkills.length === 0 ? (
                    <div className="col-span-full py-6 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2 bg-slate-950/40 rounded-2xl border border-dashed border-white/10">
                      <span>No skills added to {cat} section yet.</span>
                      <button
                        onClick={() => handleOpenAddModal(cat)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add {cat} Skill
                      </button>
                    </div>
                  ) : (
                    categorySkills.map((s, index) => (
                      <div
                        key={s.id}
                        className="glass-card p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3 hover:border-indigo-500/30 transition-colors"
                      >
                        {/* Reorder Arrows */}
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button
                            disabled={index === 0}
                            onClick={() => handleReorder(cat, index, "up")}
                            className="p-0.5 rounded bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={index === categorySkills.length - 1}
                            onClick={() => handleReorder(cat, index, "down")}
                            className="p-0.5 rounded bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-white text-sm truncate">{s.name}</span>
                            {s.level && s.level.trim() !== "" ? (
                              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">{s.level}</span>
                            ) : (
                              <span className="text-xs font-bold text-indigo-400">{s.proficiency}%</span>
                            )}
                          </div>
                          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${s.level && s.level.trim() !== "" ? "bg-cyan-500" : "bg-indigo-500"} rounded-full`}
                              style={{ width: `${s.proficiency || 85}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleToggleHideSkill(s)}
                            className={`p-1.5 rounded-lg transition-colors ${s.isHidden ? "text-rose-400 bg-rose-500/10 hover:bg-rose-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                            title={s.isHidden ? "Unhide Skill" : "Hide Skill"}
                          >
                            {s.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(s)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(s.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-md w-full rounded-3xl border border-white/10 p-6 sm:p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-white mb-6">
              {editingSkill ? "Edit Skill" : "Add New Skill"}
            </h2>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  placeholder="React / PostgreSQL / Docker"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-slate-900 text-white"
                >
                  {allCategoryNames.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Display Mode Selection: Rating % vs Handwritten Level */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Proficiency Display Format</label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 mb-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, levelMode: "rating" })}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      formData.levelMode === "rating"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Numeric % Rating
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, levelMode: "level" })}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      formData.levelMode === "level"
                        ? "bg-cyan-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Handwritten Level
                  </button>
                </div>

                {formData.levelMode === "rating" ? (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-300">Proficiency Rating</label>
                      <span className="text-xs font-bold text-indigo-400">{formData.proficiency}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={formData.proficiency}
                      onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Handwritten Level *</label>
                    <input
                      type="text"
                      required={formData.levelMode === "level"}
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                      placeholder="e.g. Advanced / Expert / Production-Ready / Hands-On"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Type any custom level text you want displayed on your portfolio badge.</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="isHidden"
                  checked={formData.isHidden}
                  onChange={(e) => setFormData({ ...formData, isHidden: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="isHidden" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  Hide from public website portfolio
                </label>
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
                  {editingSkill ? "Save Skill" : "Add Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
