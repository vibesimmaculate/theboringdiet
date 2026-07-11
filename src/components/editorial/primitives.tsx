import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EditorialEyebrow({
  children,
  invert = false,
  dot = true,
  className,
}: {
  children: ReactNode;
  invert?: boolean;
  dot?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("eyebrow", invert && "eyebrow-invert", dot && "gold-dot", className)}>
      {children}
    </div>
  );
}

export function Folio({ children, invert = false, className }: { children: ReactNode; invert?: boolean; className?: string }) {
  return (
    <div className={cn("folio", invert && "!text-bone/50", className)} aria-hidden="true">
      {children}
    </div>
  );
}

export function HorizontalRule({ invert = false, className, gold = false }: { invert?: boolean; className?: string; gold?: boolean }) {
  return (
    <hr
      className={cn(
        "border-0 h-px w-full",
        gold ? "bg-gold" : invert ? "bg-bone/20" : "bg-stone",
        className,
      )}
    />
  );
}

export function VerticalRule({ invert = false, className }: { invert?: boolean; className?: string }) {
  return <span className={cn("inline-block w-px h-full", invert ? "bg-bone/20" : "bg-stone", className)} />;
}

export function PullQuote({ children, invert = false, cite }: { children: ReactNode; invert?: boolean; cite?: string }) {
  return (
    <blockquote
      className={cn(
        "font-display font-medium text-3xl sm:text-5xl leading-[0.95] tracking-tight",
        invert ? "text-bone" : "text-charcoal",
      )}
    >
      {children}
      {cite && <cite className="mt-4 block mono-label not-italic">{cite}</cite>}
    </blockquote>
  );
}

export function RedactedText({ chars = 8, className }: { chars?: number; className?: string }) {
  return (
    <span
      aria-label="[redacted]"
      className={cn("redacted-block", className)}
      style={{ letterSpacing: "0.02em" }}
    >
      {"█".repeat(chars)}
    </span>
  );
}

export function RedactedPreview({
  eyebrow,
  folio,
  lines = 5,
  className,
}: {
  eyebrow: string;
  folio?: string;
  lines?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-paper border border-stone p-6 sm:p-8 paper-grain relative overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <EditorialEyebrow>{eyebrow}</EditorialEyebrow>
        {folio && <Folio>{folio}</Folio>}
      </div>
      <div className="mt-6 space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-2 bg-charcoal/85" style={{ width: `${45 + ((i * 13) % 45)}%` }} />
            <div className="h-2 bg-charcoal/60" style={{ width: `${15 + ((i * 7) % 25)}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 bg-stone/60" />
        ))}
      </div>
    </div>
  );
}

export function DarkChapter({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("bg-deep text-bone paper-grain", className)}>
      <div className="editorial-shell py-24 sm:py-32">{children}</div>
    </section>
  );
}

export function ChapterOpener({
  number,
  title,
  invert = false,
}: {
  number: string;
  title: string;
  invert?: boolean;
}) {
  return (
    <div className={cn("flex items-baseline gap-6", invert ? "text-bone" : "text-charcoal")}>
      <div className={cn("folio", invert && "!text-bone/60")}>{number}</div>
      <div className="flex-1">
        <HorizontalRule invert={invert} />
      </div>
      <div className="mono-label">{title}</div>
    </div>
  );
}

export function DirectAnswer({
  question,
  answer,
  className,
  id,
}: {
  question: string;
  answer: string;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={cn("border-l-2 border-gold pl-5 sm:pl-6", className)}>
      <EditorialEyebrow className="mb-2">DIRECT ANSWER</EditorialEyebrow>
      <p className="font-display text-2xl sm:text-3xl leading-tight tracking-tight text-charcoal">
        {question}
      </p>
      <p className="mt-3 text-charcoal-soft max-w-2xl leading-relaxed">{answer}</p>
    </div>
  );
}

export function FactTable({
  rows,
  emphasizeValues = false,
}: {
  rows: readonly { k: string; v: string; emphasize?: boolean }[];
  emphasizeValues?: boolean;
}) {
  return (
    <dl className="divide-y divide-stone border-y border-stone">
      {rows.map((r) => (
        <div key={r.k} className="grid grid-cols-[1fr_auto] gap-6 py-4">
          <dt className="mono-label self-center">{r.k}</dt>
          <dd
            className={cn(
              "text-right self-center",
              r.emphasize && emphasizeValues
                ? "font-display text-3xl sm:text-4xl leading-none"
                : "font-sans text-charcoal",
            )}
          >
            {r.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 mono-label" role="status" aria-live="polite">
      <span className="inline-block w-3 h-3 border border-charcoal border-t-transparent rounded-full animate-spin" />
      {label.toUpperCase()}…
    </div>
  );
}

export function ErrorState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border border-red p-6 bg-paper">
      <div className="mono-label text-red">ERROR</div>
      <div className="mt-2 font-display text-2xl">{title}</div>
      {description && <p className="mt-2 text-charcoal-soft text-sm">{description}</p>}
    </div>
  );
}
