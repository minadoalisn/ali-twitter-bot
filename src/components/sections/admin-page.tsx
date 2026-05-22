import { Archive, BadgeCheck, ClipboardCheck, Gem, MessageCircle, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { formatDate } from "@/lib/format";
import type { CustomerServiceConfig, InquiryInbox } from "@/lib/inquiries";
import type { Locale } from "@/lib/types";

const receivingAddress = process.env.BNB_USDT_RECEIVING_ADDRESS || "0xbd00c3d12dB5840A403D2880039Cb1c86155F8cC";

export const orderInbox = {
  storageConfigured: false,
  orders: [],
};

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
    value: "0",
    detail: { zh: "只显示真实订单数据，不展示演示买家或模拟钱包。", en: "Only real order records are shown. No demo buyers or simulated wallets." },
  },
  {
    label: { zh: "支付数据", en: "Payment Proofs" },
    value: "0",
    detail: { zh: "等待真实 USDT 付款凭证入库后显示。", en: "Shown after real USDT payment proofs are stored." },
  },
  {
    label: { zh: "人工审核", en: "Manual Approval" },
    value: "0",
    detail: { zh: "等待真实订单进入审核队列。", en: "Waiting for real orders to enter review." },
  },
  {
    label: { zh: "发货管理", en: "Delivery" },
    value: "0",
    detail: { zh: "到账确认后才进入真实发货流程。", en: "Real fulfillment starts only after receipt approval." },
  },
];

export const shipmentWorkflow = [
  {
    title: { zh: "到账锁定", en: "Receipt Lock" },
    detail: { zh: "未确认 USDT 到账前，不允许生成发货单、登记拥有者或公开归属。", en: "No shipment, owner registration, or public ownership before USDT receipt approval." },
    gate: { zh: "财务确认", en: "Finance approval" },
  },
  {
    title: { zh: "主人资料", en: "Owner Profile" },
    detail: { zh: "核对收件人姓名、联系方式、国家地区、完整地址、邮编与高价值配送备注。", en: "Verify recipient name, contact, region, full address, postcode, and high-value delivery notes." },
    gate: { zh: "资料完整", en: "Profile complete" },
  },
  {
    title: { zh: "白手套封装", en: "White Glove Packing" },
    detail: { zh: "记录作品编号、证书、封装照片、封条编号、出库复核人和包装视频。", en: "Record serial, certificate, packing photos, seal number, release reviewer, and packing video." },
    gate: { zh: "出库复核", en: "Release review" },
  },
  {
    title: { zh: "保价物流", en: "Insured Logistics" },
    detail: { zh: "按售价声明保价，登记承运商、保价金额、追踪号、预计送达与签收要求。", en: "Insure by sale value; record courier, insured value, tracking number, ETA, and signature requirements." },
    gate: { zh: "物流锁定", en: "Logistics locked" },
  },
  {
    title: { zh: "交付凭证", en: "Delivery Evidence" },
    detail: { zh: "保存签收回执、交付照片或视频、物流轨迹截图与异常说明。", en: "Store receipt, delivery photo or video, tracking screenshots, and exception notes." },
    gate: { zh: "凭证归档", en: "Proof archived" },
  },
  {
    title: { zh: "售后档案", en: "Aftercare Archive" },
    detail: { zh: "归档保养建议、维修记录、二次定制备注、客户偏好和长期服务记录。", en: "Archive care notes, repair history, custom follow-ups, client preference, and long-term service records." },
    gate: { zh: "服务建档", en: "Service archive" },
  },
  {
    title: { zh: "异常挂起", en: "Exception Hold" },
    detail: { zh: "金额、地址、TXID、收件人或风控不一致时，发货单必须冻结并进入人工复核。", en: "Freeze fulfillment for amount, address, TXID, recipient, or risk mismatches until manual review." },
    gate: { zh: "人工复核", en: "Manual review" },
  },
];

export const deliveryChecklist = [
  {
    label: { zh: "收货资料", en: "Shipping Identity" },
    items: {
      zh: ["姓名与联系方式二次确认", "国家/地区、完整地址、邮编", "高价值配送备注与签收人要求"],
      en: ["Recipient name and contact re-confirmed", "Region, full address, and postcode", "High-value delivery notes and signer requirements"],
    },
  },
  {
    label: { zh: "作品出库", en: "Work Release" },
    items: {
      zh: ["N 编号与证书一致", "封装照片、封条编号、出库复核人", "360 展示与交付前状态留档"],
      en: ["N serial matches certificate", "Packing photos, seal number, release reviewer", "360 view and pre-delivery condition archived"],
    },
  },
  {
    label: { zh: "保价物流", en: "Insured Logistics" },
    items: {
      zh: ["保价金额与售价一致", "承运商、追踪号、预计送达", "签收要求与丢损预案"],
      en: ["Insured value matches sale value", "Courier, tracking number, and ETA", "Signature requirement and loss/damage plan"],
    },
  },
  {
    label: { zh: "交付售后", en: "Delivery And Aftercare" },
    items: {
      zh: ["签收回执与交付凭证", "拥有者公开显示确认", "保养、维修与长期服务档案"],
      en: ["Receipt and delivery proof", "Owner display approval", "Care, repair, and long-term service archive"],
    },
  },
];

function localizedText(value: { zh: string; en: string }, locale: Locale) {
  return value[locale];
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
                  value: customerServiceConfig?.conciergeEmail ?? "lansenlight@gmail.com",
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
              <h2 className="mt-3 text-3xl">{isZh ? "真实订单队列" : "Real Orders"}</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--graphite)]">
              {isZh
                ? "这里不再展示演示买家。只有用户提交付款凭证并写入数据库后，订单、买家、钱包和发货状态才会出现。"
                : "Demo buyers are no longer displayed. Orders, buyers, wallets, and delivery status appear only after real payment proofs are stored."}
            </p>
          </div>

          <div className="mt-7 border border-black/10 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
              {orderInbox.storageConfigured ? "ORDER STORAGE ACTIVE" : "ORDER STORAGE PENDING"}
            </p>
            <h3 className="mt-4 text-2xl">{isZh ? "暂无真实订单" : "No real orders yet"}</h3>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--graphite)]">
              {isZh
                ? "当前没有从数据库读取到真实订单。接入 Supabase 订单/付款表后，这里会显示真实买家、真实钱包、真实 TXID、审核与发货状态；未接入前不会再显示任何模拟数据。"
                : "No database-backed order records are available. After Supabase order/payment tables are connected, this area will show real buyers, wallets, TXIDs, review, and fulfillment states. Until then, no simulated data is shown."}
            </p>
            <div className="mt-6 grid gap-3 text-sm md:grid-cols-3">
              {[
                isZh ? "用户提交 USDT 凭证" : "User submits USDT proof",
                isZh ? "后台确认到账" : "Admin confirms receipt",
                isZh ? "登记拥有者并发货" : "Register owner and ship",
              ].map((step, index) => (
                <div key={step} className="border border-black/10 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ash)]">0{index + 1}</p>
                  <p className="mt-2">{step}</p>
                </div>
              ))}
            </div>
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
            <div className="mt-5 border border-black/10 p-5 text-sm leading-7 text-[var(--graphite)]">
              {isZh
                ? "暂无真实付款凭证。用户完成钱包转账并成功提交询盘/付款记录后，这里才显示真实 TXID、付款钱包、金额和确认状态。"
                : "No real payment proofs yet. Real TXIDs, payer wallets, amounts, and confirmation states appear only after a user submits a stored payment record."}
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
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--ash)]">
                <PackageCheck size={14} /> {isZh ? "发货工作台" : "Fulfillment Workbench"}
              </p>
              <h2 className="mt-3 text-3xl">{isZh ? "从到账确认到交付归档的完整发货链路" : "Full delivery chain from receipt approval to aftercare archive"}</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--graphite)]">
              {isZh
                ? "发货不是一个按钮，而是一组必须满足的门禁。只有真实订单完成到账审核、收货资料和出库复核后，才允许进入保价物流与交付归档。"
                : "Fulfillment is a gated workflow, not a single button. Only real orders with approved payment, shipping data, and release review can move into insured logistics and delivery archive."}
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
            {shipmentWorkflow.map((stage, index) => (
              <div key={stage.title.en} className="border border-black/10 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ash)]">0{index + 1}</p>
                <h3 className="mt-3 text-lg">{localizedText(stage.title, locale)}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--graphite)]">{localizedText(stage.detail, locale)}</p>
                <p className="mt-4 border-t border-black/10 pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ash)]">
                  {localizedText(stage.gate, locale)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="border border-black/10 bg-white/35 p-5">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--ash)]">
                <Truck size={14} /> {isZh ? "发货队列状态" : "Shipment Queue State"}
              </p>
              <h3 className="mt-4 text-2xl">{isZh ? "暂无可发货订单" : "No shippable orders yet"}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">
                {isZh
                  ? "当前没有真实订单进入发货队列。后台接入 shipments 表后，这里会按“待收货资料、待出库、待保价物流、已发货、已签收、售后归档、异常挂起”显示真实记录。"
                  : "No real order is ready for fulfillment. After the shipments table is connected, this queue will show real records across address needed, release review, insured logistics, shipped, delivered, aftercare archived, and exception hold."}
              </p>
              <div className="mt-5 grid gap-3 text-sm">
                {[
                  isZh ? "到账未确认：禁止发货" : "Receipt unapproved: fulfillment blocked",
                  isZh ? "收货资料缺失：禁止出库" : "Shipping profile missing: release blocked",
                  isZh ? "保价物流未登记：禁止公开发货状态" : "Insured logistics missing: shipment status blocked",
                ].map((rule) => (
                  <p key={rule} className="border-t border-black/10 pt-3">{rule}</p>
                ))}
              </div>
            </div>

            <div className="border border-black/10 p-5">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--ash)]">
                <ClipboardCheck size={14} /> {isZh ? "发货审核清单" : "Delivery Checklist"}
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {deliveryChecklist.map((group) => (
                  <div key={group.label.en} className="border border-black/8 p-4">
                    <h3 className="text-lg">{localizedText(group.label, locale)}</h3>
                    <ul className="mt-4 grid gap-3 text-sm leading-6 text-[var(--graphite)]">
                      {group.items[locale].map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--champagne)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
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
