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
      metadata: {},
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
