import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    hmr: false
  },
  build: {
    target: 'esnext',
    modulePreload: {
      polyfill: false
    },
  },
})
