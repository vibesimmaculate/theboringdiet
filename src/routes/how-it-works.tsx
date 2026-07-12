import { createFileRoute } from "@tanstack/react-router";
import { HowItWorksSection, TimelineSection } from "@/components/home/timeline-and-how";
import { ContrarianChapter } from "@/components/home/contrarian-chapter";
import { CoreMechanism } from "@/components/home/core-mechanism";
import { Manifesto } from "@/components/home/manifesto";
import { DirectAnswer } from "@/components/editorial/primitives";
import { ClosingCta } from "@/components/marketing/closing-cta";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "The Idea — How The Boring Diet works" },
      { name: "description", content: "Why the protocol is deliberately boring: no counting, no app, no daily negotiation. The boredom is the point." },
      { property: "og:title", content: "The Idea — How The Boring Diet works" },
      { property: "og:description", content: "The concept, the structure and the fourteen-day boundary — explained publicly." },
      { property: "og:url", content: "/how-it-works" },
    ],
    links: [{ rel: "canonical", href: "/how-it-works" }],
  }),
  component: () => (
    <>
      <section className="bg-bone paper-grain pt-24 pb-16">
        <div className="editorial-main">
          <DirectAnswer
            question="What is The Boring Diet?"
            answer="The Boring Diet is a 36-page digital publication containing a structured, time-limited 14-day eating experiment. It includes exact operating boundaries, a complete daily schedule, preparation guidance, troubleshooting information, a structured exit and safety limitations."
          />
        </div>
      </section>
      <ContrarianChapter />
      <CoreMechanism />
      <TimelineSection />
      <HowItWorksSection />
      <Manifesto />
      <ClosingCta analyticsId="how_it_works_cta_click" />
    </>
  ),
});
