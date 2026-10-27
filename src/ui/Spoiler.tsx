import { useEffect, useId, useState, type ReactNode } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useI18n } from '../content/i18n'
import { SpoilerContext, useSpoilers } from './spoilerState'

const KEY = 'mr-spoilers'

export function SpoilerProvider({ children }: { children: ReactNode }) {
  const [revealAll, setRevealAllState] = useState(() => sessionStorage.getItem(KEY) === '1')
  const setRevealAll = (v: boolean) => {
    setRevealAllState(v)
    sessionStorage.setItem(KEY, v ? '1' : '0')
  }
  return <SpoilerContext.Provider value={{ revealAll, setRevealAll }}>{children}</SpoilerContext.Provider>
}

/**
 * Blurred until the reader opts in. While hidden the content is `inert` and aria-hidden, so it is
 * neither read out nor focusable; the reveal button carries aria-expanded/aria-controls.
 */
export function Spoiler({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  const { revealAll } = useSpoilers()
  const [open, setOpen] = useState(revealAll)
  const id = useId()
  useEffect(() => setOpen(revealAll), [revealAll])

  return (
    <div className={`spoiler${open ? ' is-open' : ''}`}>
      <m.div
        id={id}
        className="spoiler__body"
        aria-hidden={!open}
        inert={!open}
        initial={false}
        animate={{ filter: open ? 'blur(0px)' : 'blur(9px)', opacity: open ? 1 : 0.55 }}
        transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {children}
      </m.div>
      <AnimatePresence initial={false}>
        {!open && (
          <m.div className="spoiler__veil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="spoiler__label">{t.spoiler.hidden}</p>
            <button type="button" className="pill pill--small" aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)}>
              {t.spoiler.reveal}
            </button>
          </m.div>
        )}
      </AnimatePresence>
      {open && !revealAll && (
        <button type="button" className="spoiler__hide" aria-expanded={open} aria-controls={id} onClick={() => setOpen(false)}>
          {t.spoiler.hide}
        </button>
      )}
    </div>
  )
}

export function SpoilerToggle() {
  const { t } = useI18n()
  const { revealAll, setRevealAll } = useSpoilers()
  return (
    <button type="button" className="switch" role="switch" aria-checked={revealAll} onClick={() => setRevealAll(!revealAll)}>
      <span className="switch__track" aria-hidden="true">
        <m.span className="switch__thumb" layout transition={{ type: 'spring', stiffness: 500, damping: 34 }} />
      </span>
      {t.spoiler.revealAll}
    </button>
  )
}
