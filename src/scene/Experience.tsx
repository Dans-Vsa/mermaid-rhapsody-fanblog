import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Preload, useProgress } from '@react-three/drei'
import { isLowPowerDevice } from '../lib/env'
import { setLoading } from '../lib/loading'
import { useReducedMotion } from '../lib/useReducedMotion'
import { Atmosphere } from './Atmosphere'
import { CameraRig } from './CameraRig'
import { Seabed, SunkenCity } from './City'
import { Fish, Mermaid, Whale } from './Creatures'
import { Effects } from './Effects'
import { LightShafts } from './LightShafts'
import { sharedUniforms } from './materials'
import { preloadModels } from './models/assets'
import { Bubbles, MarineSnow } from './Particles'
import { WaterSurface } from './WaterSurface'

const lowPower = isLowPowerDevice()
const MAX_DPR = lowPower ? 1.25 : 1.75
preloadModels()

type Tier = 'high' | 'low'

/**
 * Drops to the low tier (no post-processing) only on sustained slowness: average fps under 40 for
 * three seconds in a row, ignoring the first seconds while assets and shaders settle.
 */
function QualityGuard({ onLow }: { onLow: () => void }) {
  const s = useRef({ elapsed: 0, frames: 0, window: 0, slow: 0, done: false })
  useFrame((_, dt) => {
    const st = s.current
    if (st.done) return
    st.elapsed += dt
    if (st.elapsed < 4) return
    st.frames++
    st.window += dt
    if (st.window >= 1) {
      const fps = st.frames / st.window
      st.slow = fps < 40 ? st.slow + 1 : 0
      st.frames = 0
      st.window = 0
      if (st.slow >= 3) {
        st.done = true
        onLow()
      }
    }
  })
  return null
}

/** Streams drei's loader progress into the main-bundle preloader store. */
function ProgressReporter() {
  const progress = useProgress((s) => s.progress)
  useEffect(() => {
    setLoading({ progress: Math.min(progress, 99) })
  }, [progress])
  return null
}

/** Rendered once everything inside Suspense has resolved and shaders are compiled. */
function Ready() {
  useEffect(() => {
    const t = window.setTimeout(() => setLoading({ phase: 'ready', progress: 100 }), 250)
    return () => window.clearTimeout(t)
  }, [])
  return null
}

function Clock({ reduced }: { reduced: boolean }) {
  useFrame((_, dt) => {
    // reduced motion: time runs very slowly so nothing drifts noticeably, caustics are off
    sharedUniforms.uTime.value += Math.min(dt, 0.1) * (reduced ? 0.15 : 1)
  })
  return null
}

/** The whole 3D dive. Loaded lazily from App so the HTML is interactive before three.js arrives. */
export default function Experience() {
  const reduced = useReducedMotion()
  const [dpr, setDpr] = useState(lowPower ? 1 : 1.5)
  // heavy post-processing only on capable devices; dropped for good if the frame rate sags
  const [tier, setTier] = useState<Tier>(lowPower ? 'low' : 'high')

  useEffect(() => {
    sharedUniforms.uCaustics.value = reduced ? 0 : 1
  }, [reduced])

  useEffect(() => {
    if (import.meta.env.DEV) (window as unknown as { __mrQuality: object }).__mrQuality = { tier, dpr }
  }, [tier, dpr])

  return (
    <Canvas
      className="scene"
      dpr={dpr}
      camera={{ fov: 50, near: 0.1, far: 220, position: [0, -3, 12] }}
      gl={{ antialias: !lowPower, powerPreference: 'high-performance' }}
      eventSource={document.getElementById('root')!}
      eventPrefix="client"
      aria-hidden="true"
    >
      {/* DPR follows the measured headroom; the tier is decided separately by QualityGuard */}
      <PerformanceMonitor factor={0.6} onChange={({ factor }) => setDpr(Math.round((1 + factor * (MAX_DPR - 1)) * 4) / 4)} />
      <QualityGuard
        onLow={() => {
          setDpr(1)
          setTier('low')
        }}
      />
      <AdaptiveDpr />
      <Clock reduced={reduced} />
      <Atmosphere />
      <CameraRig />
      <WaterSurface />
      <LightShafts count={lowPower ? 7 : 12} />
      {!reduced && <MarineSnow count={lowPower ? 700 : 1800} />}
      {!reduced && <Bubbles count={lowPower ? 60 : 140} />}
      <Suspense fallback={null}>
        <Whale />
        <Mermaid />
        <SunkenCity />
        <Seabed />
        <Fish count={lowPower ? 80 : 160} />
        {/* compile every shader up front so the first scroll into the city does not hitch */}
        <Preload all />
        <Ready />
      </Suspense>
      <ProgressReporter />
      {tier === 'high' && !reduced && <Effects />}
    </Canvas>
  )
}
