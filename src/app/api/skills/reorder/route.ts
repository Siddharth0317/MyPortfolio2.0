import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items array" }, { status: 400 });
    }

    // Execute atomic transaction to update all skill orders
    await prisma.$transaction(
      items.map((item: { id: string; order: number }) =>
        prisma.skill.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({ success: true, message: "Skill order updated successfully!" });
  } catch (error: any) {
    console.error("Error reordering skills:", error);
    return NextResponse.json({ error: "Failed to reorder skills: " + error.message }, { status: 500 });
  }
}
