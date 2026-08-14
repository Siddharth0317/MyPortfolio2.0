import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeHidden = searchParams.get("all") === "true";

    const skills = await prisma.skill.findMany({
      where: includeHidden ? {} : { isHidden: false },
      orderBy: { order: "asc" },
    });
    const response = NextResponse.json(skills);
    response.headers.set("Cache-Control", "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400");
    return response;
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
    const { name, category, iconName, proficiency, isHidden, order } = body;

    if (!name || !category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        iconName,
        proficiency: proficiency ? parseInt(proficiency) : 80,
        isHidden: isHidden !== undefined ? Boolean(isHidden) : false,
        order: order ? parseInt(order) : 0,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error: any) {
    console.error("Error creating skill:", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
