import { NextResponse } from "next/server";
import { requireUserSession } from "@/lib/auth";
import { usdtSettlementSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const session = await requireUserSession(request);
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const payload = usdtSettlementSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid USDT settlement payload", issues: payload.error.flatten() }, { status: 400 });
  }

  const expectedAddress = process.env.BNB_USDT_RECEIVING_ADDRESS;

  return NextResponse.json({
    status: "pending_manual_review",
    network: "BNB Smart Chain / BEP-20 USDT",
    expectedAddress,
    collector: { email: session.email, nickname: session.nickname },
    submission: payload.data,
    message:
      "MVP stores this settlement request for admin review. Production should verify recipient, amount, token contract, confirmations, and timestamp.",
  });
}
