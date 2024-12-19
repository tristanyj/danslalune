// https://nuxt.com/docs/api/configuration/nuxt-config
const SITE_TITLE = "Stats don't lie — A visualization of NBA legends";
const SITE_DESCRIPTION =
  'Compare NBA legends through an interactive visualization of their career statistics, records, and achievements. Explore data from 50 players and 130+ statistics.';
const SITE_URL = 'https://stirring-bublanina-c24a45.netlify.app/';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'light',
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: SITE_TITLE,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: SITE_DESCRIPTION,
        },
        {
          name: 'twitter:title',
          content: SITE_TITLE,
        },
        { name: 'twitter:url', content: SITE_URL },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        { name: 'twitter:image', content: '/backdrop.png' },
        { name: 'og:url', content: SITE_URL },
        { name: 'og:title', content: SITE_TITLE },
        {
          name: 'og:description',
          content: SITE_DESCRIPTION,
        },
        { name: 'og:image', content: '/backdrop.png' },
      ],
      style: [],
      script: [],
    },
  },
  imports: {
    dirs: ['stores/**'],
  },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'storeToRefs'],
      },
    ],
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/icon',
  ],
  icon: {
    serverBundle: {
      remote: true,
      collections: ['radix-icons'],
    },
  },
});
