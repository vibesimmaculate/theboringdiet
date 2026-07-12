import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/hero";
import { EvidenceSection } from "@/components/home/evidence";
import { WhatsInsideArchive } from "@/components/home/whats-inside-archive";
import { PricingSection } from "@/components/home/pricing-section";
import { HomeFaqSection, HOME_FAQ } from "@/components/home/faq-section";
import { BackCover } from "@/components/home/back-cover";
import { BRAND } from "@/config/brand";

const productLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: BRAND.name,
  description: BRAND.longDescription,
  sku: BRAND.sku,
  brand: { "@type": "Brand", name: BRAND.name },
  category: "Digital wellness publication",
  audience: { "@type": "PeopleAudience", suggestedMinAge: 18 },
  itemCondition: "https://schema.org/NewCondition",
  offers: {
    "@type": "Offer",
    price: "19.00",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "/",
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Boring Diet — A bounded 14-day eating experiment · $19" },
      { name: "description", content: "A premium 36-page digital publication. One protocol. Fourteen days. $19 one-time. No subscription. Instant digital access through Polar." },
      { property: "og:title", content: "The Boring Diet — A bounded 14-day eating experiment · $19" },
      { property: "og:description", content: "A premium 36-page digital publication. One protocol. Fourteen days. $19 one-time. No subscription. Instant digital access through Polar." },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(productLd) },
      { type: "application/ld+json", children: JSON.stringify(faqLd) },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <WhatsInsideArchive />
      <EvidenceSection />
      <PricingSection />
      <HomeFaqSection />
      <BackCover />
    </>
  );
}
