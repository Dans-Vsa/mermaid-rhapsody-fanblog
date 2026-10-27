import { useSyncExternalStore } from 'react'
import { reducedMotionQuery } from './env'

function subscribe(cb: () => void) {
  const mq = matchMedia(reducedMotionQuery)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => matchMedia(reducedMotionQuery).matches)
}
