// Renders Open Graph images (public/og/default.png, public/og/blog/<id>.png)
// and favicons with headless Chrome. Not part of `astro build` — rerun after
// adding or retitling an essay, then commit the PNGs.
//
// Run: NODE_PATH=<dir containing playwright-core> node scripts/render-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright-core');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#1a1814"/><path d="M20 18h8l4 8.5 4-8.5h8l-8 14 8 14h-8l-4-8.5-4 8.5h-8l8-14z" fill="#f3ede1"/><rect x="14" y="50" width="36" height="3" fill="#c4612f"/></svg>`;

// Minimal frontmatter reader: the blog schema only uses flat scalars and one-line arrays.
function frontmatter(file) {
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  const data = {};
  for (const line of (m ? m[1] : '').split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv || !kv[2]) continue;
    let v = kv[2].trim();
    if (v.startsWith('[')) v = JSON.parse(v);
    else v = v.replace(/^["']|["']$/g, '');
    data[kv[1]] = v;
  }
  return data;
}

const blogDir = 'src/content/blog';
const posts = fs.readdirSync(blogDir).filter(f => f.endsWith('.md')).map(f => ({ id: f.replace(/\.md$/, ''), ...frontmatter(path.join(blogDir, f)) }));

fs.mkdirSync('public/og/blog', { recursive: true });
fs.writeFileSync('public/favicon.svg', FAVICON);

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto('file://' + path.resolve('scripts/og.html'), { waitUntil: 'networkidle' });

async function shot(out, kicker, title, meta) {
  await page.evaluate(([k, t, m]) => {
    document.getElementById('kicker').textContent = k;
    const h = document.getElementById('title');
    h.textContent = t;
    h.className = t.length > 70 ? 'long' : '';
    document.getElementById('meta').textContent = m;
  }, [kicker, title, meta]);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out });
  console.log('og', out);
}

await shot('public/og/default.png', 'essays · oss · ai tools', 'Shipping AI into banking, documents, and autonomous agents.', 'Mikhail Yevdokimov');
for (const p of posts) {
  const ru = p.id.endsWith('-ru');
  const date = new Date(p.date).toLocaleDateString(ru ? 'ru-RU' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  await shot(`public/og/blog/${p.id}.png`, (ru ? 'эссе' : 'essay') + (p.tags?.length ? ' · ' + p.tags.join(' · ') : ''), p.title, `Mikhail Yevdokimov · ${date}`);
}

for (const [file, size] of [['apple-touch-icon.png', 180], ['favicon-32.png', 32]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<body style="margin:0">${FAVICON.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body>`);
  await page.screenshot({ path: 'public/' + file, omitBackground: true });
  console.log('icon', file);
}
await browser.close();
