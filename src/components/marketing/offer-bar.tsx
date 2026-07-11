import { useOfferCountdown } from "@/hooks/use-offer-countdown";

export function OfferBar() {
  const { ready, hours, minutes, seconds } = useOfferCountdown();
  if (!ready) return null;
  return (
    <div className="w-full bg-charcoal text-bone">
      <div className="editorial-shell py-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
        <span className="mono-label text-gold text-[10px] sm:text-[11px] tracking-[0.2em]">
          🔥 LAUNCH OFFER
        </span>
        <span className="text-sm sm:text-base font-medium">
          <span className="line-through opacity-60 mr-1.5">$50</span>
          <span className="text-gold font-semibold">$19</span>
          <span className="opacity-70 mx-2 hidden sm:inline">·</span>
          <span className="hidden sm:inline opacity-80">Save $31 today only</span>
        </span>
        <span className="mono-label text-[10px] sm:text-[11px] tabular-nums">
          ENDS IN <span className="text-gold font-semibold">{hours}:{minutes}:{seconds}</span>
        </span>
      </div>
    </div>
  );
}
