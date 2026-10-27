import { useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useI18n } from '../content/i18n'
import { CLIP_STILLS, TRAILERS, type Still } from '../content/media'
import { dive } from '../lib/dive'
import { StillArt } from '../ui/StillArt'
import { Reveal, T } from '../ui/Text'

type CharId = 'toshihide' | 'shiju'
const CHARS: CharId[] = ['toshihide', 'shiju']

/** Sunken city: character cards (synced with the 3D mermaid) and the "Clips" window. */
export function City() {
  const { t } = useI18n()
  const s = t.sections.city
  return (
    <section id="city" className="sec sec--city" aria-labelledby="city-title">
      <div className="city__chars">
        <div className="sec__body">
          <Reveal>
            <p className="eyebrow">
              <span className="eyebrow__depth">120 m</span> <T>{s.eyebrow}</T>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <T as="h2" id="city-title" tabIndex={-1}>
              {s.title}
            </T>
          </Reveal>
          <Reveal delay={0.2}>
            <T as="p">{s.body}</T>
          </Reveal>
        </div>
        <LayoutGroup>
          <ul className="cards" role="list">
            {CHARS.map((id, i) => (
              <CharacterCard key={id} id={id} index={i} />
            ))}
          </ul>
        </LayoutGroup>
      </div>
      <Clips />
    </section>
  )
}

function CharacterCard({ id, index }: { id: CharId; index: number }) {
  const { t } = useI18n()
  const s = t.sections.city
  const c = s.characters[id]
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  const bodyId = `char-${id}`

  return (
    <motion.li
      layout={!reduced}
      className={`card card--${id}${open ? ' is-open' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, delay: index * 0.15, layout: { type: 'spring', stiffness: 260, damping: 30 } }}
      onPointerEnter={() => (dive.focus = id)}
      onPointerLeave={() => (dive.focus = null)}
      onFocus={() => (dive.focus = id)}
      onBlur={() => (dive.focus = null)}
    >
      <motion.div layout="position" className="card__head">
        <span className="card__index" aria-hidden="true">
          0{index + 1}
        </span>
        <h3>{c.name}</h3>
        <T as="p" className="card__role">
          {c.role}
        </T>
      </motion.div>
      <motion.dl layout="position" className="card__facts">
        <T as="dt">{s.knownLabel}</T>
        <T as="dd">{c.known}</T>
      </motion.dl>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={bodyId}
            className="card__more"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <dl className="card__facts">
              <T as="dt">{s.appearsLabel}</T>
              <T as="dd">{s.appears}</T>
            </dl>
            <T as="p" className="card__note">
              {c.note}
            </T>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button layout="position" type="button" className="card__toggle" aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen(!open)}>
        <T>{open ? s.less : s.more}</T>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </motion.button>
    </motion.li>
  )
}

function Clips() {
  const { t, lang } = useI18n()
  const s = t.sections.clips
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // floating stills drift at different speeds (parallax); disabled with reduced motion
  const y0 = useTransform(scrollYProgress, [0, 1], [60, -90])
  const y1 = useTransform(scrollYProgress, [0, 1], [-30, 70])
  const y2 = useTransform(scrollYProgress, [0, 1], [90, -40])
  const drift = [y0, y1, y2]
  const [active, setActive] = useState(0)
  const trailer = TRAILERS[active]

  return (
    <div className="clips" ref={ref}>
      <div className="sec__body clips__intro">
        <Reveal>
          <p className="eyebrow">
            <T>{s.eyebrow}</T>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <T as="h2" id="clips-title">
            {s.title}
          </T>
        </Reveal>
        <Reveal delay={0.2}>
          <T as="p">{s.body}</T>
        </Reveal>
      </div>

      <div className="clips__stage">
        <Reveal className="window">
          <TrailerWindow key={trailer.id} youtubeId={trailer.youtubeId} title={trailer.title[lang]} />
          <div className="window__meta">
            {TRAILERS.length > 1 && (
              <div className="window__tabs" role="group" aria-label={s.eyebrow}>
                {TRAILERS.map((tr, i) => (
                  <button key={tr.id} type="button" aria-pressed={i === active} onClick={() => setActive(i)}>
                    {tr.title[lang]}
                  </button>
                ))}
              </div>
            )}
            <T as="p" className="caption">
              {trailer.caption[lang]}
            </T>
            <p className="credit">
              {s.credit}: {trailer.credit} ·{' '}
              <a href={trailer.source.url} target="_blank" rel="noopener noreferrer">
                {trailer.source.label}
              </a>
            </p>
          </div>
        </Reveal>

        {CLIP_STILLS.map((still, i) => (
          <motion.figure
            key={still.id}
            className={`float float--${i}`}
            style={reduced ? undefined : { y: drift[i] }}
            tabIndex={0}
          >
            <StillArt still={still} />
            <FloatCaption still={still} soon={s.stillSoon} />
          </motion.figure>
        ))}
      </div>
    </div>
  )
}

function FloatCaption({ still, soon }: { still: Still; soon: string }) {
  const { lang } = useI18n()
  return (
    <figcaption className="float__caption">
      <strong>{still.caption[lang]}</strong>
      <span>{still.src ? still.note[lang] : soon}</span>
      <small>{still.credit}</small>
    </figcaption>
  )
}

/** Click-to-load facade: nothing is requested from YouTube until the reader presses play. */
function TrailerWindow({ youtubeId, title }: { youtubeId: string; title: string }) {
  const { t } = useI18n()
  const [playing, setPlaying] = useState(false)
  if (playing) {
    return (
      <div className="window__frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    )
  }
  return (
    <div className="window__frame window__frame--poster">
      <button type="button" className="window__play" onClick={() => setPlaying(true)} data-autofocus>
        <span className="window__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
          </svg>
        </span>
        <span>
          {t.sections.clips.play}: {title}
        </span>
      </button>
      <p className="window__consent">{t.sections.clips.consent}</p>
    </div>
  )
}
