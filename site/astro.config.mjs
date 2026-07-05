// @ts-check
import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import vue from '@astrojs/vue';
import remarkDirective from 'remark-directive';
import remarkCallouts from './src/plugins/remark-callouts.mjs';

/**
 * Astro Configuration for Claiire Website
 *
 * This configuration sets up a custom Astro content site optimized for deployment
 * on Vercel with SEO features, MDX support, and Vue islands.
 *
 * Key features:
 * - Static site generation for optimal performance
 * - Custom content rendering with Astro routes and layouts
 * - Vercel deployment with analytics
 * - Automatic sitemap generation for SEO
 *
 * @see https://astro.build/config
 */
export default defineConfig({
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
  },
  // Base URL for the production site - used for canonical URLs and sitemap generation
  site: 'https://www.claiire.fr',

  // Server output is required for member auth, route protection and billing webhooks.
  output: 'server',

  markdown: {
    remarkPlugins: [remarkDirective, remarkCallouts],
  },

  // Vercel adapter with analytics for deployment insights and performance monitoring
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),

  integrations: [
    clerk({
      signInUrl: '/connexion/',
      signUpUrl: '/connexion/',
      afterSignOutUrl: '/',
      enableEnvSchema: false,
    }),
    // Sitemap generation for SEO - helps search engines discover and index pages
    sitemap({
      // Exclude error pages and member-only content from sitemap
      filter: (page) => !page.includes('/404') && !page.includes('/_') && !page.includes('/membres/'),
      changefreq: 'weekly', // Hint to search engines about update frequency
      lastmod: new Date(), // Set last modification date to build time
    }),

    // Vue 3 integration for interactive gamification components
    vue(),
  ],
});
