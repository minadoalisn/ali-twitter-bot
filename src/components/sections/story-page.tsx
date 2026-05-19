import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LinkButton } from "@/components/ui/link-button";
import { storySeries } from "@/lib/noirven-data";
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
              ? "Noirven 讲述的是：世界上有些人和有些作品，都曾经被忽略、被错过、被误解，甚至被认为不值得被选择。但真正独一无二的存在，不会因为一时无人出价就失去价值。"
              : "Noirven tells a story about people and works that have been overlooked, missed, or misunderstood. A one-of-one presence does not lose value because it was not chosen at first."}
          </p>
        </section>
        <section className="noir-surface py-20">
          <div className="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/46">N-0007 / Still Here</p>
              <h2 className="mt-5 font-serif text-5xl font-normal text-white">
                {locale === "zh" ? "有一件作品，连续三轮无人出价。" : "One work went unclaimed for three rounds."}
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
                  ? "从那一刻起，Noirven 确定了一条规则：没有作品会因为无人出价而被放弃。它会继续等待，直到遇见唯一的主人。"
                  : "From that moment, Noirven set a rule: no work will be abandoned because it was unclaimed. It will wait until it meets its one owner."}
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
