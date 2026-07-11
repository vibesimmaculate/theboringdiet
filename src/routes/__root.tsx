import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { BRAND } from "@/config/brand";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { StickyPurchaseDock } from "@/components/layout/sticky-purchase-dock";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { reportLovableError } from "@/lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <main className="min-h-screen bg-bone paper-grain">
      <div className="editorial-main pt-40 pb-32">
        <div className="folio mb-6">THE BORING DIET · 404</div>
        <h1 className="h-section">
          NOT FOUND<span className="text-gold">.</span>
        </h1>
        <p className="mt-6 max-w-md text-stone-dark">
          The page you're looking for is not part of this publication.
        </p>
        <a href="/" className="btn-outline mt-10">Return to the cover</a>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <main className="min-h-screen bg-bone paper-grain">
      <div className="editorial-main pt-40 pb-32">
        <div className="folio mb-6">THE BORING DIET · ERROR</div>
        <h1 className="h-chapter">This page didn't load<span className="text-gold">.</span></h1>
        <p className="mt-6 max-w-md text-stone-dark">
          Something went wrong on our end. You can try again or return home.
        </p>
        <div className="mt-10 flex gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-primary"
          >Try again</button>
          <a href="/" className="btn-outline">Go home</a>
        </div>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${BRAND.name} — A bounded 14-day eating experiment` },
      {
        name: "description",
        content:
          "A premium 36-page digital publication. One protocol. Fourteen days. $19 one-time. No subscription. Instant digital access through Polar.",
      },
      { name: "author", content: BRAND.name },
      { name: "theme-color", content: "#F5F3ED" },
      { property: "og:site_name", content: BRAND.name },
      { property: "og:type", content: "website" },
      { property: "og:title", content: `${BRAND.name} — A bounded 14-day eating experiment` },
      {
        property: "og:description",
        content:
          "A premium 36-page digital publication. One protocol. Fourteen days. $19 one-time. No subscription. Instant digital access through Polar.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "format-detection", content: "telephone=no" },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { title: "The Boring Diet — A bounded 14-day eating experiment · $19" },
      { property: "og:title", content: "The Boring Diet — A bounded 14-day eating experiment · $19" },
      { name: "twitter:title", content: "The Boring Diet — A bounded 14-day eating experiment · $19" },
      { name: "twitter:description", content: "A premium 36-page digital publication. One protocol. Fourteen days. $19 one-time. No subscription. Instant digital access through Polar." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/6293384b-cecb-46e8-80b3-a5dea707620d" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/6293384b-cecb-46e8-80b3-a5dea707620d" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: BRAND.name,
          description: BRAND.shortDescription,
          url: "/",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: BRAND.name,
          url: "/",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-charcoal focus:text-bone focus:px-4 focus:py-2">
          Skip to content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <MetaPixel />
      <AnnouncementBar />
      <SiteHeader />
      <main id="main">
        <Outlet />
      </main>
      <SiteFooter />
      <StickyPurchaseDock />
      <CookieBanner />
    </QueryClientProvider>
  );
}
