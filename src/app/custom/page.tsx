import { createMetadata } from "@/lib/seo";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata = createMetadata({
  title: "定制珠宝",
  description:
    "Noirven 诺梵定制珠宝：从意向到确认，提供材质、尺寸、预算与交付时间的清晰流程，便于快速沟通与可执行制作计划。",
  path: "/custom",
});

export default function Page() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Noirven 的定制服务适合什么需求？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "适合纪念礼物、婚礼、周年、符号化设计，或希望在材质与尺寸上做专属调整的需求。我们强调克制的轻奢语言，并保持信息透明与可确认。",
        },
      },
      {
        "@type": "Question",
        name: "定制流程是什么？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "通常包含：意向沟通（用途、风格、预算、时间）到方案确认（材质、主石与细节）到付款与制作，再到交付与归档。具体环节会随复杂度调整。",
        },
      },
      {
        "@type": "Question",
        name: "交付周期一般多久？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "周期取决于款式复杂度与工艺，例如珐琅、特殊镶嵌等，以及材料供应情况。沟通确认后，我们会给出可执行的时间预期。",
        },
      },
      {
        "@type": "Question",
        name: "定制与顶奢作品的关系是什么？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "顶奢作品用于呈现已编号的顶级奢侈品级一对一作品；定制服务用于在明确需求下建立专属方案。两者都强调可追溯、可确认与一对一的作品叙事。",
        },
      },
    ],
  } as const;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Noirven", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "定制珠宝", item: `${siteUrl}/custom` },
    ],
  } as const;

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/custom#webpage`,
    url: `${siteUrl}/custom`,
    name: "定制珠宝 | Noirven",
    inLanguage: "zh-CN",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
  } as const;

  return (
    <div className="min-h-screen bg-[var(--porcelain)]">
      <SiteHeader locale="zh" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <main className="section-shell py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">Custom / Bespoke</p>
        <h1 className="mt-4 max-w-3xl font-serif text-6xl font-normal leading-tight">定制珠宝</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--graphite)]">
          这是一个用于把需求说清楚的页面：用途、风格、预算、时间、尺寸与材质偏好。确认之后，再进入可执行的制作计划。
        </p>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="border border-black/10 bg-white/50 p-6">
            <h2 className="text-lg">1. 意向沟通</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--graphite)]">告诉我们佩戴场景、偏好的系列气质、预算区间与期望交付时间。</p>
          </div>
          <div className="border border-black/10 bg-white/50 p-6">
            <h2 className="text-lg">2. 方案确认</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--graphite)]">明确金属、主石与点缀宝石、比例与尺寸，以及关键工艺选择。</p>
          </div>
          <div className="border border-black/10 bg-white/50 p-6">
            <h2 className="text-lg">3. 制作与交付</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--graphite)]">根据复杂度制定里程碑计划，制作期间同步关键节点，完成后安排交付与归档。</p>
          </div>
        </section>

        <section className="mt-14 max-w-4xl border-t border-black/12 pt-10">
          <h2 className="font-serif text-4xl font-normal">常见问答</h2>
          <div className="mt-8 grid gap-6">
            {faqJsonLd.mainEntity.map((item) => (
              <article key={item.name} className="border border-black/10 bg-white/40 p-6">
                <h3 className="text-base">{item.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--graphite)]">{item.acceptedAnswer.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter locale="zh" />
    </div>
  );
}
