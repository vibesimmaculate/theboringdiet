import { useEffect, useRef, useState, type ReactNode } from "react";
import { getPolarApprovedStatus } from "@/lib/polar-status.functions";
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
 * A universal Polar checkout trigger.
 * - When POLAR_APPROVED=false: disables and shows the required copy.
 * - When true: opens embedded checkout over the current page via PolarEmbedCheckout.create()
 */
export function PolarCheckoutTrigger({
  className,
  children,
  analyticsId,
  size = "primary",
}: {
  className?: string;
  children?: ReactNode;
  analyticsId?: string;
  size?: "primary" | "outline";
}) {
  const [approved, setApproved] = useState<boolean | null>(true);
  const [loading, setLoading] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (false) getPolarApprovedStatus()
      .then((r) => setApproved(r.approved))
      .catch(() => setApproved(false));
  }, []);

  const onClick = async () => {
    if (!approved || loading) return;
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

  const disabled = approved !== true || loading;
  const label =
    approved === false ? "PAYMENT ACCESS IS BEING FINALIZED" : children || "GET INSTANT ACCESS — $19";

  return (
    <div className={cn("inline-flex flex-col items-start", className)}>
      <button
        ref={btnRef}
        onClick={onClick}
        disabled={disabled}
        aria-busy={loading}
        data-analytics={analyticsId}
        className={cn(size === "primary" ? "btn-primary" : "btn-outline", "w-full sm:w-auto")}
      >
        {loading ? (
          <>
            <span className="inline-block w-3 h-3 border border-bone border-t-transparent rounded-full animate-spin" />
            OPENING SECURE CHECKOUT…
          </>
        ) : (
          label
        )}
      </button>
      <div className="mt-2 mono-label text-stone-dark">
        {approved === false ? (
          <>Purchasing will become available once payment access is finalized.</>
        ) : (
          <>$19 USD · ONE TIME · DIGITAL DELIVERY</>
        )}
      </div>
      {approved !== false && (
        <div className="mono-label text-stone-dark text-[10px]">
          No subscription · No account required
        </div>
      )}
    </div>
  );
}

export function CheckoutSecureLabel() {
  return <div className="mono-label text-stone-dark">SECURE CHECKOUT · POWERED BY POLAR</div>;
}
