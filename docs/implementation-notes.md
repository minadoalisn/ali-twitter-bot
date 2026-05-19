# Noirven MVP Implementation Notes

## Confirmed Direction

- Homepage UI: option A, ivory editorial layout.
- Brand core: `每一次归属，都是一次拯救。`
- Storyline model: each product belongs to a `story_series`.
- Product material library: rose gold, carved gold, yellow gold, platinum, natural white diamonds, colored gemstones, lapis lazuli, mother-of-pearl, malachite, enamel color, piano lacquer, gilded color, cloisonne-inspired craft.
- Multilingual strategy: Chinese default routes and English `/en` routes.

## Security Boundaries

- Stripe, OpenAI, Supabase service-role clients are lazily initialized server-side only.
- No secret key is committed.
- `/admin` and `/en/admin` are protected by signed HttpOnly sessions and require `NOIRVEN_ADMIN_USERNAME`, `NOIRVEN_ADMIN_PASSWORD`, and `NOIRVEN_AUTH_SECRET`.
- `/account`, `/en/account`, bid submission, Stripe deposit creation, USDT settlement submission, and design generation APIs now check server-side authentication before continuing.
- The previously shared Stripe test secret should be revoked and regenerated before real integration.
- USDT is MVP manual/semi-automatic review, not automatic payout/refund.

## Next Integration Steps

1. Create Supabase project and apply `supabase/schema.sql`.
2. Configure `.env.local` from `.env.example`.
3. Replace local mock data with Supabase reads.
4. Implement authenticated account and admin authorization.
5. Move `place_bid_locked` into a Supabase Edge Function or call it through RPC after payment confirmation.
6. Add Stripe Elements on account/product bid flow.
7. Add admin generation UI that calls `/api/generate-design`.

## Vercel Deployment

The project is now targeted for Vercel deployment.

- Framework: Next.js App Router.
- Build command: `npm run build`.
- Start command: managed by Vercel.
- Production URL target: Vercel project domain, with custom domain optional later.

Set secrets in the Vercel Project Settings before enabling real payments, Supabase writes, or image generation.
