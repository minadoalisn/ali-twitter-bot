import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductCard } from "@/components/sections/product-card";
import { liveProducts, storySeries } from "@/lib/noirven-data";
import { withLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type AuctionSearchParams = Record<string, string | string[] | undefined>;

const pageSize = 9;

function readParam(searchParams: AuctionSearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function serialNumber(serial: string) {
  return Number(serial.replace(/\D/g, "")) || 0;
}

function auctionHref(locale: Locale, seriesId: string, page = 1) {
  const query = new URLSearchParams();

  if (seriesId !== "all") query.set("series", seriesId);
  if (page > 1) query.set("page", String(page));

  const qs = query.toString();
  return `${withLocale(locale, "/auctions")}${qs ? `?${qs}` : ""}`;
}

export function AuctionPage({ locale = "zh", searchParams = {} }: { locale?: Locale; searchParams?: AuctionSearchParams }) {
  const requestedSeries = readParam(searchParams, "series") ?? "all";
  const selectedSeries = storySeries.some((series) => series.id === requestedSeries) ? requestedSeries : "all";
  const sortedProducts = [...liveProducts].sort((a, b) => serialNumber(b.serial) - serialNumber(a.serial));
  const filteredProducts = selectedSeries === "all" ? sortedProducts : sortedProducts.filter((product) => product.seriesId === selectedSeries);
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const requestedPage = Number(readParam(searchParams, "page") ?? "1");
  const currentPage = Math.min(Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1), pageCount);
  const pageProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-[var(--porcelain)]">
      <SiteHeader locale={locale} />
      <main>
        <section className="section-shell py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ash)]">Seven-Day Belonging</p>
          <h1 className="mt-5 max-w-3xl font-serif text-6xl font-normal leading-tight">
            {locale === "zh" ? "七日期限，等待唯一的主人。" : "Seven days, waiting for the one owner."}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--graphite)]">
            {locale === "zh"
              ? "这里不是普通拍卖场，而是独一作品的七日归属窗口。新品按编号优先展示，满页后进入下一页，也可以按故事线筛选。"
              : "This is not a commodity auction room; it is a seven-day belonging window for one-of-one works. New pieces appear first, paginate after a full page, and can be filtered by series."}
          </p>
        </section>
        <section className="section-shell pb-24">
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href={auctionHref(locale, "all")}
              className={`focus-ring border px-4 py-2 text-xs transition ${
                selectedSeries === "all" ? "border-black bg-black text-white" : "border-black/10 text-[var(--graphite)] hover:border-black/40"
              }`}
            >
              {locale === "zh" ? "全部故事线" : "All Series"}
            </Link>
            {storySeries.map((series) => (
              <Link
                key={series.id}
                href={auctionHref(locale, series.id)}
                className={`focus-ring border px-4 py-2 text-xs transition ${
                  selectedSeries === series.id ? "border-black bg-black text-white" : "border-black/10 text-[var(--graphite)] hover:border-black/40"
                }`}
              >
                {locale === "zh" ? series.zhName : series.name}
              </Link>
            ))}
          </div>

          <div className="mb-10 flex items-center justify-between gap-4 border-y border-black/10 py-4 text-xs text-[var(--graphite)]">
            <p>
              {locale === "zh"
                ? `共 ${filteredProducts.length} 件 / 第 ${currentPage} 页`
                : `${filteredProducts.length} works / Page ${currentPage}`}
            </p>
            <p className="font-mono uppercase tracking-[0.16em]">{selectedSeries === "all" ? "Newest First" : selectedSeries}</p>
          </div>

          {pageProducts.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {pageProducts.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="border border-black/10 p-10 text-sm text-[var(--graphite)]">
              {locale === "zh" ? "这一条故事线暂时没有正在等待的作品。" : "This storyline has no waiting works yet."}
            </div>
          )}

          {pageCount > 1 ? (
            <nav className="mt-14 flex flex-wrap items-center justify-center gap-2" aria-label="Auction pagination">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                <Link
                  key={page}
                  href={auctionHref(locale, selectedSeries, page)}
                  className={`focus-ring inline-flex h-10 min-w-10 items-center justify-center border px-3 text-sm ${
                    currentPage === page ? "border-black bg-black text-white" : "border-black/10 text-[var(--graphite)] hover:border-black/40"
                  }`}
                >
                  {page}
                </Link>
              ))}
            </nav>
          ) : null}
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
