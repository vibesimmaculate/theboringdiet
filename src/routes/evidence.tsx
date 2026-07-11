import { createFileRoute } from "@tanstack/react-router";
import { EvidenceSection, EvidenceBoundary } from "@/components/home/evidence";
import { DirectAnswer } from "@/components/editorial/primitives";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence — Satiety Index and the boundaries of proof" },
      { name: "description", content: "The satiety-index chart, what it shows, and — more importantly — what it does not show. Transparent limitations." },
      { property: "og:title", content: "Evidence — The Boring Diet" },
      { property: "og:description", content: "The satiety-index chart and the honest limits of the underlying research." },
      { property: "og:url", content: "/evidence" },
    ],
    links: [{ rel: "canonical", href: "/evidence" }],
  }),
  component: () => (
    <>
      <section className="bg-bone paper-grain pt-24 pb-8">
        <div className="editorial-main">
          <DirectAnswer
            question="Does it guarantee weight loss?"
            answer="No. The product does not guarantee weight loss or any health outcome. The satiety-index chart supports the mechanism (fullness per calorie), not a specific clinical result. Individual experiences vary."
          />
        </div>
      </section>
      <EvidenceSection />
      <EvidenceBoundary />
    </>
  ),
});
