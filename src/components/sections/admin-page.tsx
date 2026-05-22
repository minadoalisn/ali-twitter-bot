import { Archive, BadgeCheck, Gem, MessageCircle, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { formatCurrency, formatDate } from "@/lib/format";
import type { CustomerServiceConfig, InquiryInbox } from "@/lib/inquiries";
import { localizedSeries } from "@/lib/localized-content";
import { products, storySeries } from "@/lib/noirven-data";
import type { Locale, Product } from "@/lib/types";

const receivingAddress = process.env.BNB_USDT_RECEIVING_ADDRESS || "0xbd00c3d12dB5840A403D2880039Cb1c86155F8cC";

type AdminOrder = {
  orderId: string;
  product: Product;
  collector: string;
  wallet: string;
  txid: string;
  submittedAt: string;
  paymentStatus: { zh: string; en: string };
  reviewStatus: { zh: string; en: string };
  deliveryStatus: { zh: string; en: string };
  riskNote: { zh: string; en: string };
};

const latestProducts = [...products].sort((left, right) => right.serial.localeCompare(left.serial, "en", { numeric: true }));

export const adminOrders: AdminOrder[] = latestProducts.slice(0, 6).map((product, index) => {
  const presets = [
    {
      paymentStatus: { zh: "待核验 TXID", en: "TXID Review" },
      reviewStatus: { zh: "人工审核", en: "Manual Review" },
      deliveryStatus: { zh: "未发货", en: "Not Shipped" },
      riskNote: { zh: "等待链上到账确认，暂不登记拥有者。", en: "Waiting for on-chain receipt before owner registration." },
    },
    {
      paymentStatus: { zh: "链上确认中", en: "Confirming" },
      reviewStatus: { zh: "金额匹配", en: "Amount Matched" },
      deliveryStatus: { zh: "待确认地址", en: "Address Needed" },
      riskNote: { zh: "金额与作品定价一致，需复核收款地址。", en: "Amount matches the work price; receiving address still needs review." },
    },
    {
      paymentStatus: { zh: "已到账", en: "Received" },
      reviewStatus: { zh: "可确认归属", en: "Ready To Approve" },
      deliveryStatus: { zh: "待发货", en: "Ready To Ship" },
      riskNote: { zh: "可登记拥有者，并进入高价值发货流程。", en: "Ready for owner registration and high-value delivery workflow." },
    },
  ];
  const preset = presets[index % presets.length];

  return {
    orderId: `NV-ORD-${product.serial.replace("N-", "")}`,
    product,
    collector: index === 0 ? "local@example.com" : `collector-${index + 1}@noirven.vip`,
    wallet: index === 0 ? "Connected wallet pending" : `0x${String(index + 1).repeat(4)}...${String(9 - index).repeat(4)}`,
    txid: index === 0 ? "Waiting for wallet proof" : `0xnv${product.serial.replace("N-", "")}${String(index).repeat(8)}`,
    submittedAt: product.soldAt ?? product.endsAt,
    ...preset,
  };
});

export const permissionMatrix = [
  {
    role: { zh: "超级管理员", en: "Owner Admin" },
    scope: { zh: "订单、付款、审核、发货、产品、故事线、权限", en: "Orders, payments, review, delivery, products, storylines, permissions" },
    access: { zh: "全部权限", en: "Full Access" },
  },
  {
    role: { zh: "财务审核", en: "Finance Review" },
    scope: { zh: "USDT 到账、TXID、付款钱包、金额复核", en: "USDT receipt, TXID, payer wallet, amount checks" },
    access: { zh: "只处理支付数据与到账审核", en: "Payment data and receipt review only" },
  },
  {
    role: { zh: "发货运营", en: "Fulfillment" },
    scope: { zh: "拥有者信息、收货资料、保价物流、发货状态", en: "Owner profile, shipping details, insured logistics, delivery status" },
    access: { zh: "到账后才开放", en: "Unlocked after receipt approval" },
  },
  {
    role: { zh: "内容策展", en: "Curation" },
    scope: { zh: "故事线、作品图、360 展示、编号唯一性", en: "Storylines, product images, 360 display, serial uniqueness" },
    access: { zh: "不能查看付款钱包和收货信息", en: "No wallet or shipping-data access" },
  },
];

const dashboardMetrics = [
  {
    label: { zh: "订单查看", en: "Order Review" },
    value: `${adminOrders.length}`,
    detail: { zh: "按最新编号、付款状态和发货阶段集中查看。", en: "Review by latest serial, payment state, and delivery stage." },
  },
  {
    label: { zh: "支付数据", en: "Payment Proofs" },
    value: `${adminOrders.filter((order) => order.paymentStatus.en !== "Received").length}`,
    detail: { zh: "BEP-20 USDT 收款地址、TXID、付款钱包与金额核验。", en: "BEP-20 USDT address, TXID, payer wallet, and amount checks." },
  },
  {
    label: { zh: "人工审核", en: "Manual Approval" },
    value: `${adminOrders.filter((order) => order.reviewStatus.en !== "Ready To Approve").length}`,
    detail: { zh: "确认到账后才登记拥有者，避免重复归属。", en: "Owner registration happens only after receipt approval." },
  },
  {
    label: { zh: "发货管理", en: "Delivery" },
    value: `${adminOrders.filter((order) => order.deliveryStatus.en !== "Not Shipped").length}`,
    detail: { zh: "到账确认后进入保价发货、交付凭证和售后档案。", en: "After approval: insured shipping, delivery proof, and service archive." },
  },
];

function localizedText(value: { zh: string; en: string }, locale: Locale) {
  return value[locale];
}

function productName(product: Product, locale: Locale) {
  return locale === "zh" ? product.zhTitle : product.title;
}

function shortAddress(address: string) {
  if (!address.startsWith("0x") || address.length < 14) return address;
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

export function AdminPage({
  locale = "zh",
  inquiryInbox,
  customerServiceConfig,
}: {
  locale?: Locale;
  inquiryInbox?: InquiryInbox;
  customerServiceConfig?: CustomerServiceConfig;
}) {
  const isZh = locale === "zh";
  const inquiries = inquiryInbox?.inquiries ?? [];

  return (
    <div className="min-h-screen bg-[var(--porcelain)]">
      <SiteHeader locale={locale} />
      <main className="section-shell py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/12 pb-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">Noirven Admin</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-normal leading-tight md:text-6xl">
              {isZh ? "运营后台：订单、支付、审核、发货与权限。" : "Operations console for orders, payments, approval, delivery, and permissions."}
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--graphite)]">
              {isZh
                ? "后台只允许管理员账号进入。用户可浏览作品，但订单、付款凭证、收货资料、审核和发货信息只在此处处理。"
                : "Only admin accounts can enter this console. Visitors can browse works, while orders, payment proofs, shipping data, review, and fulfillment are handled here."}
            </p>
          </div>
          <form action="/api/auth/logout" method="post">
            <input type="hidden" name="next" value={isZh ? "/admin/login" : "/en/admin/login"} />
            <button className="focus-ring rounded-full border border-black/14 px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-black transition hover:border-[var(--champagne)]">
              {isZh ? "退出后台会话" : "Sign Out"}
            </button>
          </form>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-4">
          {dashboardMetrics.map((metric) => (
            <div key={metric.label.en} className="border-t border-black/12 pt-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--ash)]">{localizedText(metric.label, locale)}</p>
              <p className="mt-3 font-mono text-3xl">{metric.value}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--graphite)]">{localizedText(metric.detail, locale)}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 border-t border-black/12 pt-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--ash)]">
                <MessageCircle size={14} /> {isZh ? "智能客服配置" : "Smart Concierge Configuration"}
              </p>
              <h2 className="mt-3 text-3xl">{isZh ? "客服能力、渠道与智能分流" : "Service capability, channels, and lead intelligence"}</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--graphite)]">
              {isZh
                ? "这里不是只提示缺配置，而是告诉运营当前客服系统哪些能力可用、哪些渠道未接、哪些询盘会自动优先处理。"
                : "This panel shows what is enabled, which channels need setup, and how concierge inquiries are prioritized."}
            </p>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: isZh ? "询盘存储" : "Inquiry Storage",
                  value: customerServiceConfig?.storageConfigured ? (isZh ? "已接入" : "Connected") : (isZh ? "待接入" : "Pending"),
                  state: customerServiceConfig?.storageConfigured ? "ok" : "pending",
                  key: "storageConfigured",
                },
                {
                  label: isZh ? "智能分析" : "AI Intelligence",
                  value: customerServiceConfig?.aiConfigured ? (isZh ? "AI 已配置" : "AI Enabled") : (isZh ? "规则引擎运行中" : "Rules Engine Active"),
                  state: "ok",
                  key: "aiConfigured",
                },
                {
                  label: isZh ? "邮件兜底" : "Email Fallback",
                  value: customerServiceConfig?.conciergeEmail ?? "concierge@nvonly.com",
                  state: "ok",
                  key: "conciergeEmail",
                },
                {
                  label: isZh ? "高净值优先" : "High Net Worth Priority",
                  value: isZh ? "预算 / 编号 / 私定识别" : "Budget / serial / custom signals",
                  state: "ok",
                  key: "hnwPriority",
                },
              ].map((item) => (
                <div key={item.key} className="border border-black/10 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--ash)]">{item.label}</p>
                  <p className="mt-3 text-xl">{item.value}</p>
                  <p className={`mt-3 font-mono text-[10px] uppercase tracking-[0.16em] ${item.state === "ok" ? "text-[var(--graphite)]" : "text-[var(--signature-red)]"}`}>
                    {item.state === "ok" ? "ACTIVE" : "ACTION REQUIRED"}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-5">
              <div className="border border-black/10 p-5">
                <h3 className="text-xl">{isZh ? "客服渠道配置" : "Concierge Channels"}</h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {(customerServiceConfig?.channels ?? []).map((channel) => (
                    <div key={channel.key} className="border border-black/8 p-4">
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--ash)]">{channel.key}</p>
                      <p className="mt-2 break-all text-sm">{channel.label}</p>
                      <p className={`mt-2 text-[10px] uppercase tracking-[0.16em] ${channel.configured ? "text-[var(--graphite)]" : "text-[var(--signature-red)]"}`}>
                        {channel.configured ? (isZh ? "已配置" : "Configured") : (isZh ? "待配置" : "Missing")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-black/10 p-5">
                <h3 className="text-xl">{isZh ? "智能分流规则" : "Lead Intelligence"}</h3>
                <div className="mt-5 grid gap-3">
                  {(customerServiceConfig?.routingRules ?? []).map((rule) => (
                    <div key={rule.name} className="grid gap-3 border-b border-black/10 pb-3 last:border-b-0 last:pb-0 md:grid-cols-[0.35fr_0.45fr_0.2fr]">
                      <p className="font-medium">{isZh ? rule.zhName : rule.name}</p>
                      <p className="text-sm leading-6 text-[var(--graphite)]">{rule.condition}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ash)]">{rule.priority}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 border-t border-black/12 pt-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--ash)]">
                <MessageCircle size={14} /> {isZh ? "询盘管理" : "Concierge Inquiries"}
              </p>
              <h2 className="mt-3 text-3xl">{isZh ? "在线客服询盘队列" : "Online Concierge Inbox"}</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--graphite)]">
              {isZh
                ? "客服浮窗提交的咨询会进入这里，优先处理作品购买、私人定制、USDT 支付和发货问题。"
                : "Inquiries from the concierge widget appear here, prioritized across available works, custom requests, USDT payment, and delivery."}
            </p>
          </div>

          {!inquiryInbox?.configured ? (
            <div className="mt-7 border border-[var(--signature-red)]/25 p-5 text-sm leading-7 text-[var(--graphite)]">
              {isZh
                ? "询盘存储尚未配置。请在 Supabase 执行 schema.sql 中的 customer_inquiries 表结构，并配置 NEXT_PUBLIC_SUPABASE_URL 与 SUPABASE_SERVICE_ROLE_KEY。"
                : "Inquiry storage is not configured. Apply the customer_inquiries table from schema.sql in Supabase and set NEXT_PUBLIC_SUPABASE_URL plus SUPABASE_SERVICE_ROLE_KEY."}
            </div>
          ) : inquiries.length === 0 ? (
            <div className="mt-7 border border-black/10 p-5 text-sm leading-7 text-[var(--graphite)]">
              {isZh ? "当前暂无新询盘。客服浮窗收到咨询后会显示在这里。" : "No new inquiries yet. Concierge widget submissions will appear here."}
            </div>
          ) : (
            <div className="mt-7 overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <thead className="border-b border-black/12 text-[11px] uppercase tracking-[0.16em] text-[var(--ash)]">
                  <tr>
                    <th className="py-4 pr-5 font-normal">{isZh ? "客户" : "Client"}</th>
                    <th className="py-4 pr-5 font-normal" data-field="contact_channel">
                      {isZh ? "联系渠道" : "Contact"}
                    </th>
                    <th className="py-4 pr-5 font-normal" data-field="product_serial">
                      {isZh ? "作品编号" : "Serial"}
                    </th>
                    <th className="py-4 pr-5 font-normal">{isZh ? "意向" : "Intent"}</th>
                    <th className="py-4 pr-5 font-normal" data-field="message">
                      {isZh ? "内容" : "Message"}
                    </th>
                    <th className="py-4 pr-5 font-normal">{isZh ? "状态" : "Status"}</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="border-b border-black/8 align-top">
                      <td className="py-5 pr-5">
                        <p className="font-medium">{inquiry.name}</p>
                        <p className="mt-1 font-mono text-xs text-[var(--ash)]">{formatDate(inquiry.created_at)}</p>
                      </td>
                      <td className="py-5 pr-5">
                        <p className="uppercase">{inquiry.contact_channel}</p>
                        <p className="mt-1 text-xs text-[var(--graphite)]">{inquiry.contact_handle || inquiry.email || inquiry.phone || "-"}</p>
                      </td>
                      <td className="py-5 pr-5 font-mono">{inquiry.product_serial || "-"}</td>
                      <td className="py-5 pr-5">{inquiry.intent}</td>
                      <td className="max-w-sm py-5 pr-5 leading-6 text-[var(--graphite)]">{inquiry.message}</td>
                      <td className="py-5 pr-5">
                        <span className="border border-black/12 px-2 py-1 text-xs uppercase">{inquiry.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-14 border-t border-black/12 pt-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--ash)]">
                <Archive size={14} /> {isZh ? "订单查看" : "Order Review"}
              </p>
              <h2 className="mt-3 text-3xl">{isZh ? "最新归属订单队列" : "Latest Ownership Queue"}</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--graphite)]">
              {isZh
                ? "每条订单绑定一个作品编号、一个故事线和一个付款凭证；审核通过后才会显示拥有者并进入发货。"
                : "Each order binds one serial, one storyline, and one payment proof; owner display and delivery start only after approval."}
            </p>
          </div>

          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="border-b border-black/12 text-[11px] uppercase tracking-[0.16em] text-[var(--ash)]">
                <tr>
                  <th className="py-4 pr-5 font-normal">{isZh ? "订单" : "Order"}</th>
                  <th className="py-4 pr-5 font-normal">{isZh ? "作品" : "Work"}</th>
                  <th className="py-4 pr-5 font-normal">{isZh ? "买家" : "Collector"}</th>
                  <th className="py-4 pr-5 font-normal">{isZh ? "金额" : "Amount"}</th>
                  <th className="py-4 pr-5 font-normal">{isZh ? "状态" : "Status"}</th>
                  <th className="py-4 pr-5 font-normal">{isZh ? "操作" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {adminOrders.map((order) => {
                  const series = storySeries.find((item) => item.id === order.product.seriesId);
                  const localized = series ? localizedSeries(series, locale) : null;

                  return (
                    <tr key={order.orderId} className="border-b border-black/8 align-top">
                      <td className="py-5 pr-5 font-mono text-xs">
                        <p>{order.orderId}</p>
                        <p className="mt-2 text-[var(--ash)]">{formatDate(order.submittedAt)}</p>
                      </td>
                      <td className="py-5 pr-5">
                        <p className="font-medium">{productName(order.product, locale)}</p>
                        <p className="mt-1 font-mono text-xs text-[var(--ash)]">{order.product.serial}</p>
                        <p className="mt-1 text-xs text-[var(--graphite)]">{localized?.zhName ?? order.product.seriesId}</p>
                      </td>
                      <td className="py-5 pr-5">
                        <p>{order.collector}</p>
                        <p className="mt-1 font-mono text-xs text-[var(--ash)]">{shortAddress(order.wallet)}</p>
                      </td>
                      <td className="py-5 pr-5 font-mono">{formatCurrency(order.product.currentPrice)}</td>
                      <td className="py-5 pr-5">
                        <div className="grid gap-2">
                          <span className="w-fit border border-black/12 px-2 py-1 text-xs">{localizedText(order.paymentStatus, locale)}</span>
                          <span className="w-fit border border-black/12 px-2 py-1 text-xs">{localizedText(order.reviewStatus, locale)}</span>
                          <span className="w-fit border border-black/12 px-2 py-1 text-xs">{localizedText(order.deliveryStatus, locale)}</span>
                        </div>
                      </td>
                      <td className="py-5 pr-5">
                        <div className="flex flex-wrap gap-2">
                          <button className="focus-ring border border-black/12 px-3 py-2 text-xs transition hover:border-[var(--champagne)]">
                            {isZh ? "确认到账" : "Approve Receipt"}
                          </button>
                          <button className="focus-ring border border-black/12 px-3 py-2 text-xs transition hover:border-[var(--champagne)]">
                            {isZh ? "登记拥有者" : "Register Owner"}
                          </button>
                          <button className="focus-ring border border-black/12 px-3 py-2 text-xs transition hover:border-[var(--champagne)]">
                            {isZh ? "安排发货" : "Ship"}
                          </button>
                        </div>
                        <p className="mt-3 text-xs leading-5 text-[var(--graphite)]">{localizedText(order.riskNote, locale)}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-t border-black/12 pt-7">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--ash)]">
              <Gem size={14} /> {isZh ? "支付数据" : "Payment Proofs"}
            </p>
            <h2 className="mt-3 text-3xl">{isZh ? "USDT 到账审核" : "USDT Receipt Review"}</h2>
            <div className="mt-6 border border-black/10 bg-white/35 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--ash)]">BEP-20 USDT</p>
              <p className="mt-3 break-all font-mono text-sm">{receivingAddress}</p>
              <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">
                {isZh
                  ? "审核时必须核对付款金额、收款地址、付款钱包、TXID 与链上确认数。到账确认前，不允许登记拥有者或发货。"
                  : "Review amount, receiving address, payer wallet, TXID, and confirmations. Owner registration and delivery stay locked before receipt approval."}
              </p>
            </div>
            <div className="mt-5 grid gap-3 text-sm">
              {adminOrders.slice(0, 3).map((order) => (
                <div key={order.txid} className="border-b border-black/10 pb-3">
                  <p className="font-mono text-xs text-[var(--ash)]">{order.orderId}</p>
                  <p className="mt-1 break-all">{order.txid}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-black/12 pt-7">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--ash)]">
              <BadgeCheck size={14} /> {isZh ? "人工审核" : "Manual Approval"}
            </p>
            <h2 className="mt-3 text-3xl">{isZh ? "审核与发货规则" : "Approval And Delivery Rules"}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: { zh: "到账前锁定", en: "Locked Before Receipt" },
                  text: { zh: "未确认到账的订单不能显示拥有者，不能进入发货。", en: "Unconfirmed orders cannot show an owner or enter delivery." },
                },
                {
                  title: { zh: "唯一编号", en: "Unique Serial" },
                  text: { zh: "每件作品只绑定一个 N 编号、一个故事线和一位最终主人。", en: "Each work binds one N serial, one storyline, and one final owner." },
                },
                {
                  title: { zh: "发货管理", en: "Delivery" },
                  text: { zh: "确认收货资料、保价物流、交付凭证和售后记录。", en: "Confirm shipping details, insured logistics, delivery proof, and aftercare records." },
                },
                {
                  title: { zh: "异常复核", en: "Exception Review" },
                  text: { zh: "金额不符、地址不符、重复 TXID 必须进入异常队列。", en: "Mismatched amount, address, or duplicate TXID enters exception review." },
                },
              ].map((item) => (
                <div key={item.title.en} className="border border-black/10 p-5">
                  <h3 className="text-lg">{localizedText(item.title, locale)}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--graphite)]">{localizedText(item.text, locale)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 border-t border-black/12 pt-7">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--ash)]">
            <ShieldCheck size={14} /> {isZh ? "权限控制" : "Permissions"}
          </p>
          <h2 className="mt-3 text-3xl">{isZh ? "后台角色权限矩阵" : "Admin Permission Matrix"}</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {permissionMatrix.map((permission) => (
              <div key={permission.role.en} className="border border-black/10 p-5">
                <p className="text-lg">{localizedText(permission.role, locale)}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--graphite)]">{localizedText(permission.scope, locale)}</p>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ash)]">{localizedText(permission.access, locale)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
