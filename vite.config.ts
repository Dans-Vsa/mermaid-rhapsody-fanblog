import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base so the build works on GitHub Pages under any repo path.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    // never inline fonts as base64: they would bloat the render-blocking CSS, and with
    // unicode-range the browser only fetches the slices a page actually uses
    assetsInlineLimit: (file) => (file.endsWith('.woff2') || file.endsWith('.woff') ? false : undefined),
  },
})
