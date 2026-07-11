import { DarkChapter, EditorialEyebrow, Folio, HorizontalRule } from "@/components/editorial/primitives";

const ROWS = [
  { n: "01", t: "NO COUNTING", d: "No calorie targets to calculate throughout the day." },
  { n: "02", t: "NO APP", d: "No streaks, notifications or dashboard to maintain." },
  { n: "03", t: "NO DAILY NEGOTIATION", d: "The schedule is decided before Day 1." },
];

export function ContrarianChapter() {
  return (
    <DarkChapter id="idea">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8">
          <EditorialEyebrow invert>01 · WHY BORING?</EditorialEyebrow>
          <h2 className="h-display mt-8 text-bone">
            MOST DIETS<br />
            GIVE YOU <span className="text-gold">MORE</span><br />
            TO MANAGE<span className="text-gold">.</span>
          </h2>
        </div>
        <aside className="hidden md:block md:col-span-4 pt-24">
          <div className="font-serif italic text-xl text-bone/70 leading-tight" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            MORE RECIPES.<br />MORE TRACKING.<br />MORE DECISIONS.
          </div>
        </aside>
      </div>

      <div className="mt-16 sm:mt-24">
        <HorizontalRule invert />
        {ROWS.map((r) => (
          <div key={r.n} className="grid grid-cols-12 gap-4 py-8 sm:py-10 border-b border-bone/15 items-baseline">
            <div className="col-span-2 sm:col-span-1 folio !text-bone/60">{r.n}</div>
            <div className="col-span-10 sm:col-span-6 font-display text-3xl sm:text-5xl">{r.t}</div>
            <div className="hidden sm:block sm:col-span-3 text-bone/70 leading-snug">{r.d}</div>
            <div className="col-span-12 sm:col-span-2 mono-label text-gold sm:text-right">REMOVED</div>
            <div className="sm:hidden col-span-12 text-bone/70">{r.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-16 flex items-center justify-between">
        <Folio invert>THE BORING DIET · 002</Folio>
        <div className="mono-label !text-bone/40">CHAPTER 01</div>
      </div>
    </DarkChapter>
  );
}
