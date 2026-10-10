import type { APIRoute } from 'astro';
import { SITE } from '../site';

// Alias for crawlers and tools that only look at /sitemap.xml; @astrojs/sitemap writes sitemap-index.xml.
export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${SITE.url}/sitemap-0.xml</loc></sitemap></sitemapindex>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
