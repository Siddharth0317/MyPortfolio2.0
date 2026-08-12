import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(skills);
  } catch (error: any) {
    console.error("Error fetching skills:", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, category, iconName, proficiency, order } = body;

    if (!name || !category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        iconName,
        proficiency: proficiency ? parseInt(proficiency) : 80,
        order: order ? parseInt(order) : 0,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error: any) {
    console.error("Error creating skill:", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
