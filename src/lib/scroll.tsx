import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis, type LenisRef } from 'lenis/react'
import { anchorOf, dive, measureAnchors, updateDive } from './dive'
import { SECTIONS } from '../content/sections'

gsap.registerPlugin(ScrollTrigger)

// Lenis scrolls the window itself, so native scroll events (and ScrollTrigger) keep working.
let lenisRefGlobal: RefObject<LenisRef | null> | null = null

/**
 * Smooth scroll (Lenis driven by the GSAP ticker, per Lenis docs) + the dive tracker.
 * With reduced motion Lenis is skipped and native scroll drives the same tracker.
 */
export function ScrollProvider({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    lenisRefGlobal = lenisRef
    dive.reducedMotion = reduced
    const onResize = () => {
      measureAnchors()
      ScrollTrigger.refresh()
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(document.body)

    const onPointer = (e: PointerEvent) => {
      dive.pointer.x = (e.clientX / innerWidth) * 2 - 1
      dive.pointer.y = -((e.clientY / innerHeight) * 2 - 1)
    }
    addEventListener('pointermove', onPointer, { passive: true })

    const root = document.documentElement
    const tick = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000)
      updateDive(scrollY)
      root.style.setProperty('--dive', dive.progress.toFixed(4))
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      ro.disconnect()
      removeEventListener('pointermove', onPointer)
      gsap.ticker.remove(tick)
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
