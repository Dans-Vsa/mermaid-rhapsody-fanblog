// The dive, top to bottom. One entry per page section; the 3D camera has one keyframe per entry
// (see scene/keyframes.ts) and the depth gauge one tick. `depth` is the gauge reading in metres
// (artistic, not a canon value).
export const SECTIONS = [
  { id: 'surface', depth: 0 },
  { id: 'whale', depth: 40 },
  { id: 'city', depth: 120 },
  { id: 'themes', depth: 170 },
  { id: 'gallery', depth: 220 },
  { id: 'info', depth: 280 },
  { id: 'seabed', depth: 340 },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']
