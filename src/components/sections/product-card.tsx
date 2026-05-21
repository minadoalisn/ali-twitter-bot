import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Gem, Hash } from "lucide-react";
import { Product360Viewer } from "@/components/ui/product-360-viewer";
import { categoryLabel, formatCurrency } from "@/lib/format";
import { getSeries } from "@/lib/noirven-data";
import { localizedProductInspiration, localizedProductTitle, localizedSeries } from "@/lib/localized-content";
import type { Locale, Product } from "@/lib/types";
import { withLocale } from "@/lib/i18n";

export function ProductCard({ product, locale = "zh" }: { product: Product; locale?: Locale }) {
  const rawSeries = getSeries(product.seriesId);
  const series = rawSeries ? localizedSeries(rawSeries, locale) : null;
  const href = withLocale(locale, `/auctions/${product.slug}`);
  const isSold = product.status === "sold";
  const title = localizedProductTitle(product, locale);

  return (
    <article className="group border-t border-black/12 pt-5">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--ivory)]">
        <Link href={href} className="focus-ring block h-full">
          <Image
            src={product.image}
            alt={`${product.serial} ${title}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-[1.025]"
          />
          <div className="absolute left-4 top-4 bg-[rgba(251,250,246,0.86)] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em]">
            {product.serial}
          </div>
          {isSold ? (
            <div className="absolute bottom-4 left-4 right-4 bg-black px-4 py-3 text-xs text-white">
              {locale === "zh" ? "此件已归于" : "Belongs to"} - {product.ownerNickname}
            </div>
          ) : null}
        </Link>
        <Product360Viewer
          image={product.image}
          title={title}
          serial={product.serial}
          spinVideo={product.spinVideo}
          locale={locale}
        />
      </div>
      <div className="mt-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
              {series?.name} / {categoryLabel(product.category, locale)}
            </p>
            <h3 className="mt-2 text-xl font-normal text-black">{title}</h3>
          </div>
          <p className="font-mono text-sm text-black">{formatCurrency(product.currentPrice)}</p>
        </div>
        <p className="text-sm leading-6 text-[var(--graphite)]">
          {locale === "zh" ? product.inspiration : localizedProductInspiration(product, locale) || series?.emotionalLine}
        </p>
        <Link
          href={href}
          className="focus-ring inline-flex min-h-10 items-center justify-center border border-black/14 px-4 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-black transition hover:border-black hover:bg-black hover:text-white"
        >
          {isSold ? (locale === "zh" ? "查看归属档案" : "View Archive") : locale === "zh" ? "查看并购买" : "View And Purchase"}
        </Link>
        <div className="grid grid-cols-3 gap-2 border-t border-black/10 pt-4 text-[11px] text-[var(--graphite)]">
          <span className="inline-flex items-center gap-1.5">
            <BadgeCheck size={13} /> {isSold ? (locale === "zh" ? "已归属" : "Sold") : locale === "zh" ? "可购买" : "Available"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Hash size={13} /> {product.serial}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Gem size={13} /> USDT
          </span>
        </div>
      </div>
    </article>
  );
}
