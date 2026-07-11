"use client";
import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  LabelList,
  Tooltip,
} from "recharts";
import { trackEvent } from "@/components/analytics/meta-pixel";

type Row = { name: string; score: number; kind: "goldSolid" | "goldPale" | "charcoal" | "baseline" };
const DATA: Row[] = [
  { name: "PROTOCOL FOOD A", score: 323, kind: "goldSolid" },
  { name: "Fish", score: 225, kind: "charcoal" },
  { name: "Apples", score: 197, kind: "charcoal" },
  { name: "Lean beef", score: 176, kind: "charcoal" },
  { name: "PROTOCOL FOOD B", score: 150, kind: "goldPale" },
  { name: "White bread", score: 100, kind: "baseline" },
  { name: "Croissant", score: 47, kind: "charcoal" },
];

const colorFor = (k: Row["kind"]) => {
  switch (k) {
    case "goldSolid":
      return "var(--gold)";
    case "goldPale":
      return "var(--gold-light)";
    case "baseline":
      return "var(--stone-dark)";
    default:
      return "var(--charcoal)";
  }
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Row }> }) {
  if (!active || !payload?.length) return null;
  const r = payload[0].payload;
  return (
    <div className="bg-bone border border-charcoal p-3">
      <div className="mono-label text-charcoal">{r.name}</div>
      <div className="font-display text-2xl leading-none mt-1">{r.score}</div>
      <div className="mono-label text-stone-dark mt-2">White bread baseline = 100</div>
    </div>
  );
}

export function EvidenceChart() {
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !seen) {
          setSeen(true);
          trackEvent("satiety_chart_view");
        }
      },
      { threshold: 0.2 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen]);

  return (
    <div ref={ref}>
      <div className="mono-label text-stone-dark">SATIETY INDEX · SELECTED FOODS</div>
      <div className="mono-label text-stone-dark text-[10px]">WHITE BREAD = 100</div>

      <div className="mt-6 w-full h-[420px] sm:h-[500px]" onMouseMove={() => trackEvent("satiety_chart_interaction")}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} layout="vertical" margin={{ top: 8, right: 60, left: 8, bottom: 8 }} barCategoryGap="22%">
            <XAxis
              type="number"
              domain={[0, 360]}
              tick={{ fill: "var(--stone-dark)", fontFamily: "IBM Plex Mono", fontSize: 11, letterSpacing: 2 }}
              stroke="var(--stone)"
              tickLine={false}
              axisLine={{ stroke: "var(--stone)" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={160}
              tick={{ fill: "var(--charcoal)", fontFamily: "IBM Plex Mono", fontSize: 11, letterSpacing: 1.5 }}
              tickLine={false}
              axisLine={{ stroke: "var(--stone)" }}
            />
            <ReferenceLine
              x={100}
              stroke="var(--charcoal)"
              strokeDasharray="2 3"
              label={{ value: "BASELINE", fill: "var(--charcoal)", fontFamily: "IBM Plex Mono", fontSize: 10, position: "top" }}
            />
            <Tooltip cursor={{ fill: "rgba(184,155,94,0.08)" }} content={<CustomTooltip />} />
            <Bar dataKey="score" isAnimationActive animationDuration={900} animationEasing="ease-out" barSize={22}>
              {DATA.map((d, i) => (
                <Cell key={i} fill={colorFor(d.kind)} stroke="var(--charcoal)" strokeWidth={d.kind === "goldPale" ? 1 : 0} />
              ))}
              <LabelList
                dataKey="score"
                position="right"
                style={{ fill: "var(--charcoal)", fontFamily: "IBM Plex Mono", fontSize: 12 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Screen-reader data table alternative */}
      <table className="sr-only">
        <caption>Satiety Index — selected foods. White bread baseline = 100.</caption>
        <thead>
          <tr><th>Food</th><th>Score</th></tr>
        </thead>
        <tbody>
          {DATA.map((d) => (
            <tr key={d.name}><td>{d.name}</td><td>{d.score}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
