import { useEffect, useState } from "react";
import { POLAR_CHECKOUT_LINK } from "@/config/brand";
import { trackEvent, trackFbStandard } from "@/components/analytics/meta-pixel";
import { useOfferCountdown } from "@/hooks/use-offer-countdown";

const DISMISS_KEY = "tbd_offer_popup_dismissed";

export function OfferPopup() {
  const [open, setOpen] = useState(false);
  const { ready, hours, minutes, seconds } = useOfferCountdown();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(DISMISS_KEY)) return;

    let fired = false;
    let armed = false; // require some engagement before we're allowed to fire
    const startedAt = Date.now();
    const ARM_AFTER_MS = 4000;      // don't fire in the first 4s (avoids bounce-in triggers)
    const FALLBACK_MS = 45000;      // last-resort auto-open
    const SCROLL_DEPTH_PCT = 0.6;   // % of page scrolled

    // Track pointer velocity for a smarter desktop exit-intent
    let lastY = 0;
    let lastT = performance.now();
    let vy = 0; // vertical velocity px/ms (negative = moving up)

    const trigger = (reason: string) => {
      if (fired || !armed) return;
      fired = true;
      trackEvent("offer_popup_shown", { reason } as unknown as Record<string, unknown>);
      setOpen(true);
      cleanup();
    };

    const armTimer = window.setTimeout(() => { armed = true; }, ARM_AFTER_MS);
    const fallbackTimer = window.setTimeout(() => { armed = true; trigger("timeout"); }, FALLBACK_MS);

    // Desktop: pointer moves quickly upward AND leaves through the top edge.
    // pointerleave on document is more reliable than mouseout for detecting real exits.
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      vy = (e.clientY - lastY) / dt;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;

      // Fast upward motion while already near the top → likely heading for tab/close button
      if (armed && e.clientY < 60 && vy < -0.35) {
        trigger("pointer_velocity_top");
      }
    };

    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      // Only count exits through the top of the viewport
      if (e.clientY <= 0) trigger("pointer_leave_top");
    };

    // Tab-switching / minimizing is also a form of leaving on desktop
    const onVisibility = () => {
      if (document.visibilityState === "hidden" && Date.now() - startedAt > ARM_AFTER_MS) {
        // Arm on first hide so returning to the tab shows the offer immediately
        armed = true;
        // Fire when they come back so it isn't hidden behind their other tab
        const onReturn = () => {
          if (document.visibilityState === "visible") {
            document.removeEventListener("visibilitychange", onReturn);
            trigger("tab_return");
          }
        };
        document.addEventListener("visibilitychange", onReturn);
      }
    };

    // Deep-scroll intent (works everywhere including mobile)
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = window.scrollY + window.innerHeight;
      const threshold = doc.scrollHeight * SCROLL_DEPTH_PCT;
      if (armed && scrolled >= threshold) trigger("scroll_depth");
    };

    // Mobile exit proxy: fast upward flick near top of page (heading for address bar / back)
    let mLastY = window.scrollY;
    let mLastT = Date.now();
    const onScrollMobile = () => {
      const y = window.scrollY;
      const t = Date.now();
      const dy = mLastY - y;
      const dt = t - mLastT;
      if (armed && y < 300 && dy > 180 && dt < 350) trigger("mobile_flick_up");
      mLastY = y;
      mLastT = t;
    };

    // History back-button intent (mobile especially)
    const onPopState = () => trigger("history_back");
    // Push a state so first back press fires us instead of leaving the site (once).
    try { window.history.pushState({ tbdOffer: 1 }, ""); } catch { /* ignore */ }

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScrollMobile, { passive: true });
    window.addEventListener("popstate", onPopState);

    function cleanup() {
      window.clearTimeout(armTimer);
      window.clearTimeout(fallbackTimer);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScrollMobile);
      window.removeEventListener("popstate", onPopState);
    }

    return cleanup;
  }, []);

  const close = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    }
  };

  if (!open || !ready) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-popup-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <div className="relative bg-bone paper-grain w-full max-w-md rounded-[var(--radius-xl)] shadow-2xl border border-stone overflow-hidden animate-scale-in">
        <button
          onClick={close}
          aria-label="Close offer"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-charcoal/5 hover:bg-charcoal/15 text-charcoal flex items-center justify-center text-lg leading-none transition"
        >
          ×
        </button>

        <div className="bg-charcoal text-bone px-6 py-3 text-center">
          <div className="mono-label text-gold text-[11px] tracking-[0.2em]">
            🔥 LIMITED-TIME LAUNCH OFFER
          </div>
        </div>

        <div className="p-6 sm:p-8 text-center">
          <div className="mono-label text-stone-dark text-[10px]">THE BORING DIET · EDITION 1.0</div>

          <h2
            id="offer-popup-title"
            className="mt-3 font-display font-semibold text-3xl sm:text-4xl leading-[0.95] text-charcoal"
          >
            SAVE $31<br />
            <span className="font-serif italic font-medium">before it's gone</span><span className="text-gold">.</span>
          </h2>

          <div className="mt-5 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
            <span className="mono-label text-stone-dark text-[10px]">WAS</span>
            <span className="font-display text-2xl text-stone-dark line-through">$50</span>
            <span className="mono-label text-stone-dark text-[10px]">NOW</span>
            <span className="font-display text-5xl font-bold text-charcoal">
              $19
            </span>
            <span className="mono-label text-gold text-[11px] font-bold">SAVE $31 · −62%</span>
          </div>

          <div className="mt-5 border-t border-b border-stone py-4">
            <div className="mono-label text-stone-dark text-[10px]">OFFER EXPIRES IN</div>
            <div className="mt-2 flex items-center justify-center gap-2 font-display text-3xl sm:text-4xl font-semibold tabular-nums text-charcoal">
              <TimeBox v={hours} label="HRS" />
              <span className="text-gold">:</span>
              <TimeBox v={minutes} label="MIN" />
              <span className="text-gold">:</span>
              <TimeBox v={seconds} label="SEC" />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <a
              href={POLAR_CHECKOUT_LINK}
              onClick={() => {
                trackEvent("offer_popup_cta_click");
                trackFbStandard("InitiateCheckout", { content_name: "The Boring Diet", currency: "USD", value: 19 });
              }}
              className="btn-primary w-full !bg-gold !text-charcoal hover:!bg-gold-light !font-bold text-center"
            >
              CLAIM $19 ACCESS NOW →
            </a>
          </div>

          <button
            onClick={close}
            className="mt-4 mono-label text-stone-dark text-[10px] hover:text-charcoal transition"
          >
            NO THANKS, I'LL PAY FULL PRICE LATER
          </button>

          <p className="mt-4 mono-label text-stone-dark text-[10px]">
            INSTANT DIGITAL DELIVERY · NO SUBSCRIPTION · NO ACCOUNT
          </p>
        </div>
      </div>
    </div>
  );
}

function TimeBox({ v, label }: { v: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-charcoal text-bone px-3 py-2 rounded-[var(--radius-md)] min-w-[3.25rem]">
        {v}
      </div>
      <div className="mono-label text-stone-dark text-[9px] mt-1">{label}</div>
    </div>
  );
}
