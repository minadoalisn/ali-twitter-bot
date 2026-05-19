import Image from "next/image";
import Link from "next/link";
import { Clock3, Gem, Users } from "lucide-react";
import { categoryLabel, formatCurrency, getTimeLeft } from "@/lib/format";
import { getSeries } from "@/lib/noirven-data";
import type { Locale, Product } from "@/lib/types";
import { withLocale } from "@/lib/i18n";

export function ProductCard({ product, locale = "zh" }: { product: Product; locale?: Locale }) {
  const series = getSeries(product.seriesId);
  const href = withLocale(locale, `/auctions/${product.slug}`);
  const isSold = product.status === "sold";

  return (
    <article className="group border-t border-black/12 pt-5">
      <Link href={href} className="focus-ring block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--ivory)]">
          <Image
            src={product.image}
            alt={`${product.serial} ${product.zhTitle}`}
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
        </div>
      </Link>
      <div className="mt-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
              {series?.name} / {categoryLabel(product.category)}
            </p>
            <h3 className="mt-2 text-xl font-normal text-black">{locale === "zh" ? product.zhTitle : product.title}</h3>
          </div>
          <p className="font-mono text-sm text-black">{formatCurrency(product.currentPrice)}</p>
        </div>
        <p className="text-sm leading-6 text-[var(--graphite)]">{locale === "zh" ? product.inspiration : series?.emotionalLine}</p>
        <div className="grid grid-cols-3 gap-2 border-t border-black/10 pt-4 text-[11px] text-[var(--graphite)]">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={13} /> {isSold ? "Sold" : getTimeLeft(product.endsAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} /> {product.bids}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Gem size={13} /> {formatCurrency(product.depositAmount)}
          </span>
        </div>
      </div>
    </article>
  );
}
