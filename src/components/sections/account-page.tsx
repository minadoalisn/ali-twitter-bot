import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Locale } from "@/lib/types";

function accountNotice(locale: Locale, paymentStatus?: string) {
  if (paymentStatus === "usdt_submitted") {
    return locale === "zh"
      ? "付款凭证已提交。后台确认 USDT 到账后，会登记拥有者、生成订单并安排发货。"
      : "Payment proof submitted. After USDT receipt is confirmed, ownership, order, and delivery will be registered.";
  }

  return "";
}

export function AccountPage({ locale = "zh", paymentStatus }: { locale?: Locale; paymentStatus?: string }) {
  const notice = accountNotice(locale, paymentStatus);

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
            {locale === "zh" ? "管理你的归属、付款凭证与订单档案。" : "Manage ownership, payment proofs, and order archive."}
          </h1>
          <p className="mt-6 text-lg leading-8 text-[var(--graphite)]">
            {locale === "zh"
              ? "作品可公开浏览；提交付款凭证、确认订单与查看发货进度需要登录。"
              : "Works are publicly browsable; payment proof, orders, and delivery status require sign-in."}
          </p>
          {notice ? <p className="mt-6 border border-[var(--champagne)]/60 px-4 py-3 text-sm leading-6 text-black">{notice}</p> : null}
        </div>
        <div className="grid gap-6">
          {[
            [locale === "zh" ? "昵称与公开身份" : "Nickname and public identity", locale === "zh" ? "选择显示昵称或 Private Collector，归属确认后用于作品拥有者展示。" : "Choose a display name or Private Collector for ownership display after confirmation."],
            [locale === "zh" ? "USDT 付款凭证" : "USDT payment proof", locale === "zh" ? "按顶奢定价通过钱包向 BEP-20 USDT 收款地址付款，链上凭证会自动进入后台确认。" : "Pay BEP-20 USDT through the wallet for the ultra-luxury fixed price; the on-chain proof is sent to admin review automatically."],
            [locale === "zh" ? "后台到账确认" : "Admin receipt review", locale === "zh" ? "后台人工核对收款地址、金额、代币合约、确认数与时间戳。" : "Admin checks recipient, amount, token contract, confirmations, and timestamp."],
            [locale === "zh" ? "订单与发货" : "Order and delivery", locale === "zh" ? "到账确认后登记拥有者、确认收货信息并安排发货。" : "After receipt confirmation, ownership, shipping details, and delivery are handled."],
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
