import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = nextUrl.pathname.startsWith("/admin") || nextUrl.pathname.startsWith("/api/admin");
      const isProtected = nextUrl.pathname.startsWith("/mypage") || nextUrl.pathname === "/replay";

      if ((isAdmin || isProtected) && !isLoggedIn) {
        const redirectUrl = new URL("/auth/login", nextUrl.origin);
        redirectUrl.searchParams.set("redirect", nextUrl.pathname);
        return Response.redirect(redirectUrl);
      }

      if (isAdmin && isLoggedIn) {
        const email = auth?.user?.email?.toLowerCase() ?? "";
        if (!adminEmails.includes(email)) {
          return Response.redirect(new URL("/", nextUrl.origin));
        }
      }

      return true;
    },
  },
});
