import { getSupabaseAdmin } from "@/lib/integrations/supabase";
import type { customerInquirySchema } from "@/lib/schemas";
import type { z } from "zod";

export type CustomerInquiryInput = z.infer<typeof customerInquirySchema>;

export type CustomerInquiryRecord = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  contact_channel: string;
  contact_handle: string | null;
  intent: string;
  product_serial: string | null;
  budget_usd: number | null;
  message: string;
  locale: string;
  page_path: string | null;
  source: string | null;
  status: string;
  priority: string;
  created_at: string;
};

export type InquiryInbox = {
  configured: boolean;
  inquiries: CustomerInquiryRecord[];
  error?: string;
};

export type CustomerServiceConfig = {
  storageConfigured: boolean;
  aiConfigured: boolean;
  conciergeEmail: string;
  channels: Array<{
    key: string;
    label: string;
    configured: boolean;
  }>;
  routingRules: Array<{
    name: string;
    zhName: string;
    condition: string;
    priority: "urgent" | "high" | "normal";
  }>;
};

export function inferInquiryPriority(input: Pick<CustomerInquiryInput, "intent" | "budgetUsd" | "productSerial" | "message">) {
  const budget = typeof input.budgetUsd === "number" ? input.budgetUsd : 0;
  const message = input.message.toLowerCase();

  if (input.intent === "payment" || input.intent === "delivery" || message.includes("paid") || message.includes("付款")) {
    return {
      priority: "urgent",
      reason: "Payment or delivery inquiries require same-day handling.",
    };
  }

  if (budget >= 100_000 || Boolean(input.productSerial) || input.intent === "custom") {
    return {
      priority: "high",
      reason: "High-intent luxury lead with product, budget, or private custom context.",
    };
  }

  return {
    priority: "normal",
    reason: "General concierge inquiry.",
  };
}

export function getCustomerServiceConfig(): CustomerServiceConfig {
  const conciergeEmail = process.env.NEXT_PUBLIC_NOIRVEN_CONCIERGE_EMAIL || "concierge@nvonly.com";

  return {
    storageConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.OPENAI_API_KEY),
    conciergeEmail,
    channels: [
      { key: "email", label: conciergeEmail, configured: Boolean(conciergeEmail) },
      { key: "wechat", label: process.env.NEXT_PUBLIC_NOIRVEN_WECHAT_ID || "Not configured", configured: Boolean(process.env.NEXT_PUBLIC_NOIRVEN_WECHAT_ID) },
      { key: "whatsapp", label: process.env.NEXT_PUBLIC_NOIRVEN_WHATSAPP || "Not configured", configured: Boolean(process.env.NEXT_PUBLIC_NOIRVEN_WHATSAPP) },
      { key: "telegram", label: process.env.NEXT_PUBLIC_NOIRVEN_TELEGRAM || "Not configured", configured: Boolean(process.env.NEXT_PUBLIC_NOIRVEN_TELEGRAM) },
    ],
    routingRules: [
      {
        name: "High Net Worth Priority",
        zhName: "高净值优先",
        condition: "Budget >= 100,000 USD, product serial present, or private custom request",
        priority: "high",
      },
      {
        name: "Payment And Delivery Priority",
        zhName: "支付与发货优先",
        condition: "USDT, payment proof, delivery, or shipping inquiry",
        priority: "urgent",
      },
      {
        name: "IP Collaboration",
        zhName: "IP 与媒体合作",
        condition: "Press, film, short drama, game, or brand collaboration intent",
        priority: "normal",
      },
    ],
  };
}

function normalizeOptional(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return null;
  return value;
}

function getSupabaseOrNull() {
  try {
    return getSupabaseAdmin();
  } catch {
    return null;
  }
}

export async function createCustomerInquiry(input: CustomerInquiryInput) {
  const supabase = getSupabaseOrNull();
  const triage = inferInquiryPriority(input);

  if (!supabase) {
    return {
      ok: false,
      status: 503,
      error: "Customer inquiry storage is not configured.",
    };
  }

  const { data, error } = await supabase
    .from("customer_inquiries")
    .insert({
      name: input.name,
      email: normalizeOptional(input.email),
      phone: normalizeOptional(input.phone),
      contact_channel: input.contactChannel,
      contact_handle: normalizeOptional(input.contactHandle),
      intent: input.intent,
      product_serial: normalizeOptional(input.productSerial),
      budget_usd: normalizeOptional(input.budgetUsd),
      message: input.message,
      locale: input.locale,
      page_path: normalizeOptional(input.pagePath),
      source: normalizeOptional(input.source) ?? "concierge_widget",
      priority: triage.priority,
      metadata: { triage_reason: triage.reason },
    })
    .select("id, created_at")
    .single();

  if (error) {
    return {
      ok: false,
      status: 500,
      error: "Customer inquiry could not be saved.",
    };
  }

  return {
    ok: true,
    status: 201,
    inquiry: data,
  };
}

export async function getRecentCustomerInquiries(limit = 12): Promise<InquiryInbox> {
  const supabase = getSupabaseOrNull();

  if (!supabase) {
    return {
      configured: false,
      inquiries: [],
      error: "Supabase is not configured for customer inquiries.",
    };
  }

  const { data, error } = await supabase
    .from("customer_inquiries")
    .select(
      "id, name, email, phone, contact_channel, contact_handle, intent, product_serial, budget_usd, message, locale, page_path, source, status, priority, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return {
      configured: true,
      inquiries: [],
      error: "Customer inquiries table is not available or cannot be queried.",
    };
  }

  return {
    configured: true,
    inquiries: (data ?? []) as CustomerInquiryRecord[],
  };
}
