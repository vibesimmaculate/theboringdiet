import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { NAV, BRAND } from "@/config/brand";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { PolarCheckoutTrigger } from "@/components/product/polar-checkout-trigger";


export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-bone/85 backdrop-blur-md border-b border-stone/60"
          : "bg-transparent",
      )}
    >
      <div className={cn("editorial-shell flex items-center justify-between", scrolled ? "py-3" : "py-5")}>
        <Link to="/" className="font-display font-semibold tracking-tight text-lg sm:text-xl text-charcoal">
          {BRAND.wordmark}<span className="text-gold">.</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-8">
          {NAV.map((n) => (
            <Link
              key={n.href}
              to={n.href}
              className="mono-label hover:text-charcoal transition-colors"
              activeProps={{ className: "!text-charcoal" }}
            >
              {n.label.toUpperCase()}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <PolarCheckoutTrigger compact analyticsId="header_cta_click" className="!bg-gold !text-charcoal hover:!bg-gold-light !font-bold">
            GET IT · <span className="line-through opacity-60 ml-1">$50</span> <span className="ml-1">$19</span>
          </PolarCheckoutTrigger>
        </div>

        <div className="lg:hidden flex items-center gap-3">
          <PolarCheckoutTrigger
            compact
            analyticsId="header_cta_click"
            className="!min-h-[40px] !py-2 !px-3 !text-[11px] !font-bold"
          >
            GET IT · $19
          </PolarCheckoutTrigger>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="p-2 border border-charcoal"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-bone border-t border-stone">
          <div className="editorial-shell py-10">
            <div className="folio mb-8">CONTENTS</div>
            <ol className="space-y-6">
              {NAV.map((n, i) => (
                <li key={n.href} className="flex items-baseline gap-4 border-b border-stone pb-4">
                  <span className="mono-label w-8">{String(i + 1).padStart(2, "0")}</span>
                  <Link to={n.href} className="font-display text-3xl">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li className="flex items-baseline gap-4 border-b border-stone pb-4">
                <span className="mono-label w-8">06</span>
                <Link to="/guides" className="font-display text-3xl">Guides</Link>
              </li>
              <li className="flex items-baseline gap-4 border-b border-stone pb-4">
                <span className="mono-label w-8">07</span>
                <Link to="/product" className="font-display text-3xl">Get the Protocol — $19</Link>
              </li>
            </ol>
          </div>
        </div>
      )}
    </header>
  );
}
