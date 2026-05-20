import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LinkButton } from "@/components/ui/link-button";
import { categoryLabel, formatCurrency, formatDate, getTimeLeft } from "@/lib/format";
import { getProduct, getSeries } from "@/lib/noirven-data";
import type { Locale } from "@/lib/types";
import { withLocale } from "@/lib/i18n";

type ProductDetailProps = {
  slug: string;
  locale?: Locale;
  paymentStatus?: string;
  minimumBid?: string;
};

function paymentMessage(locale: Locale, status?: string, minimumBid?: string) {
  if (!status) return "";

  const minimum = minimumBid ? formatCurrency(Number(minimumBid)) : "";
  const copy: Record<string, { zh: string; en: string }> = {
    cancelled: {
      zh: "支付已取消，作品仍在等待。你可以重新确认出价并支付保证金。",
      en: "Payment was cancelled. The work is still waiting; you can submit the bid again.",
    },
    minimum: {
      zh: `出价需要达到最低加价${minimum ? `：${minimum}` : "要求"}。`,
      en: `Bid must meet the minimum increment${minimum ? `: ${minimum}` : ""}.`,
    },
    invalid: {
      zh: "出价信息不完整，请重新填写昵称与金额。",
      en: "Bid details are incomplete. Please check nickname and amount.",
    },
    missing: {
      zh: "没有找到对应作品，请从拍卖页重新进入。",
      en: "The auction work was not found. Please enter again from Auctions.",
    },
    sold: {
      zh: "此件已归属，不能继续出价。",
      en: "This work already belongs to someone and cannot receive more bids.",
    },
    stripe_config: {
      zh: "Stripe 支付环境还未配置完成，请先完成支付密钥配置。",
      en: "Stripe payment is not configured yet. Add the payment keys before checkout.",
    },
    stripe_error: {
      zh: "Stripe 暂时无法创建支付，请稍后重试。",
      en: "Stripe could not create the checkout session. Please try again later.",
    },
  };

  return copy[status]?.[locale] || "";
}

export function ProductDetail({ slug, locale = "zh", paymentStatus, minimumBid }: ProductDetailProps) {
  const product = getProduct(slug);
  if (!product) notFound();
  const series = getSeries(product.seriesId);
  const nextBid = product.currentPrice + product.bidIncrement;
  const auctionPath = withLocale(locale, `/auctions/${product.slug}`);
  const notice = paymentMessage(locale, paymentStatus, minimumBid);

  return (
    <div className="min-h-screen bg-[var(--porcelain)]">
      <SiteHeader locale={locale} />
      <main>
        <section className="section-shell grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative aspect-[4/5] overflow-hidden bg-[var(--ivory)]">
            <Image src={product.image} alt={`${product.serial} ${product.zhTitle}`} fill priority className="object-cover" />
          </div>
          <div className="lg:pt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">
              {product.serial} / {series?.name} / {categoryLabel(product.category)}
            </p>
            <h1 className="mt-5 font-serif text-6xl font-normal leading-tight">{locale === "zh" ? product.zhTitle : product.title}</h1>
            <p className="mt-6 text-xl leading-9 text-[var(--graphite)]">{product.inspiration}</p>
            <div className="mt-10 grid grid-cols-2 gap-4 border-y border-black/10 py-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--ash)]">{locale === "zh" ? "当前价" : "Current"}</p>
                <p className="mt-2 font-mono text-2xl">{formatCurrency(product.currentPrice)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--ash)]">{locale === "zh" ? "剩余" : "Left"}</p>
                <p className="mt-2 font-mono text-2xl">{product.status === "sold" ? "Sold" : getTimeLeft(product.endsAt)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--ash)]">{locale === "zh" ? "保证金" : "Deposit"}</p>
                <p className="mt-2 font-mono text-xl">{formatCurrency(product.depositAmount)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--ash)]">{locale === "zh" ? "加价幅度" : "Increment"}</p>
                <p className="mt-2 font-mono text-xl">{formatCurrency(product.bidIncrement)}</p>
              </div>
            </div>
            <p className="mt-8 text-base leading-8 text-[var(--graphite)]">{product.concept}</p>
            {notice ? (
              <p className="mt-6 border border-[var(--signature-red)]/30 px-4 py-3 text-sm leading-6 text-[var(--signature-red)]">
                {notice}
              </p>
            ) : null}
            {product.status === "sold" ? (
              <div className="mt-8 border-y border-black/12 py-6">
                <p className="text-sm leading-7 text-[var(--graphite)]">
                  {locale === "zh"
                    ? "此件已经完成归属登记，仍可浏览材质、故事与唯一刻印档案。"
                    : "This work has completed belonging registration; materials, story, and engraving remain visible."}
                </p>
              </div>
            ) : (
              <form className="mt-8 border-y border-black/12 py-6" action="/api/payments/stripe/checkout" method="post">
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="returnPath" value={auctionPath} />
                <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
                      {locale === "zh" ? "公开昵称" : "Public Nickname"}
                    </span>
                    <input
                      className="mt-3 h-12 w-full border border-black/14 bg-transparent px-4 text-sm outline-none transition focus:border-[var(--champagne)]"
                      name="nickname"
                      defaultValue="Private Collector"
                      minLength={2}
                      maxLength={48}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
                      {locale === "zh" ? "你的出价 USD" : "Your Bid USD"}
                    </span>
                    <input
                      className="mt-3 h-12 w-full border border-black/14 bg-transparent px-4 font-mono text-sm outline-none transition focus:border-[var(--champagne)]"
                      name="amount"
                      type="number"
                      min={nextBid}
                      step={product.bidIncrement}
                      defaultValue={nextBid}
                      required
                    />
                  </label>
                </div>
                <div className="mt-5 flex flex-col gap-3 text-sm leading-6 text-[var(--graphite)] sm:flex-row sm:items-center sm:justify-between">
                  <p>
                    {locale === "zh"
                      ? `本次仅支付保证金 ${formatCurrency(product.depositAmount)}，成交后再结算尾款或 USDT。`
                      : `Pay only the ${formatCurrency(product.depositAmount)} deposit now; final balance or USDT settles after winning.`}
                  </p>
                  <button className="noir-primary-button focus-ring inline-flex min-h-11 items-center justify-center rounded-full border px-6 py-3 text-center text-[12px] font-medium uppercase tracking-[0.12em] transition">
                    {locale === "zh" ? "确认出价并支付保证金" : "Bid And Pay Deposit"}
                  </button>
                </div>
              </form>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={withLocale(locale, "/story")} variant="outline">
                {locale === "zh" ? "理解故事线" : "Read Story"}
              </LinkButton>
            </div>
          </div>
        </section>
        <section className="section-shell grid gap-10 pb-24 md:grid-cols-3">
          <div className="border-t border-black/12 pt-6">
            <h2 className="text-sm uppercase tracking-[0.18em]">{locale === "zh" ? "材质" : "Materials"}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">{product.materials.join(" / ")}</p>
          </div>
          <div className="border-t border-black/12 pt-6">
            <h2 className="text-sm uppercase tracking-[0.18em]">{locale === "zh" ? "工艺" : "Craft"}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">{product.craft.join(" / ")}</p>
          </div>
          <div className="border-t border-black/12 pt-6">
            <h2 className="text-sm uppercase tracking-[0.18em]">{locale === "zh" ? "归属规则" : "Belonging Rule"}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">
              {product.status === "sold"
                ? `${locale === "zh" ? "此件已归于" : "Belongs to"} ${product.ownerNickname} / ${formatDate(product.soldAt ?? product.endsAt)}`
                : locale === "zh"
                  ? "若尚未遇见唯一主人，它将进入下一轮七日等待。"
                  : "If its one owner has not arrived, it will enter another seven-day wait."}
            </p>
          </div>
          <div className="border-t border-black/12 pt-6">
            <h2 className="text-sm uppercase tracking-[0.18em]">{locale === "zh" ? "可调节规格" : "Adjustable Fit"}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">{product.sizing}</p>
          </div>
          <div className="border-t border-black/12 pt-6">
            <h2 className="text-sm uppercase tracking-[0.18em]">{locale === "zh" ? "唯一刻印" : "Unique Engraving"}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">{product.engraving}</p>
          </div>
          <div className="border-t border-black/12 pt-6">
            <h2 className="text-sm uppercase tracking-[0.18em]">{locale === "zh" ? "起拍依据" : "Pricing Basis"}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">{product.pricingBasis}</p>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
