import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const message = await prisma.message.update({
      where: { id },
      data: {
        isRead: body.isRead !== undefined ? body.isRead : true,
      },
    });

    return NextResponse.json(message);
  } catch (error: any) {
    const { id } = await context.params;
    console.error(`Error updating message ${id}:`, error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Message deleted successfully" });
  } catch (error: any) {
    const { id } = await context.params;
    console.error(`Error deleting message ${id}:`, error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
