// Site-wide constants shared by the layout, feeds, and structured data.
export const SITE = {
  name: 'xronocode',
  author: 'Mikhail Yevdokimov',
  url: 'https://pages.xronocode.com',
  description: 'Notes & discussions on shipping AI into banking, ecosystems, documents, and autonomous agents.',
  ogImage: '/og/default.png',
  jobTitle: 'CPO, fintech',
  knowsAbout: ['AI in banking', 'fintech product management', 'digital ecosystems', 'AI agents', 'open source'],
  sameAs: [
    'https://github.com/xronocode',
    'https://linkedin.com/in/xronocode',
    'https://habr.com/ru/users/Xronofag/',
  ],
};

// First-party page views go to our own collector, not to Google. The key is public
// by design: the collector accepts it only from pages.xronocode.com (Origin check).
// Set PUBLIC_COLLECT_KEY='' to disable counting.
export const COLLECT_KEY = import.meta.env.PUBLIC_COLLECT_KEY ?? '37ef53d917e02bc7cd6876155e22e953e19b24b0c3925314';

// Rough reading time for a markdown body (words / 220 wpm, min 1).
export function readingMinutes(body: string | undefined): number {
  const words = (body ?? '').replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
