import { NextResponse } from "next/server";
import { AUTH_COOKIE, getCookieOptions, safeNextPath } from "@/lib/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const next = safeNextPath(form.get("next"), "/");
  const response = NextResponse.redirect(new URL(next, request.url), 303);

  response.cookies.set(AUTH_COOKIE, "", getCookieOptions(0));

  return response;
}
