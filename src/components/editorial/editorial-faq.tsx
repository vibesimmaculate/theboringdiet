import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/components/analytics/meta-pixel";

export type FAQ = { q: string; a: string };

/**
 * Editorial index (not card-style accordions).
 * Answers are always in DOM for SEO/AEO; visual disclosure only.
 */
export function EditorialFAQ({ items, defaultOpen = 0 }: { items: FAQ[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<Set<number>>(new Set([defaultOpen]));
  const toggle = (i: number) => {
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else { n.add(i); trackEvent("faq_opened", { index: i }); }
      return n;
    });
  };

  return (
    <ol className="border-t border-charcoal">
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <li key={i} className="border-b border-stone">
            <button
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="w-full grid grid-cols-[auto_1fr_auto] items-baseline gap-6 py-6 sm:py-8 text-left group"
            >
              <span className="mono-label text-stone-dark w-8">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display text-2xl sm:text-3xl leading-tight">{it.q}</span>
              <span className={cn("mono-label", isOpen ? "text-gold" : "text-charcoal")}>
                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
              </span>
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-500 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="pl-14 pr-4 pb-8 max-w-2xl text-charcoal-soft leading-relaxed">{it.a}</div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
