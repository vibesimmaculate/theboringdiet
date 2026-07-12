import { useEffect, useRef, useState, type ReactNode } from "react";
import { POLAR_CHECKOUT_LINK } from "@/config/brand";
import { cn } from "@/lib/utils";
import { trackEvent, trackFbStandard } from "@/components/analytics/meta-pixel";
import { isCheckoutOpen, markCheckoutClosed, markCheckoutOpen, markPurchased } from "@/lib/checkout-state";
import { useOfferCountdown } from "@/hooks/use-offer-countdown";

type PolarEmbed = {
  create: (url: string, theme?: "light" | "dark") => Promise<{
    addEventListener: (name: string, cb: (e: unknown) => void) => void;
    close?: () => void;
  }>;
  init: () => void;
};

type PolarEmbedModule = { PolarEmbedCheckout: PolarEmbed };

// Preload the embed chunk once per page so the first CTA click opens
// instantly instead of waiting on a network fetch.
let embedModule: Promise<PolarEmbedModule> | null = null;

export function preloadPolarEmbed(): Promise<PolarEmbedModule> {
  if (!embedModule) {
    embedModule = import("@polar-sh/checkout/embed") as unknown as Promise<PolarEmbedModule>;
    // If the preload fails (offline blip), allow a retry on the next call.
    embedModule.catch(() => {
      embedModule = null;
    });
  }
  return embedModule;
}

/**
 * A universal Polar checkout trigger — opens the embedded Polar checkout
 * for the $19 product using the compile-time checkout link.
 */
export function PolarCheckoutTrigger({
  className,
  children,
  analyticsId,
  size = "primary",
  compact = false,
  onCheckoutOpened,
}: {
  className?: string;
  children?: ReactNode;
  analyticsId?: string;
  size?: "primary" | "outline";
  compact?: boolean;
  /** Called once the embedded checkout is open (e.g. to dismiss a popup underneath). */
  onCheckoutOpened?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(() => preloadPolarEmbed());
    else window.setTimeout(() => preloadPolarEmbed(), 1200);
  }, []);

  const onClick = async () => {
    if (loading || isCheckoutOpen()) return;
    setLoading(true);
    if (analyticsId) trackEvent(analyticsId);
    try {
      const mod = await preloadPolarEmbed();
      const checkout = await mod.PolarEmbedCheckout.create(POLAR_CHECKOUT_LINK, "dark");
      markCheckoutOpen();
      trackEvent("polar_checkout_loaded");
      trackFbStandard("InitiateCheckout", { content_name: "The Boring Diet", currency: "USD", value: 19 });
      onCheckoutOpened?.();
      checkout.addEventListener("close", () => {
        markCheckoutClosed();
        trackEvent("polar_checkout_closed");
        setLoading(false);
        btnRef.current?.focus();
      });
      checkout.addEventListener("confirmed", () => {
        markPurchased();
        trackEvent("polar_checkout_confirmed");
      });
    } catch (err) {
      console.error("Polar checkout failed to load", err);
      // Never leave the buyer with a dead button — fall back to the hosted checkout.
      trackEvent("polar_checkout_fallback_redirect");
      trackFbStandard("InitiateCheckout", { content_name: "The Boring Diet", currency: "USD", value: 19 });
      window.location.assign(POLAR_CHECKOUT_LINK);
    }
  };

  const label = children || (
    <>
      GET INSTANT ACCESS · <span className="line-through opacity-60 mr-1">$50</span> <span className="text-gold">$19</span>
    </>
  );

  const button = (
    <button
      ref={btnRef}
      onClick={onClick}
      onPointerEnter={() => preloadPolarEmbed()}
      onFocus={() => preloadPolarEmbed()}
      disabled={loading}
      aria-busy={loading}
      data-analytics={analyticsId}
      className={cn(size === "primary" ? "btn-primary" : "btn-outline", compact ? "" : "w-full sm:w-auto", className)}
    >
      {loading ? (
        <>
          <span className="inline-block w-3 h-3 border border-charcoal border-t-transparent rounded-full animate-spin" />
          OPENING…
        </>
      ) : (
        label
      )}
    </button>
  );

  if (compact) return button;

  return (
    <div className="inline-flex flex-col items-start">
      {button}
      <OfferDeadlineLabel />
      <div className="mono-label text-stone-dark text-[10px] mt-1">
        Instant delivery · No subscription · No account required
      </div>
    </div>
  );
}

function OfferDeadlineLabel() {
  const { ready, hours, minutes, seconds } = useOfferCountdown();
  return (
    <div className="mt-3 mono-label text-stone-dark tabular-nums">
      LAUNCH OFFER · 62% OFF ·{" "}
      {ready ? (
        <>
          ENDS IN <span className="text-gold font-semibold">{hours}:{minutes}:{seconds}</span>
        </>
      ) : (
        "ENDS SOON"
      )}
    </div>
  );
}

export function CheckoutSecureLabel() {
  return <div className="mono-label text-stone-dark">SECURE CHECKOUT · POWERED BY POLAR</div>;
}
