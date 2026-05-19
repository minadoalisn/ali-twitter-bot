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

## Render Deployment

The repository includes `render.yaml` for Blueprint deployment.

- Service name: `noirven`
- Runtime: Node
- Build command: `npm ci && npm run build`
- Start command: `npm run start:render`
- Public URL target: `https://noirven.onrender.com`

Secrets marked `sync: false` must be filled in the Render Dashboard.

## Network Allowlist

If Supabase, database access, an API gateway, or another protected backend uses an IP allowlist for Render traffic, allow these CIDR ranges:

- `74.220.52.0/24`
- `74.220.60.0/24`

Do not place these CIDR ranges in frontend code. They belong in the target service firewall/network restriction settings.
