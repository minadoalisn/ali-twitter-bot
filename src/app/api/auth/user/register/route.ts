import { NextResponse } from "next/server";
import { AUTH_COOKIE, createSessionToken, getCookieOptions, isAuthConfigured, safeNextPath } from "@/lib/auth";

function accountRegisterRedirect(request: Request, error?: string) {
  const url = new URL(request.url);
  const next = safeNextPath(url.searchParams.get("next"), "/account");
  const loginPath = next.startsWith("/en") ? "/en/account/login" : "/account/login";
  const loginUrl = new URL(loginPath, request.url);
  loginUrl.searchParams.set("next", next);
  if (error) loginUrl.searchParams.set("error", error);

  return NextResponse.redirect(loginUrl, 303);
}

export function GET(request: Request) {
  return accountRegisterRedirect(request);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const nickname = String(form.get("nickname") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const next = safeNextPath(form.get("next"), "/account");
  const loginPath = next.startsWith("/en") ? "/en/account/login" : "/account/login";

  if (!isAuthConfigured()) {
    return NextResponse.redirect(new URL(`${loginPath}?error=config&next=${encodeURIComponent(next)}`, request.url), 303);
  }

  if (nickname.length < 2 || !email.includes("@") || password.length < 8) {
    return NextResponse.redirect(new URL(`${loginPath}?error=invalid&next=${encodeURIComponent(next)}`, request.url), 303);
  }

  const token = await createSessionToken({
    sub: email,
    role: "user",
    email,
    nickname,
  });
  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(AUTH_COOKIE, token, getCookieOptions());

  return response;
}
