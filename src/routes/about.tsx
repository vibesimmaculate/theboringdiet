import { createFileRoute } from "@tanstack/react-router";
import { EditorialEyebrow, FactTable, Folio } from "@/components/editorial/primitives";
import { BRAND, SITE } from "@/config/brand";
import { ClosingCta } from "@/components/marketing/closing-cta";

const FACTS = [
  { k: "BRAND", v: "The Boring Diet" },
  { k: "PRODUCT TYPE", v: "Digital publication" },
  { k: "FORMAT", v: "PDF" },
  { k: "LENGTH", v: "36 pages" },
  { k: "PRICE", v: "$19 USD" },
  { k: "BILLING", v: "One-time payment" },
  { k: "SUBSCRIPTION", v: "No" },
  { k: "DURATION", v: "14 days" },
  { k: "DELIVERY", v: "Polar digital access" },
  { k: "ACCOUNT", v: "Not required" },
  { k: "TARGET AUDIENCE", v: "Adults considering a short, structured experiment" },
  { k: "MEDICAL ADVICE", v: "No" },
  { k: "EXIT PLAN", v: "Included" },
  { k: "SAFETY BOUNDARIES", v: "Included" },
  { k: "EXACT PROTOCOL PUBLIC", v: "No" },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — The Boring Diet" },
      { name: "description", content: "Verified brand and product facts for The Boring Diet. Consistent across every page." },
      { property: "og:title", content: "About — The Boring Diet" },
      { property: "og:description", content: "Verified product facts, no fabricated reviews, no hidden claims." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({
      "@context": "https://schema.org", "@type": "AboutPage",
      about: { "@type": "Organization", name: BRAND.name, description: BRAND.shortDescription },
    })}],
  }),
  component: () => (
    <>
    <section className="bg-bone paper-grain pt-24 pb-32">
      <div className="editorial-main">
        <div className="flex items-baseline justify-between">
          <EditorialEyebrow>VERIFIED PRODUCT FACTS</EditorialEyebrow>
          <Folio>THE BORING DIET · ABOUT</Folio>
        </div>
        <h1 className="mt-6 h-display">
          THE FACTS<br />ARE PUBLIC<span className="text-gold">.</span>
        </h1>
        <div className="mt-14 grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-5 space-y-6 text-lg leading-relaxed">
            <p>
              The Boring Diet is a single-product publication. It exists to explain, deliver and support one
              structured, time-limited eating experiment — nothing more.
            </p>
            <p>
              There is no membership, no ongoing coaching, no fabricated review section and no hidden
              upsell. Every public fact on this website is consistent with the structured data, the checkout
              summary and the guide itself.
            </p>
            <p className="mono-label text-stone-dark">
              PUBLISHED BY {SITE.legalName.toUpperCase()}
            </p>
          </div>
          <div className="col-span-12 md:col-span-7">
            <FactTable rows={FACTS} />
          </div>
        </div>
      </div>
    </section>
    <ClosingCta analyticsId="about_cta_click" />
    </>
  ),
});
