import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { createCustomerInquiry, getRecentCustomerInquiries } from "@/lib/inquiries";
import { customerInquirySchema } from "@/lib/schemas";

async function readPayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await readPayload(request);
  } catch {
    return NextResponse.json({ error: "Invalid inquiry payload" }, { status: 400 });
  }

  const parsed = customerInquirySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid inquiry", issues: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.company) {
    return NextResponse.json({ status: "received" }, { status: 202 });
  }

  const result = await createCustomerInquiry(parsed.data);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ status: "stored", inquiry: result.inquiry }, { status: 201 });
}

export async function GET(request: Request) {
  const session = await requireAdminSession(request);

  if (!session) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  const inbox = await getRecentCustomerInquiries();
  return NextResponse.json(inbox);
}
