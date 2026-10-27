import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useI18n } from '../content/i18n'
import { useLoading } from '../lib/loading'

const BUBBLES = 5

/**
 * Non-blocking preloader: the page is readable right away, the 3D sea streams in behind it. A small
 * column of bubbles fills like a breath being drawn in, bottom-left. Screen readers only hear the
 * start and the end, not every percent.
 */
export function Preloader() {
  const { t } = useI18n()
  const { phase, progress } = useLoading()
  const filled = Math.round((progress / 100) * BUBBLES)

  return (
    <>
      <p className="sr-only" role="status">
        {phase === 'loading' ? t.loader.status : phase === 'ready' ? t.loader.ready : ''}
      </p>
      <AnimatePresence>
        {phase === 'loading' && (
          <m.div
            className="loader"
            aria-hidden="true"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.9 } }}
          >
            <div className="loader__bubbles">
              {Array.from({ length: BUBBLES }, (_, i) => (
                <span key={i} className={`loader__bubble${BUBBLES - 1 - i < filled ? ' is-full' : ''}`} />
              ))}
            </div>
            <div className="loader__text">
              <span>{t.loader.filling}</span>
              <strong>{String(Math.round(progress)).padStart(2, '0')}%</strong>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
