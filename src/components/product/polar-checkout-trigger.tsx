import { useRef, useState, type ReactNode } from "react";
import { POLAR_CHECKOUT_LINK } from "@/config/brand";
import { cn } from "@/lib/utils";
import { trackEvent, trackFbStandard } from "@/components/analytics/meta-pixel";

type PolarEmbed = {
  create: (url: string, theme?: "light" | "dark") => Promise<{
    addEventListener: (name: string, cb: (e: unknown) => void) => void;
    close?: () => void;
  }>;
  init: () => void;
};

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
}: {
  className?: string;
  children?: ReactNode;
  analyticsId?: string;
  size?: "primary" | "outline";
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const onClick = async () => {
    if (loading) return;
    setLoading(true);
    if (analyticsId) trackEvent(analyticsId);
    try {
      const mod = (await import("@polar-sh/checkout/embed")) as unknown as {
        PolarEmbedCheckout: PolarEmbed;
      };
      const checkout = await mod.PolarEmbedCheckout.create(POLAR_CHECKOUT_LINK, "light");
      trackEvent("polar_checkout_loaded");
      trackFbStandard("InitiateCheckout", { content_name: "The Boring Diet", currency: "USD", value: 19 });
      checkout.addEventListener("close", () => {
        trackEvent("polar_checkout_closed");
        setLoading(false);
        btnRef.current?.focus();
      });
      checkout.addEventListener("confirmed", () => {
        trackEvent("polar_checkout_confirmed");
      });
    } catch (err) {
      console.error("Polar checkout failed to load", err);
      setLoading(false);
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
      <div className="mt-3 mono-label text-stone-dark">
        LAUNCH OFFER · 62% OFF · ENDS SOON
      </div>
      <div className="mono-label text-stone-dark text-[10px] mt-1">
        Instant delivery · No subscription · No account required
      </div>
    </div>
  );
}



export function CheckoutSecureLabel() {
  return <div className="mono-label text-stone-dark">SECURE CHECKOUT · POWERED BY POLAR</div>;
}
