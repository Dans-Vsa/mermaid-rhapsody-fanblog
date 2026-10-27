import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/shippori-mincho-b1/400.css'
import '@fontsource/shippori-mincho-b1/700.css'
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
