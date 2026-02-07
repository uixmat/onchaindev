import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isProtectedPage = request.nextUrl.pathname.startsWith("/dashboard");

  // Redirect authenticated users away from login
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Optimistic redirect for unauthenticated users
  // Real auth validation happens in the page's server component
  if (isProtectedPage && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
