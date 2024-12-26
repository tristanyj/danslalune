// https://nuxt.com/docs/api/configuration/nuxt-config
const SITE_TITLE = "Dans la lune — L'influence de la lune sur les vêlages.";
const SITE_DESCRIPTION =
  "Depuis des générations, de nombreux éleveurs sont convaincus que les phases de la lune influencent les vêlages et les interventions vétérinaires. Ce projet de data visualisation explore cette croyance en examinant les corrélations possibles entre les cycles lunaires et les activités d'élevage.";
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
      script: [
        {
          src: 'https://unpkg.com/d3-regression@1.3.10/dist/d3-regression.min.js',
          defer: true,
        },
      ],
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
