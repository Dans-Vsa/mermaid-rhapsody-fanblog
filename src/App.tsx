import { lazy, Suspense, useState } from 'react'
import { I18nProvider } from './content/i18n'
import { hasWebGL } from './lib/env'
import { ScrollProvider } from './lib/scroll'
import { useReducedMotion } from './lib/useReducedMotion'
import { Sections } from './sections/Sections'
import { DepthGauge } from './ui/DepthGauge'
import { Header } from './ui/Header'

const Experience = lazy(() => import('./scene/Experience'))

export default function App() {
  const reduced = useReducedMotion()
  const [webgl] = useState(hasWebGL)

  return (
    <I18nProvider>
      <ScrollProvider reduced={reduced}>
        {/* 2D sea is always painted underneath: it is the no-WebGL fallback and the loading backdrop */}
        <div className="sea2d" aria-hidden="true" />
        {webgl && (
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        )}
        <Header />
        <DepthGauge />
        <Sections />
      </ScrollProvider>
    </I18nProvider>
  )
}
