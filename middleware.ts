import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    authorized({ token, req }) {
      const pathname = req.nextUrl.pathname;

      if (!token) return false;

      if (pathname.startsWith("/admin") && token.role !== "admin") {
        return false;
      }

      return true;
    },
  },
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/participant/:path*",
  ],
};
