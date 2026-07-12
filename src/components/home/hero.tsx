import { motion, useReducedMotion } from "framer-motion";
import { BookMockup } from "@/components/editorial/book-mockup";
import { PolarCheckoutTrigger } from "@/components/product/polar-checkout-trigger";
import { EditorialEyebrow } from "@/components/editorial/primitives";

export function Hero() {
  const reduced = useReducedMotion();
  const easing = [0.22, 1, 0.36, 1] as const;
  return (
    <section className="relative bg-bone paper-grain overflow-hidden">
      {/* Enormous background word */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-10 sm:-right-20 select-none font-display font-semibold leading-none text-charcoal"
        style={{ fontSize: "clamp(240px, 40vw, 700px)", opacity: 0.06, letterSpacing: "-0.05em" }}
      >
        BORING
      </div>

      <div className="editorial-shell pt-10 sm:pt-16 pb-14 sm:pb-20 relative">
        <div className="grid grid-cols-12 gap-6 sm:gap-10 items-center">
          <div className="col-span-12 lg:col-span-7 xl:col-span-8">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6, ease: easing }}>
              <EditorialEyebrow>FOR PEOPLE DONE OVERTHINKING WHAT TO EAT</EditorialEyebrow>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: reduced ? 0.2 : 0.9, ease: easing }}
              className="h-display mt-6 sm:mt-8"
            >
              THE DIET<br />
              THAT REMOVES<br />
              <span className="font-serif italic font-medium">the decisions</span><span className="text-gold">.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-6 max-w-xl text-lg sm:text-xl text-charcoal-soft leading-relaxed"
            >
              A 36-page PDF with one exact protocol, a full 14-day schedule and shopping list.
              Delivered instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1"
            >
              <span className="mono-label text-stone-dark text-[11px]">TODAY</span>
              <span className="font-display text-2xl text-stone-dark line-through">$50</span>
              <span className="font-display text-5xl sm:text-6xl font-bold text-charcoal">$19</span>
              <span className="mono-label text-gold text-[11px] font-bold">SAVE $31</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.6 }}
              className="mt-6"
            >
              <PolarCheckoutTrigger analyticsId="hero_cta_click">GET INSTANT ACCESS — $19</PolarCheckoutTrigger>
            </motion.div>
          </div>

          <div className="col-span-12 lg:col-span-5 xl:col-span-4 relative min-h-[400px] sm:min-h-[520px] mt-10 lg:mt-0">
            <BookMockup className="lg:pt-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
