import { useSyncExternalStore } from 'react'

// Tiny store shared between the main bundle (preloader UI) and the lazy 3D chunk (which reports
// progress), so the main bundle never imports three.js just to show a loader.

export type Phase = 'idle' | 'loading' | 'ready'
let state = { phase: 'idle' as Phase, progress: 0 }
const subs = new Set<() => void>()

export function setLoading(next: Partial<typeof state>) {
  state = { ...state, ...next }
  subs.forEach((fn) => fn())
}

function subscribe(fn: () => void) {
  subs.add(fn)
  return () => {
    subs.delete(fn)
  }
}

export function useLoading() {
  return useSyncExternalStore(subscribe, () => state)
}
