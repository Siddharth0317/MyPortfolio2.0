"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, Loader2, ArrowLeft, Terminal } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="bg-glow-purple top-10 left-10" />
      <div className="bg-glow-cyan bottom-10 right-10" />

      <div className="max-w-md w-full relative z-10">
        
        {/* Back to Public Portfolio Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Public Portfolio
        </Link>

        {/* Card */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl shadow-indigo-950/50">
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Admin Portal Access</h1>
            <p className="text-xs text-slate-400 mt-1">Sign in to manage your portfolio, skills, and inbox</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                "Authenticate & Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-500">
            Default credentials configured via <code className="text-indigo-400">ADMIN_EMAIL</code> &amp; <code className="text-indigo-400">ADMIN_PASSWORD</code>
          </div>

        </div>

      </div>
    </div>
  );
}
