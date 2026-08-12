import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));
    const action = body.action || "view"; // "view" or "click"

    if (action === "click") {
      const project = await prisma.project.update({
        where: { id },
        data: { clicks: { increment: 1 } },
      });
      await prisma.analyticsLog.create({
        data: { type: "CLICK_DEMO", entityId: id, metadata: project.title },
      });
      return NextResponse.json({ success: true, clicks: project.clicks });
    } else {
      const project = await prisma.project.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
      await prisma.analyticsLog.create({
        data: { type: "VIEW_PROJECT", entityId: id, metadata: project.title },
      });
      return NextResponse.json({ success: true, views: project.views });
    }
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
  }
}
