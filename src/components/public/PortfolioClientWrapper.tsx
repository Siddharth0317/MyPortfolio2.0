"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import About from "@/components/public/About";
import ProjectsShowcase, { Project } from "@/components/public/ProjectsShowcase";
import Timeline, { Achievement } from "@/components/public/Timeline";
import ContactForm from "@/components/public/ContactForm";
import Footer from "@/components/public/Footer";
import ThemePicker from "@/components/public/ThemePicker";
import { Terminal } from "lucide-react";

// Dynamic imports with ssr: false for heavy floating widgets & modals to optimize initial JS bundle size & Core Web Vitals
const ResumeModal = dynamic(() => import("@/components/public/ResumeModal"), { ssr: false });
const TerminalModal = dynamic(() => import("@/components/public/TerminalModal"), { ssr: false });
const AiAssistantWidget = dynamic(() => import("@/components/public/AiAssistantWidget"), { ssr: false });
const AchievementBadgesWidget = dynamic(() => import("@/components/public/AchievementBadgesWidget"), { ssr: false });

interface PortfolioClientWrapperProps {
  profile?: {
    name?: string;
    title?: string;
    bio?: string;
    resumeUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    yearsExperience?: string;
    codeQuality?: string;
    customProjectsCount?: string;
    customCertsCount?: string;
    totalProjectsInDb?: number;
    totalCertsInDb?: number;
  };
  projects?: Project[];
  skills?: any[];
  achievements?: Achievement[];
}

export default function PortfolioClientWrapper({
  profile,
  projects,
  skills,
  achievements,
}: PortfolioClientWrapperProps) {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  return (
    <>
      <Navbar
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenResume={() => setIsResumeModalOpen(true)}
      />

      <Hero
        profile={profile}
        onResumeClick={() => setIsResumeModalOpen(true)}
      />

      <About
        bio={profile?.bio}
        skills={skills}
        yearsExperience={profile?.yearsExperience}
        codeQuality={profile?.codeQuality}
        customProjectsCount={profile?.customProjectsCount}
        customCertsCount={profile?.customCertsCount}
        totalProjectsInDb={profile?.totalProjectsInDb}
        totalCertsInDb={profile?.totalCertsInDb}
      />
      <ProjectsShowcase projects={projects} />
      <Timeline achievements={achievements} />
      <ContactForm />
      <Footer />

      {/* Floating Bottom-Right Controls Bar: Badges, Theme Picker, AI Twin & CLI Launcher */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <AchievementBadgesWidget />
        <ThemePicker />
        <AiAssistantWidget />

        <button
          onClick={() => setIsTerminalOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/40 hover:scale-105 transition-all duration-200 border border-indigo-400/30 group"
          title="Open Interactive CLI Terminal (Ctrl+K)"
        >
          <Terminal className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">CLI Terminal</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-black/40 border border-white/20 rounded font-mono">Ctrl+K</kbd>
        </button>
      </div>

      {/* Modals */}
      {isResumeModalOpen && (
        <ResumeModal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
          profile={profile}
        />
      )}

      {isTerminalOpen && (
        <TerminalModal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
          onOpenResume={() => {
            setIsTerminalOpen(false);
            setIsResumeModalOpen(true);
          }}
          profile={profile}
        />
      )}
    </>
  );
}
