import { PolarCheckoutTrigger } from "@/components/product/polar-checkout-trigger";

export function BackCover() {
  return (
    <section className="bg-deep text-bone paper-grain">
      <div className="editorial-main min-h-[80vh] flex flex-col justify-center py-24 sm:py-32 text-center">
        <div className="mono-label text-bone/50 mb-10">THE BORING DIET · BACK COVER</div>
        <h2 className="h-display text-bone mx-auto">
          TWO FOODS.<br />
          FOURTEEN DAYS.<br />
          <span className="text-bone">THEN STOP</span><span className="text-gold">.</span>
        </h2>
        <p className="mt-10 mx-auto max-w-xl text-bone/80 leading-relaxed">
          The complete system is inside. Purchase once, receive access through Polar and begin only when you are ready.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3">
          <PolarCheckoutTrigger analyticsId="backcover_cta_click">GET INSTANT ACCESS — $19</PolarCheckoutTrigger>
        </div>
        <p className="mt-10 mono-label text-bone/40">
          ONE-TIME PURCHASE · DIGITAL PDF · NO SUBSCRIPTION
        </p>
      </div>
    </section>
  );
}
