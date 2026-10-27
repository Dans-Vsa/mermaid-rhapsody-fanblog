import { Color, Vector3 } from 'three'

// One camera keyframe per section in content/sections.ts (same order).
// pos: where the camera floats, look: what it looks at, water: fog/background tint at that depth.
export const KEYFRAMES = [
  // surface: just under the water, tilted up toward the light
  { pos: [0, -3, 12], look: [0, 1.5, -10], water: '#0F6F8E', fog: 0.02 },
  // whale: drifting past its flank
  { pos: [-4, -15, 6], look: [7, -19, -8], water: '#0C5E7E', fog: 0.024 },
  // sunken city: rooftops come into view
  { pos: [3, -40, 10], look: [0, -50, -14], water: '#0B4F6C', fog: 0.028 },
  // themes: between the towers
  { pos: [-7, -52, -2], look: [5, -55, -22], water: '#093F5A', fog: 0.032 },
  // gallery: along the white wall
  { pos: [6, -60, -14], look: [-5, -62, -32], water: '#07304A', fog: 0.036 },
  // info: over the plaza with the piano
  { pos: [0, -70, -26], look: [0, -78, -42], water: '#05243B', fog: 0.04 },
  // seabed
  { pos: [5, -82, -64], look: [-3, -89, -86], water: '#031627', fog: 0.046 },
].map((k) => ({
  pos: new Vector3(...(k.pos as [number, number, number])),
  look: new Vector3(...(k.look as [number, number, number])),
  water: new Color(k.water),
  fog: k.fog,
}))
