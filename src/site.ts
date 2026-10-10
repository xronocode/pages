// Site-wide constants shared by the layout, feeds, and structured data.
export const SITE = {
  name: 'xronocode',
  author: 'Mikhail Yevdokimov',
  url: 'https://pages.xronocode.com',
  description: 'Notes & discussions on shipping AI into banking, ecosystems, documents, and autonomous agents.',
  ogImage: '/og/default.png',
  sameAs: [
    'https://github.com/xronocode',
    'https://linkedin.com/in/xronocode',
    'https://habr.com/ru/users/Xronofag/',
  ],
};

// GA4 measurement ID for pages.xronocode.com (property "pages blog"). Set PUBLIC_GA_ID='' to disable.
export const GA_ID = import.meta.env.PUBLIC_GA_ID ?? 'G-7PMFQ1X7DR';

// Rough reading time for a markdown body (words / 220 wpm, min 1).
export function readingMinutes(body: string | undefined): number {
  const words = (body ?? '').replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
