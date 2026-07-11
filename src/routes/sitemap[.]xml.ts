import { createFileRoute } from "@tanstack/react-router";

const BASE_URL = "";
const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" as const },
  { path: "/product", priority: "0.9", changefreq: "weekly" as const },
  { path: "/how-it-works", priority: "0.8", changefreq: "monthly" as const },
  { path: "/whats-inside", priority: "0.8", changefreq: "monthly" as const },
  { path: "/evidence", priority: "0.7", changefreq: "monthly" as const },
  { path: "/safety", priority: "0.7", changefreq: "monthly" as const },
  { path: "/faq", priority: "0.7", changefreq: "monthly" as const },
  { path: "/about", priority: "0.5", changefreq: "monthly" as const },
  { path: "/press", priority: "0.4", changefreq: "monthly" as const },
  { path: "/contact", priority: "0.4", changefreq: "monthly" as const },
  { path: "/guides", priority: "0.6", changefreq: "weekly" as const },
  { path: "/privacy", priority: "0.2", changefreq: "yearly" as const },
  { path: "/terms", priority: "0.2", changefreq: "yearly" as const },
  { path: "/refunds", priority: "0.2", changefreq: "yearly" as const },
  { path: "/disclaimer", priority: "0.2", changefreq: "yearly" as const },
];
const guides = [
  "what-is-a-bounded-14-day-food-experiment",
  "how-fewer-food-decisions-can-simplify-eating",
  "how-to-prepare-for-a-14-day-food-experiment",
  "why-an-exit-plan-matters-after-short-term-restriction",
  "how-to-decide-whether-a-diet-challenge-is-appropriate",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          ...staticRoutes,
          ...guides.map((s) => ({ path: `/guides/${s}`, priority: "0.5", changefreq: "monthly" as const })),
        ];
        const urls = entries
          .map(
            (e) =>
              `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
