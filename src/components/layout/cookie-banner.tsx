import { useEffect, useState } from "react";

const KEY = "tbd-cookie-consent-v1";
type Consent = { necessary: true; analytics: boolean; marketing: boolean };

export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConsent(c: Consent) {
  localStorage.setItem(KEY, JSON.stringify(c));
  window.dispatchEvent(new CustomEvent("consent-changed", { detail: c }));
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setVisible(!getConsent());
    const open = () => { setVisible(true); setManaging(true); };
    window.addEventListener("open-cookie-preferences", open);
    return () => window.removeEventListener("open-cookie-preferences", open);
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
    setVisible(false);
  };
  const rejectOptional = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
    setVisible(false);
  };
  const savePrefs = () => {
    saveConsent({ necessary: true, analytics, marketing });
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-3 sm:inset-x-6 sm:bottom-6 z-40 bg-bone border border-charcoal p-5 sm:p-6 max-w-2xl sm:mx-auto md:right-6 md:left-auto md:mx-0 pb-[max(env(safe-area-inset-bottom),20px)]"
    >
      <div className="mono-label text-stone-dark mb-2">COOKIE PREFERENCES</div>
      <p className="text-sm leading-relaxed">
        We use necessary cookies to run the site. With your consent we may also use analytics and marketing cookies.
        The site remains fully usable if you reject optional cookies.
      </p>

      {managing && (
        <div className="mt-4 space-y-3 border-t border-stone pt-4">
          <label className="flex items-center justify-between text-sm">
            <span>Necessary <span className="text-stone-dark ml-2 text-xs">Always on</span></span>
            <input type="checkbox" checked disabled className="accent-charcoal" />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span>Analytics</span>
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="accent-charcoal" />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span>Marketing</span>
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="accent-charcoal" />
          </label>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {!managing ? (
          <>
            <button onClick={acceptAll} className="btn-primary">Accept all</button>
            <button onClick={rejectOptional} className="btn-outline">Reject optional</button>
            <button onClick={() => setManaging(true)} className="btn-outline">Manage preferences</button>
          </>
        ) : (
          <>
            <button onClick={savePrefs} className="btn-primary">Save preferences</button>
            <button onClick={rejectOptional} className="btn-outline">Reject optional</button>
          </>
        )}
      </div>
    </div>
  );
}
