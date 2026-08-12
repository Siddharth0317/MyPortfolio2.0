import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        views: true,
        clicks: true,
      },
      orderBy: { views: "desc" },
    });

    const totalViews = projects.reduce((acc, p) => acc + p.views, 0);
    const totalClicks = projects.reduce((acc, p) => acc + p.clicks, 0);
    const totalMessages = await prisma.message.count();
    const unreadMessages = await prisma.message.count({ where: { isRead: false } });

    const recentLogs = await prisma.analyticsLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    // Category distribution
    const categoryStats: Record<string, { views: number; count: number }> = {};
    projects.forEach((p) => {
      if (!categoryStats[p.category]) {
        categoryStats[p.category] = { views: 0, count: 0 };
      }
      categoryStats[p.category].views += p.views;
      categoryStats[p.category].count += 1;
    });

    return NextResponse.json({
      totalViews,
      totalClicks,
      totalMessages,
      unreadMessages,
      projects,
      recentLogs,
      categoryStats,
    });
  } catch (error: any) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
