// Stage (a) stand-ins built from primitives. Each one is replaced by a GLB component in stage (b);
// they double as the procedural fallback if an asset cannot be produced.
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DoubleSide, Group, InstancedMesh, Object3D } from 'three'
import { mulberry32 } from '../lib/random'

const dummy = new Object3D()

export function WaterSurface() {
  return (
    <mesh rotation-x={Math.PI / 2} position={[0, 0, -20]}>
      <planeGeometry args={[400, 400]} />
      <meshBasicMaterial color="#3E9DB6" side={DoubleSide} transparent opacity={0.65} />
    </mesh>
  )
}

export function Whale() {
  const ref = useRef<Group>(null)
  useFrame(({ clock }) => {
    const g = ref.current
    if (!g) return
    const t = clock.elapsedTime
    g.position.x = 9 + Math.sin(t * 0.08) * 3
    g.position.y = -20 + Math.sin(t * 0.25) * 0.6
    g.rotation.z = Math.sin(t * 0.25) * 0.04
    g.children[1].rotation.y = Math.sin(t * 0.9) * 0.35
  })
  return (
    <group ref={ref} position={[9, -20, -12]} rotation-y={-0.5}>
      <mesh rotation-z={Math.PI / 2} scale={[1, 1, 0.8]}>
        <capsuleGeometry args={[2.4, 10, 6, 16]} />
        <meshToonMaterial color="#123F5A" />
      </mesh>
      <group position={[-7.5, 0, 0]}>
        <mesh rotation-z={Math.PI / 2} position={[-1.2, 0, 0]} scale={[1, 0.25, 1]}>
          <coneGeometry args={[2.2, 2.6, 3]} />
          <meshToonMaterial color="#0E3349" />
        </mesh>
      </group>
    </group>
  )
}

export function Mermaid() {
  const ref = useRef<Group>(null)
  useFrame(({ clock }) => {
    const g = ref.current
    if (!g) return
    const t = clock.elapsedTime
    g.position.y = -46 + Math.sin(t * 0.7) * 0.4
    g.children[1].rotation.x = Math.sin(t * 1.6) * 0.3
  })
  return (
    <group ref={ref} position={[-4, -46, -8]} rotation-z={0.15}>
      <mesh position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.35, 1, 4, 10]} />
        <meshToonMaterial color="#EDE6D6" />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <coneGeometry args={[0.38, 2.2, 8]} />
        <meshToonMaterial color="#FF6FAE" />
      </mesh>
    </group>
  )
}

/** Drowned buildings, pillars and arches around the city keyframes. */
export function SunkenCity() {
  const buildings = useRef<InstancedMesh>(null)
  const pillars = useRef<InstancedMesh>(null)
  const B = 70
  const P = 28

  useLayoutEffect(() => {
    const rnd = mulberry32(26)
    for (let i = 0; i < B; i++) {
      const a = rnd() * Math.PI * 2
      const r = 10 + rnd() * 34
      const h = 4 + rnd() * 18
      const w = 2 + rnd() * 4
      // keep a clear corridor along the camera path (x near 0)
      let x = Math.cos(a) * r
      if (Math.abs(x) < 11) x = Math.sign(x || 1) * (11 + rnd() * 6)
      dummy.position.set(x, -88 + h / 2 + rnd() * 2, -30 + Math.sin(a) * r)
      dummy.rotation.set((rnd() - 0.5) * 0.12, rnd() * Math.PI, (rnd() - 0.5) * 0.12)
      dummy.scale.set(w, h, w * (0.7 + rnd() * 0.6))
      dummy.updateMatrix()
      buildings.current!.setMatrixAt(i, dummy.matrix)
    }
    buildings.current!.instanceMatrix.needsUpdate = true
    for (let i = 0; i < P; i++) {
      const side = i % 2 ? 1 : -1
      dummy.position.set(side * (6 + rnd() * 3), -78, -10 - i * 2.4)
      dummy.rotation.set(0, 0, (rnd() - 0.5) * (i % 5 === 0 ? 0.5 : 0.05))
      dummy.scale.set(1, 10 + rnd() * 4, 1)
      dummy.updateMatrix()
      pillars.current!.setMatrixAt(i, dummy.matrix)
    }
    pillars.current!.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <group>
      <instancedMesh ref={buildings} args={[undefined, undefined, B]}>
        <boxGeometry />
        <meshToonMaterial color="#2C6F86" />
      </instancedMesh>
      <instancedMesh ref={pillars} args={[undefined, undefined, P]}>
        <cylinderGeometry args={[0.6, 0.7, 1, 10]} />
        <meshToonMaterial color="#C9D6D2" />
      </instancedMesh>
      {/* arch gate leading into the plaza */}
      <mesh position={[0, -70, -20]}>
        <torusGeometry args={[6, 0.8, 8, 24, Math.PI]} />
        <meshToonMaterial color="#C9D6D2" />
      </mesh>
      {/* the white wall and table: composition reference */}
      <mesh position={[-8, -60, -36]}>
        <boxGeometry args={[14, 8, 0.6]} />
        <meshToonMaterial color="#EDEDE6" />
      </mesh>
      <mesh position={[-6, -63.4, -33]}>
        <boxGeometry args={[3, 0.2, 1.6]} />
        <meshToonMaterial color="#EDEDE6" />
      </mesh>
      {/* the piano on the plaza */}
      <group position={[0, -82, -44]} rotation-y={0.5}>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[3, 1, 4]} />
          <meshToonMaterial color="#0A0F14" />
        </mesh>
        <mesh position={[0, 2.2, -0.6]} rotation-x={-0.6}>
          <boxGeometry args={[2.9, 0.08, 3]} />
          <meshToonMaterial color="#0A0F14" />
        </mesh>
      </group>
    </group>
  )
}

export function Seabed() {
  const rocks = useRef<InstancedMesh>(null)
  const R = 60
  useLayoutEffect(() => {
    const rnd = mulberry32(17)
    for (let i = 0; i < R; i++) {
      dummy.position.set((rnd() - 0.5) * 120, -90, -30 + (rnd() - 0.5) * 100)
      dummy.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3)
      const s = 0.6 + rnd() * 2.6
      dummy.scale.set(s, s * 0.6, s)
      dummy.updateMatrix()
      rocks.current!.setMatrixAt(i, dummy.matrix)
    }
    rocks.current!.instanceMatrix.needsUpdate = true
  }, [])
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -90, -30]}>
        <planeGeometry args={[300, 300]} />
        <meshToonMaterial color="#0A3448" />
      </mesh>
      <instancedMesh ref={rocks} args={[undefined, undefined, R]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshToonMaterial color="#1D4E5E" />
      </instancedMesh>
    </group>
  )
}

/** Small fish schools orbiting a few centres. */
export function Fish({ count = 160 }: { count?: number }) {
  const ref = useRef<InstancedMesh>(null)
  const fish = useMemo(() => {
    const rnd = mulberry32(5)
    const centres: [number, number, number][] = [
      [2, -10, -4],
      [10, -24, -10],
      [-6, -48, -12],
      [4, -66, -30],
    ]
    return Array.from({ length: count }, (_, i) => {
      const c = centres[i % centres.length]
      return {
        c,
        r: 2 + rnd() * 5,
        y: (rnd() - 0.5) * 3,
        speed: (0.2 + rnd() * 0.25) * (i % 7 === 0 ? -1 : 1),
        phase: rnd() * Math.PI * 2,
        s: 0.12 + rnd() * 0.12,
      }
    })
  }, [count])

  useFrame(({ clock }) => {
    const m = ref.current
    if (!m) return
    const t = clock.elapsedTime
    for (let i = 0; i < fish.length; i++) {
      const f = fish[i]
      const a = f.phase + t * f.speed
      dummy.position.set(f.c[0] + Math.cos(a) * f.r, f.c[1] + f.y + Math.sin(a * 2) * 0.3, f.c[2] + Math.sin(a) * f.r)
      dummy.rotation.set(0, -a + (f.speed > 0 ? 0 : Math.PI), Math.PI / 2)
      dummy.scale.setScalar(f.s)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <coneGeometry args={[0.6, 2.4, 4]} />
      <meshToonMaterial color="#BFEFF5" />
    </instancedMesh>
  )
}
