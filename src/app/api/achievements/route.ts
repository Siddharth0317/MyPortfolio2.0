import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeHidden = searchParams.get("includeHidden") === "true";

    const session = await getServerSession(authOptions);
    const isAuthorized = !!session;

    const where: any = {};
    if (!isAuthorized || !includeHidden) {
      where.isHidden = false;
    }

    const achievements = await prisma.achievement.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(achievements);
  } catch (error: any) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, issuer, date, description, certificateUrl, category, isHidden, order } = body;

    if (!title || !issuer || !date) {
      return NextResponse.json({ error: "Title, issuer, and date are required" }, { status: 400 });
    }

    const achievement = await prisma.achievement.create({
      data: {
        title,
        issuer,
        date,
        description,
        certificateUrl,
        category: category || "Certification",
        isHidden: isHidden || false,
        order: order ? parseInt(order) : 0,
      },
    });

    return NextResponse.json(achievement, { status: 201 });
  } catch (error: any) {
    console.error("Error creating achievement:", error);
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
  }
}
