"use client";

import { useState, useEffect } from "react";
import { User, Mail, FileText, Image as ImageIcon, Check, Loader2, Zap, Layers, CheckCircle2, Award } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/common/SocialIcons";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    tagline: "",
    bio: "",
    avatarUrl: "",
    resumeUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    yearsExperience: "6+",
    codeQuality: "99%",
    customProjectsCount: "",
    customCertsCount: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data && !data.error) {
        setFormData({
          name: data.name || "",
          title: data.title || "",
          tagline: data.tagline || "",
          bio: data.bio || "",
          avatarUrl: data.avatarUrl || "",
          resumeUrl: data.resumeUrl || "",
          githubUrl: data.githubUrl || "",
          linkedinUrl: data.linkedinUrl || "",
          twitterUrl: data.twitterUrl || "",
          yearsExperience: data.yearsExperience || "6+",
          codeQuality: data.codeQuality || "99%",
          customProjectsCount: data.customProjectsCount || "",
          customCertsCount: data.customCertsCount || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("Profile & About section stats updated successfully!");
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> Loading profile info...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-3xl font-extrabold text-white">Profile &amp; Info Manager</h1>
        <p className="text-sm text-slate-400">Update your hero headline, bio, About section statistics, avatar, resume download link, and social handles.</p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium flex items-center gap-2">
          <Check className="w-4 h-4" /> {message}
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              placeholder="Alex Dev"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Headline / Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              placeholder="Senior Full-Stack Engineer & System Architect"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Subtitle Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              placeholder="Architecting scalable cloud applications, distributed systems & AI-driven digital experiences."
            />
          </div>
        </div>

        {/* Dynamic About Section Highlights Cards */}
        <div className="pt-4 border-t border-white/5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Public &quot;About&quot; Section Stat Cards
          </h3>
          <p className="text-xs text-slate-400">Customize the stat numbers shown on your public About section cards.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400" /> Hands-on Practice
              </label>
              <input
                type="text"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                placeholder="2+ Years"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Code Quality %
              </label>
              <input
                type="text"
                value={formData.codeQuality}
                onChange={(e) => setFormData({ ...formData, codeQuality: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                placeholder="99%"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" /> Projects Stat
              </label>
              <input
                type="text"
                value={formData.customProjectsCount}
                onChange={(e) => setFormData({ ...formData, customProjectsCount: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                placeholder="Auto (or e.g. 35+)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Certifications Stat
              </label>
              <input
                type="text"
                value={formData.customCertsCount}
                onChange={(e) => setFormData({ ...formData, customCertsCount: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                placeholder="Auto (or e.g. 5+)"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Hero &amp; About Bio Summary
          </label>
          <textarea
            rows={4}
            required
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm resize-none"
            placeholder="Passionate engineer with experience building web applications..."
          />
        </div>

        <ImageUploader
          value={formData.avatarUrl}
          onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
          label="Profile Avatar Image"
          placeholder="https://..."
        />

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Resume PDF Download Link / Google Drive URL
          </label>
          <input
            type="text"
            value={formData.resumeUrl}
            onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm"
            placeholder="https://drive.google.com/... or /resume.pdf"
          />
        </div>

        <div className="pt-4 border-t border-white/5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Social Profile Handles</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5" /> GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <LinkedinIcon className="w-3.5 h-3.5" /> LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <TwitterIcon className="w-3.5 h-3.5" /> Twitter URL
              </label>
              <input
                type="url"
                value={formData.twitterUrl}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-white/10">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
