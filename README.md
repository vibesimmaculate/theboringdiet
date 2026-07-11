# The Boring Diet

The web-native edition of the premium PDF publication. A single one-time digital
product delivered through Polar. TanStack Start (React 19, Tailwind v4, Framer
Motion, Recharts). Serverless-friendly runtime targeting the Lovable edge worker.

## Quick start

```bash
bun install
cp .env.example .env      # fill in your Polar + Meta values
bun dev
```

## Environment variables

See `.env.example`. Highlights:

- `POLAR_APPROVED` — **required gate**. When `false` (default), every purchase
  CTA renders as "PAYMENT ACCESS IS BEING FINALIZED" and Polar checkout is
  never opened. Set to `true` only after your Polar organization is fully
  approved and the wallet-payment domain is verified.
- `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, `POLAR_PRODUCT_ID`,
  `POLAR_ORGANIZATION_SLUG`, `POLAR_ENVIRONMENT` (`sandbox` | `production`).
- `VITE_POLAR_ORGANIZATION_SLUG` — browser-safe copy used only for the customer-portal link.
- `VITE_META_PIXEL_ID`, `META_CONVERSIONS_API_TOKEN`.
- `SUPPORT_EMAIL`, `LEGAL_BUSINESS_NAME`, `LEGAL_BUSINESS_ADDRESS`, `GOVERNING_LAW`.

## Polar setup

1. Create one product in your Polar dashboard.
   - Name: **The Boring Diet**
   - Description: *"A premium 36-page digital publication containing a bounded 14-day eating experiment, exact operating boundaries, a complete schedule, preparation guidance, troubleshooting information, a structured exit sequence and safety limitations."*
   - Type: One-time purchase
   - Price: $19 USD
2. Create a **File Downloads** benefit, upload `the-boring-diet.pdf`, set customer-facing filename to *The Boring Diet — Complete Digital Edition.pdf*, and attach it to the $19 product.
3. Publish the product, copy the checkout link, and (optionally) replace the constant in `src/config/brand.ts` if it changes.
4. Add `POLAR_PRODUCT_ID` and `POLAR_ORGANIZATION_SLUG` to your env.
5. Create an organization access token, add it as `POLAR_ACCESS_TOKEN`.
6. Add a webhook endpoint pointing at `/api/public/webhooks/polar` with events `order.paid`, `order.updated`, `order.refunded`. Copy the secret into `POLAR_WEBHOOK_SECRET`.
7. Request wallet-payment domain approval from Polar before production launch.
8. Set `POLAR_APPROVED=true`.

Success URL used at checkout should include `{CHECKOUT_ID}`, e.g.
`https://your-domain.com/success?checkout_id={CHECKOUT_ID}`. The `/success`
route server-verifies the checkout before displaying the succeeded state.

## Meta Pixel and Conversions API

- Client Pixel is loaded in `src/components/analytics/meta-pixel.tsx` and fires
  only after the visitor consents to marketing cookies.
- The server webhook (`/api/public/webhooks/polar`) fires the `Purchase` CAPI
  event with `event_id = polar_order_<order_id>` so client/server events dedupe.

## Consent

`src/components/layout/cookie-banner.tsx` implements a three-category
(Necessary / Analytics / Marketing) consent stub with optional categories
unchecked by default. Marketing consent controls the Pixel; analytics consent
controls any GA4 wiring you add.

## SEO / AEO / GEO

- Per-route `head()` with unique titles/descriptions and JSON-LD (Product,
  Offer, Organization, WebSite, FAQPage, Article, BreadcrumbList, AboutPage).
- `/sitemap.xml` is a server route enumerating every canonical URL.
- `public/robots.txt` allows public routes and disallows `/api`, `/success`,
  `/payment-cancelled`. `GPTBot` is disallowed; `OAI-SearchBot` is allowed.
- `public/llms.txt` mirrors the verified product facts for AI answer engines.
- Do NOT put exact food names in titles, descriptions, JSON-LD, alt text or
  filenames — the guide's exact protocol is a paid asset.

## Testing checklist

- `POLAR_APPROVED=false` disables every CTA and shows finalization copy.
- `POLAR_APPROVED=true` opens Polar embedded checkout in one click.
- `/success` verifies `checkout_id` server-side and never reveals order internals.
- Wrong product id returns the "wrong product" state.
- Webhook signature verification rejects malformed payloads.
- Duplicate webhook deliveries are idempotent.
- `prefers-reduced-motion` disables tilt, parallax, page fanning, chart animation.
- Complete keyboard navigation; visible focus rings; skip link.
- Screen-reader table alternative for the satiety chart.

## Deployment

Set env vars in your host's dashboard (never commit real secrets). The webhook
endpoint at `/api/public/webhooks/polar` bypasses site auth on published
deployments — always verify signatures inside the handler.
