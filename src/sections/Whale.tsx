import { useI18n } from '../content/i18n'
import { Reveal, T } from '../ui/Text'

export function Whale() {
  const { t } = useI18n()
  const s = t.sections.whale
  return (
    <section id="whale" className="sec sec--left" aria-labelledby="whale-title">
      <div className="sec__body">
        <Reveal>
          <p className="eyebrow">
            <span className="eyebrow__depth">40 m</span> <T>{s.eyebrow}</T>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <T as="h2" id="whale-title" tabIndex={-1}>
            {s.title}
          </T>
        </Reveal>
        <Reveal delay={0.25}>
          <T as="p" className="lede">
            {s.body}
          </T>
        </Reveal>
        <Reveal delay={0.4}>
          <T as="p" className="aside">
            {s.aside}
          </T>
        </Reveal>
      </div>
    </section>
  )
}
