import { createFileRoute } from "@tanstack/react-router";
import { EditorialEyebrow, Folio, HorizontalRule } from "@/components/editorial/primitives";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — The Boring Diet" },
      { name: "description", content: "General educational information. Not medical advice. Individual experiences vary." },
      { property: "og:title", content: "Disclaimer — The Boring Diet" },
      { property: "og:url", content: "/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
  component: () => (
    <section className="bg-bone paper-grain pt-24 pb-32">
      <div className="editorial-main">
        <div className="flex items-baseline justify-between">
          <EditorialEyebrow>DISCLAIMER</EditorialEyebrow>
          <Folio>THE BORING DIET · LEGAL</Folio>
        </div>
        <h1 className="mt-6 h-chapter">Editorial and Health Disclaimer<span className="text-gold">.</span></h1>
        <HorizontalRule className="mt-8" />
        <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed">
          <p>
            The Boring Diet is a general educational digital publication describing a time-limited personal experiment.
            It is not medical advice and does not diagnose, treat, cure or prevent any condition.
          </p>
          <p>
            The product does not guarantee any specific outcome, including but not limited to weight loss, fat loss,
            appetite change, metabolic change, disease treatment or disease prevention. Individual experiences vary.
          </p>
          <p>
            The protocol has explicit safety exclusions and a fixed 14-day endpoint. Do not extend, repeat back-to-back
            or use for purposes other than a single bounded personal experiment. See the Safety Notice for details.
          </p>
          <p>
            No information on this website is intended as a substitute for the advice of a qualified healthcare
            professional. If you have questions about whether the protocol is appropriate for you, consult a clinician
            before starting.
          </p>
        </div>
      </div>
    </section>
  ),
});
