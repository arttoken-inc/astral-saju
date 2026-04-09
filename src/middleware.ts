export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/mypage/:path*", "/replay", "/admin/:path*", "/api/admin/:path*"],
};
