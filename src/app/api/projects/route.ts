import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects - Public route to fetch all projects
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const includeHidden = searchParams.get("includeHidden") === "true";

    const session = await getServerSession(authOptions);
    const isAuthorized = !!session;

    const where: any = {};
    if (!isAuthorized || !includeHidden) {
      where.isHidden = false;
    }
    if (category && category !== "All") {
      where.category = category;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST /api/projects - Protected route to create a new project
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, longDescription, imageUrl, category, techStack, githubUrl, liveUrl, featured, isHidden, order } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        longDescription,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        category: category || "Full Stack",
        techStack: Array.isArray(techStack) ? techStack : [],
        githubUrl,
        liveUrl,
        featured: featured || false,
        isHidden: isHidden || false,
        order: order !== undefined ? parseInt(order) : 0,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
