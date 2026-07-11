import { createFileRoute, Link } from "@tanstack/react-router";
import { EditorialEyebrow, Folio, HorizontalRule } from "@/components/editorial/primitives";

const SAFETY_TITLE = "The Boring Diet Safety Notice and Suitability Guidance";

const AVOID = [
  "Have diabetes",
  "Have kidney disease",
  "Have a history of disordered eating",
  "Are pregnant or breastfeeding",
  "Are under 18",
  "Take medication affecting blood sugar",
  "Take medication affecting potassium",
  "Have a condition that may alter nutritional requirements",
];

const STOP = [
  "Dizziness",
  "Palpitations",
  "Fainting",
  "Persistent weakness",
  "Muscle cramps",
  "Any significant or worsening symptom",
];

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: `${SAFETY_TITLE} — The Boring Diet` },
      { name: "description", content: "Complete safety notice: who should not start without medical advice, when to stop, and the fixed 14-day endpoint." },
      { property: "og:title", content: SAFETY_TITLE },
      { property: "og:description", content: "Suitability exclusions, stop rules and the fixed endpoint." },
      { property: "og:url", content: "/safety" },
    ],
    links: [{ rel: "canonical", href: "/safety" }],
  }),
  component: SafetyPage,
});

function SafetyPage() {
  return (
    <section className="bg-bone paper-grain pt-24 pb-32">
      <div className="editorial-main">
        <div className="flex items-baseline justify-between">
          <EditorialEyebrow>SAFETY NOTICE</EditorialEyebrow>
          <Folio>THE BORING DIET · SAFETY</Folio>
        </div>
        <h1 className="mt-6 h-display">
          READ<br />BEFORE<br />STARTING<span className="text-red">.</span>
        </h1>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6 text-lg leading-relaxed">
            <p>
              This publication provides general educational information and describes a time-limited personal
              experiment. It is not medical advice, diagnosis or treatment.
            </p>
            <p>
              Do not start without appropriate medical advice if you have diabetes, kidney disease, a history
              of disordered eating, are pregnant or breastfeeding, are under 18, take medication affecting
              blood sugar or potassium, or have a condition that may alter your nutritional requirements.
            </p>
            <p>
              Stop immediately and seek appropriate medical advice if you experience dizziness, palpitations,
              fainting, persistent weakness, muscle cramps or any significant or worsening symptom.
            </p>
            <p>The protocol lasts fourteen days. Do not extend it or repeat it back-to-back.</p>
          </div>
          <aside className="border-l border-charcoal pl-6 text-sm space-y-4">
            <div>
              <div className="mono-label text-stone-dark">MINIMUM AGE</div>
              <div className="font-display text-3xl">18+</div>
            </div>
            <div>
              <div className="mono-label text-stone-dark">DURATION</div>
              <div className="font-display text-3xl">14 days</div>
            </div>
            <div>
              <div className="mono-label text-stone-dark">REPEAT</div>
              <div className="font-display text-3xl">Not back-to-back</div>
            </div>
          </aside>
        </div>

        <HorizontalRule className="mt-16" />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="mono-label text-red">DO NOT START WITHOUT MEDICAL ADVICE IF YOU</div>
            <ul className="mt-4 divide-y divide-stone border-y border-stone">
              {AVOID.map((s) => (
                <li key={s} className="py-3 flex gap-3"><span className="mono-label text-red">!</span>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mono-label text-red">STOP AND SEEK MEDICAL ADVICE IF YOU EXPERIENCE</div>
            <ul className="mt-4 divide-y divide-stone border-y border-stone">
              {STOP.map((s) => (
                <li key={s} className="py-3 flex gap-3"><span className="mono-label text-red">×</span>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-16 mono-label text-stone-dark max-w-2xl">
          If you have any doubt about whether this protocol is appropriate for you, do not start. Consult a
          qualified healthcare professional first. Contact emergency services for urgent medical questions —
          not our support form.
        </p>

        <div className="mt-10 flex gap-3">
          <Link to="/faq" className="btn-outline">READ THE FAQ</Link>
          <Link to="/contact" className="btn-outline">CONTACT SUPPORT</Link>
        </div>
      </div>
    </section>
  );
}
