import { createFileRoute } from "@tanstack/react-router";
import { WhatsInsideArchive } from "@/components/home/whats-inside-archive";
import { DirectAnswer } from "@/components/editorial/primitives";
import { PricingSection } from "@/components/home/pricing-section";

export const Route = createFileRoute("/whats-inside")({
  head: () => ({
    meta: [
      { title: "What's Inside — The Boring Diet · 36 pages, redacted preview" },
      { name: "description", content: "The complete system: exact protocol, calendar, day-by-day rotation, preparation, kitchen methods, failure-mode map, Day 15 exit, safety boundaries." },
      { property: "og:title", content: "What's Inside — The Boring Diet" },
      { property: "og:description", content: "The complete 36-page publication, section by section — with redacted previews." },
      { property: "og:url", content: "/whats-inside" },
    ],
    links: [{ rel: "canonical", href: "/whats-inside" }],
  }),
  component: () => (
    <>
      <section className="bg-bone paper-grain pt-24 pb-4">
        <div className="editorial-main">
          <DirectAnswer
            question="What do I receive?"
            answer="A 36-page digital PDF containing the complete protocol, calendar, preparation system, troubleshooting map, structured exit and safety boundaries. Delivery is instant through Polar."
          />
        </div>
      </section>
      <WhatsInsideArchive />
      <PricingSection />
    </>
  ),
});
