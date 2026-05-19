import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { storySeries } from "@/lib/noirven-data";
import type { Locale } from "@/lib/types";
import { withLocale } from "@/lib/i18n";

export function SeriesGrid({ locale = "zh" }: { locale?: Locale }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {storySeries.map((series, index) => (
        <Link
          key={series.id}
          href={withLocale(locale, `/series#${series.id}`)}
          className="focus-ring group border-t border-black/12 py-6 transition hover:border-[var(--champagne)]"
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ash)]">
                0{index + 1} / {series.name}
              </p>
              <h3 className="mt-4 text-3xl font-normal text-black">{locale === "zh" ? series.zhName : series.name}</h3>
            </div>
            <ArrowUpRight className="mt-2 text-[var(--ash)] transition group-hover:text-[var(--champagne)]" size={18} />
          </div>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--graphite)]">
            {locale === "zh" ? series.emotionalLine : series.theme}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {series.materials.slice(0, 4).map((material) => (
              <span key={material} className="border border-black/10 px-3 py-2 text-xs text-[var(--graphite)]">
                {material}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}
