import { lazy, Suspense, useEffect, useState } from 'react'
import { LazyMotion, MotionConfig } from 'motion/react'
import { I18nProvider } from './content/i18n'
import { hasWebGL, isLowPowerDevice } from './lib/env'
import { setLoading } from './lib/loading'
import { ScrollProvider } from './lib/scroll'
import { useReducedMotion } from './lib/useReducedMotion'
import { Sections } from './sections/Sections'
import { Cursor } from './ui/Cursor'
import { DepthGauge } from './ui/DepthGauge'
import { Header } from './ui/Header'
import { Preloader } from './ui/Preloader'
import { SpoilerProvider } from './ui/Spoiler'

const Experience = lazy(() => import('./scene/Experience'))
// Motion's animation/layout features arrive in their own chunk after the first paint
const motionFeatures = () => import('./lib/motionFeatures').then((r) => r.default)

/**
 * Progressive enhancement: the page (2D sea, title, copy) paints immediately and is fully usable;
 * the 3D scene is mounted on the first sign of a reader (pointer move, touch, scroll, key), so
 * loading three.js never competes with the first paint. Desktop also falls back to an idle timer.
 */
function useDeferred3D(enabled: boolean) {
  const [mount, setMount] = useState(false)
  useEffect(() => {
    if (!enabled) return
    let done = false
    let idle: ReturnType<typeof setTimeout> | undefined
    const go = () => {
      if (done) return
      done = true
      cleanup()
      setLoading({ phase: 'loading', progress: 0 })
      setMount(true)
    }
    const events = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'] as const
    events.forEach((e) => addEventListener(e, go, { passive: true }))
    // desktop readers who do not touch anything still get the scene after a few calm seconds
    const start = () => {
      idle = setTimeout(go, 6000)
    }
    if (!isLowPowerDevice()) {
      if (document.readyState === 'complete') start()
      else addEventListener('load', start, { once: true })
    }
    function cleanup() {
      events.forEach((e) => removeEventListener(e, go))
      removeEventListener('load', start)
      if (idle !== undefined) clearTimeout(idle)
    }
    return cleanup
  }, [enabled])
  return mount
}

export default function App() {
  const reduced = useReducedMotion()
  const [webgl] = useState(hasWebGL)
  const mount3d = useDeferred3D(webgl)

  return (
    <I18nProvider>
      <LazyMotion features={motionFeatures} strict>
        {/* reduced motion: Motion drops transform/layout animations and keeps opacity fades */}
        <MotionConfig reducedMotion="user">
          <SpoilerProvider>
            <ScrollProvider reduced={reduced}>
              {/* 2D sea is always painted underneath: it is the no-WebGL fallback and the loading backdrop */}
              <div className="sea2d" aria-hidden="true" />
              {mount3d && (
                <Suspense fallback={null}>
                  <Experience />
                </Suspense>
              )}
              {/* vignette + film grain: cheap CSS layers, kept on every device */}
              <div className="lens" aria-hidden="true" />
              <Header />
              <DepthGauge />
              <Sections />
              <Preloader />
              <Cursor />
            </ScrollProvider>
          </SpoilerProvider>
        </MotionConfig>
      </LazyMotion>
    </I18nProvider>
  )
}
