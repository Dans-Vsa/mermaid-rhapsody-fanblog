import { lazy, Suspense, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { I18nProvider } from './content/i18n'
import { hasWebGL } from './lib/env'
import { ScrollProvider } from './lib/scroll'
import { useReducedMotion } from './lib/useReducedMotion'
import { Sections } from './sections/Sections'
import { Cursor } from './ui/Cursor'
import { DepthGauge } from './ui/DepthGauge'
import { Header } from './ui/Header'
import { SpoilerProvider } from './ui/Spoiler'

const Experience = lazy(() => import('./scene/Experience'))

export default function App() {
  const reduced = useReducedMotion()
  const [webgl] = useState(hasWebGL)

  return (
    <I18nProvider>
      {/* reduced motion: Motion drops transform/layout animations and keeps opacity fades */}
      <MotionConfig reducedMotion="user">
        <SpoilerProvider>
          <ScrollProvider reduced={reduced}>
            {/* 2D sea is always painted underneath: it is the no-WebGL fallback and the loading backdrop */}
            <div className="sea2d" aria-hidden="true" />
            {webgl && (
              <Suspense fallback={null}>
                <Experience />
              </Suspense>
            )}
            {/* vignette + film grain: cheap CSS layers, kept on every device */}
            <div className="lens" aria-hidden="true" />
            <Header />
            <DepthGauge />
            <Sections />
            <Cursor />
          </ScrollProvider>
        </SpoilerProvider>
      </MotionConfig>
    </I18nProvider>
  )
}
