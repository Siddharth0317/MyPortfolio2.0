"use client";

import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Link as LinkIcon, X, CheckCircle2, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUploader({
  value = "",
  onChange,
  label = "Cover Image",
  placeholder = "https://images.unsplash.com/photo-...",
}: ImageUploaderProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please drop an image file (PNG, JPG, WebP, SVG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === "upload" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Drag &amp; Drop
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === "url" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            URL Input
          </button>
        </div>
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Current Preview Banner */}
      {value && (
        <div className="relative rounded-2xl overflow-hidden h-40 w-full border border-white/10 group bg-slate-900 mb-2">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1 shadow-lg"
            >
              <X className="w-4 h-4" /> Remove Image
            </button>
          </div>
          <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Image Active
          </span>
        </div>
      )}

      {/* Drag & Drop Input Mode */}
      {mode === "upload" ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? "border-indigo-500 bg-indigo-500/10"
              : "border-slate-800 hover:border-indigo-500/50 bg-slate-900/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-white">Click or drag image file here</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Supports PNG, JPG, WebP, SVG up to 5MB</p>
            </div>
          </div>
        </div>
      ) : (
        /* URL Input Mode */
        <div className="relative">
          <LinkIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs"
          />
        </div>
      )}
    </div>
  );
}
