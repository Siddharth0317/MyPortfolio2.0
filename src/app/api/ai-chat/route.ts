import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    const userMessage = messages[messages.length - 1]?.content || "";

    // 1. Fetch Real-time Live Knowledge from Supabase Database
    const [rawProfile, rawProjects, rawSkills, rawAchievements] = await Promise.all([
      prisma.user.findFirst(),
      prisma.project.findMany({ where: { isHidden: false }, orderBy: { order: "asc" } }),
      prisma.skill.findMany({ orderBy: { order: "asc" } }),
      prisma.achievement.findMany({ where: { isHidden: false }, orderBy: { order: "asc" } }),
    ]);

    const name = rawProfile?.name || "Alex Dev";
    const title = rawProfile?.title || "Senior Full-Stack Engineer & System Architect";
    const bio = rawProfile?.bio || "Passionate engineer with experience building web applications, Next.js microservices, and distributed cloud architecture.";
    const githubUrl = rawProfile?.githubUrl || "https://github.com";
    const linkedinUrl = rawProfile?.linkedinUrl || "https://linkedin.com";

    const projectsList = rawProjects.map(
      (p) => `- Project: "${p.title}" (${p.category})
  Summary: ${p.description}
  Tech Stack: ${p.techStack.join(", ")}
  Live Demo: ${p.liveUrl || "Available on request"}
  GitHub: ${p.githubUrl || "Available on request"}`
    ).join("\n\n");

    const skillsList = rawSkills.map((s) => `- ${s.name} (${s.category}, ${s.proficiency}% proficiency)`).join("\n");
    const achievementsList = rawAchievements.map((a) => `- ${a.title} by ${a.issuer} (${a.date}): ${a.description || ""}`).join("\n");

    const systemPrompt = `You are ${name}'s official AI Twin & Virtual Assistant on ${name}'s developer portfolio.
Your goal is to assist recruiters, engineering managers, and visitors by answering questions about ${name}'s skills, background, projects, and availability accurately, enthusiastically, and professionally.

REAL-TIME CANDIDATE KNOWLEDGE:
- Name: ${name}
- Current Title: ${title}
- Summary Bio: ${bio}
- GitHub: ${githubUrl}
- LinkedIn: ${linkedinUrl}

CURRENT SHOWCASE PROJECTS:
${projectsList || "No public projects listed currently."}

TECHNICAL SKILLS & PROFICIENCIES:
${skillsList || "Full-Stack Development, Next.js, TypeScript, PostgreSQL, Prisma, Supabase, Cloud Architecture."}

CAREER & CERTIFICATE MILESTONES:
${achievementsList || "Senior Engineer roles & AWS Solutions Architect certification."}

INSTRUCTIONS:
1. Always speak in the first person as ${name}'s AI Assistant ("Alex built...", "In Alex's experience...").
2. Be concise, polite, and highlight ${name}'s strengths in Full-Stack Engineering, Next.js, and Cloud Architecture.
3. If asked about contact or hiring, encourage them to use the Contact Form on the page or email ${name}.
4. Keep answers under 3-4 paragraphs.`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      // Model versions list (tries primary model specified in env or latest Flash models)
      const modelsToTry = [
        process.env.GEMINI_MODEL || "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
      ];

      for (const model of modelsToTry) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [{ text: `${systemPrompt}\n\nVisitor Question: ${userMessage}` }],
                  },
                ],
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              return NextResponse.json({ reply, modelUsed: model });
            }
          }
        } catch (e) {
          console.warn(`Gemini model ${model} failed, trying fallback...`, e);
        }
      }
    }

    // Smart Knowledge Engine Fallback if Gemini Key is absent or fails
    let reply = `Thanks for asking! As ${name}'s AI Assistant, I can confirm that ${name} is a ${title} specializing in Next.js, TypeScript, PostgreSQL, and Cloud Systems.`;

    const lower = userMessage.toLowerCase();
    if (lower.includes("project") || lower.includes("work") || lower.includes("build")) {
      reply = `Here are some of ${name}'s top projects currently in the database:\n\n` +
        rawProjects.slice(0, 3).map((p) => `• **${p.title}** (${p.category}): ${p.description}`).join("\n\n") +
        `\n\nYou can explore all projects in the Showcase section!`;
    } else if (lower.includes("skill") || lower.includes("stack") || lower.includes("tech")) {
      reply = `${name}'s technical matrix includes:\n\n` +
        rawSkills.slice(0, 6).map((s) => `• **${s.name}** (${s.category})`).join("\n") +
        `\n\n${name} has extensive experience building production-grade web applications.`;
    } else if (lower.includes("contact") || lower.includes("hire") || lower.includes("email") || lower.includes("reach")) {
      reply = `${name} is currently open for Full-Time Lead & Senior Full-Stack Engineering roles and consulting contracts! You can send a direct message using the Contact Form at the bottom of the page.`;
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("AI Chat route error:", error);
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });
  }
}
