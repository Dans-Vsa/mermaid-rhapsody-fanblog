import { Suspense, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { isLowPowerDevice } from '../lib/env'
import { Atmosphere } from './Atmosphere'
import { CameraRig } from './CameraRig'
import { Seabed, SunkenCity } from './City'
import { Fish, Mermaid, Whale } from './Creatures'
import { sharedUniforms } from './materials'
import { preloadModels } from './models/assets'
import { WaterSurface } from './WaterSurface'

const lowPower = isLowPowerDevice()
preloadModels()

function Clock() {
  useFrame((_, dt) => {
    sharedUniforms.uTime.value += Math.min(dt, 0.1)
  })
  return null
}

/** The whole 3D dive. Loaded lazily from App so the HTML is interactive before three.js arrives. */
export default function Experience() {
  const [dpr, setDpr] = useState(lowPower ? 1 : 1.5)

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
      <PerformanceMonitor
        onIncline={() => setDpr(lowPower ? 1.25 : 2)}
        onDecline={() => setDpr(1)}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />
      <AdaptiveDpr />
      <Clock />
      <Atmosphere />
      <CameraRig />
      <WaterSurface />
      <Suspense fallback={null}>
        <Whale />
        <Mermaid />
        <SunkenCity />
        <Seabed />
        <Fish count={lowPower ? 80 : 160} />
      </Suspense>
    </Canvas>
  )
}
