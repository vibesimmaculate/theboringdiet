import { useEffect, useState } from "react";

const KEY = "tbd_offer_deadline";
const DURATION_MS = 60 * 60 * 1000; // 1 hour

function getDeadline(): number {
  if (typeof window === "undefined") return Date.now() + DURATION_MS;
  const raw = window.localStorage.getItem(KEY);
  const parsed = raw ? parseInt(raw, 10) : NaN;
  if (!isNaN(parsed) && parsed > Date.now()) return parsed;
  const next = Date.now() + DURATION_MS;
  window.localStorage.setItem(KEY, String(next));
  return next;
}

export function useOfferCountdown() {
  const [remaining, setRemaining] = useState<number>(DURATION_MS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let deadline = getDeadline();
    setReady(true);
    const tick = () => {
      const r = Math.max(0, deadline - Date.now());
      setRemaining(r);
      if (r === 0) {
        // reset for continuous urgency (and keep ticking from the new deadline)
        deadline = Date.now() + DURATION_MS;
        window.localStorage.setItem(KEY, String(deadline));
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const totalSec = Math.ceil(remaining / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return { ready, hours: pad(h), minutes: pad(m), seconds: pad(s), remaining };
}
