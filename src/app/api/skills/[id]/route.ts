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

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.category && { category: body.category }),
        ...(body.iconName !== undefined && { iconName: body.iconName }),
        ...(body.proficiency !== undefined && { proficiency: parseInt(body.proficiency) }),
        ...(body.isHidden !== undefined && { isHidden: Boolean(body.isHidden) }),
        ...(body.order !== undefined && { order: parseInt(body.order) }),
      },
    });

    return NextResponse.json(skill);
  } catch (error: any) {
    const { id } = await context.params;
    console.error(`Error updating skill ${id}:`, error);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await prisma.skill.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Skill deleted successfully" });
  } catch (error: any) {
    const { id } = await context.params;
    console.error(`Error deleting skill ${id}:`, error);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
