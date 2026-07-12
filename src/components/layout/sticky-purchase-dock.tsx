import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { PolarCheckoutTrigger } from "@/components/product/polar-checkout-trigger";
import { useOfferCountdown } from "@/hooks/use-offer-countdown";
import { hasPurchased } from "@/lib/checkout-state";
import { NO_PROMO_ROUTES } from "@/config/brand";

export function StickyPurchaseDock() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [visible, setVisible] = useState(false);
  const { ready, hours, minutes, seconds } = useOfferCountdown();

  useEffect(() => {
    if (hasPurchased()) return; // buyers don't need a purchase dock
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden = NO_PROMO_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
  if (hidden) return null;

  const countdown = ready ? (
    <span className="tabular-nums">{hours}:{minutes}:{seconds}</span>
  ) : (
    "SOON"
  );

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Desktop bottom-right dock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:flex fixed bottom-6 right-6 z-30 items-center gap-4 bg-charcoal text-bone px-5 py-3 border border-gold/40 shadow-2xl rounded-md"
          >
            <div>
              <div className="mono-label text-gold leading-tight">🔥 SAVE $31 · ENDS IN {countdown}</div>
              <div className="font-display text-sm leading-tight mt-0.5">
                <span className="opacity-70 mr-1">was</span>
                <span className="line-through opacity-60 mr-2">$50</span>
                <span className="opacity-70 mr-1">now</span>
                <span className="text-gold font-bold">$19</span>
                <span className="opacity-70"> · ONE TIME</span>
              </div>
            </div>
            <PolarCheckoutTrigger
              compact
              analyticsId="sticky_cta_click"
              className="!min-h-[44px] !py-2.5 !px-5 !bg-gold !text-charcoal hover:!bg-gold-light !font-bold"
            >
              GET IT NOW →
            </PolarCheckoutTrigger>
          </motion.div>

          {/* Mobile bottom bar */}
          <motion.div
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            exit={{ y: 60 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-charcoal text-bone flex items-center justify-between px-4 py-3 pb-[max(env(safe-area-inset-bottom),12px)] border-t border-gold/40 shadow-2xl"
          >
            <div>
              <div className="mono-label text-gold leading-tight text-[10px]">🔥 SAVE $31 · ENDS IN {countdown}</div>
              <div className="font-display text-base leading-tight mt-0.5">
                <span className="line-through opacity-60 mr-1 text-sm">$50</span>
                <span className="text-gold font-bold">$19</span>
                <span className="opacity-70 text-sm"> · one time</span>
              </div>
            </div>
            <PolarCheckoutTrigger
              compact
              analyticsId="sticky_cta_click"
              className="!bg-gold !text-charcoal !px-5 !py-3 !min-h-[48px] !font-bold"
            >GET IT →</PolarCheckoutTrigger>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
