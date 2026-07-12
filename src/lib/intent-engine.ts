import { useSyncExternalStore } from "react";
import type { ObjectionKey } from "@/config/funnel-defaults";

/**
 * Behavioral purchase-intent scoring engine.
 *
 * Components record signals (page views, scroll depth, dwell, pricing views,
 * checkout opens/abandons, FAQ opens…). The engine keeps a 0–100 intent score,
 * per-objection sub-scores (price / trust / safety / evidence) and exposes the
 * dominant objection so the exit popup can answer the visitor's actual
 * hesitation. State persists in localStorage per visitor.
 */

export type ObjectionCategory = "price" | "trust" | "safety" | "evidence";
export type IntentTier = "cold" | "warm" | "hot";

export type IntentState = {
  score: number;
  objections: Record<ObjectionCategory, number>;
  checkoutOpened: boolean;
  checkoutAbandoned: boolean;
  signalCounts: Record<string, number>;
  firstSeen: number;
  updatedAt: number;
};

export type SignalName =
  | "session_start"
  | "return_visit"
  | "page_view"
  | "scroll_50"
  | "scroll_90"
  | "dwell_30s"
  | "pricing_view"
  | "cta_hover"
  | "checkout_opened"
  | "checkout_abandoned"
  | "purchase_confirmed"
  | "faq_open"
  | "popup_shown"
  | "popup_dismissed"
  | "popup_cta_click";

export type Signal = { name: SignalName; path?: string; question?: string };

const STORAGE_KEY = "tbd_intent_v1";

const DEFAULT_STATE: IntentState = {
  score: 0,
  objections: { price: 0, trust: 0, safety: 0, evidence: 0 },
  checkoutOpened: false,
  checkoutAbandoned: false,
  signalCounts: {},
  firstSeen: 0,
  updatedAt: 0,
};

/** score weight + optional cap on how many occurrences count. */
const WEIGHTS: Partial<Record<SignalName, { score: number; maxCount?: number }>> = {
  session_start: { score: 0 },
  return_visit: { score: 8, maxCount: 1 },
  page_view: { score: 3, maxCount: 8 },
  scroll_50: { score: 4, maxCount: 4 },
  scroll_90: { score: 6, maxCount: 4 },
  dwell_30s: { score: 2, maxCount: 5 },
  pricing_view: { score: 10, maxCount: 1 },
  cta_hover: { score: 6, maxCount: 1 },
  checkout_opened: { score: 25, maxCount: 1 },
  checkout_abandoned: { score: 10, maxCount: 2 },
  faq_open: { score: 4, maxCount: 3 },
};

/** Route → objection evidence. Visiting these pages reveals what the visitor is worried about. */
const ROUTE_OBJECTIONS: Array<{ prefix: string; category: ObjectionCategory; points: number }> = [
  { prefix: "/safety", category: "safety", points: 18 },
  { prefix: "/refunds", category: "trust", points: 18 },
  { prefix: "/terms", category: "trust", points: 8 },
  { prefix: "/privacy", category: "trust", points: 8 },
  { prefix: "/evidence", category: "evidence", points: 12 },
  { prefix: "/how-it-works", category: "evidence", points: 4 },
];

/** FAQ question keywords → objection evidence. */
const FAQ_OBJECTIONS: Array<{ pattern: RegExp; category: ObjectionCategory; points: number }> = [
  { pattern: /refund|money/i, category: "trust", points: 15 },
  { pattern: /subscription|cost|price/i, category: "price", points: 12 },
  { pattern: /medical|safe|should not|advice/i, category: "safety", points: 15 },
  { pattern: /guarantee|weight loss|evidence/i, category: "evidence", points: 12 },
  { pattern: /account|deliver|receive|retrieve/i, category: "trust", points: 8 },
];

let state: IntentState | null = null;
const listeners = new Set<() => void>();

function load(): IntentState {
  if (state) return state;
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    state = raw ? { ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<IntentState>) } : { ...DEFAULT_STATE, firstSeen: Date.now() };
  } catch {
    state = { ...DEFAULT_STATE, firstSeen: Date.now() };
  }
  return state;
}

function persist(next: IntentState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function recordSignal(signal: Signal) {
  if (typeof window === "undefined") return;
  const prev = load();
  const counts = { ...prev.signalCounts };
  const objections = { ...prev.objections };
  let score = prev.score;
  let checkoutOpened = prev.checkoutOpened;
  let checkoutAbandoned = prev.checkoutAbandoned;

  const w = WEIGHTS[signal.name];
  const seen = counts[signal.name] ?? 0;
  counts[signal.name] = seen + 1;
  if (w && (w.maxCount === undefined || seen < w.maxCount)) score += w.score;

  switch (signal.name) {
    case "page_view": {
      const path = signal.path ?? "";
      for (const r of ROUTE_OBJECTIONS) {
        if (path === r.prefix || path.startsWith(r.prefix + "/")) {
          // Count each objection route once per visitor.
          const key = `route:${r.prefix}`;
          if (!counts[key]) {
            counts[key] = 1;
            objections[r.category] = clamp(objections[r.category] + r.points);
          }
        }
      }
      break;
    }
    case "faq_open": {
      const q = signal.question ?? "";
      for (const f of FAQ_OBJECTIONS) {
        if (f.pattern.test(q)) {
          objections[f.category] = clamp(objections[f.category] + f.points);
          break;
        }
      }
      break;
    }
    case "checkout_opened":
      checkoutOpened = true;
      checkoutAbandoned = false;
      break;
    case "checkout_abandoned":
      checkoutAbandoned = true;
      // An abandoned checkout is overwhelmingly a price/commitment hesitation.
      objections.price = clamp(objections.price + 25);
      break;
    case "purchase_confirmed":
      checkoutAbandoned = false;
      break;
  }

  persist({
    ...prev,
    score: clamp(score),
    objections,
    checkoutOpened,
    checkoutAbandoned,
    signalCounts: counts,
    firstSeen: prev.firstSeen || Date.now(),
    updatedAt: Date.now(),
  });
}

export function getIntentState(): IntentState {
  return load();
}

export function getIntentTier(score?: number): IntentTier {
  const s = score ?? load().score;
  if (s >= 65) return "hot";
  if (s >= 35) return "warm";
  return "cold";
}

/**
 * The objection the popup should answer. An abandoned checkout wins outright;
 * otherwise the strongest objection above a noise floor; otherwise "default".
 */
export function getDominantObjection(s?: IntentState): ObjectionKey {
  const st = s ?? load();
  if (st.checkoutAbandoned) return "abandoned";
  let best: ObjectionCategory | null = null;
  let bestVal = 0;
  for (const key of Object.keys(st.objections) as ObjectionCategory[]) {
    if (st.objections[key] > bestVal) {
      best = key;
      bestVal = st.objections[key];
    }
  }
  return best && bestVal >= 15 ? best : "default";
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Live intent state for React components (SSR-safe: cold default on server). */
export function useVisitorIntent(): IntentState {
  return useSyncExternalStore(subscribe, getIntentState, () => DEFAULT_STATE);
}
