import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { ReactLenis, type LenisRef } from 'lenis/react'
import { SECTIONS } from '../content/sections'
import { anchorOf, dive, measureAnchors, updateDive } from './dive'
import { addTick } from './ticker'

// Lenis scrolls the window itself, so native scroll events keep working everywhere.
let lenisRefGlobal: RefObject<LenisRef | null> | null = null

/**
 * Smooth scroll (Lenis driven by our own rAF ticker with autoRaf off, per Lenis docs) + the dive
 * tracker. With reduced motion Lenis is skipped and native scroll drives the same tracker.
 */
export function ScrollProvider({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    lenisRefGlobal = lenisRef
    dive.reducedMotion = reduced
    const ro = new ResizeObserver(() => measureAnchors())
    ro.observe(document.body)

    const onPointer = (e: PointerEvent) => {
      dive.pointer.x = (e.clientX / innerWidth) * 2 - 1
      dive.pointer.y = -((e.clientY / innerHeight) * 2 - 1)
    }
    addEventListener('pointermove', onPointer, { passive: true })

    const root = document.documentElement
    let lastProgress = -1
    const stop = addTick((time) => {
      lenisRef.current?.lenis?.raf(time)
      updateDive(scrollY)
      // only touch the style when it actually changed (avoids style recalcs every frame)
      if (Math.abs(dive.progress - lastProgress) > 0.0005) {
        lastProgress = dive.progress
        root.style.setProperty('--dive', dive.progress.toFixed(4))
      }
    })

    return () => {
      ro.disconnect()
      removeEventListener('pointermove', onPointer)
      stop()
    }
  }, [reduced])

  if (reduced) return <>{children}</>
  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.08, wheelMultiplier: 0.9 }} ref={lenisRef}>
      {children}
    </ReactLenis>
  )
}

/** Scroll to a section's camera anchor (where its keyframe sits), smooth when Lenis is active. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  measureAnchors()
  const target = anchorOf(SECTIONS.findIndex((s) => s.id === id))
  const lenis = lenisRefGlobal?.current?.lenis
  if (lenis && !dive.reducedMotion) lenis.scrollTo(target, { duration: 2.2 })
  else window.scrollTo(0, target)
  el.querySelector<HTMLElement>('h1, h2')?.focus({ preventScroll: true })
}

/** Freeze page scroll while a modal (lightbox, about) is open. */
export function lockScroll(lock: boolean) {
  const lenis = lenisRefGlobal?.current?.lenis
  if (lock) lenis?.stop()
  else lenis?.start()
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}
