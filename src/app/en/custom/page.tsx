import { createMetadata } from "@/lib/seo";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata = createMetadata({
  title: "Custom Jewelry",
  description: "Noirven custom jewelry: a clear process, timelines, materials, and a practical FAQ for bespoke work.",
  path: "/en/custom",
});

export default function Page() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nvonly.com";
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is Noirven custom made for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For gifts, weddings, anniversaries, symbolic designs, or anyone who wants a specific material, size, or wearable detail. The goal is a restrained light-luxury language with confirmable, transparent specs.",
        },
      },
      {
        "@type": "Question",
        name: "What is the custom process?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Typically: intent chat, proposal confirmation, payment and production, then delivery and archive. Steps may vary by complexity.",
        },
      },
      {
        "@type": "Question",
        name: "How long does it take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Timing depends on complexity and material sourcing. After confirmation, we provide an executable schedule and share key milestones during production.",
        },
      },
      {
        "@type": "Question",
        name: "How does this relate to one-of-one works?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The collection presents numbered one-of-one works at fixed ownership prices; custom is for building a dedicated plan under clear requirements. Both emphasize traceability, clarity, and one-to-one narrative intent.",
        },
      },
    ],
  } as const;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Noirven", item: `${siteUrl}/en` },
      { "@type": "ListItem", position: 2, name: "Custom Jewelry", item: `${siteUrl}/en/custom` },
    ],
  } as const;

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/en/custom#webpage`,
    url: `${siteUrl}/en/custom`,
    name: "Custom Jewelry | Noirven",
    inLanguage: "en",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
  } as const;

  return (
    <div className="min-h-screen bg-[var(--porcelain)]">
      <SiteHeader locale="en" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <main className="section-shell py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ash)]">Custom / Bespoke</p>
        <h1 className="mt-4 max-w-3xl font-serif text-6xl font-normal leading-tight">Custom Jewelry</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--graphite)]">
          This page is designed to make requirements explicit: use case, story tone, budget range, target date, sizing, and material preferences.
          Once confirmed, we turn it into an executable production plan.
        </p>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="border border-black/10 bg-white/50 p-6">
            <h2 className="text-lg">1. Intent</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--graphite)]">Share your use case, preferred series tone, budget range, and target delivery date.</p>
          </div>
          <div className="border border-black/10 bg-white/50 p-6">
            <h2 className="text-lg">2. Confirmation</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--graphite)]">We confirm materials, main and secondary stones, proportions, sizing, and key craft choices.</p>
          </div>
          <div className="border border-black/10 bg-white/50 p-6">
            <h2 className="text-lg">3. Production</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--graphite)]">We set milestones, share progress at critical steps, and arrange delivery and archiving after completion.</p>
          </div>
        </section>

        <section className="mt-14 max-w-4xl border-t border-black/12 pt-10">
          <h2 className="font-serif text-4xl font-normal">FAQ</h2>
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
      <SiteFooter locale="en" />
    </div>
  );
}
