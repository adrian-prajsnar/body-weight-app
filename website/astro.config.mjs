import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://adrian-prajsnar.github.io',
  base: '/body-weight-app',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
