"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, Mail, Code2, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/common/SocialIcons";

interface HeroProps {
  profile?: {
    name?: string;
    title?: string;
    bio?: string;
    resumeUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
  };
  onResumeClick?: () => void;
}

export default function Hero({ profile, onResumeClick }: HeroProps) {
  const name = profile?.name || "Siddharth";
  const title = profile?.title || "Senior Full-Stack Engineer & System Architect";
  const bio = profile?.bio || "Building high-performance web applications, distributed microservices, and modern digital experiences with Next.js, React, Node.js, and Cloud technologies.";
  const resumeUrl = profile?.resumeUrl || "#";
  const githubUrl = profile?.githubUrl || "https://github.com";
  const linkedinUrl = profile?.linkedinUrl || "https://linkedin.com";
  const twitterUrl = profile?.twitterUrl || "https://twitter.com";

  const handleDownloadResume = () => {
    if (onResumeClick) {
      onResumeClick();
    } else if (resumeUrl && resumeUrl !== "#") {
      window.open(resumeUrl, "_blank");
    } else {
      const element = document.createElement("a");
      const file = new Blob([
        `RESUME - ${name}\nTitle: ${title}\nBio: ${bio}\nGitHub: ${githubUrl}\nLinkedIn: ${linkedinUrl}\nContact: ${profile?.name || 'Alex'} (via Portfolio Contact Form)`
      ], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${name.replace(/\s+/g, "_")}_Resume.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden">
      <div className="bg-glow-purple top-1/4 -left-32 animate-pulse-slow" />
      <div className="bg-glow-cyan bottom-10 -right-20 animate-pulse-slow" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-emerald-500/30 text-xs font-semibold text-emerald-400 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Available for Full-time Roles &amp; Contracts
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight"
        >
          Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">{name}</span>
          <span className="block text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-300 mt-3">
            {title}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 mb-10 leading-relaxed"
        >
          {bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <a
            href="#projects"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02]"
          >
            <Code2 className="w-4 h-4" />
            Explore Projects
            <ArrowDownRight className="w-4 h-4" />
          </a>

          <button
            onClick={handleDownloadResume}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl glass-card hover:bg-white/10 border border-slate-700/80 text-white font-semibold text-sm transition-all duration-200 hover:border-indigo-500/50 hover:scale-[1.02]"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            View &amp; Download Resume
          </button>

          <a
            href="#contact"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl glass-card hover:bg-white/10 border border-slate-700/80 text-slate-300 hover:text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
          >
            <Mail className="w-4 h-4 text-purple-400" />
            Contact Me
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-5 text-slate-400"
        >
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full glass-card hover:text-indigo-400 hover:border-indigo-500/40 transition-all duration-200 hover:scale-110"
            aria-label="GitHub"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full glass-card hover:text-indigo-400 hover:border-indigo-500/40 transition-all duration-200 hover:scale-110"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full glass-card hover:text-indigo-400 hover:border-indigo-500/40 transition-all duration-200 hover:scale-110"
            aria-label="Twitter"
          >
            <TwitterIcon className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
