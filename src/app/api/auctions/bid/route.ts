import { NextResponse } from "next/server";
import { requireUserSession } from "@/lib/auth";
import { products } from "@/lib/noirven-data";
import { bidSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const session = await requireUserSession(request);
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const payload = bidSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid bid payload", issues: payload.error.flatten() }, { status: 400 });
  }

  const product = products.find((item) => item.id === payload.data.productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (payload.data.amount < product.currentPrice + product.bidIncrement) {
    return NextResponse.json(
      {
        error: "Bid must meet the minimum increment",
        minimumBid: product.currentPrice + product.bidIncrement,
      },
      { status: 409 },
    );
  }

  return NextResponse.json({
    status: "accepted_for_mvp",
    message:
      "In production this writes through a Supabase Edge Function using a PostgreSQL row lock and creates or verifies a Stripe deposit.",
    bidder: { email: session.email, nickname: session.nickname },
    bid: payload.data,
  });
}
