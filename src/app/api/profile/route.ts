import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        title: true,
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

    if (!user) {
      return NextResponse.json({
        name: "Alex Dev",
        title: "Senior Full-Stack Engineer & System Architect",
        bio: "Passionate Senior Full-Stack Engineer building high-scale web applications and interactive developer tooling.",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        resumeUrl: "#",
        githubUrl: "https://github.com",
        linkedinUrl: "https://linkedin.com",
        twitterUrl: "https://twitter.com",
        yearsExperience: "6+",
        codeQuality: "99%",
        customProjectsCount: "",
        customCertsCount: "",
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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.title && { title: body.title }),
        ...(body.bio && { bio: body.bio }),
        ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl }),
        ...(body.resumeUrl !== undefined && { resumeUrl: body.resumeUrl }),
        ...(body.githubUrl !== undefined && { githubUrl: body.githubUrl }),
        ...(body.linkedinUrl !== undefined && { linkedinUrl: body.linkedinUrl }),
        ...(body.twitterUrl !== undefined && { twitterUrl: body.twitterUrl }),
        ...(body.yearsExperience !== undefined && { yearsExperience: body.yearsExperience }),
        ...(body.codeQuality !== undefined && { codeQuality: body.codeQuality }),
        ...(body.customProjectsCount !== undefined && { customProjectsCount: body.customProjectsCount }),
        ...(body.customCertsCount !== undefined && { customCertsCount: body.customCertsCount }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        title: true,
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

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
