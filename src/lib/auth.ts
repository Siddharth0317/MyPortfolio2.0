import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "supersecretpassword";

        // 1. Try finding user in Prisma Database
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (user) {
            const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
            if (isValid) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
              };
            }
          }
        } catch (error) {
          console.warn("Database connection issue during auth attempt, checking env fallback:", error);
        }

        // 2. Fallback check for initial admin login before DB seed
        if (
          credentials.email.toLowerCase() === adminEmail.toLowerCase() &&
          credentials.password === adminPassword
        ) {
          return {
            id: "fallback-admin-id",
            email: adminEmail,
            name: "Portfolio Admin",
          };
        }

        throw new Error("Invalid credentials");
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_key_change_in_production_32chars",
};
