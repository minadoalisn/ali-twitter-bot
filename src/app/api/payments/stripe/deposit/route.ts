import { NextResponse } from "next/server";
import { products } from "@/lib/noirven-data";
import { getStripe } from "@/lib/integrations/stripe";
import { depositSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const payload = depositSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid deposit payload", issues: payload.error.flatten() }, { status: 400 });
  }

  const product = products.find((item) => item.id === payload.data.productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(payload.data.amount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        productId: product.id,
        serial: product.serial,
        nickname: payload.data.nickname,
        paymentRole: "auction_deposit",
      },
    });

    return NextResponse.json({ clientSecret: intent.client_secret, paymentIntentId: intent.id });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Stripe is not configured for this environment",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}
