import { NextResponse } from "next/server";
import { requireUserSession, safeNextPath } from "@/lib/auth";
import { products } from "@/lib/noirven-data";
import { usdtSettlementSchema } from "@/lib/schemas";

const defaultReceivingAddress = "0xbd00c3d12dB5840A403D2880039Cb1c86155F8cC";

function statusRedirect(request: Request, path: string, status: string, params: Record<string, string | number> = {}) {
  const url = new URL(path, request.url);
  url.searchParams.set("payment", status);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return NextResponse.redirect(url, 303);
}

async function readPayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return { isJson: true, body: await request.json() };
  }

  const form = await request.formData();
  return { isJson: false, body: Object.fromEntries(form.entries()) };
}

function rawString(body: unknown, key: string) {
  if (!body || typeof body !== "object") return "";
  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  const { isJson, body } = await readPayload(request);
  const locale = rawString(body, "locale") === "en" ? "en" : "zh";
  const prefix = locale === "en" ? "/en" : "";
  const fallbackPath = safeNextPath(rawString(body, "returnPath"), `${prefix}/auctions`);
  const session = await requireUserSession(request);

  if (!session) {
    if (isJson) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const loginUrl = new URL(`${prefix}/account/login`, request.url);
    loginUrl.searchParams.set("error", "auth");
    loginUrl.searchParams.set("next", fallbackPath);
    return NextResponse.redirect(loginUrl, 303);
  }

  const payload = usdtSettlementSchema.safeParse(body);

  if (!payload.success) {
    if (isJson) {
      return NextResponse.json({ error: "Invalid USDT settlement payload", issues: payload.error.flatten() }, { status: 400 });
    }

    return statusRedirect(request, fallbackPath, "invalid");
  }

  const product = products.find((item) => item.id === payload.data.productId);
  const returnPath = safeNextPath(payload.data.returnPath ?? "", product ? `${prefix}/auctions/${product.slug}` : fallbackPath);

  if (!product) {
    if (isJson) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return statusRedirect(request, fallbackPath, "missing");
  }

  if (product.status === "sold") {
    if (isJson) return NextResponse.json({ error: "Product already belongs to a collector" }, { status: 409 });
    return statusRedirect(request, returnPath, "sold");
  }

  if (Math.round(payload.data.amountUsd) !== Math.round(product.currentPrice)) {
    if (isJson) {
      return NextResponse.json({ error: "Amount must match the fixed direct-sale price", expectedAmountUsd: product.currentPrice }, { status: 400 });
    }

    return statusRedirect(request, returnPath, "amount", { expected: product.currentPrice });
  }

  const expectedAddress = process.env.BNB_USDT_RECEIVING_ADDRESS || defaultReceivingAddress;

  if (isJson) {
    return NextResponse.json({
      status: "pending_manual_review",
      network: "BNB Smart Chain / BEP-20 USDT",
      expectedAddress,
      collector: { email: session.email, nickname: session.nickname },
      product: { id: product.id, serial: product.serial, slug: product.slug, amountUsd: product.currentPrice },
      submission: payload.data,
      message:
        "MVP stores this USDT transfer proof for admin review. After manual confirmation, admin marks owner, order, and shipping status.",
    });
  }

  return statusRedirect(request, `${prefix}/account`, "usdt_submitted", { product: product.slug });
}
