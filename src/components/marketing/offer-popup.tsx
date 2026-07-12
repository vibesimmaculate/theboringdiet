import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { NO_PROMO_ROUTES } from "@/config/brand";
import { DEFAULT_FUNNEL_CONFIG, type FunnelConfig, type ObjectionKey, type PopupVariant } from "@/config/funnel-defaults";
import { getFunnelConfig } from "@/lib/funnel.functions";
import { useOfferCountdown } from "@/hooks/use-offer-countdown";
import { PolarCheckoutTrigger } from "@/components/product/polar-checkout-trigger";
import { hasPurchased, isCheckoutOpen } from "@/lib/checkout-state";
import { getDominantObjection, getIntentState } from "@/lib/intent-engine";
import { getTrafficInfo } from "@/lib/traffic-source";
import { funnelSignal } from "@/lib/funnel-report";

const DISMISS_KEY = "tbd_offer_popup_dismissed";

type OpenState = { variant: PopupVariant; objection: ObjectionKey; eyebrow: string };

/** Pick the variant + banner line for this visitor at the moment of exit. */
function resolveVariant(config: FunnelConfig): OpenState {
  const objection = getDominantObjection();
  const variant = config.variants[objection] ?? config.variants.default;
  let eyebrow = variant.eyebrow;
  if (objection === "default") {
    const sourceLine = config.sourceEyebrows[getTrafficInfo().source];
    if (sourceLine) eyebrow = sourceLine;
  }
  return { variant, objection, eyebrow };
}

export function OfferPopup() {
  const [openState, setOpenState] = useState<OpenState | null>(null);
  const shownRef = useRef(false);
  const { ready, hours, minutes, seconds } = useOfferCountdown();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const quiet = NO_PROMO_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));

  const { data: fetchedConfig } = useQuery({
    queryKey: ["funnel-config"],
    queryFn: () => getFunnelConfig(),
    staleTime: 5 * 60 * 1000,
  });
  const config = fetchedConfig ?? DEFAULT_FUNNEL_CONFIG;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (quiet || !config.popupEnabled) return;
    if (window.sessionStorage.getItem(DISMISS_KEY)) return;
    if (hasPurchased()) return;

    let armed = false;
    const armTimer = window.setTimeout(() => {
      armed = true;
    }, config.armAfterMs);

    const trigger = (reason: string) => {
      // Only genuine exits: never while the checkout is open, never twice,
      // never before real engagement, never below the intent threshold.
      if (!armed || shownRef.current || isCheckoutOpen() || hasPurchased()) return;
      if (getIntentState().score < config.minIntentScore) return;
      shownRef.current = true;
      const resolved = resolveVariant(config);
      funnelSignal({ name: "popup_shown", path: `${reason}:${resolved.objection}` });
      setOpenState(resolved);
      cleanup();
    };

    // --- Desktop exit-intent: mouse crossing the top edge of the viewport ---
    const onMouseOut = (e: MouseEvent) => {
      const to = (e.relatedTarget || (e as unknown as { toElement?: Node }).toElement) as Node | null;
      if (to) return; // moved to another element inside the page
      if (e.clientY <= 0) trigger("mouse_leave_top");
    };
    const onDocMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger("doc_mouse_leave_top");
    };

    // Tab-switching / minimizing = leaving. Fire on hide so the offer is
    // waiting for them when they return.
    const onVisibility = () => {
      if (document.visibilityState === "hidden") trigger("tab_hidden");
    };

    // --- Mobile exit proxy: fast upward flick near the top of the page ------
    let mLastY = window.scrollY;
    let mLastT = Date.now();
    const onScrollMobile = () => {
      const y = window.scrollY;
      const t = Date.now();
      const dy = mLastY - y;
      const dt = t - mLastT;
      if (y < 300 && dy > 150 && dt < 400) trigger("mobile_flick_up");
      mLastY = y;
      mLastT = t;
    };

    document.addEventListener("mouseout", onMouseOut);
    document.documentElement.addEventListener("mouseleave", onDocMouseLeave);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("scroll", onScrollMobile, { passive: true });

    function cleanup() {
      window.clearTimeout(armTimer);
      document.removeEventListener("mouseout", onMouseOut);
      document.documentElement.removeEventListener("mouseleave", onDocMouseLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScrollMobile);
    }

    return cleanup;
  }, [quiet, config]);

  const dismiss = (reason: "closed" | "cta") => {
    setOpenState(null);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    }
    if (reason === "closed") funnelSignal({ name: "popup_dismissed" });
  };

  if (!ready) return null;
  const v = openState?.variant;

  return (
    <DialogPrimitive.Root open={openState !== null} onOpenChange={(o) => { if (!o) dismiss("closed"); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-charcoal/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-[101] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 max-h-[92svh] overflow-y-auto bg-bone paper-grain rounded-[var(--radius-xl)] shadow-2xl border border-stone data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
        >
          {v && (
            <>
              <div className="bg-charcoal text-bone px-6 py-3 text-center">
                <div className="mono-label text-gold text-[11px] tracking-[0.2em]">{openState.eyebrow}</div>
              </div>

              <div className="p-6 sm:p-8 text-center">
                <div className="mono-label text-stone-dark text-[10px]">THE BORING DIET · EDITION 1.0</div>

                <DialogPrimitive.Title asChild>
                  <h2 className="mt-3 font-display font-semibold text-3xl sm:text-4xl leading-[0.95] text-charcoal">
                    {v.headlineTop}<br />
                    <span className="font-serif italic font-medium">{v.headlineItalic}</span><span className="text-gold">.</span>
                  </h2>
                </DialogPrimitive.Title>

                <div className="mt-5 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
                  <span className="font-display text-2xl text-stone-dark line-through">$50</span>
                  <span className="font-display text-5xl font-bold text-charcoal">$19</span>
                  <span className="mono-label text-gold text-[11px] font-bold">SAVE $31 · −62%</span>
                </div>

                <p className="mt-4 text-sm text-charcoal-soft leading-relaxed max-w-sm mx-auto">{v.body}</p>

                <ul className="mt-4 space-y-1.5 text-left max-w-xs mx-auto">
                  {v.bullets.map((b) => (
                    <li key={b} className="flex items-baseline gap-2.5 text-[13px] text-charcoal-soft">
                      <span className="text-gold font-bold shrink-0">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>

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

                <div className="mt-6">
                  <PolarCheckoutTrigger
                    compact
                    analyticsId="offer_popup_cta_click"
                    className="w-full !bg-gold !text-charcoal hover:!bg-gold-light !font-bold"
                    onCheckoutOpened={() => {
                      funnelSignal({ name: "popup_cta_click", path: openState.objection });
                      dismiss("cta");
                    }}
                  >
                    {v.cta}
                  </PolarCheckoutTrigger>
                </div>

                <DialogPrimitive.Close className="mt-4 mono-label text-stone-dark text-[10px] hover:text-charcoal transition">
                  NO THANKS, I'LL PAY FULL PRICE LATER
                </DialogPrimitive.Close>

                <p className="mt-4 mono-label text-stone-dark text-[10px]">
                  INSTANT DELIVERY · NO SUBSCRIPTION · SECURE CHECKOUT VIA POLAR
                </p>
              </div>

              <DialogPrimitive.Close
                aria-label="Close offer"
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-charcoal/5 hover:bg-charcoal/15 text-charcoal flex items-center justify-center text-lg leading-none transition"
              >
                ×
              </DialogPrimitive.Close>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
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
