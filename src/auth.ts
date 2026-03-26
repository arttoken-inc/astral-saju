import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

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
      const isProtected = nextUrl.pathname.startsWith("/mypage");

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL("/auth/login", nextUrl.origin);
        redirectUrl.searchParams.set("redirect", nextUrl.pathname);
        return Response.redirect(redirectUrl);
      }

      return true;
    },
  },
});
