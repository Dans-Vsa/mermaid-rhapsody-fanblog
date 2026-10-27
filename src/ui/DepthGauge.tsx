import type { CSSProperties } from 'react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SECTIONS } from '../content/sections'
import { useI18n } from '../content/i18n'
import { dive } from '../lib/dive'
import { scrollToSection } from '../lib/scroll'

const MAX = SECTIONS[SECTIONS.length - 1].depth

/**
 * Depth gauge on the side of the screen. The marker and readout are written straight to the DOM
 * from the GSAP ticker (no React re-render per frame). Ticks are real buttons for keyboard users.
 */
export function DepthGauge() {
  const { t } = useI18n()
  const marker = useRef<HTMLDivElement>(null)
  const readout = useRef<HTMLSpanElement>(null)
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    let lastDepth = -1
    let lastActive = -1
    const tick = () => {
      const d = Math.round(dive.depth)
      if (d !== lastDepth) {
        lastDepth = d
        if (readout.current) readout.current.textContent = String(d).padStart(3, '0')
        if (marker.current) marker.current.style.setProperty('--y', String(dive.depth / MAX))
      }
      const active = Math.round(dive.section)
      if (active !== lastActive && list.current) {
        lastActive = active
        list.current.querySelectorAll('button').forEach((b, i) => {
          if (i === active) b.setAttribute('aria-current', 'location')
          else b.removeAttribute('aria-current')
        })
      }
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <nav className="gauge" aria-label={t.gauge.label}>
      <div className="gauge__readout" aria-hidden="true">
        <span ref={readout}>000</span>
        <small>{t.gauge.unit}</small>
      </div>
      <div className="gauge__rail">
        <div ref={marker} className="gauge__marker" aria-hidden="true" />
        <ol ref={list}>
          {SECTIONS.map((s) => (
            <li key={s.id} style={{ '--y': s.depth / MAX } as CSSProperties}>
              <button type="button" onClick={() => scrollToSection(s.id)}>
                <span className="gauge__depth">{s.depth}</span>
                <span className="gauge__name">
                  <span className="sr-only">{t.gauge.jump} </span>
                  {t.sections[s.id].name}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
