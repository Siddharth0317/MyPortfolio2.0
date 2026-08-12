import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create or Update Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const rawPassword = process.env.ADMIN_PASSWORD || "supersecretpassword";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "Alex Dev",
      title: "Senior Full-Stack Engineer & System Architect",
      bio: "Passionate Senior Full-Stack Engineer with 6+ years of experience building high-scale web applications, microservices, and interactive developer tooling using React, Next.js, Node.js, and Cloud native technologies.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      resumeUrl: "#",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      twitterUrl: "https://twitter.com",
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Alex Dev",
      title: "Senior Full-Stack Engineer & System Architect",
      bio: "Passionate Senior Full-Stack Engineer with 6+ years of experience building high-scale web applications, microservices, and interactive developer tooling using React, Next.js, Node.js, and Cloud native technologies.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      resumeUrl: "#",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      twitterUrl: "https://twitter.com",
    },
  });

  console.log(`Admin user created: ${admin.email}`);

  // 2. Clear existing sample projects & seed fresh sample data if empty
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: "AI-Powered Analytics Dashboard",
          description: "Real-time analytics portal with custom chart visualizer and automated AI insights generation.",
          longDescription: "A high-performance analytics dashboard built for enterprise data exploration. Integrates real-time WebSocket streams, custom chart canvas rendering, and AI metric summaries.",
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
          category: "Full Stack",
          techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Supabase", "Chart.js"],
          githubUrl: "https://github.com/example/analytics-dashboard",
          liveUrl: "https://analytics-demo.example.com",
          featured: true,
          isHidden: false,
          order: 1,
        },
        {
          title: "Cloud Native E-Commerce Engine",
          description: "Headless e-commerce platform with microservices architecture and automated stripe checkout flow.",
          longDescription: "Scalable headless commerce solution with sub-second page loads, automated inventory synchronization, multi-currency support, and Stripe payments integration.",
          imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
          category: "Full Stack",
          techStack: ["React", "Node.js", "PostgreSQL", "Tailwind CSS", "Stripe API", "Docker"],
          githubUrl: "https://github.com/example/ecommerce-engine",
          liveUrl: "https://store-demo.example.com",
          featured: true,
          isHidden: false,
          order: 2,
        },
        {
          title: "Developer Documentation & CLI Hub",
          description: "Sleek MDX documentation engine with instant search, interactive code runner, and CLI tooling.",
          longDescription: "Documentation framework featuring Algolia instant search, syntax highlighting, multi-tab code snippets, and automated API doc generation from OpenAPI schemas.",
          imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
          category: "Frontend",
          techStack: ["Next.js", "MDX", "Tailwind CSS", "Framer Motion", "Algolia"],
          githubUrl: "https://github.com/example/doc-hub",
          liveUrl: "https://docs-demo.example.com",
          featured: false,
          isHidden: false,
          order: 3,
        },
      ],
    });
    console.log("Sample projects created.");
  }

  // 3. Seed Skills
  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    await prisma.skill.createMany({
      data: [
        { name: "TypeScript", category: "Frontend", iconName: "Code2", proficiency: 95, order: 1 },
        { name: "Next.js (App Router)", category: "Frontend", iconName: "Globe", proficiency: 95, order: 2 },
        { name: "React", category: "Frontend", iconName: "Layout", proficiency: 90, order: 3 },
        { name: "Tailwind CSS", category: "Frontend", iconName: "Palette", proficiency: 95, order: 4 },
        { name: "Node.js & Express", category: "Backend", iconName: "Server", proficiency: 90, order: 5 },
        { name: "PostgreSQL & Prisma", category: "Database", iconName: "Database", proficiency: 88, order: 6 },
        { name: "Supabase", category: "Database", iconName: "Zap", proficiency: 90, order: 7 },
        { name: "Docker & CI/CD", category: "DevOps", iconName: "Cpu", proficiency: 82, order: 8 },
      ],
    });
    console.log("Sample skills created.");
  }

  // 4. Seed Achievements & Timeline
  const achievementCount = await prisma.achievement.count();
  if (achievementCount === 0) {
    await prisma.achievement.createMany({
      data: [
        {
          title: "Lead Full-Stack Architect",
          issuer: "TechCorp Global",
          date: "2023 - Present",
          description: "Spearheaded cloud architecture migration, reduced API response latency by 45%, and mentored 8 engineers.",
          category: "Experience",
          order: 1,
        },
        {
          title: "Senior Software Engineer",
          issuer: "Innovate AI Labs",
          date: "2021 - 2023",
          description: "Engineered scalable web interfaces and real-time inference processing systems for AI applications.",
          category: "Experience",
          order: 2,
        },
        {
          title: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          date: "2023",
          description: "Validation of expertise in designing distributed AWS systems and cloud security best practices.",
          category: "Certification",
          order: 3,
        },
        {
          title: "B.S. in Computer Science",
          issuer: "State University",
          date: "2017 - 2021",
          description: "Graduated with Honors. Specialized in Software Systems, Algorithms, and Database Management.",
          category: "Education",
          order: 4,
        },
      ],
    });
    console.log("Sample achievements created.");
  }

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
