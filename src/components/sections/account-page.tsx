import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Locale } from "@/lib/types";

export function AccountPage({ locale = "zh" }: { locale?: Locale }) {
  return (
    <div className="min-h-screen bg-[var(--porcelain)]">
      <SiteHeader locale={locale} />
      <main className="section-shell grid gap-12 py-20 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">Collector Account</p>
            <form action="/api/auth/logout" method="post">
              <input type="hidden" name="next" value={locale === "zh" ? "/account/login" : "/en/account/login"} />
              <button className="focus-ring rounded-full border border-black/14 px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-black transition hover:border-[var(--champagne)]">
                {locale === "zh" ? "退出登录" : "Sign Out"}
              </button>
            </form>
          </div>
          <h1 className="mt-5 font-serif text-6xl font-normal leading-tight">
            {locale === "zh" ? "管理你的出价、保证金与归属档案。" : "Manage bids, deposits, and belonging archive."}
          </h1>
          <p className="mt-6 text-lg leading-8 text-[var(--graphite)]">
            {locale === "zh"
              ? "MVP 会接入 Supabase Auth。当前页面展示账户能力和支付流程边界。"
              : "The MVP will use Supabase Auth. This page shows the account and payment flow boundary."}
          </p>
        </div>
        <div className="grid gap-6">
          {[
            [locale === "zh" ? "昵称与公开身份" : "Nickname and public identity", locale === "zh" ? "选择显示昵称或 Private Collector。" : "Choose a display name or Private Collector."],
            [locale === "zh" ? "保证金支付" : "Bid deposit", locale === "zh" ? "Stripe 支付保证金，成交后支付尾款。" : "Stripe deposit first, balance after winning."],
            [locale === "zh" ? "USDT 尾款确认" : "USDT balance review", locale === "zh" ? "提交 BEP-20 USDT 交易哈希，后台半自动审核。" : "Submit BEP-20 USDT transaction hash for admin review."],
            [locale === "zh" ? "订单与发货" : "Order and delivery", locale === "zh" ? "成交后确认收货信息、制作状态和物流。" : "Confirm shipping details, production status, and delivery."],
          ].map(([title, text]) => (
            <section key={title} className="border-t border-black/12 pt-6">
              <h2 className="text-2xl">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--graphite)]">{text}</p>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
