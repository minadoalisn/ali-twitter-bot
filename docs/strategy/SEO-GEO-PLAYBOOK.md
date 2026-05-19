# Noirven 诺梵 SEO / GEO / Crawler Playbook

## 1. Position

Noirven 诺梵 is not a mass ecommerce jewelry site. SEO and GEO must support a high-luxury private commission brand:

- Search intent: private custom jewelry, haute joaillerie, bespoke engagement ring, one-of-one gemstone jewelry, high jewelry atelier.
- Brand intent: Noirven 诺梵, 暗夜中的神圣孤品, 私人高定珠宝, 高奢首饰定制.
- Conversion intent: book a private advisor, submit a commission brief, inquire about gemstone sourcing, request a private appointment.
- Trust intent: craftsmanship, gem origin, certification, process, materials, privacy, aftercare.

Primary GEO meaning in this project:

- Generative Engine Optimization: making Noirven easy for AI search, AI Overviews, browser agents, and answer engines to understand, cite, and route users toward.

Secondary GEO meaning:

- Geographic/local optimization: if Noirven later has a showroom, private salon, or region-specific service pages, add local business details, localized landing pages, and multilingual `hreflang`.

## 2. Current External References

Scrapling:

- GitHub: https://github.com/D4Vinci/Scrapling
- Docs: https://scrapling.readthedocs.io/en/latest/

Google:

- AI search optimization guide, last updated 2026-05-15: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- SEO starter guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Search Essentials: https://developers.google.com/search/docs/essentials
- Ecommerce structured data: https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce
- Agent-friendly websites, last updated 2026-04-01: https://web.dev/articles/ai-agent-site-ux

## 3. What We Learned From Scrapling

Scrapling is useful for our project as a research and audit layer, not as a growth hack.

Relevant capabilities:

- `Fetcher`, `AsyncFetcher`: fast static page fetching.
- `DynamicFetcher`: browser-backed crawling for JavaScript-heavy luxury sites.
- `StealthyFetcher`: stronger browser automation when normal fetching fails.
- `Spider`: async multi-page crawler.
- `CrawlSpider`: rule-based crawl for category, collection, and article pages.
- `SitemapSpider`: ideal for SEO audits because it starts from sitemap or robots-defined sitemaps.
- `robots_txt_obey = True`: important for compliant research crawling.
- `allowed_domains`: keeps crawls scoped.
- Built-in JSON / JSONL export.
- Adaptive selectors: useful when competitor sites change markup.
- MCP / AI integration: useful later if we want an agent to extract targeted page facts before summarizing.

Install command when we need it:

```bash
pip install "scrapling[fetchers]"
scrapling install
```

For simple metadata audits:

```bash
pip install scrapling
```

## 4. Ethical Crawling Rules

Noirven crawler work must be conservative:

- Respect robots.txt.
- Use `allowed_domains`.
- Use low concurrency and download delays.
- Prefer public sitemap URLs where available.
- Do not scrape private, account-only, checkout, or blocked content.
- Do not bypass access controls.
- Do not copy competitor text, product names, photography, or brand identity.
- Use crawled data only for structure analysis: title patterns, URL architecture, schema types, internal linking, content depth, metadata completeness, and page experience signals.

Default crawler settings:

```python
robots_txt_obey = True
concurrent_requests = 4
concurrent_requests_per_domain = 2
download_delay = 1.5
```

## 5. Competitor Audit Targets

Use crawler audits for public site structure and metadata:

- Cartier high jewelry
- Van Cleef & Arpels high jewelry
- Graff high jewellery
- Boucheron high jewelry
- Tiffany high jewelry
- Chaumet high jewellery
- Chopard high jewellery
- Harry Winston high jewelry

Extract:

- URL
- status
- canonical URL
- title
- meta description
- H1
- H2 list
- Open Graph title / image
- JSON-LD schema types
- image alt coverage
- internal links
- page category: homepage, collection, product, story, craft, appointment, contact
- visible CTA text

Do not extract or reuse:

- Full body copy.
- Product descriptions.
- Image files.
- Customer data.
- Any gated or blocked content.

## 6. Noirven SEO Architecture

Recommended launch pages:

- `/` homepage
- `/brand` brand legend: Noirven 诺梵, 暗夜中的神圣孤品
- `/bespoke` private commission service
- `/bespoke/engagement-rings` bespoke engagement rings
- `/bespoke/high-jewelry` one-of-one high jewelry commissions
- `/collections/noir-solitaire` signature dark solitaire concept
- `/collections/sacred-gemstones` gemstone-led collection stories
- `/craft` atelier craft, setting, engraving, stone sourcing
- `/materials/black-diamond`
- `/materials/emerald`
- `/materials/sapphire`
- `/materials/ruby`
- `/journal` editorial education and brand worldview
- `/appointment` private advisor booking
- `/contact`
- `/privacy`
- `/terms`

URL rules:

- English slugs for stability.
- Chinese visible headings can be primary in page UI.
- Keep each page focused on one search and conversion intent.
- Avoid creating thin pages for every keyword variation.

## 7. Page Metadata Templates

Homepage:

- Title: `Noirven 诺梵 | 高奢私人定制珠宝`
- Description: `Noirven 诺梵以暗夜、誓约与孤品为核心，为不可复制的人生片段定制高级珠宝、订婚戒指与私人珠宝作品。`

Bespoke page:

- Title: `私人高定珠宝服务 | Noirven 诺梵`
- Description: `从誓约故事、宝石筛选、设计塑形到私密交付，Noirven 诺梵为每位委托人完成一件不可复制的高级珠宝孤品。`

High jewelry page:

- Title: `高级珠宝孤品定制 | Noirven 诺梵`
- Description: `探索 Noirven 诺梵高级珠宝孤品定制：稀有宝石、暗夜美学、手工镶嵌与一对一私人顾问服务。`

Craft page:

- Title: `珠宝工艺与宝石甄选 | Noirven 诺梵`
- Description: `了解 Noirven 诺梵的宝石筛选、贵金属塑形、手工镶嵌、私密铭刻与高级珠宝交付流程。`

Appointment page:

- Title: `预约私人珠宝顾问 | Noirven 诺梵`
- Description: `预约 Noirven 诺梵私人顾问，提交你的定制需求、纪念意义、预算区间与首饰方向，开启一件孤品珠宝的委托。`

## 8. Structured Data Plan

Use JSON-LD. Add only schema that reflects real page content.

Site-wide:

- `Organization`
- `WebSite`
- `BreadcrumbList`

If showroom/private salon exists:

- `LocalBusiness`

Collection and product-like pages:

- `Product` only when a real purchasable or commissionable item/page exists.
- `ProductGroup` if there are genuine variants.
- `ImageObject` for important original product photography.
- `VideoObject` when craft or product videos are used.

Editorial pages:

- `Article` for journal/craft education content.

Do not over-focus on structured data for GEO. Google says structured data is not required for generative AI search, but it remains useful for rich results and comprehension.

## 9. GEO Content Rules

For AI search visibility, write pages that are clear, quotable, and grounded in unique brand knowledge.

Do:

- Explain what Noirven is in the first screen using plain language.
- Include a concise brand definition: `Noirven 诺梵是高奢私人定制珠宝品牌，以暗夜美学、誓约叙事与一件一制为核心。`
- Use clear section headings.
- Make the bespoke process explicit: brief, stone, form, seal.
- Include first-party expertise: gem selection criteria, setting choices, privacy process, advisor workflow.
- Add high-quality images with accurate alt text.
- Keep important content in HTML, not only inside images or canvas.
- Use stable semantic HTML, accessible buttons, labeled inputs, crawlable links.

Don't:

- Create `llms.txt` only because someone claims it is required for Google AI Search.
- Break content into unnatural tiny AI chunks.
- Rewrite pages in robotic Q&A style only for AI.
- Create many thin pages for long-tail variations.
- Seek fake mentions or artificial PR citations.
- Hide key copy behind animations, hover-only reveals, canvas, or client-only rendering.

## 10. Agent-Friendly UI Requirements

AI/browser agents may inspect screenshots, HTML, and the accessibility tree. Build accordingly:

- Use real `<button>`, `<a>`, `<form>`, `<label>`, `<input>`, `<select>`, and `<textarea>` elements.
- Appointment form labels must use `for` and matching input `id`.
- CTAs must have unambiguous text, not only icons.
- Layout should be stable; avoid shifting CTA positions after images load.
- Do not use transparent overlays above clickable elements.
- Interactive elements should be visually and semantically obvious.
- Keep private commission steps in text as well as visual UI.

## 11. Technical SEO Build Checklist

Every route must include:

- Unique `<title>`.
- Unique meta description.
- One clear H1.
- Canonical URL.
- Open Graph and Twitter metadata.
- Crawlable internal links.
- Image `alt` text for meaningful images.
- JSON-LD where appropriate.
- No accidental `noindex`.
- No important content hidden from server-rendered HTML.

Site must include:

- `robots.txt`
- `sitemap.xml`
- `manifest` / favicon assets
- Search Console verification support
- Analytics with privacy-conscious events
- 404 page
- Fast image delivery with dimensions to prevent layout shift
- Core Web Vitals target: good LCP, CLS, INP
- Multilingual `hreflang` for Chinese and English routes.
- Region-aware copy and metadata for China and overseas audiences.

Preferred rendering:

- Static generation or server-side rendering for all SEO-critical pages.
- Client-side animation is fine, but the content must exist in initial HTML or be reliably renderable and crawlable.

## 12. Launch Content System

Initial content clusters:

### Brand

- Noirven 诺梵 brand story
- 暗夜中的神圣孤品
- What private high jewelry commission means

### Bespoke

- How private jewelry commission works
- Bespoke engagement rings
- Anniversary and family legacy jewelry
- Confidential design process

### Materials

- Black diamond jewelry
- Emerald high jewelry
- Sapphire high jewelry
- Ruby high jewelry
- Platinum and champagne gold settings

### Craft

- Gemstone sourcing
- Hand setting
- Engraving and hidden inscriptions
- Stone certificates and provenance

### Advisor

- How to prepare for a private jewelry consultation
- Budget range guidance
- Timeline and delivery
- Aftercare

## 13. Future Scrapling Audit Script Shape

When development starts, create `tools/scrapers/metadata_audit.py`:

```python
from scrapling.spiders import SitemapSpider, CrawlRule, LinkExtractor


class LuxuryMetadataAudit(SitemapSpider):
    name = "luxury_metadata_audit"
    robots_txt_obey = True
    concurrent_requests = 4
    concurrent_requests_per_domain = 2
    download_delay = 1.5

    sitemap_urls = [
        "https://example.com/robots.txt",
    ]

    def rules(self):
        return [
            CrawlRule(LinkExtractor(allow=r"/high-jewelry|/high-jewellery|/collections|/jewelry"), callback=self.parse_page),
        ]

    async def parse_page(self, response):
        json_ld_types = []
        for script in response.css('script[type="application/ld+json"]::text').getall():
            if '"@type"' in script:
                json_ld_types.append(script[:500])

        yield {
            "url": response.url,
            "title": response.css("title::text").get(""),
            "description": response.css('meta[name="description"]::attr(content)').get(""),
            "canonical": response.css('link[rel="canonical"]::attr(href)').get(""),
            "h1": response.css("h1::text").get(""),
            "h2": response.css("h2::text").getall(),
            "og_title": response.css('meta[property="og:title"]::attr(content)').get(""),
            "og_image": response.css('meta[property="og:image"]::attr(content)').get(""),
            "json_ld_sample": json_ld_types,
        }
```

## 14. Development Rule

When we start building the Noirven website, SEO and GEO are not a later marketing pass. They must be implemented with each page:

1. Design the page.
2. Write the human-facing luxury copy.
3. Add metadata.
4. Add semantic HTML.
5. Add structured data if relevant.
6. Add image alt text.
7. Add internal links and breadcrumbs.
8. Verify crawlability and performance.
