import { createFileRoute } from "@tanstack/react-router";
import { EditorialFAQ } from "@/components/editorial/editorial-faq";
import { HOME_FAQ } from "@/components/home/faq-section";
import { EditorialEyebrow, Folio } from "@/components/editorial/primitives";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "/" },
    { "@type": "ListItem", position: 2, name: "FAQ", item: "/faq" },
  ],
};

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "The Boring Diet FAQ — Price, Delivery, Duration and Safety" },
      { name: "description", content: "Frequently asked questions about The Boring Diet: price, delivery through Polar, duration, safety, refunds and how to retrieve your PDF later." },
      { property: "og:title", content: "The Boring Diet FAQ" },
      { property: "og:description", content: "Every answer is public — price, delivery, duration, safety, refunds." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(faqLd) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
    ],
  }),
  component: () => (
    <section className="bg-bone paper-grain pt-24 pb-32">
      <div className="editorial-main">
        <div className="flex items-baseline justify-between">
          <EditorialEyebrow>QUESTIONS</EditorialEyebrow>
          <Folio>THE BORING DIET · FAQ</Folio>
        </div>
        <h1 className="mt-6 h-display">
          FREQUENTLY<br />ASKED<span className="text-gold">.</span>
        </h1>
        <p className="mt-8 text-charcoal-soft max-w-xl">
          Every answer is publicly available and rendered in the page HTML.
        </p>
        <div className="mt-16">
          <EditorialFAQ items={HOME_FAQ} />
        </div>
      </div>
    </section>
  ),
});
