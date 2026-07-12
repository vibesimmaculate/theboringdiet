import { createFileRoute } from "@tanstack/react-router";
import { BRAND, FACTS } from "@/config/brand";
import { PricingSection } from "@/components/home/pricing-section";
import { SafetySpread } from "@/components/home/safety-spread";
import { EditorialEyebrow, Folio, FactTable } from "@/components/editorial/primitives";
import { BookMockup } from "@/components/editorial/book-mockup";
import { PolarCheckoutTrigger } from "@/components/product/polar-checkout-trigger";

const productLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: BRAND.name,
  description: BRAND.longDescription,
  sku: BRAND.sku,
  category: "Digital wellness publication",
  itemCondition: "https://schema.org/NewCondition",
  offers: {
    "@type": "Offer",
    price: "19.00",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "/product",
  },
};
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "/" },
    { "@type": "ListItem", position: 2, name: "Product", item: "/product" },
  ],
};

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title: "The Product — The Boring Diet · $19 Digital Edition" },
      { name: "description", content: "The Boring Diet Digital Edition · 36 pages · $19 USD · one-time · instant delivery through Polar." },
      { property: "og:title", content: "The Boring Diet Digital Edition · $19" },
      { property: "og:description", content: "A 36-page digital publication containing a bounded 14-day eating experiment." },
      { property: "og:url", content: "/product" },
      { property: "og:type", content: "product" },
    ],
    links: [{ rel: "canonical", href: "/product" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(productLd) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  return (
    <>
      <section className="bg-bone paper-grain">
        <div className="editorial-shell py-20 sm:py-28 grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 md:col-span-7">
            <EditorialEyebrow>THE PRODUCT</EditorialEyebrow>
            <h1 className="mt-6 h-display">
              THE DIGITAL<br />EDITION<span className="text-gold">.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-charcoal-soft leading-relaxed">
              {BRAND.longDescription}
            </p>
            <div className="mt-8">
              <PolarCheckoutTrigger analyticsId="product_hero_cta_click">GET INSTANT ACCESS — $19</PolarCheckoutTrigger>
            </div>
            <div className="mt-10 max-w-lg">
              <FactTable rows={FACTS} emphasizeValues />
            </div>
            <div className="mt-8 flex items-center justify-between">
              <Folio>THE BORING DIET · 001</Folio>
              <div className="mono-label text-stone-dark">SKU · {BRAND.sku}</div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5">
            <BookMockup />
          </div>
        </div>
      </section>
      <PricingSection />
      <SafetySpread />
    </>
  );
}
