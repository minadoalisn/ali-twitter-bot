import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LinkButton } from "@/components/ui/link-button";
import { categoryLabel, formatCurrency, formatDate, getTimeLeft } from "@/lib/format";
import { getProduct, getSeries } from "@/lib/noirven-data";
import type { Locale } from "@/lib/types";
import { withLocale } from "@/lib/i18n";

export function ProductDetail({ slug, locale = "zh" }: { slug: string; locale?: Locale }) {
  const product = getProduct(slug);
  if (!product) notFound();
  const series = getSeries(product.seriesId);

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
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={withLocale(locale, "/account")}>{locale === "zh" ? "支付保证金并出价" : "Place Bid Deposit"}</LinkButton>
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
                  ? "若无人认领，它将进入下一轮七日等待。"
                  : "If unclaimed, it will enter another seven-day wait."}
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
