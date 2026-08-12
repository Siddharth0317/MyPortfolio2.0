import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.longDescription !== undefined && { longDescription: body.longDescription }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.category && { category: body.category }),
        ...(body.techStack && { techStack: body.techStack }),
        ...(body.githubUrl !== undefined && { githubUrl: body.githubUrl }),
        ...(body.liveUrl !== undefined && { liveUrl: body.liveUrl }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.isHidden !== undefined && { isHidden: body.isHidden }),
        ...(body.order !== undefined && { order: parseInt(body.order) }),
      },
    });

    return NextResponse.json(project);
  } catch (error: any) {
    const { id } = await context.params;
    console.error(`Error updating project ${id}:`, error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    const { id } = await context.params;
    console.error(`Error deleting project ${id}:`, error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
