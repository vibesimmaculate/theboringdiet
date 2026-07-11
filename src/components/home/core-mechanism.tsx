import { EditorialEyebrow, RedactedText } from "@/components/editorial/primitives";

const METERS = [
  { k: "FULLNESS", trend: "up", value: "HIGH" },
  { k: "FOOD REWARD", trend: "down", value: "LOW" },
  { k: "DECISIONS", trend: "down", value: "NONE" },
] as const;

export function CoreMechanism() {
  return (
    <section className="bg-bone py-24 sm:py-32">
      <div className="editorial-main">
        <div className="grid grid-cols-12 gap-6 sm:gap-12">
          <div className="col-span-12 md:col-span-6">
            <EditorialEyebrow>02 · THE APPROACH</EditorialEyebrow>
            <h2 className="h-section mt-6">
              THE BOREDOM<br />IS THE POINT<span className="text-gold">.</span>
            </h2>
            <p className="mt-8 text-lg text-charcoal-soft max-w-md leading-relaxed">
              The protocol is designed to reduce food decisions and food reward while keeping the experiment
              short, explicit and bounded.
            </p>
            <p className="mt-4 text-sm text-stone-dark max-w-md">
              It is not presented as a magic-food claim, medical treatment or guaranteed outcome.
            </p>
          </div>

          <div className="col-span-12 md:col-span-6 relative">
            <div
              aria-hidden="true"
              className="absolute -top-6 -right-4 font-display font-medium leading-none text-charcoal/5"
              style={{ fontSize: "clamp(60px, 8vw, 120px)", letterSpacing: "-0.03em" }}
            >
              THE ACTIVE<br/>INGREDIENT IS<br/>████████<span className="text-gold">.</span>
            </div>
            <ul className="relative space-y-8">
              {METERS.map((m) => (
                <li key={m.k} className="border-t border-charcoal pt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="mono-label">{m.k}</span>
                    <span className="font-display text-3xl sm:text-4xl">
                      {m.value}
                      <span className="text-gold ml-2 text-2xl">
                        {m.trend === "up" ? "↑" : "↓"}
                      </span>
                    </span>
                  </div>
                  <div className="mt-3 h-[2px] bg-charcoal/10 relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-charcoal"
                      style={{ width: m.trend === "up" ? "82%" : "18%" }}
                    />
                    <div
                      className="absolute inset-y-0 bg-gold h-full"
                      style={{
                        left: m.trend === "up" ? "80%" : "16%",
                        width: "2%",
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-10 mono-label text-stone-dark">
              REDACTED: <RedactedText chars={10} /> · EXACT FOODS INSIDE THE GUIDE
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
