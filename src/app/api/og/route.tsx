import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Sid.dev | Senior Full-Stack Engineer";
    const bio = searchParams.get("bio") || "Full-Stack Engineer & System Architect. Building high-performance Next.js apps, distributed microservices, and modern web tooling.";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#0b0f19",
            backgroundImage: "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%)",
            backgroundSize: "50px 50px",
            padding: "80px",
            fontFamily: "sans-serif",
            color: "#ffffff",
          }}
        >
          {/* Ambient Glow Gradient Circle */}
          <div
            style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(0, 0, 0, 0) 70%)",
              filter: "blur(40px)",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "16px",
                backgroundColor: "rgba(99, 102, 241, 0.2)",
                border: "1px solid rgba(99, 102, 241, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6366f1",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              &lt;/&gt;
            </div>
            <span style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>
              Sid<span style={{ color: "#6366f1" }}>.dev</span>
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
            <div
              style={{
                fontSize: "52px",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-1px",
                background: "linear-gradient(to right, #ffffff, #a5b4fc, #c084fc)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: "22px", color: "#94a3b8", lineHeight: 1.5 }}>
              {bio}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase", "Prisma"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 16px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#cbd5e1",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image`, { status: 500 });
  }
}
