import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductCard } from "@/components/sections/product-card";
import { liveProducts, storySeries } from "@/lib/noirven-data";
import type { Locale } from "@/lib/types";

export function AuctionPage({ locale = "zh" }: { locale?: Locale }) {
  return (
    <div className="min-h-screen bg-[var(--porcelain)]">
      <SiteHeader locale={locale} />
      <main>
        <section className="section-shell py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ash)]">Seven-Day Auction</p>
          <h1 className="mt-5 max-w-3xl font-serif text-6xl font-normal leading-tight">
            {locale === "zh" ? "七日期限，等待唯一的主人。" : "Seven days, waiting for the one owner."}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--graphite)]">
            {locale === "zh"
              ? "若无人认领，作品将继续等待。Noirven 不让任何独一无二的作品被系统放弃。"
              : "If unclaimed, the work waits again. Noirven does not let a one-of-one piece be discarded by the system."}
          </p>
        </section>
        <section className="section-shell pb-24">
          <div className="mb-10 flex flex-wrap gap-2">
            {storySeries.map((series) => (
              <span key={series.id} className="border border-black/10 px-4 py-2 text-xs text-[var(--graphite)]">
                {series.name}
              </span>
            ))}
          </div>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {liveProducts.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
