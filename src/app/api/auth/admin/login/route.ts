import { NextResponse } from "next/server";
import { AUTH_COOKIE, createSessionToken, getCookieOptions, isAdminAuthConfigured, safeNextPath, validateAdminCredentials } from "@/lib/auth";

function adminLoginRedirect(request: Request, error?: string) {
  const url = new URL(request.url);
  const next = safeNextPath(url.searchParams.get("next"), "/admin");
  const loginPath = next.startsWith("/en") ? "/en/admin/login" : "/admin/login";
  const loginUrl = new URL(loginPath, request.url);
  loginUrl.searchParams.set("next", next);
  if (error) loginUrl.searchParams.set("error", error);

  return NextResponse.redirect(loginUrl, 303);
}

export function GET(request: Request) {
  return adminLoginRedirect(request);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const username = String(form.get("username") || "");
  const password = String(form.get("password") || "");
  const next = safeNextPath(form.get("next"), "/admin");
  const loginPath = next.startsWith("/en") ? "/en/admin/login" : "/admin/login";

  if (!isAdminAuthConfigured()) {
    return NextResponse.redirect(new URL(`${loginPath}?error=config&next=${encodeURIComponent(next)}`, request.url), 303);
  }

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.redirect(new URL(`${loginPath}?error=invalid&next=${encodeURIComponent(next)}`, request.url), 303);
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  const token = await createSessionToken({
    sub: "admin",
    role: "admin",
    email: username.includes("@") ? username : undefined,
    nickname: "Noirven Admin",
  });
  response.cookies.set(AUTH_COOKIE, token, getCookieOptions());

  return response;
}
