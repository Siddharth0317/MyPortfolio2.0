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

    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.issuer && { issuer: body.issuer }),
        ...(body.date && { date: body.date }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.certificateUrl !== undefined && { certificateUrl: body.certificateUrl }),
        ...(body.category && { category: body.category }),
        ...(body.isHidden !== undefined && { isHidden: body.isHidden }),
        ...(body.order !== undefined && { order: parseInt(body.order) }),
      },
    });

    return NextResponse.json(achievement);
  } catch (error: any) {
    const { id } = await context.params;
    console.error(`Error updating achievement ${id}:`, error);
    return NextResponse.json({ error: "Failed to update achievement" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await prisma.achievement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Achievement deleted successfully" });
  } catch (error: any) {
    const { id } = await context.params;
    console.error(`Error deleting achievement ${id}:`, error);
    return NextResponse.json({ error: "Failed to delete achievement" }, { status: 500 });
  }
}
