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

    await Promise.all(
      items.map((item: { name: string; order: number }) =>
        prisma.skillCategory.upsert({
          where: { name: item.name },
          update: { order: item.order },
          create: { name: item.name, order: item.order },
        })
      )
    );

    return NextResponse.json({ success: true, message: "Category order updated" });
  } catch (error: any) {
    console.error("Error reordering skill categories:", error);
    return NextResponse.json({ error: "Failed to reorder categories" }, { status: 500 });
  }
}
