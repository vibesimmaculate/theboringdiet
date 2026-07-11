import { Link } from "@tanstack/react-router";
import { BRAND, SITE } from "@/config/brand";

const columns = [
  {
    title: "PRODUCT",
    items: [
      { l: "Product", h: "/product" },
      { l: "The Idea", h: "/how-it-works" },
      { l: "Evidence", h: "/evidence" },
      { l: "What's Inside", h: "/whats-inside" },
      { l: "Safety", h: "/safety" },
      { l: "FAQ", h: "/faq" },
    ],
  },
  {
    title: "READ",
    items: [
      { l: "Guides", h: "/guides" },
      { l: "About", h: "/about" },
      { l: "Press", h: "/press" },
      { l: "Contact", h: "/contact" },
    ],
  },
  {
    title: "LEGAL",
    items: [
      { l: "Terms", h: "/terms" },
      { l: "Privacy", h: "/privacy" },
      { l: "Refunds", h: "/refunds" },
      { l: "Disclaimer", h: "/disclaimer" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-deep text-bone mt-24">
      <div className="editorial-shell py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_repeat(3,1fr)] gap-12">
          <div>
            <div className="font-display text-2xl">
              {BRAND.wordmark}<span className="text-gold">.</span>
            </div>
            <p className="mt-4 text-bone/70 max-w-xs font-serif italic">{BRAND.tagline}</p>
            <div className="mt-8 folio text-bone/50">EDITION 1.0 · DIGITAL PUBLICATION</div>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <div className="mono-label text-bone/60 mb-4">{c.title}</div>
              <ul className="space-y-2.5">
                {c.items.map((it) => (
                  <li key={it.h}>
                    <Link to={it.h} className="text-bone/85 hover:text-gold transition-colors text-sm">
                      {it.l}
                    </Link>
                  </li>
                ))}
                {c.title === "READ" && (
                  <li>
                    <a href="https://polar.sh/" target="_blank" rel="noreferrer" className="text-bone/85 hover:text-gold text-sm">
                      Customer Portal
                    </a>
                  </li>
                )}
                {c.title === "LEGAL" && (
                  <li>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-preferences"))}
                      className="text-bone/85 hover:text-gold text-sm"
                    >Cookie Preferences</button>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        <hr className="hairline-invert my-12" />

        <p className="text-bone/60 text-xs max-w-3xl leading-relaxed">
          The Boring Diet is a general educational digital publication describing a time-limited personal experiment. It is
          not medical advice and does not diagnose, treat, cure or prevent any condition. Individual experiences vary.
        </p>
        <p className="mt-4 folio text-bone/50">
          © {year} {SITE.legalName}. All rights reserved. · Support: {SITE.supportEmail}
        </p>
      </div>
    </footer>
  );
}
