import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { funnelSignal } from "@/lib/funnel-report";
import { getTrafficInfo } from "@/lib/traffic-source";

const SESSION_MARK = "tbd_session_started";

/**
 * Invisible component mounted at the root. Captures traffic source on entry
 * and feeds page views, scroll depth and dwell time into the intent engine.
 */
export function FunnelTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onAdmin = pathname.startsWith("/admin");
  const scrollFired = useRef<{ path: string; s50: boolean; s90: boolean }>({ path: "", s50: false, s90: false });

  // Session start: lock in attribution, detect returning visitors.
  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return;
    getTrafficInfo();
    try {
      if (!window.sessionStorage.getItem(SESSION_MARK)) {
        window.sessionStorage.setItem(SESSION_MARK, "1");
        funnelSignal({ name: "session_start" });
        const raw = window.localStorage.getItem("tbd_intent_v1");
        const firstSeen = raw ? (JSON.parse(raw) as { firstSeen?: number }).firstSeen : undefined;
        if (firstSeen && Date.now() - firstSeen > 6 * 60 * 60 * 1000) {
          funnelSignal({ name: "return_visit" });
        }
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Page views (admin pages don't pollute the funnel data).
  useEffect(() => {
    if (onAdmin) return;
    funnelSignal({ name: "page_view", path: pathname });
    scrollFired.current = { path: pathname, s50: false, s90: false };
  }, [pathname, onAdmin]);

  // Scroll depth (once per page).
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const depth = window.scrollY / total;
      const f = scrollFired.current;
      if (!f.s50 && depth >= 0.5) {
        f.s50 = true;
        funnelSignal({ name: "scroll_50", path: f.path });
      }
      if (!f.s90 && depth >= 0.9) {
        f.s90 = true;
        funnelSignal({ name: "scroll_90", path: f.path });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dwell time: one tick every 30s while the tab is visible (engine caps the total).
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        funnelSignal({ name: "dwell_30s" });
      }
    }, 30000);
    return () => window.clearInterval(id);
  }, []);

  return null;
}
