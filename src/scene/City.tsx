import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { BufferGeometry, InstancedMesh, Material, Object3D } from 'three'
import { mulberry32 } from '../lib/random'
import { makeToonMaterial } from './materials'
import { useCityGeometries, usePropGeometries, type CityModule } from './models/assets'

// Layout of the drowned city in world units (1 unit = 1 m). Seabed at y = -90, the camera path runs
// down x ~ 0 (see keyframes.ts), so buildings keep a clear corridor around it.
const FLOOR = -90
const dummy = new Object3D()

type Placement = { p: [number, number, number]; ry: number; s: number; tilt?: number }

// Where the camera rests at the seabed keyframe (x, z): nothing tall may stand this close.
const SEABED_VIEW: [number, number] = [5, -64]
function nearSeabedView(x: number, z: number, r: number) {
  return Math.hypot(x - SEABED_VIEW[0], z - SEABED_VIEW[1]) < r
}

function useMaterial(...args: Parameters<typeof makeToonMaterial>) {
  const mat = useMemo(() => makeToonMaterial(...args), []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => mat.dispose(), [mat])
  return mat
}

function Instanced({ geometry, material, items }: { geometry: BufferGeometry; material: Material; items: Placement[] }) {
  const ref = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    const m = ref.current!
    items.forEach((it, i) => {
      dummy.position.set(...it.p)
      dummy.rotation.set(it.tilt ?? 0, it.ry, (it.tilt ?? 0) * 0.6)
      dummy.scale.setScalar(it.s)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    })
    m.instanceMatrix.needsUpdate = true
    m.computeBoundingSphere()
  }, [items])
  return <instancedMesh ref={ref} args={[geometry, material, items.length]} />
}

function cityLayout(): Record<CityModule, Placement[]> {
  const rnd = mulberry32(26)
  const out: Record<CityModule, Placement[]> = {
    bldg_tower: [],
    bldg_vault: [],
    bldg_ruin: [],
    wall_curve: [],
    pillar: [],
    pillar_broken: [],
    stairs: [],
    arch_gate: [],
  }
  // buildings in a loose ring around the plaza
  const kinds: CityModule[] = ['bldg_tower', 'bldg_tower', 'bldg_vault', 'bldg_ruin', 'bldg_ruin']
  for (let i = 0; i < 64; i++) {
    const a = rnd() * Math.PI * 2
    const r = 14 + rnd() * 42
    let x = Math.cos(a) * r
    if (Math.abs(x) < 12) x = Math.sign(x || 1) * (12 + rnd() * 6)
    const z = -34 + Math.sin(a) * r
    if (nearSeabedView(x, z, 26)) continue
    const kind = kinds[Math.floor(rnd() * kinds.length)]
    const s = kind === 'bldg_tower' ? 1.3 + rnd() * 1.3 : 1.1 + rnd() * 0.9
    out[kind].push({ p: [x, FLOOR, z], ry: Math.round(rnd() * 4) * (Math.PI / 2) + (rnd() - 0.5) * 0.2, s, tilt: (rnd() - 0.5) * 0.08 })
  }
  // curved walls framing the corridor
  for (let i = 0; i < 6; i++) {
    const side = i % 2 ? 1 : -1
    out.wall_curve.push({ p: [side * (10 + rnd() * 4), FLOOR, -8 - i * 9], ry: side > 0 ? Math.PI : 0, s: 1.4 })
  }
  // colonnade along the path down to the plaza
  for (let i = 0; i < 14; i++) {
    const side = i % 2 ? 1 : -1
    const broken = rnd() < 0.35
    out[broken ? 'pillar_broken' : 'pillar'].push({
      p: [side * 7.5, FLOOR, -6 - Math.floor(i / 2) * 5.5],
      ry: rnd() * Math.PI,
      s: 1.6,
      tilt: broken ? (rnd() - 0.5) * 0.25 : 0,
    })
  }
  out.arch_gate.push({ p: [0, FLOOR, -10], ry: 0, s: 2.6 })
  // steps rise toward -z (rotated half a turn) and end at the plaza edge (z = -37)
  out.stairs.push({ p: [0, FLOOR, -29.8], ry: Math.PI, s: 2.4 })
  return out
}

/** Instanced sunken city, the raised plaza with the piano, and the white wall + table on a rooftop. */
export function SunkenCity() {
  const geos = useCityGeometries()
  const props = usePropGeometries()
  const stone = useMaterial({ rimStrength: 0.4 })
  const plazaMat = useMaterial({ color: '#9FB8BA', rimStrength: 0.25, caustics: 0.7 })
  const layout = useMemo(cityLayout, [])

  return (
    <group>
      {(Object.keys(layout) as CityModule[]).map((k) =>
        layout[k].length ? <Instanced key={k} geometry={geos[k]} material={stone} items={layout[k]} /> : null,
      )}

      {/* raised plaza the stairs lead up to; the piano stands on it */}
      <mesh position={[0, FLOOR + 3.5, -46]} material={plazaMat}>
        <boxGeometry args={[18, 7, 18]} />
      </mesh>
      <mesh geometry={props.piano} material={stone} position={[0, FLOOR + 7, -44]} rotation={[0, 0.5, 0]} scale={1.6} />

      {/* tower whose roof holds the white wall and table (composition reference) */}
      <mesh geometry={geos.bldg_tower} material={stone} position={[-8, FLOOR, -36]} scale={[1.6, 1.86, 1.6]} />
      <group position={[-8, FLOOR + 14.5 * 1.86, -36]}>
        <mesh geometry={props.white_wall} material={stone} position={[0, 0, -2.6]} scale={[0.42, 0.5, 0.5]} />
        <mesh geometry={props.white_table} material={stone} position={[0.6, 0, 0.4]} rotation={[0, 0.25, 0]} />
      </group>
    </group>
  )
}

/** Sand, rocks, coral and swaying seaweed. */
export function Seabed() {
  const g = usePropGeometries()
  const plain = useMaterial({ rimStrength: 0.3 })
  const weed = useMaterial({ deform: 'seaweed', rim: '#7FE0B0', rimStrength: 0.35 })
  const sand = useMaterial({ color: '#0C3A4C', rimStrength: 0, caustics: 0.9 })
  const { rocks, corals, weeds } = useMemo(() => {
    const rnd = mulberry32(17)
    const scatter = (n: number, spread: number, s0: number, s1: number): Placement[] =>
      Array.from({ length: n }, () => {
        let x = (rnd() - 0.5) * spread
        if (Math.abs(x) < 3) x += Math.sign(x || 1) * 3
        let z = -36 + (rnd() - 0.5) * spread
        // push anything that would sit right in front of the seabed camera further back
        if (nearSeabedView(x, z, 14)) z -= 22
        return { p: [x, FLOOR, z], ry: rnd() * Math.PI * 2, s: s0 + rnd() * (s1 - s0) }
      })
    return { rocks: scatter(70, 130, 0.8, 3.2), corals: scatter(40, 90, 0.8, 2.2), weeds: scatter(140, 110, 0.7, 1.6) }
  }, [])

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR, -36]} material={sand}>
        <planeGeometry args={[320, 320]} />
      </mesh>
      <Instanced geometry={g.rock} material={plain} items={rocks} />
      <Instanced geometry={g.coral} material={plain} items={corals} />
      <Instanced geometry={g.seaweed} material={weed} items={weeds} />
    </group>
  )
}
