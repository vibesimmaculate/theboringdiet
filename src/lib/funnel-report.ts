import { recordFunnelEvent } from "@/lib/funnel.functions";
import { recordSignal, getIntentState, getIntentTier, getDominantObjection, type Signal } from "@/lib/intent-engine";
import { getTrafficInfo } from "@/lib/traffic-source";
import { trackEvent } from "@/components/analytics/meta-pixel";

/** Signals worth shipping to the admin live feed (everything still scores locally). */
const SERVER_REPORTED = new Set<Signal["name"]>([
  "session_start",
  "page_view",
  "pricing_view",
  "cta_hover",
  "checkout_opened",
  "checkout_abandoned",
  "purchase_confirmed",
  "popup_shown",
  "popup_dismissed",
  "popup_cta_click",
  "faq_open",
]);

/**
 * Single entry point for funnel signals: updates the local intent engine,
 * mirrors key moments to the Meta pixel, and fire-and-forgets a compact,
 * PII-free event to the server for the admin feed.
 */
export function funnelSignal(signal: Signal) {
  if (typeof window === "undefined") return;
  recordSignal(signal);

  if (!SERVER_REPORTED.has(signal.name)) return;

  const state = getIntentState();
  const traffic = getTrafficInfo();
  const payload = {
    name: signal.name,
    path: signal.path ?? window.location.pathname,
    source: traffic.source,
    tier: getIntentTier(state.score),
    objection: getDominantObjection(state),
    score: state.score,
  };

  if (signal.name !== "page_view" && signal.name !== "session_start") {
    trackEvent(`funnel_${signal.name}`, payload);
  }

  recordFunnelEvent({ data: payload }).catch(() => {
    /* analytics must never break the funnel */
  });
}
