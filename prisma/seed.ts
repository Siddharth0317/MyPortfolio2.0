import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create or Update Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "inftpaths@gmail.com";
  const rawPassword = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  // Update all existing users with official profile details
  await prisma.user.updateMany({
    data: {
      name: "Siddharth",
      title: "Full Stack Engineer and AI Enthusiast",
      tagline: "Architecting scalable cloud applications, distributed systems & AI-driven digital experiences.",
      bio: "Passionate Full Stack Engineer and AI Enthusiast building high-scale web applications, AI pipelines, and interactive developer tooling.",
      githubUrl: "https://github.com/Siddharth0317",
      yearsExperience: "2+ Years",
      codeQuality: "80+%",
      customProjectsCount: "15+",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "Siddharth",
      title: "Full Stack Engineer and AI Enthusiast",
      tagline: "Architecting scalable cloud applications, distributed systems & AI-driven digital experiences.",
      bio: "Passionate Full Stack Engineer and AI Enthusiast building high-scale web applications, AI pipelines, and interactive developer tooling.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      resumeUrl: "/resume.pdf",
      githubUrl: "https://github.com/Siddharth0317",
      linkedinUrl: "https://linkedin.com",
      twitterUrl: "https://twitter.com",
      yearsExperience: "2+ Years",
      codeQuality: "80+%",
      customProjectsCount: "15+",
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Siddharth",
      title: "Full Stack Engineer and AI Enthusiast",
      tagline: "Architecting scalable cloud applications, distributed systems & AI-driven digital experiences.",
      bio: "Passionate Full Stack Engineer and AI Enthusiast building high-scale web applications, AI pipelines, and interactive developer tooling.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      resumeUrl: "/resume.pdf",
      githubUrl: "https://github.com/Siddharth0317",
      linkedinUrl: "https://linkedin.com",
      twitterUrl: "https://twitter.com",
      yearsExperience: "2+ Years",
      codeQuality: "80+%",
      customProjectsCount: "15+",
    },
  });

  console.log(`Admin user created: ${admin.email}`);

  // 2. Clear old projects and seed the 9 official projects
  await prisma.project.deleteMany({});
  await prisma.project.createMany({
    data: [
      {
        title: "MedBriefAI",
        description: "An AI-driven clinical triage platform that accelerates consultation prep by extracting patient symptoms and lab data into structured SOAP summaries using grounded RAG search.",
        longDescription: "An AI-driven clinical triage platform that accelerates consultation prep by extracting patient symptoms and lab data into structured SOAP summaries using grounded RAG search. Features secure JWT/Bcrypt authentication and real-time medical PDF report ingestion.",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
        category: "AI / ML",
        techStack: ["Next.js", "RAG", "AI/LLMs", "JWT/Bcrypt", "PDF Parsing"],
        githubUrl: "https://github.com/Siddharth0317/MedBriefAI",
        liveUrl: "http://med-brief-ai-three.vercel.app/",
        featured: true,
        isHidden: false,
        order: 1,
      },
      {
        title: "LedgerFlow_AI",
        description: "An autonomous financial operations platform leveraging a 5-agent AI pipeline to ingest, mathematically validate, and post invoices using natural language inputs.",
        longDescription: "An autonomous financial operations platform leveraging a 5-agent AI pipeline to ingest, mathematically validate, and post invoices using natural language inputs. Built with Next.js, React Flow canvas, Gemini API, BullMQ queues, MongoDB, and live Socket.IO events.",
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
        category: "AI / ML",
        techStack: ["Next.js", "Node.js", "React Flow", "Gemini API", "BullMQ", "MongoDB", "Socket.IO"],
        githubUrl: "https://github.com/Siddharth0317/LedgerFlow_AI",
        liveUrl: "https://ledger-flow-ai-drab.vercel.app/",
        featured: true,
        isHidden: false,
        order: 2,
      },
      {
        title: "AutoHealQA",
        description: "A self-healing autonomous QA engine that instantly translates natural language Jira requirements into comprehensive, multi-browser Playwright test scripts.",
        longDescription: "A self-healing autonomous QA engine that instantly translates natural language Jira requirements into comprehensive, multi-browser Playwright test scripts with visual regression verification and dynamic selector recovery.",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        category: "Automation / QA",
        techStack: ["Playwright", "AI Neural Engine (70B)", "BDD", "Multi-Browser Automation", "Visual Regression"],
        githubUrl: "https://github.com/Siddharth0317/AutoHealQA",
        liveUrl: "https://auto-heal-qa.vercel.app/",
        featured: true,
        isHidden: false,
        order: 3,
      },
      {
        title: "AI Analytics Dashboard",
        description: "A full-stack, real-time analytics portal that visualizes complex data and generates automated AI-driven business insights.",
        longDescription: "A full-stack, real-time analytics portal that visualizes complex data and generates automated AI-driven business insights using Next.js, Supabase PostgreSQL, Prisma ORM, and responsive Chart.js components.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        category: "Full Stack",
        techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Supabase", "Chart.js"],
        githubUrl: "https://github.com/Siddharth0317/ai-analytics-dashboard",
        liveUrl: "https://vercel.com/siddharth-rahanes-projects/ai-analytics-dashboard",
        featured: true,
        isHidden: false,
        order: 4,
      },
      {
        title: "Netguard_AI",
        description: "An interactive, AI-powered network monitoring dashboard designed to analyze traffic patterns and identify potential security threats in real-time.",
        longDescription: "An interactive, AI-powered network monitoring dashboard designed to analyze traffic patterns and identify potential security threats in real-time with machine learning models and Streamlit.",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
        category: "AI / ML",
        techStack: ["Python", "Streamlit", "Machine Learning", "Network Security Analysis"],
        githubUrl: "https://github.com/Siddharth0317/Netgaurd_AI",
        liveUrl: "https://netgaurd.streamlit.app/",
        featured: false,
        isHidden: false,
        order: 5,
      },
      {
        title: "MyPortfolio2.0",
        description: "A high-performance, interactive personal developer portfolio featuring sleek animations, responsive design, and a comprehensive showcase of full-stack system architectures.",
        longDescription: "A high-performance, interactive personal developer portfolio featuring sleek animations, responsive design, interactive CLI terminal, Gemini AI twin, and a comprehensive showcase of full-stack system architectures.",
        imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
        category: "Frontend",
        techStack: ["Next.js (App Router)", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
        githubUrl: "https://github.com/Siddharth0317/MyPortfolio2.0",
        liveUrl: "https://my-portfolio2-0-seven.vercel.app/",
        featured: false,
        isHidden: false,
        order: 6,
      },
      {
        title: "CodeCheck",
        description: "An automated development tool that analyzes source code repositories to ensure code quality, catch early-stage bugs, and seamlessly enforce best practices.",
        longDescription: "An automated development tool that analyzes source code repositories to ensure code quality, catch early-stage bugs, and seamlessly enforce best practices across continuous integration pipelines.",
        imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
        category: "Backend",
        techStack: ["Python/Node.js", "LLM Integration", "Static Code Analysis", "CI/CD"],
        githubUrl: "https://github.com/Siddharth0317/codecheck",
        liveUrl: null,
        featured: false,
        isHidden: false,
        order: 7,
      },
      {
        title: "AetherStore",
        description: "A cloud-native, headless e-commerce engine featuring a robust microservices architecture and a secure, automated checkout pipeline.",
        longDescription: "A cloud-native, headless e-commerce engine featuring a robust microservices architecture, PostgreSQL database, Docker containerization, and a secure automated Stripe checkout pipeline.",
        imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
        category: "Full Stack",
        techStack: ["React", "Node.js", "PostgreSQL", "Tailwind CSS", "Stripe API", "Docker"],
        githubUrl: "https://github.com/Siddharth0317/AetherStore",
        liveUrl: null,
        featured: false,
        isHidden: false,
        order: 8,
      },
      {
        title: "Test-Automation",
        description: "A comprehensive test automation framework built to integrate with CI/CD pipelines, ensuring software reliability through resilient end-to-end testing.",
        longDescription: "A comprehensive test automation framework built to integrate with CI/CD pipelines, ensuring software reliability through resilient end-to-end testing, cross-browser validation, and automated GitHub Actions workflows.",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        category: "Automation / QA",
        techStack: ["Selenium/Playwright", "PyTest/Jest", "GitHub Actions", "Automated Frameworks"],
        githubUrl: "https://github.com/Siddharth0317/Test-Automation",
        liveUrl: null,
        featured: false,
        isHidden: false,
        order: 9,
      },
    ],
  });
  console.log("9 official portfolio projects seeded.");

  // 3. Clear and seed achievements and certifications
  await prisma.achievement.deleteMany({});
  await prisma.achievement.createMany({
    data: [
      {
        title: "Certificate of Project Completion: Build Your Own AI Automation Platform Workshop",
        issuer: "NxtWave Academy",
        date: "12-Sep-2026",
        description: "Showcased practical skills in workflow generation, multi-agent AI systems, real-world integrations, and automation monitoring.",
        certificateUrl: "/certificates/nxtwave-ai-automation-platform.jpg",
        category: "Cloud & AI",
        order: 1,
      },
      {
        title: "AWS Cloud Practitioner Essentials",
        issuer: "AWS Training & Certification",
        date: "August 16, 2025",
        description: "Foundational mastery in AWS cloud architecture, security, compute models, database systems, and global serverless infrastructure.",
        certificateUrl: "/certificates/aws-cloud-practitioner.pdf",
        category: "Cloud & AI",
        order: 2,
      },
      {
        title: "Certificate of Project Completion: Generative AI Mega Workshop 2.0",
        issuer: "NXT WAVE / CCBP 4.0 Academy",
        date: "18-Sep-2024",
        description: "Built a pitch-ready product successfully using 10+ AI tools in workshop hosted by Mr Tezan Sahu (SDE II at Microsoft).",
        certificateUrl: "/certificates/nxtwave-genai-workshop.jpg",
        category: "Cloud & AI",
        order: 3,
      },
      {
        title: "Certificate of Completion: NxtCode - AI-Powered Challenge: 25 Under 5",
        issuer: "NXT WAVE / CCBP 4.0 Academy",
        date: "08-Feb-2025",
        description: "Successfully achieved the 5 Day Milestone, showcasing the skills of a Modern Age Developer.",
        certificateUrl: null,
        category: "Cloud & AI",
        order: 4,
      },
      {
        title: "TECHNORBIT Certified Programmer For The C++",
        issuer: "TECHNORBIT INFOSYSTEMS",
        date: "May 15, 2023",
        description: "Certified C++ Programmer with ISO 9001:2015 certification. Credential ID: TORBITSEP2022PPA1203147.",
        certificateUrl: "/certificates/technorbit-cpp.pdf",
        category: "Programming",
        order: 5,
      },
      {
        title: "TECHNORBIT Certified Programmer For The Data Structure Using C",
        issuer: "TECHNORBIT INFOSYSTEMS",
        date: "February 15, 2023",
        description: "Certified Programmer for Data Structures Using C with ISO 9001:2015 certification. Credential ID: TORBITSEP2022PPA1202147.",
        certificateUrl: "/certificates/technorbit-dsa-c.pdf",
        category: "Programming",
        order: 6,
      },
      {
        title: "DSA CodeVerse: Bi-Weekly Contest #16 (BEGINNER)",
        issuer: "NXT WAVE",
        date: "24-July-2025",
        description: "Achieved Rank 98, demonstrating exceptional performance and problem-solving skills in competitive algorithmic challenges.",
        certificateUrl: null,
        category: "Programming",
        order: 7,
      },
      {
        title: 'Masterclass: "Skills You Can\'t Ignore to get Exciting AI Jobs"',
        issuer: "NXT WAVE / CCBP 4.0 Academy",
        date: "20-Feb-2025",
        description: "Masterclass focused on strategic skills, tools, and technical roadmaps essential for high-impact AI engineering roles.",
        certificateUrl: null,
        category: "Professional Development",
        order: 8,
      },
      {
        title: "Masterclass: 'The Interview Game Changer: What Employers Really Want'",
        issuer: "NXT WAVE / CCBP 4.0 Academy",
        date: "30-Oct-2024",
        description: "In-depth masterclass on cracking modern software engineering interviews, architectural storytelling, and technical evaluations.",
        certificateUrl: null,
        category: "Professional Development",
        order: 9,
      },
      {
        title: "Masterclass: 'Beyond Tech: Skills that make you unstoppable'",
        issuer: "NXT WAVE / CCBP 4.0 Academy",
        date: "09-Oct-2024",
        description: "Executive session on critical thinking, agile mindset, cross-functional engineering, and career acceleration.",
        certificateUrl: null,
        category: "Professional Development",
        order: 10,
      },
      {
        title: "Skillups (NxtWave CCBP 4.0 Academy)",
        issuer: "NxtWave CCBP 4.0 Academy",
        date: "Ongoing",
        description: "Intensive ongoing specialization in Python, Full Stack Web Development (MERN), Databases, and AI skills with hands-on project and coding-based assessments.",
        certificateUrl: null,
        category: "Education",
        order: 11,
      },
      {
        title: "Bachelor of Engineering (Information Technology)",
        issuer: "Amrutvahini College of Engineering, Sangamner (SPPU, Pune)",
        date: "2021 – 2026",
        description: "Specialized in Software Systems, Machine Learning Workflows, Data Structures & Algorithms, and Cloud Systems. Final CGPA: 8.02.",
        certificateUrl: null,
        category: "Education",
        order: 12,
      },
      {
        title: "Higher Secondary Certificate (HSC - 12th)",
        issuer: "Shramik Junior College, Sangamner",
        date: "2021",
        description: "Completed Higher Secondary Certificate with 83.33% in Science stream with focus on Physics, Chemistry, and Mathematics.",
        certificateUrl: null,
        category: "Education",
        order: 13,
      },
      {
        title: "Secondary School Certificate (SSC - 10th)",
        issuer: "I.E.M.S. Chandanapuri",
        date: "2019",
        description: "Completed Secondary School Certificate with 82.80% with strong analytical, science, and mathematics fundamentals.",
        certificateUrl: null,
        category: "Education",
        order: 14,
      },
    ],
  });
  console.log("14 achievements & certifications seeded.");

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
