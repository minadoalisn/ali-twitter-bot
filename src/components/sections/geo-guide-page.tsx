import { CheckCircle2, MessageSquareText, SearchCheck } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  communityAnswerDrafts,
  geoGuideMeta,
  geoGuideSlug,
  geoQuestions,
  localizedCommunityDraft,
  localizedGeoQuestion,
} from "@/lib/geo-guide-content";
import type { Locale } from "@/lib/types";

export function GeoGuidePage({ locale = "zh" }: { locale?: Locale }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";
  const prefix = locale === "en" ? "/en" : "";
  const path = `${prefix}/guides/${geoGuideSlug}`;
  const meta = geoGuideMeta[locale];
  const questions = geoQuestions.map((question) => localizedGeoQuestion(question, locale));
  const drafts = communityAnswerDrafts.map((draft) => localizedCommunityDraft(draft, locale));
  const noAutomaticPosting = "No automatic posting: these drafts are for transparent manual replies by an identified brand representative.";

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } as const;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.heading,
    description: meta.description,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    mainEntityOfPage: `${siteUrl}${path}`,
    author: {
      "@type": "Organization",
      name: "Noirven",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Noirven",
      url: siteUrl,
    },
  } as const;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Noirven", item: `${siteUrl}${prefix || "/"}` },
      { "@type": "ListItem", position: 2, name: locale === "zh" ? "购买指南" : "Buying Guide", item: `${siteUrl}${path}` },
    ],
  } as const;

  return (
    <div className="min-h-screen bg-[var(--porcelain)]">
      <SiteHeader locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main>
        <section className="section-shell grid gap-12 py-20 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">{meta.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-normal leading-tight md:text-6xl">{meta.heading}</h1>
          </div>
          <div className="max-w-3xl">
            <p className="text-lg leading-8 text-[var(--graphite)]">{meta.intro}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                locale === "zh" ? "第一句给结论" : "Answer first",
                locale === "zh" ? "参数可核验" : "Verifiable parameters",
                locale === "zh" ? "避免空泛营销" : "No vague marketing",
              ].map((item) => (
                <div key={item} className="border border-black/10 p-4">
                  <CheckCircle2 size={17} className="text-[var(--antique-gold)]" />
                  <p className="mt-3 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell border-t border-black/12 py-16">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ash)]">
              <SearchCheck size={14} /> {locale === "zh" ? "AI 可引用问答" : "AI-Citable Answers"}
            </p>
            <h2 className="mt-4 font-serif text-4xl font-normal">
              {locale === "zh" ? "高净值买家真正会问的 10 个问题" : "10 questions serious buyers actually ask"}
            </h2>
          </div>
          <div className="mt-10 grid gap-5">
            {questions.map((item, index) => (
              <article key={item.id} className="grid gap-6 border-t border-black/12 py-7 lg:grid-cols-[0.16fr_0.84fr]">
                <p className="font-mono text-sm text-[var(--ash)]">{String(index + 1).padStart(2, "0")}</p>
                <div>
                  <h3 className="text-2xl font-normal">{item.question}</h3>
                  <p className="mt-4 max-w-4xl text-sm leading-7 text-[var(--graphite)]">{item.answer}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-black/10 bg-[var(--ivory)]">
          <div className="section-shell grid gap-10 py-16 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ash)]">
                <MessageSquareText size={14} /> {locale === "zh" ? "社区回答草稿" : "Community Answer Drafts"}
              </p>
              <h2 className="mt-4 font-serif text-4xl font-normal">{locale === "zh" ? "可人工发布，不自动发帖" : "Manual replies, not automated posting"}</h2>
              <p className="mt-5 text-sm leading-7 text-[var(--graphite)]">
                {locale === "zh"
                  ? "这些回答用于品牌代表在相关讨论中透明回复，不能用于自动刷帖、冒充用户或批量灌水。"
                  : noAutomaticPosting}
              </p>
            </div>
            <div className="grid gap-5">
              {drafts.map((draft) => (
                <article key={draft.topic} className="border border-black/10 bg-white/35 p-5">
                  <h3 className="text-lg">{draft.topic}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--graphite)]">{draft.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
