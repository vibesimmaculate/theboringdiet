import { EditorialEyebrow } from "@/components/editorial/primitives";

const PAGES = [
  { n: "01", t: "THE EXACT PROTOCOL", d: "What is allowed, excluded and how the boundaries work." },
  { n: "02", t: "14-DAY CALENDAR", d: "Printable tracker with difficult days flagged in advance." },
  { n: "03", t: "DAY-BY-DAY ROTATION", d: "Complete schedule for all fourteen days." },
  { n: "04", t: "THE PREP SYSTEM", d: "Shopping, preparation, storage and portioning." },
  { n: "05", t: "KITCHEN METHODS", d: "Exact preparation, temperatures and timings." },
  { n: "06", t: "FAILURE-MODE MAP", d: "Adjustment, social pressure, peak boredom." },
  { n: "07", t: "DAY 15 · THE EXIT", d: "A controlled return to a wider range of foods." },
  { n: "08", t: "SAFETY BOUNDARIES", d: "Exclusions, stop rules and the fixed endpoint." },
];

export function WhatsInsideArchive() {
  return (
    <section className="bg-paper py-14 sm:py-20 border-y border-stone">
      <div className="editorial-shell">
        <div className="max-w-2xl">
          <EditorialEyebrow>WHAT YOU GET · 36 PAGES</EditorialEyebrow>
          <h2 className="mt-4 h-chapter">
            THE COMPLETE SYSTEM<span className="text-gold">.</span>
          </h2>
          <p className="mt-3 text-charcoal-soft">
            Everything to run the fourteen days without guessing.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-stone border border-stone">
          {PAGES.map((p) => (
            <li key={p.n} className="bg-bone p-5 flex flex-col gap-2 hover:bg-gold-light transition-colors">
              <span className="folio text-gold">{p.n}</span>
              <h3 className="font-display text-lg leading-tight">{p.t}</h3>
              <p className="text-sm text-charcoal-soft leading-snug">{p.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
