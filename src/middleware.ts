import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Session verified by NextAuth middleware
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/projects/:path*",
    "/admin/skills/:path*",
    "/admin/timeline/:path*",
    "/admin/messages/:path*",
    "/admin/profile/:path*",
  ],
};
