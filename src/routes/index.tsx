import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/hero";
import { ContrarianChapter } from "@/components/home/contrarian-chapter";
import { QuickFacts } from "@/components/home/quick-facts";
import { CoreMechanism } from "@/components/home/core-mechanism";
import { EvidenceSection, EvidenceBoundary } from "@/components/home/evidence";
import { WhatsInsideArchive } from "@/components/home/whats-inside-archive";
import { HowItWorksSection, TimelineSection } from "@/components/home/timeline-and-how";
import { SafetySpread } from "@/components/home/safety-spread";
import { Manifesto } from "@/components/home/manifesto";
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
      { property: "og:title", content: "The Boring Diet — A bounded 14-day eating experiment" },
      { property: "og:description", content: "A premium 36-page digital publication. One protocol. Fourteen days. $19 one-time." },
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
      <ContrarianChapter />
      <QuickFacts />
      <CoreMechanism />
      <EvidenceSection />
      <EvidenceBoundary />
      <WhatsInsideArchive />
      <TimelineSection />
      <HowItWorksSection />
      <SafetySpread />
      <Manifesto />
      <PricingSection />
      <HomeFaqSection />
      <BackCover />
    </>
  );
}
