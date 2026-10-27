import { SECTIONS } from '../content/sections'

// Single mutable source of truth for the dive. Written once per frame by the scroll tracker,
// read by the 3D camera (useFrame) and the depth gauge. Never put this in React state.
export const dive = {
  /** 0 .. SECTIONS.length - 1, fractional between sections */
  section: 0,
  /** 0 .. 1 over the whole page */
  progress: 0,
  /** gauge reading in metres */
  depth: 0,
  /** pointer in -1 .. 1, y up */
  pointer: { x: 0, y: 0 },
  reducedMotion: false,
}

let anchors: number[] = []

/** Scroll position at which each section is centred in the viewport, clamped to the page. */
export function measureAnchors() {
  const max = document.documentElement.scrollHeight - innerHeight
  anchors = SECTIONS.map(({ id }) => {
    const el = document.getElementById(id)
    if (!el) return 0
    const top = el.getBoundingClientRect().top + scrollY
    return Math.min(max, Math.max(0, top + el.offsetHeight / 2 - innerHeight / 2))
  })
}

export function updateDive(scroll: number) {
  if (!anchors.length) measureAnchors()
  const n = anchors.length
  let s = n - 1
  for (let i = 0; i < n - 1; i++) {
    if (scroll < anchors[i + 1]) {
      const span = anchors[i + 1] - anchors[i] || 1
      s = i + Math.min(1, Math.max(0, (scroll - anchors[i]) / span))
      break
    }
  }
  dive.section = s
  const max = document.documentElement.scrollHeight - innerHeight
  dive.progress = max > 0 ? scroll / max : 0
  const i = Math.floor(s)
  const a = SECTIONS[i].depth
  const b = SECTIONS[Math.min(n - 1, i + 1)].depth
  dive.depth = a + (b - a) * (s - i)
}

/** Section index whose anchor is nearest, used by the gauge and reduced motion. */
export function anchorOf(index: number) {
  if (!anchors.length) measureAnchors()
  return anchors[index] ?? 0
}
