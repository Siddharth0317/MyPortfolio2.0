"use client";

import { useState, useRef } from "react";
import { Download, UploadCloud, Database, CheckCircle2, AlertCircle, RefreshCw, FileCode } from "lucide-react";

export default function DataBackupManager() {
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<"overwrite" | "merge">("overwrite");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadBackup = async () => {
    setDownloading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/backup");
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `portfolio-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setMessage({ type: "success", text: "Portfolio backup JSON file downloaded successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to download backup JSON file." });
    } finally {
      setDownloading(false);
    }
  };

  const handleRestoreFile = (file: File) => {
    if (!file.name.endsWith(".json")) {
      setMessage({ type: "error", text: "Please upload a valid JSON backup file (.json)." });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setUploading(true);
        setMessage(null);
        const parsed = JSON.parse(e.target?.result as string);

        const res = await fetch("/api/backup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...parsed, mode }),
        });

        const data = await res.json();
        if (res.ok) {
          setMessage({ type: "success", text: data.message || "Data restored successfully!" });
        } else {
          setMessage({ type: "error", text: data.error || "Restore failed." });
        }
      } catch (err: any) {
        setMessage({ type: "error", text: "Invalid JSON format: " + err.message });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (confirm(`Are you sure you want to ${mode} your portfolio data with this backup file?`)) {
        handleRestoreFile(e.target.files[0]);
      }
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" /> 1-Click Data Backup &amp; JSON Import/Export
          </h3>
          <p className="text-xs text-slate-400">Backup your entire portfolio schema to a JSON file or restore from a previous backup.</p>
        </div>

        <button
          onClick={handleDownloadBackup}
          disabled={downloading}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          {downloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Download JSON Backup
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {message.text}
        </div>
      )}

      {/* Restore Dropzone */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase text-slate-300">Restore Portfolio Data</label>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Restore Mode:</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 text-white text-xs rounded-lg px-2.5 py-1"
            >
              <option value="overwrite">Overwrite Existing</option>
              <option value="merge">Merge &amp; Append</option>
            </select>
          </div>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/40 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-white">Click or drag portfolio-backup.json here to restore</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Restores Projects, Skills, Certificates &amp; Profile info instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
