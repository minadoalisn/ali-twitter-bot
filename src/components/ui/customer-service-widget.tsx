"use client";

import { FormEvent, useMemo, useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/types";

type SubmitState = "idle" | "sending" | "sent" | "error";
type InquiryIntent = "available_work" | "custom" | "payment" | "delivery" | "press" | "other";

const conciergeEmail = process.env.NEXT_PUBLIC_NOIRVEN_CONCIERGE_EMAIL || "lansenlight@gmail.com";

const copy = {
  zh: {
    button: "在线客服",
    title: "在线客服",
    subtitle: "Luxury Concierge",
    intro: "告诉我们你想咨询的作品、预算或定制方向，客服会按询盘优先级跟进。",
    smartTitle: "智能建议",
    quickTitle: "快速填写",
    intent: "咨询类型",
    intents: [
      ["available_work", "现售作品"],
      ["custom", "私人定制"],
      ["payment", "USDT 支付"],
      ["delivery", "发货交付"],
      ["press", "媒体/IP 合作"],
      ["other", "其它"],
    ],
    name: "姓名 / 昵称",
    channel: "联系渠道",
    contact: "联系方式",
    email: "邮箱",
    product: "作品编号，可选",
    budget: "预算 USD，可选",
    message: "询盘内容",
    placeholder: "例如：我想了解 N-0520 是否可直接购买，或希望定制一件类似归潮故事线的耳坠。",
    quickPrompts: [
      "我想确认这件作品是否仍可购买，并了解付款和交付流程。",
      "我想做一件私人定制作品，预算和故事方向需要客服协助梳理。",
      "我已完成 USDT 转账，需要客服协助确认到账和后续发货。",
    ],
    submit: "提交询盘",
    sending: "提交中",
    sent: "询盘已提交，后台会进入客服跟进。",
    fallback: "询盘已生成邮件草稿，请发送给客服完成提交：",
    error: "询盘暂时未保存，请稍后再试，或发送邮件至 ",
    mail: "邮件咨询",
  },
  en: {
    button: "Concierge",
    title: "Online Concierge",
    subtitle: "Luxury Concierge",
    intro: "Tell us the work, budget, or custom direction you want to discuss. The concierge team will follow up by priority.",
    smartTitle: "Smart Guidance",
    quickTitle: "Quick Prompts",
    intent: "Inquiry Type",
    intents: [
      ["available_work", "Available Work"],
      ["custom", "Private Custom"],
      ["payment", "USDT Payment"],
      ["delivery", "Delivery"],
      ["press", "Press / IP"],
      ["other", "Other"],
    ],
    name: "Name / Nickname",
    channel: "Contact Channel",
    contact: "Contact Handle",
    email: "Email",
    product: "Serial, optional",
    budget: "Budget USD, optional",
    message: "Message",
    placeholder: "Example: I want to know whether N-0520 is available, or discuss a Tide Return custom earring.",
    quickPrompts: [
      "I want to confirm whether this work is available and understand payment and delivery.",
      "I want a private custom work and need help shaping the story direction and budget.",
      "I have completed a USDT transfer and need receipt confirmation plus delivery support.",
    ],
    submit: "Send Inquiry",
    sending: "Sending",
    sent: "Inquiry submitted. It will enter concierge follow-up.",
    fallback: "A concierge email draft has been created. Send it to complete the inquiry:",
    error: "Inquiry could not be saved. Try again later, or email ",
    mail: "Email Concierge",
  },
} as const;

const contactChannels = ["email", "wechat", "whatsapp", "telegram", "phone", "other"] as const;

function smartGuidance({
  locale,
  intent,
  productSerial,
  budgetUsd,
}: {
  locale: Locale;
  intent: InquiryIntent;
  productSerial: string;
  budgetUsd: string;
}) {
  const budget = Number(budgetUsd);
  const hasBudget = Number.isFinite(budget) && budget > 0;
  const highValue = hasBudget && budget >= 100_000;
  const hasSerial = productSerial.trim().length > 0;

  if (intent === "payment") {
    return locale === "zh"
      ? "已识别为支付咨询：请写明付款钱包、TXID、作品编号和付款时间，后台会按紧急级别核验。"
      : "Payment inquiry detected: include payer wallet, TXID, serial, and payment time for urgent review.";
  }

  if (intent === "delivery") {
    return locale === "zh"
      ? "已识别为交付咨询：请写明订单/作品编号、收货国家和希望的保价物流方式。"
      : "Delivery inquiry detected: include order or serial, destination country, and insured logistics preference.";
  }

  if (intent === "custom" || highValue) {
    return locale === "zh"
      ? "已进入高净值优先线索：建议写明预算、佩戴场景、材质偏好和故事情绪，客服会先做私定方案判断。"
      : "High-value custom lead: include budget, wearing context, material preference, and emotional storyline.";
  }

  if (hasSerial) {
    return locale === "zh"
      ? "已识别作品编号：客服会优先核对该作品状态、定价、付款与交付要求。"
      : "Serial detected: concierge will check availability, price, payment, and delivery requirements first.";
  }

  return locale === "zh"
    ? "你可以先选择咨询类型；填写作品编号或预算后，系统会自动提高线索优先级。"
    : "Choose an inquiry type first; adding a serial or budget automatically improves lead priority.";
}

function buildFallbackMailto(payload: Record<string, FormDataEntryValue>, locale: Locale) {
  const subjectPrefix = locale === "zh" ? "Noirven 询盘" : "Noirven inquiry";
  const product = String(payload.productSerial || "");
  const subject = `${subjectPrefix}${product ? ` ${product}` : ""}`;
  const body = [
    `Name: ${String(payload.name || "")}`,
    `Contact channel: ${String(payload.contactChannel || "")}`,
    `Contact handle: ${String(payload.contactHandle || "")}`,
    `Email: ${String(payload.email || "")}`,
    `Product serial: ${String(payload.productSerial || "")}`,
    `Budget USD: ${String(payload.budgetUsd || "")}`,
    `Intent: ${String(payload.intent || "")}`,
    `Page: ${String(payload.pagePath || "")}`,
    "",
    String(payload.message || ""),
  ].join("\n");

  return `mailto:${conciergeEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function CustomerServiceWidget({ locale = "zh" }: { locale?: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusText, setStatusText] = useState("");
  const [contactChannel, setContactChannel] = useState<(typeof contactChannels)[number]>("wechat");
  const [intent, setIntent] = useState<InquiryIntent>("available_work");
  const [productSerial, setProductSerial] = useState("");
  const [budgetUsd, setBudgetUsd] = useState("");
  const [message, setMessage] = useState("");
  const t = copy[locale];

  const hidden = useMemo(() => Boolean(pathname?.includes("/admin")), [pathname]);
  const guidance = smartGuidance({ locale, intent, productSerial, budgetUsd });

  if (hidden) return null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("sending");
    setStatusText("");

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error("Inquiry failed");
      }

      if (result.mode === "fallback_email" || result.status === "accepted_without_storage") {
        const mailto = buildFallbackMailto(payload, locale);
        setSubmitState("sent");
        setStatusText(`${t.fallback} ${result.fallbackEmail || conciergeEmail}`);
        window.location.href = mailto;
        return;
      }

      event.currentTarget.reset();
      setContactChannel("wechat");
      setIntent("available_work");
      setProductSerial("");
      setBudgetUsd("");
      setMessage("");
      setSubmitState("sent");
      setStatusText(t.sent);
    } catch {
      setSubmitState("error");
      setStatusText(`${t.error}${conciergeEmail}`);
    }
  }

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 sm:right-6">
      {open ? (
        <section className="max-h-[calc(100dvh-7rem)] w-[calc(100vw-2rem)] max-w-[390px] overflow-y-auto overscroll-contain border border-black/12 bg-[var(--porcelain)] shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
          <div className="flex items-start justify-between gap-4 border-b border-black/10 p-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ash)]">{t.subtitle}</p>
              <h2 className="mt-2 text-2xl">{t.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--graphite)]">{t.intro}</p>
            </div>
            <button className="focus-ring border border-black/12 p-2 transition hover:border-[var(--champagne)]" type="button" onClick={() => setOpen(false)} aria-label="Close concierge">
              <X size={16} />
            </button>
          </div>

          <form className="grid gap-4 p-5" onSubmit={onSubmit}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="pagePath" value={pathname ?? ""} />
            <input type="hidden" name="source" value="concierge_widget" />
            <input className="hidden" tabIndex={-1} autoComplete="off" name="company" />

            <div className="border border-black/10 bg-white/35 p-4">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--ash)]">
                <Sparkles size={13} /> {t.smartTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--graphite)]">{guidance}</p>
            </div>

            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--ash)]">{t.intent}</span>
              <select
                className="mt-2 h-11 w-full border border-black/14 bg-transparent px-3 text-sm outline-none focus:border-[var(--champagne)]"
                name="intent"
                value={intent}
                onChange={(event) => setIntent(event.target.value as InquiryIntent)}
              >
                {t.intents.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--ash)]">{t.name}</span>
                <input className="mt-2 h-11 w-full border border-black/14 bg-transparent px-3 text-sm outline-none focus:border-[var(--champagne)]" name="name" minLength={2} required />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--ash)]">{t.channel}</span>
                <select
                  className="mt-2 h-11 w-full border border-black/14 bg-transparent px-3 text-sm outline-none focus:border-[var(--champagne)]"
                  name="contactChannel"
                  value={contactChannel}
                  onChange={(event) => setContactChannel(event.target.value as (typeof contactChannels)[number])}
                >
                  {contactChannels.map((channel) => (
                    <option key={channel} value={channel}>
                      {channel.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--ash)]">{t.contact}</span>
                <input className="mt-2 h-11 w-full border border-black/14 bg-transparent px-3 text-sm outline-none focus:border-[var(--champagne)]" name="contactHandle" placeholder={contactChannel === "wechat" ? "WeChat ID" : ""} />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--ash)]">{t.email}</span>
                <input className="mt-2 h-11 w-full border border-black/14 bg-transparent px-3 text-sm outline-none focus:border-[var(--champagne)]" name="email" type="email" />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--ash)]">{t.product}</span>
                <input
                  className="mt-2 h-11 w-full border border-black/14 bg-transparent px-3 text-sm uppercase outline-none focus:border-[var(--champagne)]"
                  name="productSerial"
                  placeholder="N-0520"
                  value={productSerial}
                  onChange={(event) => setProductSerial(event.target.value.toUpperCase())}
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--ash)]">{t.budget}</span>
                <input
                  className="mt-2 h-11 w-full border border-black/14 bg-transparent px-3 text-sm outline-none focus:border-[var(--champagne)]"
                  name="budgetUsd"
                  type="number"
                  min="1"
                  step="1"
                  value={budgetUsd}
                  onChange={(event) => setBudgetUsd(event.target.value)}
                />
              </label>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--ash)]">{t.quickTitle}</p>
              <div className="mt-2 grid gap-2">
                {t.quickPrompts.map((prompt) => (
                  <button
                    className="focus-ring border border-black/10 px-3 py-2 text-left text-xs leading-5 text-[var(--graphite)] transition hover:border-[var(--champagne)]"
                    key={prompt}
                    type="button"
                    onClick={() => setMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--ash)]">{t.message}</span>
              <textarea
                className="mt-2 min-h-28 w-full resize-none border border-black/14 bg-transparent px-3 py-3 text-sm leading-6 outline-none focus:border-[var(--champagne)]"
                name="message"
                placeholder={t.placeholder}
                minLength={8}
                required
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>

            {statusText ? <p className={`text-sm leading-6 ${submitState === "error" ? "text-[var(--signature-red)]" : "text-[var(--graphite)]"}`}>{statusText}</p> : null}

            <div className="flex items-center gap-3">
              <button className="noir-primary-button focus-ring inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border px-5 py-3 text-[11px] uppercase tracking-[0.14em]" type="submit" disabled={submitState === "sending"}>
                <Send size={14} /> {submitState === "sending" ? t.sending : t.submit}
              </button>
              <a className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-black/14 px-4 text-[11px] uppercase tracking-[0.12em]" href={`mailto:${conciergeEmail}`}>
                {t.mail}
              </a>
            </div>
          </form>
        </section>
      ) : null}

      <button className="noir-primary-button focus-ring inline-flex min-h-12 items-center gap-2 rounded-full border px-5 py-3 text-[11px] uppercase tracking-[0.16em] shadow-[0_18px_50px_rgba(0,0,0,0.18)]" type="button" onClick={() => setOpen((value) => !value)}>
        <MessageCircle size={17} /> {t.button}
      </button>
    </div>
  );
}
