import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { getConsent } from "@/components/layout/cookie-banner";

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function loadPixel(id: string) {
  if (window.fbq) return;
  const w = window as unknown as {
    fbq?: {
      (...args: unknown[]): void;
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[][];
      push?: unknown;
      loaded?: boolean;
      version?: string;
    };
    _fbq?: unknown;
  };
  const n: any = function () {
    // eslint-disable-next-line prefer-rest-params
    n.callMethod ? n.callMethod.apply(n, arguments as any) : n.queue.push(arguments);
  };
  if (!w._fbq) w._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  w.fbq = n;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  window.fbq!("init", id);
  window.fbq!("track", "PageView");
}

export function MetaPixel() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!PIXEL_ID) return;
    const c = getConsent();
    if (!c?.marketing) return;
    loadPixel(PIXEL_ID);
  }, []);

  useEffect(() => {
    if (!window.fbq) return;
    window.fbq("track", "PageView");
  }, [pathname]);

  useEffect(() => {
    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent).detail as { marketing?: boolean };
      if (detail?.marketing && PIXEL_ID) loadPixel(PIXEL_ID);
    };
    window.addEventListener("consent-changed", onConsent);
    return () => window.removeEventListener("consent-changed", onConsent);
  }, []);

  return null;
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", name, params);
  }
}

export function trackFbStandard(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, params);
  }
}
