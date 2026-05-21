import Link from "next/link";
import { BrandMark } from "@/components/ui/brand-mark";
import { navCopy, withLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function SiteHeader({ locale = "zh" }: { locale?: Locale }) {
  const copy = navCopy[locale];
  const alternateLocale = locale === "zh" ? "en" : "zh";

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[rgba(251,250,246,0.86)] backdrop-blur-xl">
      <div className="section-shell flex min-h-[72px] items-center justify-between gap-6 py-3">
        <nav className="hidden items-center gap-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--graphite)] lg:flex">
          <Link className="focus-ring" href={withLocale(locale, "/auctions")}>
            {copy.auctions}
          </Link>
          <Link className="focus-ring" href={withLocale(locale, "/custom")}>
            {copy.custom}
          </Link>
          <Link className="focus-ring" href={withLocale(locale, "/series")}>
            {copy.series}
          </Link>
          <Link className="focus-ring" href={withLocale(locale, "/sold")}>
            {copy.sold}
          </Link>
        </nav>
        <div className="flex flex-1 justify-start lg:justify-center">
          <BrandMark href={withLocale(locale, "/")} compact />
        </div>
        <div className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--graphite)]">
          <Link className="focus-ring hidden sm:inline" href={withLocale(locale, "/story")}>
            {copy.story}
          </Link>
          <Link className="focus-ring hidden sm:inline" href={withLocale(locale, "/account")}>
            {copy.account}
          </Link>
          <Link className="focus-ring" href={alternateLocale === "en" ? "/en" : "/"}>
            {alternateLocale === "en" ? "EN" : "ZH"}
          </Link>
          <Link
            href={withLocale(locale, "/auctions")}
            className="focus-ring rounded-full border border-black/14 px-4 py-3 text-[10px] text-black transition hover:border-[var(--champagne)]"
          >
            {locale === "zh" ? "归属" : "Belong"}
          </Link>
        </div>
      </div>
    </header>
  );
}
