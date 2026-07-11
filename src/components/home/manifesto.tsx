import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STATEMENTS = [
  { t: "NOT A SUBSCRIPTION.", s: "One payment. Instant digital access. Nothing renews." },
  { t: "NOT AN APP.", s: "No streaks, notifications or dashboard to maintain." },
  { t: "NOT OPEN-ENDED.", s: "Fourteen days. A structured exit. Then you stop." },
  { t: "NOT PERSONALIZED MEDICAL ADVICE.", s: "General educational information about a bounded personal experiment." },
  { t: "FOURTEEN DAYS. THEN STOP.", s: "Not repeated back-to-back. Not extended beyond Day 14." },
];

export function Manifesto() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = refs.current.findIndex((r) => r === e.target);
            if (i >= 0) setActive(i);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-bone paper-grain">
      <div className="editorial-main py-24">
        <div className="space-y-24">
          {STATEMENTS.map((s, i) => (
            <div
              key={s.t}
              ref={(el) => { refs.current[i] = el; }}
              className="min-h-[40vh] flex flex-col justify-center"
            >
              <p className={cn(
                "font-display font-semibold leading-[0.95] tracking-tight transition-colors duration-700",
                "text-4xl sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl",
                i === active ? "text-charcoal" : "text-stone",
              )}>
                {s.t.replace(".", "")}<span className={cn("transition-colors", i === active ? "text-gold" : "text-stone")}>.</span>
              </p>
              <p className={cn("mt-6 text-lg transition-colors duration-700 max-w-md",
                i === active ? "text-charcoal-soft" : "text-stone")}>{s.s}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
