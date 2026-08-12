import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "developer@example.com";

  if (!resend) {
    console.log("--------------------------------------------------");
    console.log("[MOCK EMAIL SENT - RESEND_API_KEY missing]");
    console.log(`From: ${name} <${email}>`);
    console.log(`To: ${receiverEmail}`);
    console.log(`Subject: ${subject || "New Portfolio Contact Message"}`);
    console.log(`Body: ${message}`);
    console.log("--------------------------------------------------");
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [receiverEmail],
      replyTo: email,
      subject: subject ? `[Portfolio] ${subject}` : `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #6366f1;">New Portfolio Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || "N/A"}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; white-space: pre-wrap;">${message}</div>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    return { success: false, error };
  }
}
