import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { PolarCheckoutTrigger } from "@/components/product/polar-checkout-trigger";


const HIDE_ROUTES = ["/success", "/payment-cancelled", "/safety", "/privacy", "/terms", "/refunds", "/disclaimer", "/contact"];

export function StickyPurchaseDock() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden = HIDE_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
  if (hidden) return null;

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
            className="hidden md:flex fixed bottom-6 right-6 z-30 items-center gap-4 bg-charcoal text-bone px-5 py-3 border border-charcoal-soft"
          >
            <div>
              <div className="mono-label text-bone/70 leading-tight">THE BORING DIET</div>
              <div className="font-display text-sm leading-tight">
                <span className="text-gold">$19</span> · ONE TIME
              </div>
            </div>
            <Link to="/product" data-analytics="sticky_cta_click" className="mono-label bg-bone text-charcoal px-4 py-2.5 hover:bg-gold-light transition-colors">
              GET IT
            </Link>
          </motion.div>

          {/* Mobile bottom bar */}
          <motion.div
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            exit={{ y: 60 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-charcoal text-bone flex items-center justify-between px-4 py-3 pb-[max(env(safe-area-inset-bottom),12px)]"
          >
            <div>
              <div className="mono-label text-bone/70 leading-tight text-[10px]">THE BORING DIET</div>
              <div className="font-display text-base leading-tight">
                <span className="text-gold">$19</span>
              </div>
            </div>
            <Link
              to="/product"
              data-analytics="sticky_cta_click"
              className="mono-label bg-bone text-charcoal px-5 py-3 min-h-[48px] flex items-center"
            >GET IT</Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
