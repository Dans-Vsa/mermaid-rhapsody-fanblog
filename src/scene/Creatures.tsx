import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, InstancedMesh, Object3D } from 'three'
import { mulberry32 } from '../lib/random'
import { makeToonMaterial } from './materials'
import { useMermaidGeometry, usePropGeometries, useWhaleGeometry } from './models/assets'

const dummy = new Object3D()

function useMaterial(...args: Parameters<typeof makeToonMaterial>) {
  const mat = useMemo(() => makeToonMaterial(...args), []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => mat.dispose(), [mat])
  return mat
}

/** The whale drifts past the synopsis; flukes beat in the vertex shader. */
export function Whale() {
  const geometry = useWhaleGeometry()
  const material = useMaterial({ deform: 'whale', rimStrength: 0.45 })
  const ref = useRef<Group>(null)
  useFrame(({ clock }) => {
    const g = ref.current
    if (!g) return
    const t = clock.elapsedTime
    g.position.x = 9 + Math.sin(t * 0.06) * 3
    g.position.y = -20 + Math.sin(t * 0.22) * 0.7
    g.rotation.z = Math.sin(t * 0.22 + 0.8) * 0.05
  })
  return (
    <group ref={ref} position={[9, -20, -12]} rotation={[0, -0.55, 0]}>
      <mesh geometry={geometry} material={material} />
    </group>
  )
}

/** Stylized mermaid silhouette in the sunken city. Tail undulates in the shader. */
export function Mermaid() {
  const geometry = useMermaidGeometry()
  const material = useMaterial({ deform: 'mermaid', rim: '#FFB3D1', rimStrength: 0.6 })
  const ref = useRef<Group>(null)
  useFrame(({ clock }) => {
    const g = ref.current
    if (!g) return
    const t = clock.elapsedTime
    g.position.y = -44 + Math.sin(t * 0.6) * 0.35
    g.rotation.z = 0.12 + Math.sin(t * 0.6) * 0.04
  })
  return (
    <group ref={ref} position={[-3.5, -44, -1]} rotation={[0, 0.9, 0.12]} scale={1.5}>
      <mesh geometry={geometry} material={material} />
    </group>
  )
}

/** Schools of small fish circling a few centres along the dive. */
export function Fish({ count = 160 }: { count?: number }) {
  const { fish: geometry } = usePropGeometries()
  const material = useMaterial({ rimStrength: 0.35 })
  const ref = useRef<InstancedMesh>(null)
  const school = useMemo(() => {
    const rnd = mulberry32(5)
    const centres: [number, number, number][] = [
      [2, -10, -4],
      [12, -24, -8],
      [-6, -48, -12],
      [4, -66, -30],
    ]
    return Array.from({ length: count }, (_, i) => ({
      c: centres[i % centres.length],
      r: 2 + rnd() * 5,
      y: (rnd() - 0.5) * 3,
      speed: (0.2 + rnd() * 0.25) * (i % 7 === 0 ? -1 : 1),
      phase: rnd() * Math.PI * 2,
      s: 1.2 + rnd() * 1.2,
    }))
  }, [count])

  useFrame(({ clock }) => {
    const m = ref.current
    if (!m) return
    const t = clock.elapsedTime
    for (let i = 0; i < school.length; i++) {
      const f = school[i]
      const a = f.phase + t * f.speed
      dummy.position.set(f.c[0] + Math.cos(a) * f.r, f.c[1] + f.y + Math.sin(a * 2) * 0.3, f.c[2] + Math.sin(a) * f.r)
      // nose is +X: face along the tangent of the circle
      dummy.rotation.set(0, -a - (f.speed > 0 ? Math.PI / 2 : -Math.PI / 2), Math.sin(t * 3 + f.phase) * 0.15)
      dummy.scale.setScalar(f.s)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={ref} args={[geometry, material, count]} frustumCulled={false} />
}
