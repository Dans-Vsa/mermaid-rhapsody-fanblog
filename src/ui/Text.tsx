import { Fragment, type ElementType, type ReactNode } from 'react'
import * as m from 'motion/react-m'
import { useI18n } from '../content/i18n'

const SPLIT = /(\d+-\d+)/
const TOKEN = /^\d+-\d+$/

/** Keeps tokens like "17-26" or "22-26" from breaking at the hyphen. */
export function Nw({ children }: { children: string }) {
  const parts = children.split(SPLIT)
  return (
    <>
      {parts.map((p, i) =>
        TOKEN.test(p) ? (
          <span key={i} className="nw">
            {p}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  )
}

/**
 * Text that softly crossfades when the language changes (keyed on the language, opacity only so it
 * never shifts layout).
 */
export function T({ children, as = 'span', className, id, tabIndex }: { children: string; as?: ElementType; className?: string; id?: string; tabIndex?: number }) {
  const { lang } = useI18n()
  const Tag = as
  return (
    <Tag className={className} id={id} tabIndex={tabIndex}>
      <m.span key={lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
        <Nw>{children}</Nw>
      </m.span>
    </Tag>
  )
}

/** Fades and lifts its children in once, the first time they enter the viewport. */
export function Reveal({ children, delay = 0, className, as = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'p' | 'section' }) {
  const M = m[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </M>
  )
}
