import { useState } from "react";
import { cn } from "@/lib/utils";

const DAYS: Record<number, { label: string; note: string; tone: "gold" | "red" | "goldBlock" }> = {
  1: { label: "START", note: "The rules begin. The schedule is already decided.", tone: "gold" },
  3: { label: "ADJUSTMENT", note: "An adjustment period may occur. The guide explains what to monitor.", tone: "gold" },
  6: { label: "SOCIAL PRESSURE", note: "Social pressure often matters more than hunger.", tone: "gold" },
  9: { label: "BOREDOM PEAK", note: "The novelty has disappeared. The failure-mode map becomes important.", tone: "red" },
  14: { label: "STOP", note: "The protocol ends. Extending it is not part of the design.", tone: "goldBlock" },
};

export function Timeline14Days() {
  const [active, setActive] = useState<number>(1);
  return (
    <div>
      {/* Desktop horizontal */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute left-0 right-0 top-6 h-px bg-charcoal" />
          <ol className="grid gap-1 relative" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
            {Array.from({ length: 14 }).map((_, i) => {
              const day = i + 1;
              const meta = DAYS[day];
              const isActive = active === day;
              return (
                <li key={day} className="text-center">
                  <button
                    onClick={() => setActive(day)}
                    aria-pressed={isActive}
                    aria-label={`Day ${day}${meta ? ` — ${meta.label}` : ""}`}
                    className={cn(
                      "block mx-auto w-3 h-3 mt-[18px] border border-charcoal transition-all",
                      meta?.tone === "goldBlock" && "bg-gold w-5 h-5",
                      meta?.tone === "gold" && "bg-gold rounded-full",
                      meta?.tone === "red" && "bg-red rounded-full",
                      !meta && "bg-bone rounded-full",
                      isActive && "scale-125",
                    )}
                  />
                  <div className={cn("mt-4 font-display font-medium text-lg tabular-nums", isActive ? "text-charcoal" : "text-stone-dark")}>
                    {String(day).padStart(2, "0")}
                  </div>
                  {meta && <div className="mono-label text-[9px] mt-1">{meta.label}</div>}
                </li>
              );
            })}
          </ol>
        </div>
        <div className="mt-10 border-t border-stone pt-6 min-h-[80px]">
          {DAYS[active] && (
            <div>
              <div className="mono-label text-stone-dark">DAY {String(active).padStart(2, "0")} · {DAYS[active].label}</div>
              <p className="mt-2 font-serif italic text-2xl max-w-2xl leading-snug">{DAYS[active].note}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile vertical */}
      <ol className="md:hidden space-y-3">
        {Array.from({ length: 14 }).map((_, i) => {
          const day = i + 1;
          const meta = DAYS[day];
          return (
            <li key={day} className="grid grid-cols-[auto_1fr] gap-4 py-3 border-b border-stone">
              <div className={cn(
                "w-10 h-10 flex items-center justify-center font-display text-lg",
                meta?.tone === "goldBlock" ? "bg-gold text-charcoal" :
                meta?.tone === "red" ? "bg-red text-bone" :
                meta ? "bg-charcoal text-bone" : "border border-stone text-stone-dark",
              )}>{String(day).padStart(2, "0")}</div>
              <div>
                {meta ? (
                  <>
                    <div className="mono-label">{meta.label}</div>
                    <p className="text-sm text-charcoal-soft mt-1">{meta.note}</p>
                  </>
                ) : (
                  <div className="mono-label text-stone-dark">— </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-10 font-display text-2xl sm:text-3xl leading-tight max-w-2xl">
        THE DIFFICULT DAYS ARE NOT SURPRISES.<br />
        <span className="text-stone-dark">They are part of the map.</span>
      </p>
    </div>
  );
}
