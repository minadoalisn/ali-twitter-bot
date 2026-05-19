# Noirven 诺梵

Noirven 诺梵 is a multilingual light-luxury art jewelry auction platform.

Core line:

> 每一次归属，都是一次拯救。

## What Is Included

- Next.js App Router + TypeScript + Tailwind CSS.
- Chinese default routes and English `/en` routes.
- Homepage based on the confirmed ivory editorial UI with live countdown.
- Story series architecture: `Still Here`, `Unclaimed Star`, `Seventh Light`, `Justice of One`.
- 12 unique first-batch product concepts with independent generated visuals.
- Seven-day auction pages, product detail pages, sold archive, account shell, admin shell.
- Server API boundaries for bids, Stripe deposits, USDT settlement review, OpenAI image generation, and Stripe webhooks.
- Supabase schema draft with RLS and row-lock bidding function.
- SEO/GEO basics: metadata, sitemap, robots, hreflang-ready routing.

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Environment

Copy `.env.example` to `.env.local` and configure:

- Supabase project URL and keys.
- Auth secret and admin credentials: `NOIRVEN_AUTH_SECRET`, `NOIRVEN_ADMIN_USERNAME`, `NOIRVEN_ADMIN_PASSWORD`.
- Stripe publishable key, secret key, webhook secret.
- OpenAI API key and image model.
- BNB/BEP-20 USDT receiving address.

Never commit real secrets. Any previously shared Stripe test secret should be revoked and regenerated before integration.

## Verification

```bash
npm run lint
npm run build
```

Both pass in the current MVP.
