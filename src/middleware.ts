import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth";

function isEnglish(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/");
}

function loginPath(pathname: string, section: "admin" | "account") {
  const prefix = isEnglish(pathname) ? "/en" : "";
  return `${prefix}/${section}/login`;
}

function isLoginPath(pathname: string) {
  return pathname === "/admin/login" || pathname === "/en/admin/login" || pathname === "/account/login" || pathname === "/en/account/login";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isLoginPath(pathname)) {
    return NextResponse.next();
  }

  const session = await verifySessionToken(request.cookies.get(AUTH_COOKIE)?.value);
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/en/admin" || pathname.startsWith("/en/admin/");
  const isAccountRoute = pathname === "/account" || pathname.startsWith("/account/") || pathname === "/en/account" || pathname.startsWith("/en/account/");

  if (isAdminRoute && session?.role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = loginPath(pathname, "admin");
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAccountRoute && session?.role !== "user" && session?.role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = loginPath(pathname, "account");
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/en/admin/:path*", "/account/:path*", "/en/account/:path*"],
};
