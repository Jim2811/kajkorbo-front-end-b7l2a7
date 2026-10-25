import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/admin", "/onboarding"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const hasSessionCookie = Boolean(request.cookies.get("accessToken")?.value);

  if (isProtected && !hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === "/login" || pathname === "/register") && hasSessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/onboarding/:path*",
    "/login",
    "/register",
  ],
};
