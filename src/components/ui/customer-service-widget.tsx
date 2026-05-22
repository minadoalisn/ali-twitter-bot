"use client";

import { FormEvent, useMemo, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/types";

type SubmitState = "idle" | "sending" | "sent" | "error";

const conciergeEmail = process.env.NEXT_PUBLIC_NOIRVEN_CONCIERGE_EMAIL || "concierge@nvonly.com";

const copy = {
  zh: {
    button: "在线客服",
    title: "在线客服",
    subtitle: "Luxury Concierge",
    intro: "告诉我们你想咨询的作品、预算或定制方向，客服会按询盘优先级跟进。",
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
    submit: "提交询盘",
    sending: "提交中",
    sent: "询盘已提交，后台会进入客服跟进。",
    error: "询盘暂时未保存，请稍后再试，或发送邮件至 ",
    mail: "邮件咨询",
  },
  en: {
    button: "Concierge",
    title: "Online Concierge",
    subtitle: "Luxury Concierge",
    intro: "Tell us the work, budget, or custom direction you want to discuss. The concierge team will follow up by priority.",
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
    submit: "Send Inquiry",
    sending: "Sending",
    sent: "Inquiry submitted. It will enter concierge follow-up.",
    error: "Inquiry could not be saved. Try again later, or email ",
    mail: "Email Concierge",
  },
} as const;

const contactChannels = ["email", "wechat", "whatsapp", "telegram", "phone", "other"] as const;

export function CustomerServiceWidget({ locale = "zh" }: { locale?: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusText, setStatusText] = useState("");
  const [contactChannel, setContactChannel] = useState<(typeof contactChannels)[number]>("wechat");
  const t = copy[locale];

  const hidden = useMemo(() => Boolean(pathname?.includes("/admin")), [pathname]);

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

      if (!response.ok) {
        throw new Error("Inquiry failed");
      }

      event.currentTarget.reset();
      setContactChannel("wechat");
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
        <section className="w-[calc(100vw-2rem)] max-w-[390px] border border-black/12 bg-[var(--porcelain)] shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
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

            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--ash)]">{t.intent}</span>
              <select className="mt-2 h-11 w-full border border-black/14 bg-transparent px-3 text-sm outline-none focus:border-[var(--champagne)]" name="intent" defaultValue="available_work">
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
                <input className="mt-2 h-11 w-full border border-black/14 bg-transparent px-3 text-sm uppercase outline-none focus:border-[var(--champagne)]" name="productSerial" placeholder="N-0520" />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--ash)]">{t.budget}</span>
                <input className="mt-2 h-11 w-full border border-black/14 bg-transparent px-3 text-sm outline-none focus:border-[var(--champagne)]" name="budgetUsd" type="number" min="1" step="1" />
              </label>
            </div>

            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--ash)]">{t.message}</span>
              <textarea className="mt-2 min-h-28 w-full resize-none border border-black/14 bg-transparent px-3 py-3 text-sm leading-6 outline-none focus:border-[var(--champagne)]" name="message" placeholder={t.placeholder} minLength={8} required />
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
