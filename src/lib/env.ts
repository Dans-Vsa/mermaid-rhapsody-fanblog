export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion() {
  return matchMedia(reducedMotionQuery).matches
}

/** Coarse pointer + small screen: treat as phone for quality decisions. */
export function isLowPowerDevice() {
  return matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 820
}
