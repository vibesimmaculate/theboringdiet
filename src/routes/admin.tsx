import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import {
  adminLogin,
  adminLogout,
  adminSession,
  adminGetFunnelState,
  adminSaveFunnelConfig,
  adminResetFunnelConfig,
} from "@/lib/funnel.functions";
import {
  DEFAULT_FUNNEL_CONFIG,
  type FunnelConfig,
  type ObjectionKey,
  type PopupVariant,
  type TrafficSource,
} from "@/config/funnel-defaults";
import { useVisitorIntent, getDominantObjection, getIntentTier } from "@/lib/intent-engine";
import { getTrafficInfo } from "@/lib/traffic-source";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Funnel Admin — The Boring Diet" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

const OBJECTIONS: Array<{ key: ObjectionKey; label: string; hint: string }> = [
  { key: "default", label: "Default", hint: "No specific objection detected. Source eyebrows apply here." },
  { key: "abandoned", label: "Abandoned checkout", hint: "Opened the checkout, closed it without paying." },
  { key: "price", label: "Price", hint: "Price-focused FAQ opens, repeat pricing views, abandonment." },
  { key: "trust", label: "Trust / risk", hint: "Refunds, terms or delivery questions." },
  { key: "safety", label: "Safety", hint: "Safety page visits or medical FAQ questions." },
  { key: "evidence", label: "Evidence", hint: "Evidence page dwell, guarantee questions." },
];

const SOURCES: TrafficSource[] = ["meta", "tiktok", "google", "youtube", "reddit", "x", "email", "direct", "other"];

const inputCls = "w-full border border-stone bg-paper px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-charcoal";
const labelCls = "mono-label text-stone-dark text-[10px] block mb-1";

function AdminPage() {
  const qc = useQueryClient();
  const session = useQuery({ queryKey: ["admin-session"], queryFn: () => adminSession() });

  if (session.isLoading) {
    return (
      <main className="min-h-screen bg-bone paper-grain flex items-center justify-center">
        <div className="mono-label">LOADING…</div>
      </main>
    );
  }

  return session.data?.authed ? (
    <Dashboard onSignOut={() => qc.invalidateQueries({ queryKey: ["admin-session"] })} />
  ) : (
    <Login onSuccess={() => qc.invalidateQueries({ queryKey: ["admin-session"] })} />
  );
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const r = await adminLogin({ data: { email, password } });
      if (r.ok) onSuccess();
      else setError("Invalid credentials.");
    } catch {
      setError("Login failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-bone paper-grain flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-paper border border-stone p-8">
        <div className="mono-label text-stone-dark">THE BORING DIET</div>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          FUNNEL ADMIN<span className="text-gold">.</span>
        </h1>
        <div className="mt-8 space-y-4">
          <div>
            <label htmlFor="admin-email" className={labelCls}>EMAIL</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-password" className={labelCls}>PASSWORD</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
              required
            />
          </div>
        </div>
        {error && <p className="mt-4 text-sm text-red">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full mt-6">
          {busy ? "SIGNING IN…" : "SIGN IN"}
        </button>
      </form>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const qc = useQueryClient();
  const state = useQuery({ queryKey: ["admin-funnel"], queryFn: () => adminGetFunnelState() });
  const [draft, setDraft] = useState<FunnelConfig | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (state.data && !draft) setDraft(state.data.config);
  }, [state.data, draft]);

  // Session may have expired server-side; bounce to login.
  useEffect(() => {
    if (state.isError) onSignOut();
  }, [state.isError, onSignOut]);

  const save = async () => {
    if (!draft) return;
    setStatus("Saving…");
    try {
      await adminSaveFunnelConfig({ data: draft });
      setStatus("Saved. Live for all visitors until the next deploy — use Copy JSON to make it permanent.");
      qc.invalidateQueries({ queryKey: ["admin-funnel"] });
      qc.invalidateQueries({ queryKey: ["funnel-config"] });
    } catch {
      setStatus("Save failed — check field lengths and try again.");
    }
  };

  const reset = async () => {
    setStatus("Resetting…");
    try {
      await adminResetFunnelConfig();
      setDraft(DEFAULT_FUNNEL_CONFIG);
      setStatus("Reset to code defaults.");
      qc.invalidateQueries({ queryKey: ["admin-funnel"] });
      qc.invalidateQueries({ queryKey: ["funnel-config"] });
    } catch {
      setStatus("Reset failed.");
    }
  };

  const copyJson = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(draft, null, 2));
      setStatus("Config JSON copied. Paste into DEFAULT_FUNNEL_CONFIG in src/config/funnel-defaults.ts to persist across deploys.");
    } catch {
      setStatus("Clipboard unavailable.");
    }
  };

  const signOut = async () => {
    await adminLogout().catch(() => {});
    onSignOut();
  };

  const setField = <K extends keyof FunnelConfig>(key: K, value: FunnelConfig[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const setVariant = (key: ObjectionKey, patch: Partial<PopupVariant>) =>
    setDraft((d) =>
      d ? { ...d, variants: { ...d.variants, [key]: { ...d.variants[key], ...patch } } } : d,
    );

  return (
    <main className="min-h-screen bg-bone paper-grain pb-24">
      <div className="editorial-shell pt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <div className="mono-label text-stone-dark">THE BORING DIET · ADMIN</div>
            <h1 className="mt-1 font-display text-4xl font-semibold">
              ADAPTIVE FUNNEL CMS<span className="text-gold">.</span>
            </h1>
          </div>
          <button onClick={signOut} className="btn-outline !min-h-[40px] !py-2">SIGN OUT</button>
        </div>

        <p className="mt-4 max-w-2xl text-sm text-stone-dark">
          Edits go live for every visitor immediately after saving, and hold until the next deploy or worker
          restart. For permanent changes, save, then “Copy JSON” and paste into{" "}
          <code className="text-charcoal">src/config/funnel-defaults.ts</code>.
          {state.data?.overrideActive && state.data.overrideSavedAt && (
            <> <span className="text-gold">Live override active</span> (saved {new Date(state.data.overrideSavedAt).toLocaleString()}).</>
          )}
        </p>

        <YourSession />

        {draft && (
          <>
            {/* Trigger settings */}
            <section className="mt-10 bg-paper border border-stone p-6">
              <h2 className="font-display text-xl font-semibold">Trigger settings</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                <label className="flex items-center gap-2 text-sm pt-5">
                  <input
                    type="checkbox"
                    checked={draft.popupEnabled}
                    onChange={(e) => setField("popupEnabled", e.target.checked)}
                  />
                  Exit popup enabled
                </label>
                <div>
                  <label htmlFor="arm-ms" className={labelCls}>ARM DELAY (MS)</label>
                  <input
                    id="arm-ms"
                    type="number"
                    min={0}
                    max={60000}
                    value={draft.armAfterMs}
                    onChange={(e) => setField("armAfterMs", Number(e.target.value) || 0)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="min-score" className={labelCls}>MIN INTENT SCORE (0 = EVERYONE)</label>
                  <input
                    id="min-score"
                    type="number"
                    min={0}
                    max={100}
                    value={draft.minIntentScore}
                    onChange={(e) => setField("minIntentScore", Number(e.target.value) || 0)}
                    className={inputCls}
                  />
                </div>
              </div>
            </section>

            {/* Source personalization */}
            <section className="mt-6 bg-paper border border-stone p-6">
              <h2 className="font-display text-xl font-semibold">Traffic-source banner lines</h2>
              <p className="mt-1 text-sm text-stone-dark">
                Replaces the popup banner when no objection is detected. Leave empty to use the default variant's banner.
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SOURCES.map((s) => (
                  <div key={s}>
                    <label htmlFor={`src-${s}`} className={labelCls}>{s.toUpperCase()}</label>
                    <input
                      id={`src-${s}`}
                      value={draft.sourceEyebrows[s] ?? ""}
                      onChange={(e) =>
                        setField("sourceEyebrows", { ...draft.sourceEyebrows, [s]: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Variants */}
            <section className="mt-6 space-y-6">
              <h2 className="font-display text-xl font-semibold">Objection-specific popup variants</h2>
              {OBJECTIONS.map(({ key, label, hint }) => {
                const v = draft.variants[key];
                return (
                  <fieldset key={key} className="bg-paper border border-stone p-6">
                    <legend className="font-display text-lg px-2 -ml-2">
                      {label} <span className="mono-label text-stone-dark text-[10px] ml-2">{hint}</span>
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div>
                        <label htmlFor={`${key}-eyebrow`} className={labelCls}>BANNER</label>
                        <input id={`${key}-eyebrow`} value={v.eyebrow} onChange={(e) => setVariant(key, { eyebrow: e.target.value })} className={inputCls} />
                      </div>
                      <div>
                        <label htmlFor={`${key}-cta`} className={labelCls}>CTA BUTTON</label>
                        <input id={`${key}-cta`} value={v.cta} onChange={(e) => setVariant(key, { cta: e.target.value })} className={inputCls} />
                      </div>
                      <div>
                        <label htmlFor={`${key}-h1`} className={labelCls}>HEADLINE (BOLD LINE)</label>
                        <input id={`${key}-h1`} value={v.headlineTop} onChange={(e) => setVariant(key, { headlineTop: e.target.value })} className={inputCls} />
                      </div>
                      <div>
                        <label htmlFor={`${key}-h2`} className={labelCls}>HEADLINE (ITALIC LINE)</label>
                        <input id={`${key}-h2`} value={v.headlineItalic} onChange={(e) => setVariant(key, { headlineItalic: e.target.value })} className={inputCls} />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor={`${key}-body`} className={labelCls}>BODY</label>
                        <textarea id={`${key}-body`} value={v.body} onChange={(e) => setVariant(key, { body: e.target.value })} className={inputCls} rows={2} />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor={`${key}-bullets`} className={labelCls}>PROOF BULLETS (ONE PER LINE, MAX 5)</label>
                        <textarea
                          id={`${key}-bullets`}
                          value={v.bullets.join("\n")}
                          onChange={(e) => setVariant(key, { bullets: e.target.value.split("\n").filter(Boolean).slice(0, 5) })}
                          className={inputCls}
                          rows={3}
                        />
                      </div>
                    </div>
                  </fieldset>
                );
              })}
            </section>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button onClick={save} className="btn-primary">SAVE &amp; PUBLISH</button>
              <button onClick={copyJson} className="btn-outline">COPY JSON</button>
              <button onClick={reset} className="btn-outline">RESET TO DEFAULTS</button>
            </div>
            {status && <p className="mt-3 text-sm text-stone-dark max-w-2xl">{status}</p>}
          </>
        )}

        {/* Live events */}
        <section className="mt-12">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold">Live intent feed</h2>
            <button onClick={() => qc.invalidateQueries({ queryKey: ["admin-funnel"] })} className="mono-label hover:text-charcoal">
              REFRESH ↻
            </button>
          </div>
          <p className="mt-1 text-sm text-stone-dark">
            Recent visitor signals (in worker memory — resets on deploy). Score and objection are computed on the visitor's device.
          </p>
          <div className="mt-4 overflow-x-auto border border-stone bg-paper">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone text-left">
                  {["TIME", "EVENT", "DETAIL", "SOURCE", "TIER", "OBJECTION", "SCORE"].map((h) => (
                    <th key={h} className="mono-label text-[10px] px-3 py-2 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(state.data?.events ?? []).map((e, i) => (
                  <tr key={`${e.ts}-${i}`} className="border-b border-stone/50">
                    <td className="px-3 py-1.5 whitespace-nowrap tabular-nums">{new Date(e.ts).toLocaleTimeString()}</td>
                    <td className="px-3 py-1.5">{e.name}</td>
                    <td className="px-3 py-1.5 max-w-[220px] truncate">{e.path}</td>
                    <td className="px-3 py-1.5">{e.source}</td>
                    <td className="px-3 py-1.5">{e.tier}</td>
                    <td className="px-3 py-1.5">{e.objection}</td>
                    <td className="px-3 py-1.5 tabular-nums">{e.score}</td>
                  </tr>
                ))}
                {(state.data?.events ?? []).length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-stone-dark">
                      No events yet. Browse the site in another tab to see signals arrive.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

/** The admin's own live intent state — useful for testing the scoring engine. */
function YourSession() {
  const intent = useVisitorIntent();
  const [source, setSource] = useState("…");
  useEffect(() => {
    setSource(getTrafficInfo().source);
  }, []);

  const resetIntent = () => {
    try {
      window.localStorage.removeItem("tbd_intent_v1");
      window.sessionStorage.removeItem("tbd_offer_popup_dismissed");
      window.location.reload();
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="mt-8 bg-charcoal text-bone p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-x-10 gap-y-2">
          <Stat label="YOUR INTENT SCORE" value={String(intent.score)} />
          <Stat label="TIER" value={getIntentTier(intent.score).toUpperCase()} />
          <Stat label="DOMINANT OBJECTION" value={getDominantObjection(intent).toUpperCase()} />
          <Stat label="TRAFFIC SOURCE" value={source.toUpperCase()} />
          <Stat
            label="OBJECTION SCORES"
            value={`P${intent.objections.price} T${intent.objections.trust} S${intent.objections.safety} E${intent.objections.evidence}`}
          />
        </div>
        <button onClick={resetIntent} className="mono-label text-gold hover:text-gold-light">
          RESET MY INTENT DATA ↺
        </button>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mono-label text-bone/50 text-[10px]">{label}</div>
      <div className="font-display text-xl mt-0.5 text-gold">{value}</div>
    </div>
  );
}
