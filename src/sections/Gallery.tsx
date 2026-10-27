import { useCallback, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useI18n } from '../content/i18n'
import { STILLS } from '../content/media'
import { Modal } from '../ui/Modal'
import { StillArt } from '../ui/StillArt'
import { Reveal, T } from '../ui/Text'

/** Asymmetric gallery (no uniform grid) + lightbox. No download affordance. */
export function Gallery() {
  const { t, lang } = useI18n()
  const s = t.sections.gallery
  const [index, setIndex] = useState<number | null>(null)
  const close = useCallback(() => setIndex(null), [])
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + STILLS.length) % STILLS.length)), [])
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    },
    [step],
  )
  const current = index === null ? null : STILLS[index]

  return (
    <section id="gallery" className="sec sec--gallery" aria-labelledby="gallery-title">
      <div className="gallery">
        <div className="sec__body">
          <Reveal>
            <p className="eyebrow">
              <span className="eyebrow__depth">220 m</span> <T>{s.eyebrow}</T>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <T as="h2" id="gallery-title" tabIndex={-1}>
              {s.title}
            </T>
          </Reveal>
          <Reveal delay={0.2}>
            <T as="p">{s.body}</T>
          </Reveal>
        </div>
        <ul className="tiles" role="list">
          {STILLS.map((still, i) => (
            <Reveal as="li" key={still.id} delay={i * 0.08} className={`tile tile--${i}`}>
              <button type="button" className="tile__btn" onClick={() => setIndex(i)} aria-label={`${s.open}: ${still.caption[lang]}`}>
                <StillArt still={still} />
              </button>
              <p className="tile__caption">
                <span className="tile__num">{String(i + 1).padStart(2, '0')}</span> {still.caption[lang]}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>

      <Modal open={current !== null} onClose={close} labelledBy="lightbox-caption" className="modal--lightbox" onKey={onKey}>
        {current && (
          <>
            <div className="lightbox__bar">
              <span className="lightbox__count">
                {index! + 1} {s.of} {STILLS.length}
              </span>
              <button type="button" className="icon-btn" onClick={close} aria-label={s.close} data-autofocus>
                ×
              </button>
            </div>
            <AnimatePresence mode="wait">
              <m.figure
                key={current.id}
                className="lightbox__figure"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                onContextMenu={(e) => e.preventDefault()}
              >
                <StillArt still={current} sizes="90vw" />
                <figcaption id="lightbox-caption">
                  <strong>{current.caption[lang]}</strong>
                  <span>{current.src ? current.note[lang] : s.empty}</span>
                  <small>
                    {current.credit}
                    {current.source.url ? (
                      <>
                        {' · '}
                        <a href={current.source.url} target="_blank" rel="noopener noreferrer">
                          {current.source.label}
                        </a>
                      </>
                    ) : null}
                  </small>
                </figcaption>
              </m.figure>
            </AnimatePresence>
            <div className="lightbox__nav">
              <button type="button" className="pill pill--small" onClick={() => step(-1)}>
                ← {s.prev}
              </button>
              <button type="button" className="pill pill--small" onClick={() => step(1)}>
                {s.next} →
              </button>
            </div>
          </>
        )}
      </Modal>
    </section>
  )
}
