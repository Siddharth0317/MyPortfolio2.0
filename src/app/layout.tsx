import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Developer Portfolio | Senior Full-Stack Engineer",
  description: "Dynamic developer portfolio featuring interactive projects showcase, skill matrix, career timeline, and contact form.",
  keywords: ["Full Stack Engineer", "React", "Next.js", "TypeScript", "Portfolio", "Software Architect"],
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
