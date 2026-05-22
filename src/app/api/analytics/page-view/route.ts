import { NextResponse } from "next/server";
import { createSiteEvent } from "@/lib/admin-analytics";

function safeString(value: unknown, fallback = "") {
  return typeof value === "string" && value.length > 0 ? value.slice(0, 500) : fallback;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  await createSiteEvent({
    eventName: "page_view",
    path: safeString(payload.path, "/"),
    locale: safeString(payload.locale, "zh"),
    referrer: safeString(payload.referrer, ""),
    userAgent: request.headers.get("user-agent"),
    metadata: {
      source: "site_analytics_tracker",
    },
  });

  return new NextResponse(null, { status: 204 });
}
