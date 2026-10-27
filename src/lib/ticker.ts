// One requestAnimationFrame loop for all DOM-side per-frame work (Lenis, dive tracker, gauge).
// Replaces the GSAP ticker: same job, no 100 KB dependency.

type Tick = (timeMs: number) => void
const subs = new Set<Tick>()
let raf = 0

function loop(t: number) {
  for (const fn of subs) fn(t)
  raf = subs.size ? requestAnimationFrame(loop) : 0
}

export function addTick(fn: Tick) {
  subs.add(fn)
  if (!raf) raf = requestAnimationFrame(loop)
  return () => {
    subs.delete(fn)
  }
}
