import { getSupabaseAdmin } from "@/lib/integrations/supabase";

type DatedRow = {
  created_at: string | null;
};

type PaymentRow = DatedRow & {
  amount_usd: string | number | null;
};

export type AdminAnalyticsSnapshot = {
  configured: boolean;
  trafficViews: number;
  trafficSeries: number[];
  paymentVolumeUsd: number;
  paymentSeries: number[];
  orderCount: number;
  orderSeries: number[];
  error?: string;
};

export type SiteEventInput = {
  eventName?: string;
  path: string;
  locale: string;
  referrer?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
};

function emptySnapshot(configured: boolean, error?: string): AdminAnalyticsSnapshot {
  return {
    configured,
    trafficViews: 0,
    trafficSeries: [0, 0, 0, 0, 0, 0, 0],
    paymentVolumeUsd: 0,
    paymentSeries: [0, 0, 0, 0, 0, 0, 0],
    orderCount: 0,
    orderSeries: [0, 0, 0, 0, 0, 0, 0],
    error,
  };
}

function getSupabaseOrNull() {
  try {
    return getSupabaseAdmin();
  } catch {
    return null;
  }
}

function lastSevenDayKeys() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today);
    day.setUTCDate(today.getUTCDate() - (6 - index));
    return day.toISOString().slice(0, 10);
  });
}

function seriesFromRows<T extends DatedRow>(rows: T[], valueForRow: (row: T) => number) {
  const keys = lastSevenDayKeys();
  const buckets = new Map(keys.map((key) => [key, 0]));

  rows.forEach((row) => {
    if (!row.created_at) return;
    const key = row.created_at.slice(0, 10);
    if (!buckets.has(key)) return;
    buckets.set(key, (buckets.get(key) ?? 0) + valueForRow(row));
  });

  return keys.map((key) => buckets.get(key) ?? 0);
}

function numericAmount(value: string | number | null) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

export async function getAdminAnalyticsSnapshot(): Promise<AdminAnalyticsSnapshot> {
  const supabase = getSupabaseOrNull();

  if (!supabase) {
    return emptySnapshot(false, "Supabase analytics storage is not configured.");
  }

  const since = `${lastSevenDayKeys()[0]}T00:00:00.000Z`;
  const [eventsResult, paymentsResult, ordersResult] = await Promise.all([
    supabase.from("site_events").select("created_at").eq("event_name", "page_view").gte("created_at", since),
    supabase.from("payments").select("amount_usd, created_at").eq("status", "paid").gte("created_at", since),
    supabase.from("orders").select("created_at").gte("created_at", since),
  ]);

  if (eventsResult.error || paymentsResult.error || ordersResult.error) {
    return emptySnapshot(
      true,
      eventsResult.error?.message ?? paymentsResult.error?.message ?? ordersResult.error?.message ?? "Analytics query failed.",
    );
  }

  const events = (eventsResult.data ?? []) as DatedRow[];
  const payments = (paymentsResult.data ?? []) as PaymentRow[];
  const orders = (ordersResult.data ?? []) as DatedRow[];
  const paymentVolumeUsd = payments.reduce((total, payment) => total + numericAmount(payment.amount_usd), 0);

  return {
    configured: true,
    trafficViews: events.length,
    trafficSeries: seriesFromRows(events, () => 1),
    paymentVolumeUsd,
    paymentSeries: seriesFromRows(payments, (payment) => numericAmount(payment.amount_usd)),
    orderCount: orders.length,
    orderSeries: seriesFromRows(orders, () => 1),
  };
}

export async function createSiteEvent(input: SiteEventInput) {
  const supabase = getSupabaseOrNull();

  if (!supabase) {
    return { ok: false, configured: false };
  }

  const { error } = await supabase.from("site_events").insert({
    event_name: input.eventName ?? "page_view",
    path: input.path,
    locale: input.locale,
    referrer: input.referrer ?? null,
    user_agent: input.userAgent ?? null,
    metadata: input.metadata ?? {},
  });

  return { ok: !error, configured: true, error: error?.message };
}
