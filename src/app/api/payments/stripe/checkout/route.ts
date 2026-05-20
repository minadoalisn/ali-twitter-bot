import { NextResponse } from "next/server";
import { requireUserSession, safeNextPath } from "@/lib/auth";
import { getStripe } from "@/lib/integrations/stripe";
import { products } from "@/lib/noirven-data";
import { bidCheckoutSchema } from "@/lib/schemas";
import type { Locale } from "@/lib/types";

function localePrefix(locale: Locale) {
  return locale === "en" ? "/en" : "";
}

function paymentPath(path: string, status: string, params: Record<string, string | number> = {}) {
  const url = new URL(path, "https://noirven.local");
  url.searchParams.set("payment", status);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  return `${url.pathname}${url.search}`;
}

function redirectTo(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const locale: Locale = form.get("locale") === "en" ? "en" : "zh";
  const prefix = localePrefix(locale);
  const fallbackPath = `${prefix}/auctions`;

  const payload = bidCheckoutSchema.safeParse({
    productId: String(form.get("productId") || ""),
    amount: Number(form.get("amount")),
    nickname: String(form.get("nickname") || "").trim(),
    locale,
    returnPath: safeNextPath(form.get("returnPath"), fallbackPath),
  });

  if (!payload.success) {
    return redirectTo(request, paymentPath(fallbackPath, "invalid"));
  }

  const product = products.find((item) => item.id === payload.data.productId);

  if (!product) {
    return redirectTo(request, paymentPath(fallbackPath, "missing"));
  }

  const returnPath = safeNextPath(payload.data.returnPath, `${prefix}/auctions/${product.slug}`);
  const session = await requireUserSession(request);

  if (!session) {
    const loginPath = `${prefix}/account/login?error=auth&next=${encodeURIComponent(returnPath)}`;
    return redirectTo(request, loginPath);
  }

  if (product.status === "sold") {
    return redirectTo(request, paymentPath(returnPath, "sold"));
  }

  const minimumBid = product.currentPrice + product.bidIncrement;

  if (payload.data.amount < minimumBid) {
    return redirectTo(request, paymentPath(returnPath, "minimum", { minimumBid }));
  }

  try {
    const stripe = getStripe();
    const origin = new URL(request.url).origin;
    const accountPath = `${prefix}/account`;
    const bidAmount = Math.round(payload.data.amount);
    const depositAmount = Math.round(product.depositAmount);
    const metadata = {
      paymentRole: "auction_deposit",
      productId: product.id,
      productSlug: product.slug,
      serial: product.serial,
      bidAmountUsd: String(bidAmount),
      depositAmountUsd: String(depositAmount),
      bidderNickname: payload.data.nickname,
      bidderEmail: session.email || "",
    };

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: session.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: depositAmount * 100,
            product_data: {
              name: `Noirven ${product.serial} Auction Deposit`,
              description: `${product.title} / bid ${bidAmount} USD`,
              images: [`${origin}${product.image}`],
            },
          },
        },
      ],
      metadata,
      payment_intent_data: {
        metadata,
      },
      success_url: `${origin}${accountPath}?payment=deposit_success&product=${encodeURIComponent(product.slug)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${returnPath}?payment=cancelled`,
    });

    if (!checkout.url) {
      return redirectTo(request, paymentPath(returnPath, "stripe_error"));
    }

    return NextResponse.redirect(checkout.url, 303);
  } catch (error) {
    const reason = error instanceof Error && error.message.includes("STRIPE_SECRET_KEY") ? "stripe_config" : "stripe_error";
    return redirectTo(request, paymentPath(returnPath, reason));
  }
}
