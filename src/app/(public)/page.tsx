import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import About from "@/components/public/About";
import ProjectsShowcase from "@/components/public/ProjectsShowcase";
import Timeline from "@/components/public/Timeline";
import ContactForm from "@/components/public/ContactForm";
import Footer from "@/components/public/Footer";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Revalidate every 60 seconds

async function getData() {
  try {
    const rawProfile = await prisma.user.findFirst();
    const rawProjects = await prisma.project.findMany({
      where: { isHidden: false },
      orderBy: { order: "asc" },
    });
    const rawSkills = await prisma.skill.findMany({
      orderBy: { order: "asc" },
    });
    const rawAchievements = await prisma.achievement.findMany({
      where: { isHidden: false },
      orderBy: { order: "asc" },
    });

    const profile = rawProfile
      ? {
          name: rawProfile.name,
          title: rawProfile.title,
          bio: rawProfile.bio,
          resumeUrl: rawProfile.resumeUrl || undefined,
          githubUrl: rawProfile.githubUrl || undefined,
          linkedinUrl: rawProfile.linkedinUrl || undefined,
          twitterUrl: rawProfile.twitterUrl || undefined,
        }
      : undefined;

    const projects = rawProjects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      longDescription: p.longDescription,
      imageUrl: p.imageUrl,
      category: p.category,
      techStack: p.techStack,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      featured: p.featured,
      isHidden: p.isHidden,
      order: p.order,
    }));

    const skills = rawSkills.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      iconName: s.iconName || undefined,
      proficiency: s.proficiency,
    }));

    const achievements = rawAchievements.map((a) => ({
      id: a.id,
      title: a.title,
      issuer: a.issuer,
      date: a.date,
      description: a.description,
      certificateUrl: a.certificateUrl,
      category: a.category,
      isHidden: a.isHidden,
      order: a.order,
    }));

    return { profile, projects, skills, achievements };
  } catch (error) {
    console.warn("Could not query DB for public portfolio, falling back to defaults:", error);
    return { profile: undefined, projects: [], skills: [], achievements: [] };
  }
}

export default async function PublicPortfolioPage() {
  const { profile, projects, skills, achievements } = await getData();

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <Hero profile={profile} />
      <About bio={profile?.bio} skills={skills.length > 0 ? skills : undefined} />
      <ProjectsShowcase projects={projects.length > 0 ? projects : undefined} />
      <Timeline achievements={achievements.length > 0 ? achievements : undefined} />
      <ContactForm />
      <Footer />
    </main>
  );
}
