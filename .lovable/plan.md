Building the complete production site for **The Boring Diet** per the spec. Stack note: the project runs on **TanStack Start** (not React Router — the spec's mention of React Router is superseded by our stack). Everything else in the spec is honored.

## Stack

React 19 + TanStack Start (SSR) · TypeScript strict · Tailwind v4 · Framer Motion · Recharts · shadcn/ui only where useful · Polar TS SDK + `@polar-sh/checkout` · Meta Pixel + Conversions API · consent-aware GA4 stub.

## Design system (`src/styles.css`)

Semantic tokens for the full editorial palette (`--bone`, `--paper`, `--charcoal`, `--gold`, `--red`, etc.), typography scale using the four required font families loaded via `<link>` in `__root.tsx` (Instrument Sans, Inter, Newsreader, IBM Plex Mono), radius 0–4px, custom utilities for editorial rules, folios, redacted blocks, paper grain.

Reusable components: `EditorialPage`, `EditorialSpread`, `ChapterOpener`, `DarkChapter`, `EditorialEyebrow`, `Folio`, `BookMockup`, `PageStack`, `RedactedPreview`, `HorizontalRule`, `VerticalRule`, `PullQuote`, `FactTable`, `EvidenceChart` (Recharts), `Timeline14Days`, `DirectAnswer`, `EditorialFAQ`, `PurchasePage`, `StickyPurchaseDock`, `MobilePurchaseBar`, `PolarCheckoutTrigger`, `SafetySpread`, `LoadingState`, `ErrorState`, plus header/footer/announcement bar and desktop book-spine progress rail.

## Routes

Editorial: `/`, `/product`, `/how-it-works`, `/whats-inside`, `/evidence`, `/safety`, `/faq`, `/about`, `/press`, `/contact`.
Guides hub: `/guides` + 5 MDX-style article pages listed in spec.
Transactional: `/success` (noindex), `/payment-cancelled` (noindex).
Legal: `/privacy`, `/terms`, `/refunds`, `/disclaimer`.
API: `src/routes/api/polar.verify-purchase.ts`, `src/routes/api/webhooks.polar.ts`, `src/routes/api/meta.capi.ts`, `src/routes/sitemap[.]xml.ts`.
Static: `public/robots.txt`, `public/llms.txt`, `public/.well-known/security.txt`.

Each shareable route gets its own `head()` with unique title, description, og:*, JSON-LD (Article / Product / FAQPage / Organization as appropriate).

## Polar integration

- Publishable checkout link is a compile-time constant (`src/config/polar.ts`) using the link you provided.
- `PolarCheckoutTrigger` uses `PolarEmbedCheckout.create()` from `@polar-sh/checkout/embed` and only opens when `POLAR_APPROVED=true` (read via a server fn so it's env-controlled). Otherwise CTA disables and shows the "PAYMENT ACCESS IS BEING FINALIZED" copy per spec section 03.
- `GET /api/polar/verify-purchase?checkout_id=…` → server-side call to Polar with `POLAR_ACCESS_TOKEN`, verifies product/amount/currency, returns minimal safe payload.
- `POST /api/webhooks/polar` → Standard Webhooks signature validation with `POLAR_WEBHOOK_SECRET`, idempotent handling of `order.paid` / `order.refunded` / `order.updated`, fires Meta CAPI Purchase with dedup event id `polar_order_<id>`.
- Customer portal link built from `POLAR_ORGANIZATION_SLUG`.

## Meta Pixel + CAPI

- Pixel loaded in `__root.tsx` behind consent stub; `PageView`, `ViewContent`, `InitiateCheckout` (fired after Polar embed loads), `Purchase` (server-side via CAPI from webhook, with `event_id` matching client Purchase for dedup).
- `POST /api/meta/capi` proxy used server-side.

## Purchase-secrecy enforcement

Public copy never names the two foods. Chart labels use `PROTOCOL FOOD A` / `PROTOCOL FOOD B`. Redacted preview components render `██████` blocks. No food names in alt text, filenames, JSON-LD, or meta.

## Content

I'll write the full editorial copy per spec (hero, contrarian chapter, quick facts, core mechanism, satiety chart, what's-inside spreads, safety, evidence, FAQ direct-answer blocks, back cover, about/press, all guide articles, legal/safety pages). Copy blocks come straight from the spec where provided; I'll write the guide articles in matching editorial voice.

## Analytics, SEO, AEO, GEO, accessibility

- Consent-aware GA4 stub gated by a lightweight cookie banner.
- Full head metadata per route, canonical + og:url self-referential, Article/Product/FAQPage/Organization JSON-LD.
- Dynamic `sitemap.xml` server route; `robots.txt`; `llms.txt` describing the product for AI answer engines.
- Semantic HTML, single H1 per route, focus states, prefers-reduced-motion honored in every animation, keyboard-accessible book-spine rail.

## Env & README

`.env.example` with every variable from spec §05. README with Polar product setup, webhook URL, Meta setup, deployment notes, and the `POLAR_APPROVED` flag procedure.

## Missing inputs

Still need (I'll request via secure form after you approve): `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, `POLAR_PRODUCT_ID`, `POLAR_ORGANIZATION_SLUG`, `VITE_META_PIXEL_ID`, `META_CONVERSIONS_API_TOKEN`, `SUPPORT_EMAIL`, `LEGAL_BUSINESS_NAME`, `LEGAL_BUSINESS_ADDRESS`, `GOVERNING_LAW`. The site is fully functional with the gate at `POLAR_APPROVED=false` until those land.

## Execution order

1. Design system + fonts + root head + navigation shell + footer + announcement bar.
2. Reusable editorial components + book mockup + redacted primitives + charts.
3. Homepage (hero → contrarian → quick facts → mechanism → satiety → what's inside → safety teaser → evidence teaser → purchase → FAQ → back cover).
4. Dedicated content routes + guides hub + 5 guide articles.
5. Legal, safety, contact, about, press, success, payment-cancelled.
6. Polar checkout trigger + verify-purchase server route + webhook + Meta CAPI.
7. Sitemap, robots, llms.txt, JSON-LD, per-route head metadata pass.
8. `.env.example` + README + final placeholder scan.
