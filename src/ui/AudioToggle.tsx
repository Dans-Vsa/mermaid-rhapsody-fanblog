import { useEffect, useState } from 'react'
import { useI18n } from '../content/i18n'
import { disposeAmbience, setAmbience } from '../lib/ambience'

/** Sea ambience, OFF by default. The icon shows the current state; the label says the action. */
export function AudioToggle() {
  const { t } = useI18n()
  const [on, setOn] = useState(false)
  useEffect(() => () => disposeAmbience(), [])

  return (
    <button
      type="button"
      className="icon-btn"
      aria-pressed={on}
      aria-label={on ? t.header.soundOff : t.header.soundOn}
      title={on ? t.header.soundOff : t.header.soundOn}
      onClick={() => {
        const next = !on
        setOn(next)
        void setAmbience(next)
      }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
        {on ? (
          <>
            <path d="M15.5 9.2c.9.8 1.4 1.8 1.4 2.8s-.5 2-1.4 2.8" />
            <path d="M18 7c1.5 1.4 2.3 3.1 2.3 5s-.8 3.6-2.3 5" />
          </>
        ) : (
          <path d="M16 9.5l5 5M21 9.5l-5 5" />
        )}
      </svg>
    </button>
  )
}
