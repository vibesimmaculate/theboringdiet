import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A restrained CSS 3D editorial publication object.
 * No food imagery, no bright color.
 */
export function BookMockup({ className, interactive = true }: { className?: string; interactive?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative select-none", className)} style={{ perspective: "1600px" }}>
      {/* Redacted pages fanning behind */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 40, rotate: 8 - i * 2 }}
            animate={{ opacity: 0.7, x: 24 + i * 18, rotate: 6 - i * 2, y: -20 + i * 10 }}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-6 top-6 w-40 sm:w-52 h-56 sm:h-72 bg-paper border border-stone shadow-[0_4px_20px_rgba(17,17,17,0.06)] overflow-hidden"
          >
            <div className="p-3">
              <div className="folio">THE BORING DIET · 00{i + 4}</div>
              <div className="mt-3 h-1 w-8 bg-gold" />
              <div className="mt-4 space-y-1.5">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="h-1.5 bg-charcoal/70" style={{ width: `${50 + ((j * 13) % 40)}%` }} />
                ))}
              </div>
              <div className="mt-4 grid grid-cols-7 gap-1">
                {Array.from({ length: 14 }).map((_, k) => (
                  <div key={k} className={cn("aspect-square", k === 13 ? "bg-gold" : "bg-stone/60")} />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Book */}
      <motion.div
        initial={{ opacity: 0, rotateY: -8, rotateX: 4, y: 20 }}
        animate={{ opacity: 1, rotateY: interactive && !reduced ? -2 : 0, rotateX: 0, y: 0 }}
        transition={{ delay: 0.25, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        whileHover={interactive && !reduced ? { rotateY: 1.5, rotateX: -1 } : undefined}
        className="relative mx-auto w-64 sm:w-80 md:w-96 aspect-[3/4] paper-grain"
        style={{ transformStyle: "preserve-3d", transformOrigin: "center" }}
      >
        {/* Spine */}
        <div
          className="absolute top-0 bottom-0 -left-2 w-4 bg-charcoal"
          style={{ transform: "rotateY(-40deg) translateZ(-6px)" }}
        />
        {/* Front cover */}
        <div
          className="absolute inset-0 bg-bone border border-stone shadow-[0_30px_60px_-30px_rgba(17,17,17,0.35)]"
          style={{ transform: "translateZ(6px)" }}
        >
          <div className="h-full flex flex-col p-6 sm:p-8">
            <div>
              <div className="mono-label">A BOUNDED EXPERIMENT</div>
              <div className="mono-label">IN EATING SIMPLY</div>
            </div>
            <div className="mt-8 sm:mt-10 flex-1">
              <div className="h-px bg-charcoal w-full" />
              <h3 className="mt-4 font-display font-semibold text-3xl sm:text-4xl md:text-5xl leading-[0.9]">
                THE<br />BORING<br />DIET<span className="text-gold">.</span>
              </h3>
            </div>
            <div className="mt-8 flex items-end justify-between">
              <div className="font-serif italic text-sm text-charcoal-soft leading-tight">
                Two foods.<br />Fourteen days.<br />Then stop.
              </div>
              <div className="bg-charcoal text-bone mono-label text-[9px] px-2 py-1">EDITION 1.0</div>
            </div>
            <div className="mt-6 mono-label text-stone-dark">DIGITAL EDITION</div>
          </div>
        </div>
        {/* Page block edge */}
        <div className="absolute inset-y-2 -right-1.5 w-1.5 bg-stone" aria-hidden="true" />
      </motion.div>
    </div>
  );
}
