import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base so the build works on GitHub Pages under any repo path.
export default defineConfig({
  base: './',
  plugins: [react()],
})
