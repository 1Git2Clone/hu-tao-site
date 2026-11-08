import type { RequestHandler } from "@sveltejs/kit";
import { POSTS } from "$lib/server/posts";
import { publishedDate } from "$lib/data/seo";

export const prerender = true;

import { SITE_URL } from "$lib/utils/consts";

const routePages = import.meta.glob("/src/routes/**/+page.svelte", {
  eager: true,
});

function routeFromPagePath(path: string): string {
  const route = path.replace("/src/routes", "").replace("/+page.svelte", "");
  return route || "/";
}

const STATIC_ROUTES = Object.keys(routePages)
  .map(routeFromPagePath)
  .filter((route) => !route.includes("["))
  .sort((a, b) => a.localeCompare(b));

function urlEntry(loc: string, lastmod?: string): string {
  return [
    "\t<url>",
    `\t\t<loc>${loc}</loc>`,
    lastmod ? `\t\t<lastmod>${lastmod}</lastmod>` : null,
    "\t\t<changefreq>monthly</changefreq>",
    "\t</url>",
  ]
    .filter(Boolean)
    .join("\n");
}

export const GET: RequestHandler = () => {
  const staticEntries = STATIC_ROUTES.map((route) =>
    urlEntry(`${SITE_URL}${route}`),
  );

  const postEntries = POSTS.map(({ slug, metadata }) => {
    const lastmod = metadata.date ? publishedDate(metadata.date) : undefined;
    return urlEntry(`${SITE_URL}/blogs/${slug}`, lastmod);
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...postEntries].join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=3600",
    },
  });
};
