import { createFileRoute, Link } from "@tanstack/react-router";
import { EditorialEyebrow, Folio } from "@/components/editorial/primitives";

export const GUIDES = [
  { slug: "what-is-a-bounded-14-day-food-experiment", title: "What is a bounded 14-day food experiment?", excerpt: "Structure, endpoints, and why boundaries matter more than novelty." },
  { slug: "how-fewer-food-decisions-can-simplify-eating", title: "How fewer food decisions can simplify eating", excerpt: "Decision reduction as a design tool — not a promise." },
  { slug: "how-to-prepare-for-a-14-day-food-experiment", title: "How to prepare for a 14-day food experiment", excerpt: "The mental, logistical and social preparation that makes short experiments feasible." },
  { slug: "why-an-exit-plan-matters-after-short-term-restriction", title: "Why an exit plan matters after short-term restriction", excerpt: "The Day 15 principle: designed re-entry beats an abrupt stop." },
  { slug: "how-to-decide-whether-a-diet-challenge-is-appropriate", title: "How to decide whether a diet challenge is appropriate", excerpt: "A calm framework — including when the honest answer is no." },
] as const;

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: "Guides — The Boring Diet Editorial Hub" },
      { name: "description", content: "Editorial guides on bounded food experiments, decision reduction, preparation and safe exit sequences." },
      { property: "og:title", content: "Guides — The Boring Diet" },
      { property: "og:description", content: "Editorial guides on bounded food experiments." },
      { property: "og:url", content: "/guides" },
    ],
    links: [{ rel: "canonical", href: "/guides" }],
  }),
  component: () => (
    <section className="bg-bone paper-grain pt-24 pb-32">
      <div className="editorial-main">
        <div className="flex items-baseline justify-between">
          <EditorialEyebrow>EDITORIAL · GUIDES</EditorialEyebrow>
          <Folio>THE BORING DIET · GUIDES</Folio>
        </div>
        <h1 className="mt-6 h-display">GUIDES<span className="text-gold">.</span></h1>
        <p className="mt-6 text-lg text-charcoal-soft max-w-xl">
          Editorial essays about bounded personal experiments. Public. Educational. No medical advice.
        </p>
        <ol className="mt-16 border-t border-charcoal">
          {GUIDES.map((g, i) => (
            <li key={g.slug} className="border-b border-stone">
              <Link
                to="/guides/$slug"
                params={{ slug: g.slug }}
                className="grid grid-cols-[auto_1fr_auto] items-baseline gap-6 py-8 group"
              >
                <span className="mono-label text-stone-dark w-8">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="font-display text-2xl sm:text-3xl leading-tight group-hover:text-gold transition-colors">{g.title}</div>
                  <p className="mt-2 text-charcoal-soft text-sm max-w-xl">{g.excerpt}</p>
                </div>
                <span className="mono-label text-stone-dark">READ →</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  ),
});
