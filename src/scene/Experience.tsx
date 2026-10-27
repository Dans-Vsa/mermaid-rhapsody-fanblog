import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { isLowPowerDevice } from '../lib/env'
import { Atmosphere } from './Atmosphere'
import { CameraRig } from './CameraRig'
import { Fish, Mermaid, Seabed, SunkenCity, WaterSurface, Whale } from './placeholders'

const lowPower = isLowPowerDevice()

/** The whole 3D dive. Loaded lazily from App so the HTML is interactive before three.js arrives. */
export default function Experience() {
  const [dpr, setDpr] = useState(lowPower ? 1 : 1.5)

  return (
    <Canvas
      className="scene"
      dpr={dpr}
      camera={{ fov: 50, near: 0.1, far: 220, position: [0, -2, 12] }}
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
      <Atmosphere />
      <CameraRig />
      <WaterSurface />
      <Whale />
      <Mermaid />
      <SunkenCity />
      <Seabed />
      <Fish count={lowPower ? 80 : 160} />
    </Canvas>
  )
}
