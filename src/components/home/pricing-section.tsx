import { EditorialEyebrow, Folio, HorizontalRule } from "@/components/editorial/primitives";
import { PolarCheckoutTrigger, CheckoutSecureLabel } from "@/components/product/polar-checkout-trigger";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/components/analytics/meta-pixel";

const CONTENTS = [
  "36-page digital guide",
  "Exact protocol and boundaries",
  "Complete fourteen-day schedule",
  "Preparation and storage system",
  "Kitchen temperatures and timings",
  "Troubleshooting map",
  "Structured exit sequence",
  "Printable tracker",
  "Evidence explanation and limitations",
  "Safety and stop rules",
];

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && trackEvent("pricing_view"), { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="pricing" className="bg-deep py-14 sm:py-20">
      <div className="editorial-shell">
        <div className="mx-auto max-w-4xl bg-bone paper-grain">
          <div className="p-6 sm:p-12 md:p-16">
            <div className="flex items-start justify-between gap-4">
              <EditorialEyebrow>ONE PAYMENT · DIGITAL EDITION</EditorialEyebrow>
              <Folio>THE BORING DIET · 019</Folio>
            </div>
            <h2 className="mt-8 h-section">
              THE COMPLETE<br />14-DAY PROTOCOL<span className="text-gold">.</span>
            </h2>

            <div className="mt-10 inline-flex items-center gap-2 bg-gold-light text-charcoal px-3 py-1.5 rounded-full mono-label text-[10px]">
              ● LAUNCH OFFER · 62% OFF · ENDS SOON
            </div>

            <div className="mt-6 grid grid-cols-12 gap-8 items-end border-y border-charcoal py-8">
              <div className="col-span-12 sm:col-span-6">
                <div className="mono-label text-stone-dark">TODAY'S PRICE</div>
                <div className="mt-2 flex items-baseline gap-4">
                  <span className="numeric-huge">$19</span>
                  <span className="font-display text-3xl line-through text-stone-dark">$50</span>
                </div>
                <div className="mt-2 mono-label text-gold">YOU SAVE $31</div>
              </div>
              <div className="col-span-12 sm:col-span-6">
                <div className="mono-label text-stone-dark">CURRENCY · BILLING</div>
                <div className="font-display text-3xl sm:text-4xl mt-2">USD · ONE TIME</div>
                <div className="mt-2 text-stone-dark text-sm">No subscription. Nothing renews.</div>
              </div>
            </div>


            <div className="mt-10">
              <div className="mono-label text-stone-dark">WHAT'S INCLUDED</div>
              <ul className="mt-4 divide-y divide-stone border-y border-stone">
                {CONTENTS.map((c) => (
                  <li key={c} className="grid grid-cols-[auto_1fr] gap-4 py-3">
                    <span className="mono-label text-stone-dark">—</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <HorizontalRule className="mt-10" />
          </div>

          {/* Purchase band */}
          <div className="bg-charcoal text-bone px-6 sm:px-12 md:px-16 py-10">
            <CheckoutSecureLabel />
            <div className="mt-4">
              <PolarCheckoutTrigger analyticsId="pricing_cta_click">GET THE BORING DIET — $19</PolarCheckoutTrigger>
            </div>
            <p className="mt-6 text-bone/70 text-sm max-w-xl">
              Secure checkout and digital delivery through Polar. No subscription · No account required · Instant digital access.
            </p>
            <p className="mt-4 mono-label text-gold">18+ · REVIEW THE SAFETY NOTICE BEFORE STARTING.</p>
            <div className="mt-6 mono-label text-bone/50">EDITION 1.0</div>
          </div>
        </div>
      </div>
    </section>
  );
}
