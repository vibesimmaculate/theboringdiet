import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { EditorialEyebrow, Folio, HorizontalRule } from "@/components/editorial/primitives";
import { PolarCheckoutTrigger } from "@/components/product/polar-checkout-trigger";

const GUIDE_CONTENT: Record<string, { title: string; excerpt: string; body: string[] }> = {
  "what-is-a-bounded-14-day-food-experiment": {
    title: "What is a bounded 14-day food experiment?",
    excerpt: "Structure, endpoints, and why boundaries matter more than novelty.",
    body: [
      "A bounded food experiment is a short, deliberately constrained pattern of eating with a fixed start, a fixed endpoint and a small number of pre-decided rules. It is not a lifestyle. It is not a treatment. It is a two-week structured observation of what happens when the daily decision load is reduced to almost nothing.",
      "The word bounded is doing most of the work in that sentence. Open-ended restriction — 'eat like this indefinitely' — is where the trouble usually starts: rebound, obsession, social friction, gradually creeping ambiguity about what the rules even are. A fixed endpoint eliminates most of that by design. You already know the day it ends.",
      "The 14-day length is neither magic nor arbitrary. Two weeks is long enough to move through novelty, adjustment, social pressure and boredom in a single cycle, and short enough that it stays inside the boundaries most healthy adults can tolerate without meaningful nutritional risk. It is a length that lets you feel the friction and then stop before the friction becomes damage.",
      "The point of the experiment is not the specific foods. It is the removal of the decision. Whatever you eat, you have decided in advance — before hunger, before boredom, before Friday night. The interesting variable isn't the food. It's the version of you that shows up when the food is no longer negotiable.",
    ],
  },
  "how-fewer-food-decisions-can-simplify-eating": {
    title: "How fewer food decisions can simplify eating",
    excerpt: "Decision reduction as a design tool — not a promise.",
    body: [
      "Most eating advice adds. Track this. Time that. Rotate this macro. Cycle these carbs. Buy the extra tool, run the extra check, log the extra number. The overhead is presented as sophistication. In practice it is drift disguised as work.",
      "Removing decisions is a legitimate design choice. It is how uniforms work. It is how morning routines work. It is how airplane checklists work. Reducing the number of choices you have to make about a repeating problem is not a moral position — it is a way to spend the finite decision budget somewhere else.",
      "Applied to food, decision reduction looks like this: the schedule is decided before Day 1. You do not decide breakfast. You do not decide lunch. You do not decide what to order. There is nothing to negotiate at 4 p.m. when the sugar craving arrives. The negotiation was already lost, on purpose, in advance.",
      "This is not a claim about metabolism. It is a claim about attention. When food is decided, food stops being interesting. That is uncomfortable. It is also, occasionally, useful.",
    ],
  },
  "how-to-prepare-for-a-14-day-food-experiment": {
    title: "How to prepare for a 14-day food experiment",
    excerpt: "The mental, logistical and social preparation that makes short experiments feasible.",
    body: [
      "A short food experiment fails or succeeds mostly in the week before it starts. Once Day 1 arrives, there is very little left to decide. The interesting question is what you have already handled.",
      "The logistical part is small and boring. Buy what you need. Prep what you can prep on one Sunday. Store it where you will actually see it. Have a place to sit down and eat that does not involve looking at a phone. None of this is remarkable. All of it is load-bearing.",
      "The social part is the one people underestimate. Tell the people close to you what you are doing and, more importantly, when it ends. Fourteen days is short. Most people will politely wait it out. Give them a date on the calendar so they can.",
      "The mental part is a single sentence. This is temporary. Not a lifestyle, not an identity, not a claim about food. You are running a two-week observation and then you are going back to a normal life. Preparation is the practice of believing that sentence in advance.",
    ],
  },
  "why-an-exit-plan-matters-after-short-term-restriction": {
    title: "Why an exit plan matters after short-term restriction",
    excerpt: "The Day 15 principle: designed re-entry beats an abrupt stop.",
    body: [
      "Nobody talks about Day 15. Every plan pours its energy into Day 1. What happens after the plan ends is usually left blank, which is where most of the damage lives.",
      "An unstructured exit tends to be an over-correction. Two weeks of narrow eating followed by an unbounded Saturday is not a return to normal. It is a swing. Swings feel like failure and cost the goodwill of the whole preceding fortnight.",
      "A structured exit is small, calm and pre-decided. It says which foods return, in which order, at which meal. It does not turn Day 15 into another rule set. It uses the same principle that made the fourteen days work: reduce the number of decisions to make while the system settles.",
      "The exit is not decoration. It is the reason a bounded experiment stays bounded.",
    ],
  },
  "how-to-decide-whether-a-diet-challenge-is-appropriate": {
    title: "How to decide whether a diet challenge is appropriate",
    excerpt: "A calm framework — including when the honest answer is no.",
    body: [
      "The correct first question is not 'will it work'. It is 'is it appropriate for me right now'. The answer is genuinely sometimes no, and the framework should reflect that.",
      "Any condition that changes nutritional requirements or medication dose is a hard stop until you have spoken to a qualified clinician. Diabetes, kidney disease, pregnancy, breastfeeding, blood-sugar medication, potassium medication and history of disordered eating are the obvious ones. Age under 18 is another. These are not obstacles to argue with. They are honest boundaries.",
      "The soft check is about season of life. A high-stress fortnight, a bereavement, a house move, a new baby, a job change — these are the wrong times to add friction to eating. The experiment will still exist next month.",
      "The last question is intent. If the reason to run it is curiosity — you want to see what happens when the decision load drops — that is a reasonable reason. If the reason is punishment, or self-erasure, or an argument with your body, that is not a diet question and no protocol will resolve it. Stop and talk to someone.",
    ],
  },
};

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const guide = GUIDE_CONTENT[params.slug];
    if (!guide) throw notFound();
    return { guide, slug: params.slug };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Guide — The Boring Diet" }, { name: "robots", content: "noindex" }] };
    const g = loaderData.guide;
    const url = `/guides/${params.slug}`;
    return {
      meta: [
        { title: `${g.title} — The Boring Diet` },
        { name: "description", content: g.excerpt },
        { property: "og:title", content: g.title },
        { property: "og:description", content: g.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org", "@type": "Article",
          headline: g.title, description: g.excerpt,
          author: { "@type": "Organization", name: "The Boring Diet" },
        }),
      }],
    };
  },
  component: GuidePage,
});

function GuidePage() {
  const { guide } = Route.useLoaderData();
  return (
    <article className="bg-bone paper-grain pt-24 pb-32">
      <div className="editorial-main">
        <div className="flex items-baseline justify-between">
          <EditorialEyebrow>EDITORIAL · GUIDE</EditorialEyebrow>
          <Folio>THE BORING DIET · GUIDES</Folio>
        </div>
        <h1 className="mt-8 h-section max-w-4xl">
          {guide.title}<span className="text-gold">.</span>
        </h1>
        <p className="mt-6 font-serif italic text-2xl text-charcoal-soft max-w-2xl">{guide.excerpt}</p>
        <HorizontalRule className="mt-12" />
        <div className="mt-12 max-w-2xl space-y-6 text-lg leading-relaxed">
          {guide.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="mt-16 border-t border-charcoal pt-10 max-w-2xl">
          <div className="mono-label text-stone-dark">THE PUBLICATION</div>
          <p className="mt-3 text-lg">
            The complete protocol — including foods, quantities and daily schedule — is inside the paid guide.
          </p>
          <div className="mt-6">
            <PolarCheckoutTrigger>GET THE GUIDE — $19</PolarCheckoutTrigger>
          </div>
        </div>

        <div className="mt-16">
          <Link to="/guides" className="mono-label hover:underline">← BACK TO GUIDES</Link>
        </div>
      </div>
    </article>
  );
}
