// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pages.xronocode.com',
  output: 'static',
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
