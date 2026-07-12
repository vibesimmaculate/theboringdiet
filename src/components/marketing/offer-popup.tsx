import { useEffect, useState } from "react";
import { PolarCheckoutTrigger } from "@/components/product/polar-checkout-trigger";
import { useOfferCountdown } from "@/hooks/use-offer-countdown";

const DISMISS_KEY = "tbd_offer_popup_dismissed";

export function OfferPopup() {
  const [open, setOpen] = useState(false);
  const { ready, hours, minutes, seconds } = useOfferCountdown();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(DISMISS_KEY)) return;
    const t = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(t);
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
            <PolarCheckoutTrigger analyticsId="offer_popup_cta_click" compact className="w-full">
              CLAIM $19 ACCESS NOW
            </PolarCheckoutTrigger>
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
