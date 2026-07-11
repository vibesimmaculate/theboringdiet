/**
 * The Boring Diet — brand + product configuration.
 * Public constants only. Server-only secrets are read from process.env in server code.
 */

export const BRAND = {
  name: "The Boring Diet",
  wordmark: "THE BORING DIET",
  tagline: "Two foods. Fourteen days. Then stop.",
  shortDescription:
    "A premium 36-page digital publication containing a bounded 14-day eating experiment.",
  longDescription:
    "A premium 36-page digital publication containing a bounded 14-day eating experiment, exact operating boundaries, a complete schedule, preparation guidance, troubleshooting information, a structured exit sequence and safety limitations.",
  sku: "TBD-DIGITAL-001",
  edition: "EDITION 1.0",
  priceUsd: 19,
  pages: 36,
  durationDays: 14,
} as const;

// Publishable Polar checkout link (safe in client code).
export const POLAR_CHECKOUT_LINK =
  "https://buy.polar.sh/polar_cl_inYKTLkCDB1hNck3Njs1QGKgWqHba2IXKgeHB1LZQXj";

// Build the customer portal URL from the org slug at runtime (browser-safe VITE_ var).
export const CUSTOMER_PORTAL_URL = (slug?: string) =>
  slug ? `https://polar.sh/${slug}/portal` : "https://polar.sh/";

export const SITE = {
  supportEmail: (typeof process !== "undefined" && process.env?.SUPPORT_EMAIL) || "support@theboringdiet.example",
  legalName:
    (typeof process !== "undefined" && process.env?.LEGAL_BUSINESS_NAME) ||
    "[LEGAL BUSINESS NAME]",
  legalAddress:
    (typeof process !== "undefined" && process.env?.LEGAL_BUSINESS_ADDRESS) ||
    "[LEGAL ADDRESS]",
  governingLaw:
    (typeof process !== "undefined" && process.env?.GOVERNING_LAW) || "[GOVERNING LAW]",
};

export const NAV = [
  { label: "The Idea", href: "/how-it-works" },
  { label: "Evidence", href: "/evidence" },
  { label: "What's Inside", href: "/whats-inside" },
  { label: "Safety", href: "/safety" },
  { label: "FAQ", href: "/faq" },
] as const;

export const FACTS = [
  { k: "FORMAT", v: "Digital PDF" },
  { k: "LENGTH", v: "36 pages" },
  { k: "PRICE", v: "$19 USD", emphasize: true },
  { k: "PAYMENT", v: "One time" },
  { k: "DURATION", v: "14 days", emphasize: true },
  { k: "DELIVERY", v: "Immediate access through Polar" },
  { k: "ACCOUNT", v: "Not required" },
  { k: "SUBSCRIPTION", v: "None", emphasize: true },
  { k: "PURPOSE", v: "Bounded personal eating experiment" },
  { k: "MEDICAL ADVICE", v: "No" },
  { k: "MINIMUM AGE", v: "18+", emphasize: true },
  { k: "EXACT FOODS PUBLICLY SHOWN", v: "No" },
] as const;
