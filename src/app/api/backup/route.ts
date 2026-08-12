import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user, projects, skills, achievements, messages] = await Promise.all([
      prisma.user.findFirst(),
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.skill.findMany({ orderBy: { order: "asc" } }),
      prisma.achievement.findMany({ orderBy: { order: "asc" } }),
      prisma.message.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    const backupData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      user,
      projects,
      skills,
      achievements,
      messages,
    };

    const fileName = `portfolio-backup-${new Date().toISOString().split("T")[0]}.json`;

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    console.error("Backup export error:", error);
    return NextResponse.json({ error: "Failed to generate backup" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { projects, skills, achievements, user, mode = "overwrite" } = body;

    if (!Array.isArray(projects) || !Array.isArray(skills)) {
      return NextResponse.json({ error: "Invalid backup JSON structure." }, { status: 400 });
    }

    if (mode === "overwrite") {
      // Clear existing records safely
      await prisma.project.deleteMany({});
      await prisma.skill.deleteMany({});
      await prisma.achievement.deleteMany({});
    }

    // Restore user profile if provided
    if (user && user.email) {
      const existingUser = await prisma.user.findFirst();
      if (existingUser) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: user.name || existingUser.name,
            title: user.title || existingUser.title,
            bio: user.bio || existingUser.bio,
            avatarUrl: user.avatarUrl || existingUser.avatarUrl,
            resumeUrl: user.resumeUrl || existingUser.resumeUrl,
            githubUrl: user.githubUrl || existingUser.githubUrl,
            linkedinUrl: user.linkedinUrl || existingUser.linkedinUrl,
            twitterUrl: user.twitterUrl || existingUser.twitterUrl,
          },
        });
      }
    }

    // Bulk insert projects
    if (projects.length > 0) {
      await prisma.project.createMany({
        data: projects.map((p: any) => ({
          title: p.title,
          description: p.description,
          longDescription: p.longDescription || null,
          imageUrl: p.imageUrl || null,
          category: p.category || "Full Stack",
          techStack: Array.isArray(p.techStack) ? p.techStack : [],
          githubUrl: p.githubUrl || null,
          liveUrl: p.liveUrl || null,
          featured: Boolean(p.featured),
          isHidden: Boolean(p.isHidden),
          views: p.views || 0,
          clicks: p.clicks || 0,
          order: p.order || 0,
        })),
      });
    }

    // Bulk insert skills
    if (skills.length > 0) {
      await prisma.skill.createMany({
        data: skills.map((s: any) => ({
          name: s.name,
          category: s.category || "Frontend",
          iconName: s.iconName || null,
          proficiency: s.proficiency || 80,
          order: s.order || 0,
        })),
      });
    }

    // Bulk insert achievements
    if (achievements && Array.isArray(achievements) && achievements.length > 0) {
      await prisma.achievement.createMany({
        data: achievements.map((a: any) => ({
          title: a.title,
          issuer: a.issuer,
          date: a.date || "2024",
          description: a.description || null,
          certificateUrl: a.certificateUrl || null,
          category: a.category || "Certification",
          isHidden: Boolean(a.isHidden),
          order: a.order || 0,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully restored ${projects.length} projects, ${skills.length} skills, and ${achievements?.length || 0} achievements.`,
    });
  } catch (error: any) {
    console.error("Backup import error:", error);
    return NextResponse.json({ error: "Failed to restore backup data: " + error.message }, { status: 500 });
  }
}
