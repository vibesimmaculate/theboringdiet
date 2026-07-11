import { EditorialEyebrow, Folio, HorizontalRule } from "@/components/editorial/primitives";
import { EvidenceChart } from "@/components/product/evidence-chart";
import { PolarCheckoutTrigger } from "@/components/product/polar-checkout-trigger";

export function EvidenceSection() {
  return (
    <section className="bg-bone py-14 sm:py-20 border-t border-stone">
      <div className="editorial-main">
        <div className="max-w-2xl">
          <EditorialEyebrow>THE EVIDENCE · SATIETY INDEX</EditorialEyebrow>
          <h2 className="h-chapter mt-4">
            ONE PROTOCOL FOOD RANKED FIRST<span className="text-gold">.</span>
          </h2>
          <p className="mt-4 text-charcoal-soft leading-relaxed">
            In the original satiety index study, participants ate equal-calorie portions of common foods.
            White bread was scored 100. One of the two protocol foods ranked highest of everything tested.
          </p>
        </div>

        <div className="mt-10 border border-stone bg-paper p-6 sm:p-10 rounded-2xl">
          <EvidenceChart />
        </div>

        <p className="mt-4 mono-label text-stone-dark max-w-3xl">
          CHART USES ANONYMIZED PROTOCOL LABELS. EXACT FOODS AND FULL CITATION INSIDE THE GUIDE.
        </p>

        <div className="mt-10 rounded-2xl bg-charcoal text-bone p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="mono-label text-gold">READY WHEN YOU ARE</div>
            <p className="mt-3 font-display text-3xl sm:text-4xl leading-tight max-w-lg">
              Get the exact protocol, the calendar and the full method.
            </p>
          </div>
          <PolarCheckoutTrigger analyticsId="evidence_cta_click">GET IT — $19</PolarCheckoutTrigger>
        </div>

        <HorizontalRule className="mt-12" />
        <div className="mt-4 flex items-center justify-between text-sm text-stone-dark">
          <p>Source: Satiety Index, European Journal of Clinical Nutrition, 1995.</p>
          <Folio>THE BORING DIET · 004</Folio>
        </div>
      </div>
    </section>
  );
}

export function EvidenceBoundary() {
  return null;
}

