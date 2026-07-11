import { EditorialEyebrow } from "@/components/editorial/primitives";
import { Link } from "@tanstack/react-router";

const SUIT = [
  "You are an adult considering a short, highly structured personal experiment.",
  "You prefer exact boundaries over open-ended food choices.",
  "You are comfortable with repetition.",
  "You understand that individual experiences vary.",
  "You are prepared to stop after Day 14.",
];

const NOT_START = [
  "Have diabetes",
  "Have kidney disease",
  "Have a history of disordered eating",
  "Are pregnant or breastfeeding",
  "Are under 18",
  "Take medication affecting blood sugar",
  "Take medication affecting potassium",
  "Have a condition that may alter nutritional requirements",
];

export function SafetySpread() {
  return (
    <section className="border-t border-stone">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="bg-bone paper-grain py-20 sm:py-28 px-6 sm:px-12 lg:px-20">
          <EditorialEyebrow>SUITABILITY</EditorialEyebrow>
          <h2 className="mt-6 h-chapter">
            THIS MAY<br />SUIT YOU IF<span className="text-gold">…</span>
          </h2>
          <ul className="mt-10 space-y-4">
            {SUIT.map((s) => (
              <li key={s} className="border-t border-stone pt-3 flex gap-4">
                <span className="mono-label text-stone-dark">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-deep text-bone paper-grain py-20 sm:py-28 px-6 sm:px-12 lg:px-20">
          <EditorialEyebrow invert>SAFETY</EditorialEyebrow>
          <h2 className="mt-6 h-chapter text-bone">
            DO NOT START<br />
            WITHOUT MEDICAL<br />ADVICE IF<span className="text-red">…</span>
          </h2>
          <ul className="mt-10 space-y-4">
            {NOT_START.map((s) => (
              <li key={s} className="border-t border-bone/15 pt-3 flex gap-4 text-bone/90">
                <span className="mono-label text-red">!</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-charcoal text-bone py-8 px-6 sm:px-12 text-center">
        <p className="mono-label text-bone">
          STOP AND SEEK APPROPRIATE MEDICAL ADVICE IF YOU FEEL SIGNIFICANTLY UNWELL.
        </p>
        <Link to="/safety" className="mt-4 inline-block mono-label text-gold hover:underline">
          READ THE COMPLETE SAFETY NOTICE →
        </Link>
      </div>
    </section>
  );
}
