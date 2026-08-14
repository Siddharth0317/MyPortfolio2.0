import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_CATEGORIES = [
  "Programming Languages",
  "CS Fundamentals",
  "AI Automations",
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Tools",
];

export async function GET() {
  try {
    let categories = await prisma.skillCategory.findMany({
      orderBy: { order: "asc" },
    });

    if (categories.length === 0) {
      await Promise.all(
        DEFAULT_CATEGORIES.map((cat, index) =>
          prisma.skillCategory.upsert({
            where: { name: cat },
            update: {},
            create: { name: cat, order: index + 1 },
          })
        )
      );
      categories = await prisma.skillCategory.findMany({
        orderBy: { order: "asc" },
      });
    }

    const response = NextResponse.json(categories);
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return response;
  } catch (error: any) {
    console.error("Error fetching skill categories:", error);
    return NextResponse.json({ error: "Failed to fetch skill categories" }, { status: 500 });
  }
}
