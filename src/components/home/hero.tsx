import { motion, useReducedMotion } from "framer-motion";
import { BookMockup } from "@/components/editorial/book-mockup";
import { PolarCheckoutTrigger } from "@/components/product/polar-checkout-trigger";
import { EditorialEyebrow, Folio } from "@/components/editorial/primitives";
import { Link } from "@tanstack/react-router";

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

      <div className="editorial-shell pt-16 sm:pt-24 pb-20 sm:pb-32 relative">
        <div className="grid grid-cols-12 gap-6 sm:gap-10 items-start">
          <div className="col-span-12 lg:col-span-7 xl:col-span-8">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6, ease: easing }}>
              <EditorialEyebrow>A DELIBERATELY SIMPLE 14-DAY EXPERIMENT</EditorialEyebrow>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: reduced ? 0.2 : 0.9, ease: easing }}
              className="h-display mt-6 sm:mt-10"
            >
              THE DIET<br />
              THAT REMOVES<br />
              <span className="font-serif italic font-medium">the decisions</span><span className="text-gold">.</span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.7, ease: easing }}
              style={{ transformOrigin: "left" }}
              className="mt-8 sm:mt-10 h-px bg-gold w-24"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.6 }}
              className="mt-6 max-w-xl text-lg sm:text-xl text-charcoal-soft leading-relaxed"
            >
              One exact protocol. Fourteen days. No calorie counting, no app and no daily meal planning.
              Then you stop.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row sm:items-start gap-4"
            >
              <PolarCheckoutTrigger analyticsId="hero_cta_click">GET INSTANT ACCESS — $19</PolarCheckoutTrigger>
              <Link to="/whats-inside" className="btn-outline w-full sm:w-auto">SEE WHAT'S INSIDE</Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
              className="mt-8 mono-label text-stone-dark max-w-md"
            >
              THE EXACT FOODS, QUANTITIES AND DAILY SCHEDULE ARE CONTAINED INSIDE THE PAID GUIDE.
            </motion.p>

            <motion.dl
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 border-t border-stone pt-6 max-w-2xl"
            >
              {[
                ["DIGITAL", "PDF"],
                ["LENGTH", "36 PAGES"],
                ["DURATION", "14 DAYS"],
                ["PRICE", "$19 ONCE"],
                ["ACCOUNT", "NONE"],
                ["BILLING", "ONE-TIME"],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <dt className="mono-label text-stone-dark text-[10px]">{k}</dt>
                  <dd className="font-display text-base sm:text-lg mt-1">{v}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <div className="col-span-12 lg:col-span-5 xl:col-span-4 relative min-h-[400px] sm:min-h-[520px] mt-10 lg:mt-0">
            <BookMockup className="lg:pt-8" />
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between">
          <Folio>THE BORING DIET · 001 · COVER</Folio>
          <div className="mono-label text-stone-dark">SCROLL</div>
        </div>
      </div>
    </section>
  );
}
