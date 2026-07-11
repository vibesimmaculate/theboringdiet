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

        <div className="mt-10 rounded-2xl bg-charcoal text-bone p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 mono-label text-gold text-[10px] border border-gold/40 rounded-full px-3 py-1">
            LAUNCH OFFER · ENDS SOON
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-xl">
              <div className="mono-label text-gold">STOP GUESSING. START DAY 1 TODAY.</div>
              <p className="mt-4 font-display text-3xl sm:text-4xl leading-tight">
                The exact protocol, calendar and full method — delivered the second you pay.
              </p>
              <div className="mt-6 flex items-baseline gap-4">
                <span className="font-display text-5xl sm:text-6xl font-semibold text-bone">$19</span>
                <span className="font-display text-2xl line-through text-bone/40">$50</span>
                <span className="mono-label text-gold">SAVE 62%</span>
              </div>
              <p className="mt-3 text-bone/70 text-sm">
                One-time payment · Instant PDF · Read in 20 minutes · Start tomorrow morning.
              </p>
            </div>
            <div className="shrink-0">
              <PolarCheckoutTrigger analyticsId="evidence_cta_click">
                CLAIM YOUR COPY — $19
              </PolarCheckoutTrigger>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-bone/15 flex flex-wrap gap-x-8 gap-y-2 mono-label text-bone/60 text-[10px]">
            <span>✓ SECURE CHECKOUT VIA POLAR</span>
            <span>✓ 14-DAY REFUND WINDOW</span>
            <span>✓ NO SUBSCRIPTION</span>
            <span>✓ NO ACCOUNT REQUIRED</span>
          </div>
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

