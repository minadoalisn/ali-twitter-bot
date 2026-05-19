import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/integrations/stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook secret or signature missing" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    return NextResponse.json({
      received: true,
      type: event.type,
      message: "Production should update payments, bids, orders, and audit logs idempotently.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid Stripe webhook", detail: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 },
    );
  }
}
