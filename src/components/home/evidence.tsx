import { EditorialEyebrow, Folio, HorizontalRule } from "@/components/editorial/primitives";
import { EvidenceChart } from "@/components/product/evidence-chart";

export function EvidenceSection() {
  return (
    <section className="bg-bone py-24 sm:py-32 border-t border-stone">
      <div className="editorial-main">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <EditorialEyebrow>03 · THE EVIDENCE · SATIETY INDEX</EditorialEyebrow>
            <h2 className="h-section mt-6">
              ONE OF THE TWO FOODS<br />
              RANKED FIRST<span className="text-gold">.</span>
            </h2>
            <p className="mt-4 font-serif italic text-2xl text-charcoal-soft">By a distance.</p>
          </div>
          <div className="col-span-12 md:col-span-8">
            <p className="text-lg text-charcoal-soft leading-relaxed max-w-2xl">
              In the original satiety index study, participants consumed equal-calorie portions of common
              foods. White bread was assigned a score of 100. One of the two protocol foods ranked highest
              among the foods tested.
            </p>
          </div>
        </div>

        <div className="mt-12 border border-stone bg-paper p-6 sm:p-10 paper-grain">
          <EvidenceChart />
        </div>

        <p className="mt-6 mono-label text-stone-dark max-w-3xl">
          THE PUBLIC CHART USES ANONYMIZED PROTOCOL LABELS. THE EXACT FOODS AND COMPLETE SOURCE EXPLANATION
          ARE INSIDE THE GUIDE.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-0 border border-stone">
          <div className="p-8 border-b md:border-b-0 md:border-r border-stone">
            <div className="mono-label text-gold">WHAT THIS SHOWS</div>
            <p className="mt-3 text-lg leading-snug">
              One protocol food ranked very highly for satiety in the original comparison.
            </p>
          </div>
          <div className="p-8">
            <div className="mono-label text-red">WHAT THIS DOES NOT SHOW</div>
            <p className="mt-3 text-lg leading-snug">
              It does not prove that the complete two-food, fourteen-day protocol has been clinically tested
              or guarantees any outcome.
            </p>
          </div>
        </div>

        <HorizontalRule className="mt-16" />
        <div className="mt-6 flex items-center justify-between text-sm text-stone-dark">
          <p>
            Source: original Satiety Index research, European Journal of Clinical Nutrition, 1995. Full
            citation and interpretation are provided inside the guide.
          </p>
          <Folio>THE BORING DIET · 004</Folio>
        </div>
      </div>
    </section>
  );
}

export function EvidenceBoundary() {
  return (
    <section className="bg-deep text-bone paper-grain py-24 sm:py-32">
      <div className="editorial-main">
        <EditorialEyebrow invert>WHERE THE PROOF ENDS</EditorialEyebrow>
        <h2 className="mt-6 h-display text-bone">
          WHERE<br />THE PROOF<br />ENDS<span className="text-gold">.</span>
        </h2>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <div className="mono-label text-gold">SUPPORTED</div>
            <ul className="mt-4 space-y-3 text-bone/90">
              {[
                "Relative satiety differences among foods tested",
                "Low-energy-density foods can support fullness",
                "Structure can reduce food decisions",
                "The protocol has explicit boundaries and an end date",
              ].map((s) => (
                <li key={s} className="flex gap-3 border-b border-bone/15 pb-3">
                  <span className="mono-label text-bone/50 w-6">—</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mono-label text-red">NOT ESTABLISHED</div>
            <ul className="mt-4 space-y-3 text-bone/90">
              {[
                "Guaranteed results",
                "The exact two-food protocol as a clinical treatment",
                "Suitability for every person",
                "Long-term safety",
                "Disease treatment",
                "A specific amount of weight loss",
              ].map((s) => (
                <li key={s} className="flex gap-3 border-b border-bone/15 pb-3">
                  <span className="mono-label text-bone/50 w-6">×</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-16 font-display text-3xl sm:text-5xl leading-tight max-w-3xl">
          THE EVIDENCE SUPPORTS THE WHY<span className="text-gold">.</span>
          <br /><span className="text-bone/70">The protocol is the experiment.</span>
        </p>
      </div>
    </section>
  );
}
