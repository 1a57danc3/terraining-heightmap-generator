import { visualizer } from 'rollup-plugin-visualizer'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import wasmpack from 'vite-plugin-wasm-pack'

// https://nuxt.com/docs/api/configuration/nuxt-config

const token = process.env.NODE_ENV !== 'production' ? process.env.TOKEN : process.env.PUBLIC_TOKEN

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  typescript: {
    strict: true,
    typeCheck: true,
    shim: false,
  },
  srcDir: 'src/',
  runtimeConfig: {
    public: {
      token,
      gtag: '',
    },
  },
  css: [
    '@/assets/scss/reset.scss',
    '@/assets/scss/main.scss',
    '@fortawesome/fontawesome-svg-core/styles.css',
    'mapbox-gl/dist/mapbox-gl.css',
  ],
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        plugins: [
          visualizer({
            open: false,
          }),
        ],
        output: {
          manualChunks(id) {
            if (id.includes('mapbox-gl') && !id.includes('mapbox-gl.css')) {
              return 'vendor'
            }
          },
        },
      },
    },
    server: {
      watch: {
        usePolling: true,
      },
    },
    define: {
      'process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE': '1000000',
      'process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS': '1000000',
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/scss/_variables.scss";',
        },
      },
    },
    plugins: [
      nodePolyfills({
        protocolImports: true,
      }),
      wasmpack('./png_lib'),
    ],
    worker: {
      format: 'es',
    },
  },
  modules: [
    '@nuxtjs/device',
    '@nuxtjs/google-fonts',
  ],
  components: [
    {
      path: '@/components',
      pathPrefix: false,
    },
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        prefix: 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#',
      },
      title: 'Terraining - Heightmap Generator for Cities: Skylines',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'format-detection', content: 'address=no, email=no, telephone=no' },
        { name: 'description', content: 'Heightmap Generator for Cities: Skylines' },
        { name: 'keywords', content: 'Cities: Skylines, Heightmap, Heightmap Generator' },
        { property: 'og:site_name', content: 'Terraining - Heightmap Generator for Cities: Skylines' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://terraining.ateliernonta.com' },
        { property: 'og:title', content: 'Terraining - Heightmap Generator for Cities: Skylines' },
        { property: 'og:description', content: 'Heightmap Generator' },
        { property: 'og:image', content: 'https://terraining.ateliernonta.com/images/logo.png' },
        { name: 'twitter:card', content: 'summary' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
  googleFonts: {
    display: 'swap',
    inject: true,
    download: true,
    preload: true,
    families: {
      Inter: [400, 700],
    },
  },
})
