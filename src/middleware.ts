import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 인증이 필요한 경로
const protectedPaths = ["/mypage"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 보호된 경로인지 확인
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected) {
    // TODO: 실제 인증 토큰 체크로 교체
    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mypage/:path*"],
};
