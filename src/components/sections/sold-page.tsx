import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductCard } from "@/components/sections/product-card";
import { soldProducts } from "@/lib/noirven-data";
import type { Locale } from "@/lib/types";

export function SoldPage({ locale = "zh" }: { locale?: Locale }) {
  return (
    <div className="min-h-screen bg-[var(--porcelain)]">
      <SiteHeader locale={locale} />
      <main>
        <section className="section-shell py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">Recognized Archive</p>
          <h1 className="mt-5 max-w-4xl font-serif text-6xl font-normal leading-tight">
            {locale === "zh" ? "它曾等待，直到被认出。" : "It waited until it was recognized."}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--graphite)]">
            {locale === "zh"
              ? "已售档案不是普通成交记录，而是作品与主人完成归属后的公开痕迹。"
              : "The archive is not only a sales record. It is the trace left after a work and its owner found belonging."}
          </p>
        </section>
        <section className="section-shell grid gap-10 pb-24 md:grid-cols-2">
          {soldProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
