import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Latin-only display face; Japanese glyphs come from a site-specific subset (tools/build-fonts.py)
import '@fontsource/shippori-mincho-b1/latin-400.css'
import '@fontsource/shippori-mincho-b1/latin-700.css'
import './styles/fonts-jp.css'
import '@fontsource-variable/hanken-grotesk'
import '@fontsource/geist-mono/400.css'
import 'lenis/dist/lenis.css'
import './styles/global.css'
import './styles/sections.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
