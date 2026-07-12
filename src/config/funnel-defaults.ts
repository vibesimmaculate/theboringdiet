/**
 * Adaptive funnel configuration — single source of truth for the exit-intent
 * popup variants, traffic-source personalization and trigger tuning.
 *
 * The admin CMS (/admin) can override this at runtime; overrides live in
 * server memory until the next deploy. To make CMS edits permanent, use
 * "Copy JSON" in the admin panel and paste the result into DEFAULT_FUNNEL_CONFIG.
 *
 * Copy rules: every claim here must stay consistent with the public product
 * facts — no guarantees, no fabricated reviews, no refund promises beyond
 * the published (discretionary) policy.
 */

export type ObjectionKey = "abandoned" | "price" | "trust" | "safety" | "evidence" | "default";

export type TrafficSource =
  | "meta"
  | "tiktok"
  | "google"
  | "youtube"
  | "reddit"
  | "x"
  | "email"
  | "direct"
  | "other";

export type PopupVariant = {
  /** Charcoal banner line at the top of the popup. */
  eyebrow: string;
  /** Bold display line. */
  headlineTop: string;
  /** Italic serif second line. */
  headlineItalic: string;
  /** Short supporting sentence under the price row. */
  body: string;
  /** Proof points — keep to 3, each one verifiable. */
  bullets: string[];
  /** CTA button label. */
  cta: string;
};

export type FunnelConfig = {
  version: number;
  popupEnabled: boolean;
  /** Minimum engagement time before an exit signal may fire the popup. */
  armAfterMs: number;
  /** Popup shows only when the visitor's intent score is at/above this (0 = everyone). */
  minIntentScore: number;
  variants: Record<ObjectionKey, PopupVariant>;
  /**
   * Traffic-source banner override — applied only when no specific objection
   * is detected (i.e. the "default" variant is showing). Empty string = no override.
   */
  sourceEyebrows: Partial<Record<TrafficSource, string>>;
};

export const DEFAULT_FUNNEL_CONFIG: FunnelConfig = {
  version: 1,
  popupEnabled: true,
  armAfterMs: 4000,
  minIntentScore: 0,
  variants: {
    default: {
      eyebrow: "🔥 WAIT — BEFORE YOU GO",
      headlineTop: "SAVE $31",
      headlineItalic: "before it's gone.",
      body: "The complete 14-day protocol. One payment. Delivered instantly.",
      bullets: [
        "Instant PDF delivery",
        "No subscription — one payment of $19",
        "Secure checkout via Polar",
      ],
      cta: "CLAIM $19 ACCESS NOW →",
    },
    abandoned: {
      eyebrow: "YOUR CHECKOUT IS STILL WAITING",
      headlineTop: "60 SECONDS",
      headlineItalic: "is all it takes.",
      body: "Your $19 launch price is still locked. The PDF lands in your inbox the moment you finish.",
      bullets: [
        "Card, Apple Pay or Google Pay via Polar",
        "Instant delivery to your email",
        "One payment — nothing renews",
      ],
      cta: "FINISH CHECKOUT — $19 →",
    },
    price: {
      eyebrow: "🔥 62% OFF — LAUNCH WINDOW",
      headlineTop: "$19, NOT $50",
      headlineItalic: "that's $1.36 a day.",
      body: "One payment for fourteen days of zero food decisions. Nothing renews, ever.",
      bullets: [
        "One-time $19 — nothing recurring",
        "Less than a single takeout order",
        "Price returns to $50 after the launch window",
      ],
      cta: "LOCK IN $19 →",
    },
    trust: {
      eyebrow: "NO TRICKS — HERE'S THE DEAL",
      headlineTop: "NO SUBSCRIPTION.",
      headlineItalic: "no account. no upsell.",
      body: "One flat payment through Polar, the merchant of record. Every product fact is published openly on this site.",
      bullets: [
        "Secure checkout handled by Polar",
        "Instant email delivery — retrieve it anytime",
        "No recurring charges. Nothing to cancel",
      ],
      cta: "GET INSTANT ACCESS — $19",
    },
    safety: {
      eyebrow: "BOUNDED BY DESIGN",
      headlineTop: "14 DAYS.",
      headlineItalic: "then it ends — by design.",
      body: "Hard stop rules, exclusion criteria and a structured Day-15 exit are part of the guide.",
      bullets: [
        "Fixed endpoint — never open-ended",
        "Stop rules and safety boundaries included",
        "18+ · not medical advice · exclusions published",
      ],
      cta: "READ THE FULL PROTOCOL — $19",
    },
    evidence: {
      eyebrow: "THE MECHANISM IS PUBLIC",
      headlineTop: "RANKED #1",
      headlineItalic: "on the satiety index.",
      body: "One protocol food scored highest of every food tested in the original satiety research.",
      bullets: [
        "Chart and source published on this site",
        "Full citation and method inside the guide",
        "Mechanism, not magic — no outcome guarantees",
      ],
      cta: "SEE THE FULL METHOD — $19",
    },
  },
  sourceEyebrows: {
    meta: "BEFORE YOU SCROLL ON —",
    tiktok: "BEFORE YOU SCROLL ON —",
    x: "BEFORE YOU SCROLL ON —",
    google: "BEFORE YOU KEEP SEARCHING —",
    youtube: "BEFORE YOU CLICK AWAY —",
    reddit: "ONE MORE THING —",
    email: "",
    direct: "",
    other: "",
  },
};
