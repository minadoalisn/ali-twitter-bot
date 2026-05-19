import { NextResponse } from "next/server";
import { AUTH_COOKIE, createSessionToken, getCookieOptions, isAuthConfigured, safeNextPath } from "@/lib/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const nickname = String(form.get("nickname") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const next = safeNextPath(form.get("next"), "/account");
  const loginPath = next.startsWith("/en") ? "/en/account/login" : "/account/login";

  if (!isAuthConfigured()) {
    return NextResponse.redirect(new URL(`${loginPath}?error=config&next=${encodeURIComponent(next)}`, request.url));
  }

  if (nickname.length < 2 || !email.includes("@") || password.length < 8) {
    return NextResponse.redirect(new URL(`${loginPath}?error=invalid&next=${encodeURIComponent(next)}`, request.url));
  }

  const token = await createSessionToken({
    sub: email,
    role: "user",
    email,
    nickname,
  });
  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set(AUTH_COOKIE, token, getCookieOptions());

  return response;
}
