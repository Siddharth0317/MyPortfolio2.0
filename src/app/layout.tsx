import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Alex Dev | Senior Full-Stack Engineer & System Architect",
  description: "Dynamic developer portfolio featuring interactive project showcases, skill matrix, career timeline, CLI terminal, and admin management panel.",
  keywords: ["Full Stack Engineer", "React", "Next.js 16", "TypeScript", "Developer Portfolio", "Software Architect", "Prisma", "Supabase"],
  authors: [{ name: "Alex Dev" }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Alex Dev | Senior Full-Stack Engineer",
    description: "Dynamic developer portfolio featuring interactive project showcases, skill matrix, career timeline, and CLI terminal.",
    url: siteUrl,
    siteName: "Alex Dev Portfolio",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Alex Dev - Senior Full-Stack Engineer Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex Dev | Senior Full-Stack Engineer",
    description: "Dynamic developer portfolio featuring interactive project showcases, skill matrix, career timeline, and CLI terminal.",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-[#0b0f19] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
