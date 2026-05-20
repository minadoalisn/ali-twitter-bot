import Image from "next/image";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LinkButton } from "@/components/ui/link-button";
import { dailyProductSeeds, getSeries, materialNarratives, storyChapters, storySeries } from "@/lib/noirven-data";
import { withLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function StoryPage({ locale = "zh" }: { locale?: Locale }) {
  return (
    <div className="min-h-screen bg-[var(--porcelain)]">
      <SiteHeader locale={locale} />
      <main>
        <section className="section-shell py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">Final Brand Story</p>
          <h1 className="mt-5 max-w-4xl font-serif text-6xl font-normal leading-tight">
            {locale === "zh" ? "没有滞销品，只有还未遇见主人的作品。" : "There are no unwanted works, only works that have not met their owner yet."}
          </h1>
          <p className="mt-8 max-w-3xl text-xl leading-10 text-[var(--graphite)]">
            {locale === "zh"
              ? "Noirven 讲述的是：世界上有些人和有些作品，都曾经被忽略、被错过、被误解，甚至被认为不值得被选择。但真正独一无二的存在，不会因为一时尚未被确认就失去价值。"
              : "Noirven tells a story about people and works that have been overlooked, missed, or misunderstood. A one-of-one presence does not lose value because it was not chosen at first."}
          </p>
        </section>
        <section className="noir-surface py-20">
          <div className="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/46">N-0007 / Still Here</p>
              <h2 className="mt-5 font-serif text-5xl font-normal text-white">
                {locale === "zh" ? "有一件作品，连续三轮仍在等待。" : "One work waited through three rounds."}
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-9 text-white/68">
              <p>
                {locale === "zh"
                  ? "它没有耀眼到让所有人停下，也没有像流行款那样容易被理解。它只是安静地停在页面上，编号 N-0007，名字叫《第七日的光》。"
                  : "It was not dazzling enough to stop everyone, and it was not easy to understand like a trend piece. It simply waited on the page, numbered N-0007, named Seventh Light."}
              </p>
              <p>
                {locale === "zh"
                  ? "直到最后一小时，一个匿名用户出价。她留下昵称 Still Here，并写道：我也曾经以为，自己不会再被选择。"
                  : "In the final hour, an anonymous user placed a bid. She left the nickname Still Here and wrote: I once thought I would never be chosen again."}
              </p>
              <p>
                {locale === "zh"
                  ? "从那一刻起，Noirven 确定了一条规则：没有作品会因为尚未归属而被放弃。它会继续等待，直到与唯一的主人互相确认。"
                  : "From that moment, Noirven set a rule: no work will be abandoned because its owner has not arrived. It will wait until it meets its one owner."}
              </p>
            </div>
          </div>
        </section>
        <section className="section-shell py-20">
          <div className="mb-12 max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ash)]">Series As IP</p>
            <h2 className="mt-4 font-serif text-5xl font-normal">{locale === "zh" ? "每个系列是一条可延展故事线。" : "Each series is an expandable storyline."}</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {storySeries.map((series) => (
              <article key={series.id} className="border-t border-black/12 pt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ash)]">{series.name}</p>
                <h3 className="mt-4 text-3xl">{locale === "zh" ? series.zhName : series.name}</h3>
                <p className="mt-5 text-lg leading-8 text-[var(--graphite)]">{locale === "zh" ? series.ipHook : series.description}</p>
              </article>
            ))}
          </div>
          <section className="mt-20 border-t border-black/12 pt-10">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ash)]">Daily Story Growth</p>
                <h2 className="mt-4 font-serif text-5xl font-normal">
                  {locale === "zh" ? "故事会继续生长。" : "The story keeps growing."}
                </h2>
                <p className="mt-5 text-sm leading-7 text-[var(--graphite)]">
                  {locale === "zh"
                    ? "每天新增故事章节和产品方向，先进入策展草案，确认配图、编号、材质和起拍价后再上架拍卖。"
                    : "New chapters and product directions enter curation daily, then move to auction after imagery, serials, materials, and pricing are confirmed."}
                </p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {storyChapters.map((chapter) => {
                  const series = getSeries(chapter.seriesId);
                  const chapterSeed = dailyProductSeeds.find((seed) => seed.seriesId === chapter.seriesId);

                  return (
                    <article key={chapter.code} className="overflow-hidden border border-black/10">
                      {chapterSeed ? (
                        <div className="relative aspect-[16/10] bg-[var(--ivory)]">
                          <Image
                            src={chapterSeed.image}
                            alt={`${chapterSeed.serial} ${chapterSeed.zhTitle}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      <div className="p-5">
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
                          {chapter.code} / {series?.name}
                        </p>
                        <h3 className="mt-4 text-2xl">{chapter.title}</h3>
                        <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">{chapter.summary}</p>
                        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--antique-gold)]">{chapter.emotion}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
          <section className="mt-20 border-t border-black/12 pt-10">
            <div className="mb-10 max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ash)]">Material Story Codes</p>
              <h2 className="mt-4 font-serif text-5xl font-normal">
                {locale === "zh" ? "每一种材质都有自己的叙事职责。" : "Every material carries a narrative role."}
              </h2>
              <p className="mt-5 text-sm leading-7 text-[var(--graphite)]">
                {locale === "zh"
                  ? "材质不是堆砌价格，而是替故事承担情绪：夜色金属负责克制，档案之光负责保存，裁决之绿负责证明，灰烬盛开负责反转。"
                  : "Materials are not price stacking. They carry emotion: night metal restrains, archive light preserves, verdict green proves, burned bloom reverses."}
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {materialNarratives.map((item) => (
                <article key={item.title} className="border border-black/10 p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">{item.title}</p>
                  <h3 className="mt-4 text-2xl">{locale === "zh" ? item.zhTitle : item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--graphite)]">{locale === "zh" ? item.story : item.materials.join(" / ")}</p>
                  <p className="mt-5 text-xs leading-6 text-[var(--ash)]">{[...item.materials, ...item.craft].join(" / ")}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="mt-20 border-t border-black/12 pt-10">
            <div className="mb-10 max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ash)]">Next Product Seeds</p>
              <h2 className="mt-4 font-serif text-5xl font-normal">
                {locale === "zh" ? "下一批产品不再只依赖金银。" : "The next products move beyond gold and silver."}
              </h2>
              <p className="mt-5 text-sm leading-7 text-[var(--graphite)]">
                {locale === "zh"
                  ? "黑铑铂金、钯金、陨铁、黑陶瓷、碳纤维、帕拉伊巴碧玺、沙弗莱石、欧泊、月光石、黑贝母、烟晶与半透明珐琅会成为新的材质记忆，让 Noirven 的产品语言更容易被辨认。"
                  : "Black rhodium platinum, palladium, meteorite, black ceramic, carbon fiber, paraiba tourmaline, tsavorite, opal, moonstone, black nacre, smoky quartz, and translucent enamel become new material memories."}
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {dailyProductSeeds.map((seed) => {
                const series = getSeries(seed.seriesId);

                return (
                  <article key={seed.serial} className="overflow-hidden border border-black/10">
                    <div className="relative aspect-[4/5] bg-[var(--ivory)]">
                      <Image
                        src={seed.image}
                        alt={`${seed.serial} ${seed.zhTitle}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="grid min-h-[280px] p-5">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
                          {seed.serial} / {series?.name}
                        </p>
                        <h3 className="mt-4 text-2xl leading-tight">{seed.zhTitle}</h3>
                      </div>
                      <div className="mt-8 space-y-5 self-end text-sm leading-7 text-[var(--graphite)]">
                        <p>{seed.storyLine}</p>
                        <p>
                          <span className="text-black">{locale === "zh" ? "材质：" : "Materials: "}</span>
                          {seed.materialLine}
                        </p>
                        <p>
                          <span className="text-black">{locale === "zh" ? "工艺：" : "Craft: "}</span>
                          {seed.craftLine}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
          <div className="mt-12">
            <LinkButton href={withLocale(locale, "/series")} variant="outline">
              {locale === "zh" ? "查看故事系列" : "View Story Series"}
            </LinkButton>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
