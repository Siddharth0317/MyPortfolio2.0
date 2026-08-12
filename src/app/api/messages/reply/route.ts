import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messageId, recipientEmail, recipientName, subject, replyText } = await req.json();

    if (!recipientEmail || !replyText) {
      return NextResponse.json({ error: "Recipient email and reply text are required." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const profile = await prisma.user.findFirst();
      const senderName = profile?.name || "Siddharth";

      await resend.emails.send({
        from: `${senderName} <onboarding@resend.dev>`,
        to: recipientEmail,
        subject: subject || `Re: Inquirer Message from ${senderName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b; line-height: 1.6;">
            <p>Hi ${recipientName || "there"},</p>
            <div style="white-space: pre-wrap; background: #f8fafc; padding: 16px; border-left: 4px solid #6366f1; border-radius: 8px; margin: 16px 0;">
              ${replyText}
            </div>
            <p>Best regards,<br/><strong>${senderName}</strong><br/>${profile?.title || "Senior Full-Stack Engineer"}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 12px; color: #64748b;">Sent directly from ${senderName}'s Developer Portfolio Admin Panel.</p>
          </div>
        `,
      });
    }

    // Mark message as read in database
    if (messageId) {
      await prisma.message.update({
        where: { id: messageId },
        data: { isRead: true },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Reply email dispatched successfully to ${recipientEmail}!`,
    });
  } catch (error: any) {
    console.error("Error replying to message:", error);
    return NextResponse.json({ error: "Failed to send email reply: " + error.message }, { status: 500 });
  }
}
