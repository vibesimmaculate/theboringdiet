import { PolarCheckoutTrigger } from "@/components/product/polar-checkout-trigger";

/**
 * End-of-page conversion band for content pages (evidence, FAQ, guides, …)
 * so no page dead-ends without a purchase path.
 */
export function ClosingCta({ analyticsId = "closing_cta_click" }: { analyticsId?: string }) {
  return (
    <section className="bg-charcoal text-bone">
      <div className="editorial-shell py-14 sm:py-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-xl">
            <div className="mono-label text-gold">READY WHEN YOU ARE</div>
            <p className="mt-3 font-display text-3xl sm:text-4xl leading-tight">
              One protocol. Fourteen days.<br />
              Delivered the second you pay<span className="text-gold">.</span>
            </p>
            <div className="mt-5 flex items-baseline gap-4">
              <span className="font-display text-5xl font-semibold">$19</span>
              <span className="font-display text-2xl line-through text-bone/40">$50</span>
              <span className="mono-label text-gold">SAVE $31 · ONE TIME</span>
            </div>
          </div>
          <div className="shrink-0">
            <PolarCheckoutTrigger analyticsId={analyticsId} labelTone="invert">
              GET INSTANT ACCESS — $19
            </PolarCheckoutTrigger>
          </div>
        </div>
      </div>
    </section>
  );
}
