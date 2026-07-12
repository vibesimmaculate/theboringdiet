import { useOfferCountdown } from "@/hooks/use-offer-countdown";
import { PolarCheckoutTrigger } from "@/components/product/polar-checkout-trigger";

export function OfferBar() {
  const { ready, hours, minutes, seconds } = useOfferCountdown();
  if (!ready) return null;
  return (
    <div className="w-full bg-charcoal text-bone border-b border-gold/30">
      <div className="editorial-shell py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <span className="mono-label text-gold text-[10px] sm:text-[11px] tracking-[0.2em]">
          🔥 LAUNCH OFFER
        </span>
        <span className="text-sm sm:text-base font-medium whitespace-nowrap">
          <span className="line-through opacity-60 mr-1.5">$50</span>
          <span className="opacity-70 mr-1.5">was</span>
          <span className="text-gold font-bold">$19</span>
          <span className="opacity-80 ml-2">— SAVE $31</span>
        </span>
        <span className="mono-label text-[10px] sm:text-[11px] tabular-nums whitespace-nowrap">
          ENDS IN <span className="text-gold font-semibold">{hours}:{minutes}:{seconds}</span>
        </span>
        <PolarCheckoutTrigger
          compact
          analyticsId="offer_bar_cta_click"
          className="!min-h-[32px] !py-1.5 !px-3 !text-[11px] !bg-gold !text-charcoal hover:!bg-gold-light"
        >
          CLAIM $19 →
        </PolarCheckoutTrigger>
      </div>
    </div>
  );
}
