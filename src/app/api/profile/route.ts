import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_PROFILE = {
  email: process.env.ADMIN_EMAIL || "inftpaths@gmail.com",
  passwordHash: "$2a$10$w8T0M0W2t9xL0.90xM.u.e0V7X6b4n2k3m5l7p9q0r1s2t3u4v5w",
  name: "Siddharth",
  title: "Senior Full-Stack Engineer & System Architect",
  tagline: "Architecting scalable cloud applications, distributed systems & AI-driven digital experiences.",
  bio: "Passionate Senior Full-Stack Engineer building high-scale web applications and interactive developer tooling.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  resumeUrl: "#",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://twitter.com",
  yearsExperience: "2+ Years",
  codeQuality: "99%",
  customProjectsCount: "",
  customCertsCount: "",
};

export async function GET() {
  try {
    let user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        title: true,
        tagline: true,
        bio: true,
        avatarUrl: true,
        resumeUrl: true,
        githubUrl: true,
        linkedinUrl: true,
        twitterUrl: true,
        yearsExperience: true,
        codeQuality: true,
        customProjectsCount: true,
        customCertsCount: true,
      },
    });

    // Auto-create initial profile row in Supabase if database is empty
    if (!user) {
      user = await prisma.user.create({
        data: DEFAULT_PROFILE,
        select: {
          id: true,
          email: true,
          name: true,
          title: true,
          tagline: true,
          bio: true,
          avatarUrl: true,
          resumeUrl: true,
          githubUrl: true,
          linkedinUrl: true,
          twitterUrl: true,
          yearsExperience: true,
          codeQuality: true,
          customProjectsCount: true,
          customCertsCount: true,
        },
      });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const user = await prisma.user.findFirst();

    let updatedUser;

    const updatePayload = {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.title !== undefined && { title: body.title }),
      ...(body.tagline !== undefined && { tagline: body.tagline }),
      ...(body.bio !== undefined && { bio: body.bio }),
      ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl }),
      ...(body.resumeUrl !== undefined && { resumeUrl: body.resumeUrl }),
      ...(body.githubUrl !== undefined && { githubUrl: body.githubUrl }),
      ...(body.linkedinUrl !== undefined && { linkedinUrl: body.linkedinUrl }),
      ...(body.twitterUrl !== undefined && { twitterUrl: body.twitterUrl }),
      ...(body.yearsExperience !== undefined && { yearsExperience: body.yearsExperience }),
      ...(body.codeQuality !== undefined && { codeQuality: body.codeQuality }),
      ...(body.customProjectsCount !== undefined && { customProjectsCount: body.customProjectsCount }),
      ...(body.customCertsCount !== undefined && { customCertsCount: body.customCertsCount }),
    };

    if (!user) {
      // Create user if not present
      updatedUser = await prisma.user.create({
        data: {
          ...DEFAULT_PROFILE,
          ...updatePayload,
        },
        select: {
          id: true,
          email: true,
          name: true,
          title: true,
          tagline: true,
          bio: true,
          avatarUrl: true,
          resumeUrl: true,
          githubUrl: true,
          linkedinUrl: true,
          twitterUrl: true,
          yearsExperience: true,
          codeQuality: true,
          customProjectsCount: true,
          customCertsCount: true,
        },
      });
    } else {
      // Update existing user
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updatePayload,
        select: {
          id: true,
          email: true,
          name: true,
          title: true,
          tagline: true,
          bio: true,
          avatarUrl: true,
          resumeUrl: true,
          githubUrl: true,
          linkedinUrl: true,
          twitterUrl: true,
          yearsExperience: true,
          codeQuality: true,
          customProjectsCount: true,
          customCertsCount: true,
        },
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
