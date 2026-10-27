import { useGLTF } from '@react-three/drei'
import type { BufferGeometry, Mesh } from 'three'

// GLB assets built in Blender (see blender/*.py) and exported with Draco.
// Node names were listed with gltfjsx (`npx gltfjsx public/models/<name>.glb -t -k`); components are
// hand-written so paths respect Vite's BASE_URL and geometry can be instanced.
const BASE = import.meta.env.BASE_URL
const DRACO = `${BASE}draco/`

export const MODEL_URLS = {
  whale: `${BASE}models/whale.glb`,
  mermaid: `${BASE}models/mermaid.glb`,
  city: `${BASE}models/city.glb`,
  props: `${BASE}models/props.glb`,
} as const

type Nodes<K extends string> = { nodes: Record<K, Mesh> }

export type CityModule =
  | 'arch_gate'
  | 'bldg_ruin'
  | 'bldg_tower'
  | 'bldg_vault'
  | 'pillar'
  | 'pillar_broken'
  | 'stairs'
  | 'wall_curve'
export type PropModule = 'coral' | 'fish' | 'piano' | 'rock' | 'seaweed' | 'white_table' | 'white_wall'

function useModel<K extends string>(url: string) {
  return useGLTF(url, DRACO) as unknown as Nodes<K>
}

export function useWhaleGeometry(): BufferGeometry {
  return useModel<'Whale'>(MODEL_URLS.whale).nodes.Whale.geometry
}

export function useMermaidGeometry(): BufferGeometry {
  return useModel<'Mermaid'>(MODEL_URLS.mermaid).nodes.Mermaid.geometry
}

export function useCityGeometries(): Record<CityModule, BufferGeometry> {
  const { nodes } = useModel<CityModule>(MODEL_URLS.city)
  return Object.fromEntries(Object.entries(nodes).map(([k, m]) => [k, (m as Mesh).geometry])) as Record<
    CityModule,
    BufferGeometry
  >
}

export function usePropGeometries(): Record<PropModule, BufferGeometry> {
  const { nodes } = useModel<PropModule>(MODEL_URLS.props)
  return Object.fromEntries(Object.entries(nodes).map(([k, m]) => [k, (m as Mesh).geometry])) as Record<
    PropModule,
    BufferGeometry
  >
}

export function preloadModels() {
  for (const url of Object.values(MODEL_URLS)) useGLTF.preload(url, DRACO)
}
