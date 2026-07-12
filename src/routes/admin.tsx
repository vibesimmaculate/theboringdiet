import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type FormEvent } from "react";
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
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Funnel Admin — The Boring Diet" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

// ---------------------------------------------------------------------------
// Types & aggregation
// ---------------------------------------------------------------------------

type FeedEvent = {
  ts: number;
  name: string;
  path: string;
  source: string;
  tier: string;
  objection: string;
  score: number;
  visitorId?: string;
};

type VisitorAgg = {
  id: string;
  source: string;
  firstTs: number;
  lastTs: number;
  maxScore: number;
  lastObjection: string;
  pageViews: number;
  faqOpens: number;
  popupShown: boolean;
  popupClicked: boolean;
  checkoutOpened: boolean;
  abandoned: boolean;
  purchased: boolean;
  events: FeedEvent[]; // newest first
};

function aggregateVisitors(events: FeedEvent[]): VisitorAgg[] {
  const map = new Map<string, VisitorAgg>();
  for (const e of events) {
    const id = e.visitorId || "unknown";
    let v = map.get(id);
    if (!v) {
      v = {
        id,
        source: e.source || "other",
        firstTs: e.ts,
        lastTs: e.ts,
        maxScore: 0,
        lastObjection: "default",
        pageViews: 0,
        faqOpens: 0,
        popupShown: false,
        popupClicked: false,
        checkoutOpened: false,
        abandoned: false,
        purchased: false,
        events: [],
      };
      map.set(id, v);
    }
    v.events.push(e);
    v.firstTs = Math.min(v.firstTs, e.ts);
    if (e.ts >= v.lastTs) {
      v.lastTs = e.ts;
      if (e.source) v.source = e.source;
      if (e.objection) v.lastObjection = e.objection;
    }
    v.maxScore = Math.max(v.maxScore, e.score);
    if (e.name === "page_view") v.pageViews += 1;
    if (e.name === "faq_open") v.faqOpens += 1;
    if (e.name === "popup_shown") v.popupShown = true;
    if (e.name === "popup_cta_click") v.popupClicked = true;
    if (e.name === "checkout_opened") v.checkoutOpened = true;
    if (e.name === "checkout_abandoned") v.abandoned = true;
    if (e.name === "purchase_confirmed") {
      v.purchased = true;
      v.abandoned = false;
    }
  }
  return [...map.values()].sort((a, b) => b.lastTs - a.lastTs);
}

const countBy = <T,>(items: T[], key: (t: T) => string) => {
  const m = new Map<string, number>();
  for (const it of items) {
    const k = key(it);
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

const tierOf = (score: number) => (score >= 65 ? "hot" : score >= 35 ? "warm" : "cold");

// ---------------------------------------------------------------------------
// Shared UI atoms
// ---------------------------------------------------------------------------

const inputCls = "w-full border border-stone bg-paper px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-charcoal";
const labelCls = "mono-label text-stone-dark text-[10px] block mb-1";

function Panel({ title, sub, children, className }: { title: string; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("bg-paper border border-stone p-4 sm:p-6", className)}>
      <h2 className="font-display text-lg sm:text-xl font-semibold">{title}</h2>
      {sub && <p className="mt-0.5 text-xs sm:text-sm text-stone-dark">{sub}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function StatTile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-paper border border-stone p-3 sm:p-4">
      <div className="mono-label text-stone-dark text-[9px] sm:text-[10px]">{label}</div>
      <div className="font-display text-2xl sm:text-3xl font-semibold mt-1 tabular-nums">{value}</div>
      {sub && <div className="text-[11px] text-stone-dark mt-0.5">{sub}</div>}
    </div>
  );
}

/** Horizontal bar: single validated hue, value labeled in ink, 4px rounded data-end. */
function HBar({ label, value, max, right, title }: { label: string; value: number; max: number; right?: string; title?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2 sm:gap-3 py-1 group" title={title ?? `${label}: ${value}`}>
      <div className="mono-label text-[9px] sm:text-[10px] w-20 sm:w-28 shrink-0 truncate">{label}</div>
      <div className="flex-1 h-3 bg-stone/40 overflow-hidden">
        <div
          className="h-full bg-gold rounded-r-[4px] group-hover:bg-gold/80 transition-colors"
          style={{ width: `${Math.max(pct, value > 0 ? 2 : 0)}%` }}
        />
      </div>
      <div className="text-xs sm:text-sm tabular-nums w-14 sm:w-16 text-right text-charcoal">
        {value}{right ? <span className="text-stone-dark text-[10px] ml-1">{right}</span> : null}
      </div>
    </div>
  );
}

function TierChip({ tier }: { tier: string }) {
  return (
    <span
      className={cn(
        "mono-label text-[9px] px-2 py-0.5 border whitespace-nowrap",
        tier === "hot" && "bg-charcoal text-bone border-charcoal",
        tier === "warm" && "bg-gold-light text-charcoal border-gold",
        tier === "cold" && "text-stone-dark border-stone",
      )}
    >
      {tier.toUpperCase()}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------

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
      <form onSubmit={submit} className="w-full max-w-sm bg-paper border border-stone p-6 sm:p-8">
        <div className="mono-label text-stone-dark">THE BORING DIET</div>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          FUNNEL ADMIN<span className="text-gold">.</span>
        </h1>
        <div className="mt-8 space-y-4">
          <div>
            <label htmlFor="admin-email" className={labelCls}>EMAIL</label>
            <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required />
          </div>
          <div>
            <label htmlFor="admin-password" className={labelCls}>PASSWORD</label>
            <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} required />
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

const OBJECTION_LABELS: Record<string, string> = {
  abandoned: "Abandoned checkout",
  price: "Price",
  trust: "Trust / risk",
  safety: "Safety",
  evidence: "Evidence",
  default: "None detected",
};

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const qc = useQueryClient();
  const state = useQuery({
    queryKey: ["admin-funnel"],
    queryFn: () => adminGetFunnelState(),
    refetchInterval: 15000,
  });

  useEffect(() => {
    if (state.isError) onSignOut();
  }, [state.isError, onSignOut]);

  const events = (state.data?.events ?? []) as FeedEvent[];
  const visitors = useMemo(() => aggregateVisitors(events), [events]);

  const signOut = async () => {
    await adminLogout().catch(() => {});
    onSignOut();
  };

  return (
    <main className="min-h-screen bg-bone paper-grain pb-24">
      <div className="editorial-shell pt-8 sm:pt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mono-label text-stone-dark">THE BORING DIET · ADMIN</div>
            <h1 className="mt-1 font-display text-2xl sm:text-4xl font-semibold">
              ADAPTIVE FUNNEL CMS<span className="text-gold">.</span>
            </h1>
          </div>
          <button onClick={signOut} className="btn-outline !min-h-[40px] !py-2 !px-4 text-sm">SIGN OUT</button>
        </div>

        <YourSession />
        <Analytics visitors={visitors} events={events} />
        <VisitorsTable visitors={visitors} />
        <ConfigEditor
          data={state.data}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["admin-funnel"] });
            qc.invalidateQueries({ queryKey: ["funnel-config"] });
          }}
        />
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

function Analytics({ visitors, events }: { visitors: VisitorAgg[]; events: FeedEvent[] }) {
  const totalVisitors = visitors.length;
  const engaged = visitors.filter((v) => v.maxScore >= 35).length;
  const pricing = visitors.filter((v) => v.events.some((e) => e.name === "pricing_view")).length;
  const checkouts = visitors.filter((v) => v.checkoutOpened).length;
  const purchases = visitors.filter((v) => v.purchased).length;
  const popupShownCount = events.filter((e) => e.name === "popup_shown").length;

  const sources = countBy(visitors, (v) => v.source || "other");
  const tiers = countBy(visitors, (v) => tierOf(v.maxScore));
  const tierOrder = ["hot", "warm", "cold"];
  const objections = countBy(visitors, (v) => v.lastObjection || "default");

  // Exit-popup performance per objection variant
  const shownBy = new Map<string, number>();
  const clickBy = new Map<string, number>();
  for (const e of events) {
    if (e.name === "popup_shown") shownBy.set(e.objection, (shownBy.get(e.objection) ?? 0) + 1);
    if (e.name === "popup_cta_click") clickBy.set(e.objection, (clickBy.get(e.objection) ?? 0) + 1);
  }
  const popupRows = [...shownBy.entries()].sort((a, b) => b[1] - a[1]);

  const funnelSteps = [
    { label: "VISITED", value: totalVisitors },
    { label: "ENGAGED ≥35", value: engaged },
    { label: "SAW PRICING", value: pricing },
    { label: "CHECKOUT", value: checkouts },
    { label: "PURCHASED", value: purchases },
  ];

  const maxSource = sources[0]?.[1] ?? 0;
  const maxObjection = objections[0]?.[1] ?? 0;
  const maxTier = Math.max(...tierOrder.map((t) => tiers.find(([k]) => k === t)?.[1] ?? 0), 0);

  return (
    <>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <StatTile label="VISITORS" value={totalVisitors} sub="in current feed" />
        <StatTile label="EVENTS" value={events.length} sub="last 500 kept" />
        <StatTile label="POPUPS SHOWN" value={popupShownCount} />
        <StatTile label="CHECKOUTS" value={checkouts} sub={totalVisitors ? `${Math.round((checkouts / totalVisitors) * 100)}% of visitors` : undefined} />
        <StatTile label="PURCHASES" value={purchases} sub={checkouts ? `${Math.round((purchases / checkouts) * 100)}% of checkouts` : undefined} />
        <StatTile label="AVG SCORE" value={totalVisitors ? Math.round(visitors.reduce((s, v) => s + v.maxScore, 0) / totalVisitors) : 0} sub="peak per visitor" />
      </div>

      <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Panel title="Purchase funnel" sub="Each visitor's furthest step. Percentages are of all visitors.">
          {funnelSteps.map((s) => (
            <HBar
              key={s.label}
              label={s.label}
              value={s.value}
              max={Math.max(totalVisitors, 1)}
              right={totalVisitors ? `${Math.round((s.value / totalVisitors) * 100)}%` : undefined}
            />
          ))}
        </Panel>

        <Panel title="Traffic sources" sub="Where visitors came from (UTMs, click IDs, referrer).">
          {sources.length === 0 && <Empty />}
          {sources.map(([src, n]) => (
            <HBar key={src} label={src.toUpperCase()} value={n} max={maxSource} />
          ))}
        </Panel>

        <Panel title="Intent tiers" sub="Peak behavioral score per visitor: hot ≥65, warm ≥35, cold <35.">
          {tierOrder.map((t) => (
            <HBar key={t} label={t.toUpperCase()} value={tiers.find(([k]) => k === t)?.[1] ?? 0} max={Math.max(maxTier, 1)} />
          ))}
        </Panel>

        <Panel title="Detected objections" sub="Latest dominant objection per visitor — what the exit popup answers.">
          {objections.length === 0 && <Empty />}
          {objections.map(([o, n]) => (
            <HBar key={o} label={OBJECTION_LABELS[o] ?? o} value={n} max={maxObjection} />
          ))}
        </Panel>
      </div>

      <Panel className="mt-3" title="Exit popup performance" sub="Which objection variant was shown, and how often its CTA was clicked.">
        {popupRows.length === 0 && <Empty text="No popups fired yet." />}
        <div className="space-y-1">
          {popupRows.map(([obj, shown]) => {
            const clicks = clickBy.get(obj) ?? 0;
            const ctr = shown ? Math.round((clicks / shown) * 100) : 0;
            return (
              <div key={obj} className="flex items-center gap-2 sm:gap-3 py-1" title={`${obj}: shown ${shown}, clicked ${clicks}`}>
                <div className="mono-label text-[9px] sm:text-[10px] w-20 sm:w-28 shrink-0 truncate">{OBJECTION_LABELS[obj] ?? obj}</div>
                <div className="flex-1 h-3 bg-stone/40 overflow-hidden">
                  <div className="h-full bg-gold rounded-r-[4px]" style={{ width: `${ctr}%` }} />
                </div>
                <div className="text-xs sm:text-sm tabular-nums text-right w-32 sm:w-40 text-charcoal">
                  {clicks}/{shown} <span className="text-stone-dark text-[10px]">clicked · {ctr}% CTR</span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}

function Empty({ text = "No data yet — browse the site in another tab." }: { text?: string }) {
  return <p className="text-sm text-stone-dark py-2">{text}</p>;
}

// ---------------------------------------------------------------------------
// Visitors
// ---------------------------------------------------------------------------

function VisitorsTable({ visitors }: { visitors: VisitorAgg[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <Panel className="mt-3" title="Visitors" sub="Every tracked visitor (anonymous device id). Tap a row for their full event timeline.">
      {visitors.length === 0 && <Empty />}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-stone text-left">
              {["VISITOR", "SOURCE", "SCORE", "TIER", "OBJECTION", "ACTIVITY", "LAST SEEN"].map((h) => (
                <th key={h} className="mono-label text-[9px] sm:text-[10px] px-2 py-2 font-normal whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => {
              const open = openId === v.id;
              return (
                <VisitorRow key={v.id} v={v} open={open} onToggle={() => setOpenId(open ? null : v.id)} />
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function VisitorRow({ v, open, onToggle }: { v: VisitorAgg; open: boolean; onToggle: () => void }) {
  const tier = tierOf(v.maxScore);
  const badges: string[] = [];
  if (v.purchased) badges.push("PURCHASED ✓");
  else if (v.abandoned) badges.push("ABANDONED CART");
  else if (v.checkoutOpened) badges.push("CHECKOUT");
  if (v.popupClicked) badges.push("POPUP→CTA");
  else if (v.popupShown) badges.push("POPUP SEEN");

  return (
    <>
      <tr
        onClick={onToggle}
        className={cn("border-b border-stone/50 cursor-pointer hover:bg-bone transition-colors", open && "bg-bone")}
      >
        <td className="px-2 py-2 font-mono text-xs whitespace-nowrap">
          <span className="text-stone-dark">{open ? "▾" : "▸"}</span> {v.id.slice(0, 8)}
        </td>
        <td className="px-2 py-2 mono-label text-[10px]">{v.source.toUpperCase()}</td>
        <td className="px-2 py-2">
          <div className="flex items-center gap-2">
            <span className="tabular-nums w-6 text-right">{v.maxScore}</span>
            <div className="w-14 h-2 bg-stone/40">
              <div className="h-full bg-gold rounded-r-[3px]" style={{ width: `${v.maxScore}%` }} />
            </div>
          </div>
        </td>
        <td className="px-2 py-2"><TierChip tier={tier} /></td>
        <td className="px-2 py-2 text-xs whitespace-nowrap">{OBJECTION_LABELS[v.lastObjection] ?? v.lastObjection}</td>
        <td className="px-2 py-2 text-[11px] text-stone-dark whitespace-nowrap">
          {v.pageViews}p{v.faqOpens > 0 ? ` · ${v.faqOpens}faq` : ""}
          {badges.length > 0 && <span className="text-gold font-semibold"> · {badges.join(" · ")}</span>}
        </td>
        <td className="px-2 py-2 text-xs text-stone-dark whitespace-nowrap tabular-nums">{timeAgo(v.lastTs)}</td>
      </tr>
      {open && (
        <tr className="border-b border-stone/50 bg-bone">
          <td colSpan={7} className="px-3 sm:px-8 py-3">
            <div className="mono-label text-[9px] text-stone-dark mb-2">
              TIMELINE · FIRST SEEN {new Date(v.firstTs).toLocaleString()}
            </div>
            <ol className="space-y-1 max-h-64 overflow-y-auto">
              {v.events.map((e, i) => (
                <li key={`${e.ts}-${i}`} className="flex flex-wrap items-baseline gap-x-3 text-xs">
                  <span className="tabular-nums text-stone-dark w-[72px] shrink-0">{new Date(e.ts).toLocaleTimeString()}</span>
                  <span className="font-semibold">{e.name}</span>
                  {e.path && <span className="text-stone-dark truncate max-w-[200px]">{e.path}</span>}
                  <span className="text-stone-dark tabular-nums ml-auto">score {e.score}</span>
                </li>
              ))}
            </ol>
          </td>
        </tr>
      )}
    </>
  );
}

function timeAgo(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// ---------------------------------------------------------------------------
// Your session (engine debug)
// ---------------------------------------------------------------------------

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
    <section className="mt-6 bg-charcoal text-bone p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-8 gap-y-3">
          <Stat label="YOUR SCORE" value={String(intent.score)} />
          <Stat label="TIER" value={getIntentTier(intent.score).toUpperCase()} />
          <Stat label="OBJECTION" value={getDominantObjection(intent).toUpperCase()} />
          <Stat label="SOURCE" value={source.toUpperCase()} />
        </div>
        <button onClick={resetIntent} className="mono-label text-gold hover:text-gold-light text-left">
          RESET MY INTENT DATA ↺
        </button>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mono-label text-bone/50 text-[9px] sm:text-[10px]">{label}</div>
      <div className="font-display text-lg sm:text-xl mt-0.5 text-gold">{value}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Config editor
// ---------------------------------------------------------------------------

const OBJECTIONS: Array<{ key: ObjectionKey; label: string; hint: string }> = [
  { key: "default", label: "Default", hint: "No specific objection detected. Source lines apply here." },
  { key: "abandoned", label: "Abandoned checkout", hint: "Opened the checkout, closed it without paying." },
  { key: "price", label: "Price", hint: "Price-focused FAQ opens, repeat pricing views, abandonment." },
  { key: "trust", label: "Trust / risk", hint: "Refunds, terms or delivery questions." },
  { key: "safety", label: "Safety", hint: "Safety page visits or medical FAQ questions." },
  { key: "evidence", label: "Evidence", hint: "Evidence page dwell, guarantee questions." },
];

const SOURCES: TrafficSource[] = ["meta", "tiktok", "google", "youtube", "reddit", "x", "email", "direct", "other"];

type AdminState = Awaited<ReturnType<typeof adminGetFunnelState>> | undefined;

function ConfigEditor({ data, onSaved }: { data: AdminState; onSaved: () => void }) {
  const [draft, setDraft] = useState<FunnelConfig | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (data && !draft) setDraft(data.config);
  }, [data, draft]);

  if (!draft) return null;

  const save = async () => {
    setStatus("Saving…");
    try {
      await adminSaveFunnelConfig({ data: draft });
      setStatus("Saved. Live for all visitors until the next deploy — use Copy JSON to make it permanent.");
      onSaved();
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
      onSaved();
    } catch {
      setStatus("Reset failed.");
    }
  };

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(draft, null, 2));
      setStatus("Config JSON copied. Paste into DEFAULT_FUNNEL_CONFIG in src/config/funnel-defaults.ts to persist across deploys.");
    } catch {
      setStatus("Clipboard unavailable.");
    }
  };

  const setField = <K extends keyof FunnelConfig>(key: K, value: FunnelConfig[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const setVariant = (key: ObjectionKey, patch: Partial<PopupVariant>) =>
    setDraft((d) => (d ? { ...d, variants: { ...d.variants, [key]: { ...d.variants[key], ...patch } } } : d));

  return (
    <>
      <div className="mt-10 flex items-baseline justify-between flex-wrap gap-2">
        <h2 className="font-display text-xl sm:text-2xl font-semibold">Popup content editor</h2>
        {data?.overrideActive && data.overrideSavedAt && (
          <span className="mono-label text-[10px] text-gold">LIVE OVERRIDE · SAVED {new Date(data.overrideSavedAt).toLocaleTimeString()}</span>
        )}
      </div>
      <p className="mt-1 text-xs sm:text-sm text-stone-dark max-w-2xl">
        Edits publish to all visitors on save and hold until the next deploy. For permanent changes: save, “Copy JSON”,
        paste into <code className="text-charcoal">src/config/funnel-defaults.ts</code>.
      </p>

      <Panel className="mt-4" title="Trigger settings">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
          <label className="flex items-center gap-2 text-sm sm:pt-5">
            <input type="checkbox" checked={draft.popupEnabled} onChange={(e) => setField("popupEnabled", e.target.checked)} />
            Exit popup enabled
          </label>
          <div>
            <label htmlFor="arm-ms" className={labelCls}>ARM DELAY (MS)</label>
            <input id="arm-ms" type="number" min={0} max={60000} value={draft.armAfterMs} onChange={(e) => setField("armAfterMs", Number(e.target.value) || 0)} className={inputCls} />
          </div>
          <div>
            <label htmlFor="min-score" className={labelCls}>MIN INTENT SCORE (0 = EVERYONE)</label>
            <input id="min-score" type="number" min={0} max={100} value={draft.minIntentScore} onChange={(e) => setField("minIntentScore", Number(e.target.value) || 0)} className={inputCls} />
          </div>
        </div>
      </Panel>

      <Panel className="mt-3" title="Traffic-source banner lines" sub="Replaces the popup banner when no objection is detected. Empty = default banner.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SOURCES.map((s) => (
            <div key={s}>
              <label htmlFor={`src-${s}`} className={labelCls}>{s.toUpperCase()}</label>
              <input id={`src-${s}`} value={draft.sourceEyebrows[s] ?? ""} onChange={(e) => setField("sourceEyebrows", { ...draft.sourceEyebrows, [s]: e.target.value })} className={inputCls} />
            </div>
          ))}
        </div>
      </Panel>

      <div className="mt-3 space-y-3">
        {OBJECTIONS.map(({ key, label, hint }) => {
          const v = draft.variants[key];
          return (
            <Panel key={key} title={label} sub={hint}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <textarea id={`${key}-bullets`} value={v.bullets.join("\n")} onChange={(e) => setVariant(key, { bullets: e.target.value.split("\n").filter(Boolean).slice(0, 5) })} className={inputCls} rows={3} />
                </div>
              </div>
            </Panel>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button onClick={save} className="btn-primary">SAVE &amp; PUBLISH</button>
        <button onClick={copyJson} className="btn-outline">COPY JSON</button>
        <button onClick={reset} className="btn-outline">RESET TO DEFAULTS</button>
      </div>
      {status && <p className="mt-3 text-sm text-stone-dark max-w-2xl">{status}</p>}
    </>
  );
}
