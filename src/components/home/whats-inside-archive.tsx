import { EditorialEyebrow, RedactedPreview } from "@/components/editorial/primitives";

const PAGES = [
  { n: "01", t: "THE EXACT PROTOCOL", d: "What is allowed, what is excluded and how the boundaries work." },
  { n: "02", t: "THE 14-DAY CALENDAR", d: "A printable tracker with difficult days identified in advance." },
  { n: "03", t: "DAY-BY-DAY ROTATION", d: "A complete schedule for all fourteen days." },
  { n: "04", t: "THE PREP SYSTEM", d: "Shopping, preparation, storage and portioning guidance." },
  { n: "05", t: "KITCHEN METHODS", d: "Exact preparation instructions, temperatures and timings." },
  { n: "06", t: "THE FAILURE-MODE MAP", d: "Guidance for adjustment, social pressure and peak boredom." },
  { n: "07", t: "DAY 15: THE EXIT", d: "A controlled sequence for returning to a wider range of foods." },
  { n: "08", t: "SAFETY BOUNDARIES", d: "Suitability exclusions, stop rules and the fixed endpoint." },
];

export function WhatsInsideArchive() {
  return (
    <section className="bg-bone py-24 sm:py-32">
      <div className="editorial-shell">
        <div className="grid grid-cols-12 gap-6 sm:gap-12">
          <aside className="col-span-12 lg:col-span-4 lg:sticky lg:top-24 self-start">
            <EditorialEyebrow>THE PUBLICATION · CONTENTS</EditorialEyebrow>
            <h2 className="mt-6 h-section">
              THE COMPLETE SYSTEM.<br />
              <span className="text-stone-dark">Not a vague food list</span><span className="text-gold">.</span>
            </h2>
            <p className="mt-6 text-charcoal-soft max-w-md leading-relaxed">
              The guide contains the operating detail required to run the experiment without exposing the
              complete method on the sales page.
            </p>
            <p className="mt-6 mono-label text-stone-dark">
              PREVIEW PAGES ARE INTENTIONALLY REDACTED.
            </p>
          </aside>

          <div className="col-span-12 lg:col-span-8 space-y-8 sm:space-y-12">
            {PAGES.map((p, i) => (
              <article key={p.n} className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-2 folio pt-2">{p.n}</div>
                <div className="col-span-10 sm:col-span-5">
                  <h3 className="font-display text-2xl sm:text-3xl leading-tight">{p.t}</h3>
                  <p className="mt-2 text-charcoal-soft text-sm max-w-sm">{p.d}</p>
                </div>
                <div className="col-span-12 sm:col-span-5">
                  <RedactedPreview
                    eyebrow={`PAGE ${p.n}`}
                    folio={`THE BORING DIET · ${String(10 + i).padStart(3, "0")}`}
                    lines={5}
                    className={i % 2 === 0 ? "rotate-[-0.6deg]" : "rotate-[0.6deg]"}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
