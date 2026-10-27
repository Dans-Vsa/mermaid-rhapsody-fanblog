import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useI18n } from '../content/i18n'
import { WORK } from '../content/work'
import { scrollToSection } from '../lib/scroll'
import { Magnetic } from '../ui/Magnetic'
import { T } from '../ui/Text'

const ease = [0.22, 0.61, 0.36, 1] as const

export function Surface() {
  const { t } = useI18n()
  const s = t.sections.surface
  const reduced = useReducedMotion()
  const kanji = [...WORK.titleJp]

  return (
    <section id="surface" className="sec sec--surface" aria-labelledby="surface-title">
      {/* the title in kanji surfaces one character at a time, like bubbles */}
      <p className="kanji" aria-hidden="true">
        {kanji.map((ch, i) => (
          <m.span
            key={i}
            initial={{ opacity: 0, y: reduced ? 0 : 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.4, delay: 0.5 + i * 0.16, ease }}
          >
            {ch}
          </m.span>
        ))}
      </p>
      <div className="sec__body">
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 1.4 }}>
          <T as="p" className="eyebrow">
            {s.eyebrow}
          </T>
        </m.div>
        <m.h1
          id="surface-title"
          tabIndex={-1}
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 1.1, ease }}
        >
          <span className="sr-only">{WORK.titleJp} </span>
          {s.title}
        </m.h1>
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 1.9 }} className="stack">
          <T as="p" className="lede">
            {s.lede}
          </T>
          <Magnetic>
            <button type="button" className="pill" onClick={() => scrollToSection('whale')}>
              <T>{s.dive}</T>
            </button>
          </Magnetic>
        </m.div>
      </div>
      <p className="scroll-hint" aria-hidden="true">
        {s.scrollHint}
      </p>
    </section>
  )
}
