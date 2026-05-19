import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { storySeries } from "@/lib/noirven-data";
import type { Locale } from "@/lib/types";

export function SeriesPage({ locale = "zh" }: { locale?: Locale }) {
  return (
    <div className="min-h-screen bg-[var(--porcelain)]">
      <SiteHeader locale={locale} />
      <main>
        <section className="section-shell py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">Story Series</p>
          <h1 className="mt-5 max-w-4xl font-serif text-6xl font-normal leading-tight">
            {locale === "zh" ? "首批产品线以故事线为核心，而不是以商品分类为核心。" : "The first product lines are built around storylines, not categories."}
          </h1>
        </section>
        <section className="section-shell space-y-16 pb-24">
          {storySeries.map((series, index) => (
            <article id={series.id} key={series.id} className="grid gap-8 border-t border-black/12 pt-10 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ash)]">
                  0{index + 1} / {series.name}
                </p>
                <h2 className="mt-4 font-serif text-5xl font-normal">{locale === "zh" ? series.zhName : series.name}</h2>
                <p className="mt-5 text-xl leading-9 text-black">{locale === "zh" ? series.emotionalLine : series.theme}</p>
              </div>
              <div>
                <p className="text-lg leading-8 text-[var(--graphite)]">{series.description}</p>
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.18em] text-[var(--ash)]">{locale === "zh" ? "材质" : "Materials"}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--graphite)]">{series.materials.join(" / ")}</p>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.18em] text-[var(--ash)]">{locale === "zh" ? "工艺" : "Craft"}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--graphite)]">{series.craft.join(" / ")}</p>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.18em] text-[var(--ash)]">{locale === "zh" ? "记忆元素" : "Memory"}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--graphite)]">{series.visualMemory.join(" / ")}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
