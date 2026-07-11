import { DarkChapter, EditorialEyebrow, HorizontalRule } from "@/components/editorial/primitives";
import { Timeline14Days } from "@/components/product/timeline-14-days";

const STEPS = [
  { n: "01", t: "PAY $19 ONCE", d: "No subscription and no recurring charge." },
  { n: "02", t: "RECEIVE ACCESS THROUGH POLAR", d: "Polar provides secure checkout, purchase confirmation and digital access." },
  { n: "03", t: "READ THE COMPLETE PROTOCOL", d: "Review the full guide and Safety Notice before choosing a start date." },
  { n: "04", t: "STOP AFTER DAY 14", d: "Follow the structured exit rather than extending the experiment." },
];

export function TimelineSection() {
  return (
    <section className="bg-bone py-24 sm:py-32 border-t border-stone">
      <div className="editorial-main">
        <EditorialEyebrow>04 · THE STRUCTURE</EditorialEyebrow>
        <h2 className="mt-6 h-section">
          FOURTEEN DAYS.<br />ALREADY DECIDED<span className="text-gold">.</span>
        </h2>
        <div className="mt-16">
          <Timeline14Days />
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <DarkChapter id="process">
      <EditorialEyebrow invert>05 · THE PROCESS</EditorialEyebrow>
      <h2 className="mt-6 h-section text-bone">
        BUY IT.<br />DOWNLOAD IT.<br />
        RUN IT ONCE<span className="text-gold">.</span>
      </h2>

      <div className="mt-16 relative">
        <div className="absolute left-0 right-0 top-8 h-px bg-gold hidden md:block" />
        <ol className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
          {STEPS.map((s, i) => (
            <li key={s.n} className={i % 2 === 1 ? "md:pt-16" : ""}>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gold rounded-full" />
                <div className="folio !text-bone/60">{s.n}</div>
              </div>
              <div className="mt-6 font-display text-2xl leading-tight text-bone">{s.t}</div>
              <p className="mt-3 text-bone/70 text-sm max-w-xs">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>

      <HorizontalRule invert className="mt-16" />
    </DarkChapter>
  );
}
