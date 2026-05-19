# Noirven 诺梵 DESIGN.md

## 1. Visual Theme & Atmosphere

Noirven 诺梵 is a minimalist light-luxury AI jewelry auction brand built around the idea:

> Noirven = 极简、独特、可被记住的 AI 轻奢首饰拍卖品牌。`Noir + ven` 的暗夜感可以作为命名来源之一，但不是全站唯一视觉风格。

The interface should feel minimal, memorable, refined, and differentiated. It must not read like a mass jewelry shop, a generic SaaS dashboard, or a copy of an existing luxury Maison. It should behave like a polished light-luxury auction house where AI-generated jewelry works are presented as unique collectible objects.

Core mood:

- Minimal, light-luxury, precise, memorable.
- Strong wordmark, simple symbol, disciplined spacing.
- Black / ivory / platinum / restrained accent palettes are allowed, but the brand is not locked into dark sacred styling.
- Full-bleed product imagery, AI concept renders, and auction states carry the emotion.
- UI chrome disappears; the jewel, bidding path, and ownership story are the focus.
- Scarcity is expressed through clarity, rhythm, and spacing, not decorative effects.

Design reference logic:

- Use the `awesome-design-md` method: define atmosphere, color roles, typography, components, layout, depth, do/don't rules, and agent prompts before building.
- Study Gucci / Hermès / Chanel / Prada only at the level of principles: extremely simple wordmarks, memorable proportions, restrained symbols, and repeatable brand codes.
- Do not copy any luxury brand's logo, typography proportions, symbol, classic motif, layout identity, product silhouette, or trade dress.
- Use Bugatti-like austerity when dark pages are needed: minimal chrome, large whitespace, photography-first sections.
- Use Apple-like product reverence: object-centered imagery, museum-gallery pacing, short copy.
- Study high-jewelry storytelling principles only: organize content by craft, gemstone, theme, and ownership narrative without copying any Maison identity.
- Avoid common e-commerce noise: sale badges, dense category blocks, loud CTAs, countdowns, cartoon icons, and gradient backgrounds.

## 2. Color Palette & Roles

### Brand Colors

| Token | Hex | Use |
|---|---:|---|
| `noir` | `#030303` | Premium dark canvas, footer, selected hero backgrounds |
| `obsidian` | `#090807` | Secondary dark section |
| `black-lacquer` | `#10100E` | Soft panels, appointment forms |
| `platinum` | `#F4F1EA` | Primary text on dark |
| `soft-ivory` | `#F7F3EA` | Light-luxury canvas, editorial sections |
| `porcelain` | `#FBFAF6` | Clean product backgrounds |
| `warm-silver` | `#C9C2B6` | Body text, quiet metadata |
| `ink` | `#151515` | Primary text on light backgrounds |
| `graphite` | `#4B4A46` | Secondary text on light backgrounds |
| `ash` | `#7D756C` | Muted captions, secondary nav |
| `champagne-gold` | `#C8A96A` | Luxury accent, small lines, active states |
| `antique-gold` | `#8F7140` | Pressed/hover gold state |
| `signature-red` | `#8E1F2F` | Rare brand accent for auction urgency or sold states |
| `ruby-shadow` | `#4A0E18` | Rare editorial accent for one-off collection pages |
| `jade-night` | `#123327` | Rare gemstone story accent |
| `hairline` | `#26221D` | 1px dividers on dark |
| `soft-hairline` | `#3A332B` | Stronger form underline or selected boundary |

Rules:

- The site can alternate between dark premium sections and light-luxury ivory / porcelain sections.
- The homepage does not have to be fully dark.
- `champagne-gold` is used sparingly: logo accent, selected tab, thin rule, focus ring, and one primary CTA per viewport.
- Do not create purple-blue gradients, beige luxury backgrounds, or brown/orange-dominant palettes.
- Gem colors may appear through photography, not as broad UI backgrounds.

## 3. Typography Rules

Use a three-voice type system:

1. Minimal display serif or high-contrast editorial serif for brand gravity.
2. Clean sans for interface clarity.
3. Monospace for certification, gem specifications, and atelier precision.

Recommended open web stack:

- Display: `Cormorant Garamond`, `EB Garamond`, `Noto Serif SC`, serif.
- UI Sans: `Inter`, `Noto Sans SC`, system-ui, sans-serif.
- Precision Mono: `IBM Plex Mono`, `JetBrains Mono`, monospace.

| Role | Size | Weight | Line Height | Letter Spacing | Use |
|---|---:|---:|---:|---:|---|
| `hero-display` | 72px | 400 | 1.0 | 0 | Homepage hero, brand manifesto |
| `display-lg` | 48px | 400 | 1.08 | 0 | Collection title, atelier section |
| `display-md` | 34px | 400 | 1.16 | 0 | Product story headings |
| `title` | 22px | 400 | 1.3 | 0 | Card titles, service titles |
| `body` | 16px | 400 | 1.7 | 0 | Editorial copy |
| `body-sm` | 14px | 400 | 1.6 | 0 | Product metadata, form helper text |
| `caption` | 11px | 500 | 1.4 | 0.12em | Uppercase labels, section eyebrows |
| `button` | 12px | 500 | 1 | 0.14em | Buttons and nav |
| `mono-spec` | 12px | 400 | 1.5 | 0.08em | Stone specs, certificate IDs |

Rules:

- Do not use bold display headings. Luxury comes from scale and spacing, not weight.
- Hero display text can be large, but copy must stay concise.
- Chinese text should feel calm and breathable. Avoid dense blocks above 3 lines.
- Use uppercase English labels only for nav, captions, and small UI controls.
- Do not use negative letter spacing.

## 4. Component Stylings

### Top Navigation

- Height: 72px desktop, 60px mobile.
- Background: transparent over hero; white / ivory pages can use `rgba(251, 250, 246, 0.82)` with blur after scroll.
- Layout: left menu, centered wordmark, right appointment/wishlist/language.
- Wordmark: uppercase `NOIRVEN` with smaller `诺梵`, extremely simple and memorable. The wordmark is the primary brand asset. Follow `BRAND-LOCK.md`.
- Nav labels: 12px sans or mono, uppercase English where appropriate.

### Buttons

Primary CTA:

- Transparent or `champagne-gold` depending on contrast.
- Border: 1px `champagne-gold`.
- Text: uppercase mono/sans, 12px, 0.14em letter spacing.
- Radius: pill only.
- Height: 44px minimum.
- Examples: `预约私人顾问`, `Begin A Private Commission`.

Secondary CTA:

- Transparent background.
- Border: 1px `soft-hairline`.
- Text: `platinum` or `warm-silver`.
- Hover: border becomes `champagne-gold`.

Text link:

- No background.
- Underline appears on hover only.
- Gold text is allowed only for high-value links.

### Product / Collection Cards

- Cards should not look like consumer product tiles.
- Prefer full-bleed image modules, editorial split sections, or sparse two-column layouts.
- If a grid is needed, use 2-up desktop, 1-up mobile.
- Corners: 0px for image containers; 6px maximum for form panels.
- No drop shadows. Use dark surface contrast and hairline borders.

Product card content:

- Collection name.
- One poetic line.
- Gem / metal metadata.
- CTA: `探索孤品` or `咨询定制`.

### Appointment Form

- Dark panel on black lacquer.
- Inputs use underline only, no boxed white fields.
- Required fields: name, contact, desired piece, story/occasion, budget range, preferred consultation mode.
- Submit CTA must feel ceremonial, not transactional.

### Customization Flow

Use a four-step private commission path:

1. `誓约 Brief` - story, occasion, wearer, emotion.
2. `选石 Stone` - gemstone, origin, cut, rarity.
3. `塑形 Form` - ring, necklace, brooch, bracelet, transformable piece.
4. `封存 Seal` - certificate, engraving, final presentation.

Represent steps as slim horizontal stages on desktop and stacked timeline on mobile.

## 5. Layout Principles

Spacing:

- Base unit: 4px.
- Major section rhythm: 112px desktop, 72px tablet, 56px mobile.
- Content max width: 1240px.
- Editorial text max width: 640px.
- Product storytelling image width can exceed text width.

Homepage order:

1. Full-bleed hero or clean porcelain hero with logo, brand line, and a single auction CTA.
2. Brand idea: `简单到被记住，独特到不能复制`.
3. Signature commission path.
4. Featured solitaire / high jewelry themes.
5. Materials and craft: stone, metal, setting, engraving.
6. Private appointment form.
7. Footer with boutique-style contact and legal links.

Rules:

- Every viewport should have one visual focus.
- Do not place multiple cards inside another card.
- Do not use marketing SaaS hero layouts with a text card on one side and media card on the other.
- Use full-width bands or unframed layouts, not floating decorative sections.

## 6. Photography & Media

Required visual language:

- Macro gemstone facets on black or deep neutral backgrounds.
- Hands of artisans, wax models, sketches, tools, and stone trays.
- One hero jewel must be inspectable, sharp, and not hidden by blur.
- Use clean product lighting, warm pin-lighting, negative space, and controlled reflections.

Avoid:

- Stock photos of generic luxury women.
- Blurred atmospheric jewelry where the piece cannot be inspected.
- Overly gold room interiors.
- Heavy bokeh, floating orbs, decorative sparkles, and fake glitter overlays.

## 7. Depth & Elevation

Depth is created through:

- Photography lighting.
- 1px hairline dividers.
- Slight dark-surface shifts.
- Large black negative space.

Never use:

- Card shadows.
- Glassmorphism panels.
- Multicolor gradients.
- Decorative glows around products.

## 8. Do's And Don'ts

Do:

- Keep the site minimal, quiet, memorable, and auction-led.
- Use the `awesome-design-md` design system rules as the source of truth during development.
- Use one accent color: champagne gold.
- Let product photography and material closeups carry the luxury signal.
- Keep copy short, poetic, and precise.
- Make the private commission flow clear and trustworthy.
- Use bilingual branding where it matters: `Noirven 诺梵`.

Don't:

- Build a discount-driven e-commerce store.
- Use large rounded cards, colorful badges, or loud hover effects.
- Put too much text over detailed jewelry images.
- Overuse gold backgrounds.
- Copy Gucci, Hermès, Chanel, Prada, Cartier, Graff, Van Cleef, or any other Maison identity directly.
- Use animal mascots, cartoon illustrations, or decorative SVG hero art.

## 9. Responsive Behavior

Mobile:

- Hero remains full-bleed, with the jewel centered and text below or above clear negative space.
- Nav collapses to menu icon, centered wordmark, appointment icon/text.
- Collection cards collapse to one column.
- Step flow becomes vertical.
- Touch targets: 44px minimum.

Desktop:

- Preserve wide empty margins.
- Use two-column editorial rhythm: image dominant, text restrained.
- Avoid dense product grids above the fold.

## 10. Agent Prompt Guide

When building Noirven pages, use this prompt:

> Build a minimalist light-luxury AI jewelry auction website for Noirven 诺梵 using the awesome-design-md method. The brand should feel simple, memorable, refined, and differentiated, with a strong original wordmark, disciplined spacing, sharp AI jewelry imagery, sparse auction UI, and restrained black / ivory / platinum / champagne accents. Do not imitate any existing luxury brand. Prioritize unique AI-generated works, seven-day auction mechanics, ownership storytelling, sold archives, user accounts, and secure payment flows.
