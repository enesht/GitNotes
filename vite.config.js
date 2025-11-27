import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  base: '/GitNotes/',
  plugins: [
    nodePolyfills({
      // Include Buffer polyfill
      include: ['buffer'],
      globals: {
        Buffer: true,
      },
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
