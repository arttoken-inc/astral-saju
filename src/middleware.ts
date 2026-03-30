export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/mypage/:path*", "/admin/:path*", "/api/admin/:path*"],
};
