import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // 1. Save to Database
    let savedMessage = null;
    try {
      savedMessage = await prisma.message.create({
        data: {
          name,
          email,
          subject: subject || "Portfolio Inquiry",
          message,
        },
      });
    } catch (dbError) {
      console.warn("Could not save message to DB (Prisma error):", dbError);
    }

    // 2. Dispatch Email via Resend helper
    const emailResult = await sendContactEmail({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
      messageId: savedMessage?.id || "mock-id",
      emailStatus: emailResult,
    });
  } catch (error: any) {
    console.error("Error in /api/contact:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process contact request." },
      { status: 500 }
    );
  }
}
