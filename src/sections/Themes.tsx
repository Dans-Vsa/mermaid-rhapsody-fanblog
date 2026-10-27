import { useI18n } from '../content/i18n'
import { Spoiler, SpoilerToggle } from '../ui/Spoiler'
import { Reveal, T } from '../ui/Text'

export function Themes() {
  const { t } = useI18n()
  const s = t.sections.themes
  return (
    <section id="themes" className="sec sec--themes" aria-labelledby="themes-title">
      <div className="themes">
        <div className="sec__body">
          <Reveal>
            <p className="eyebrow">
              <span className="eyebrow__depth">170 m</span> <T>{s.eyebrow}</T>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <T as="h2" id="themes-title" tabIndex={-1}>
              {s.title}
            </T>
          </Reveal>
          <Reveal delay={0.2}>
            <T as="p">{s.body}</T>
          </Reveal>
          <Reveal delay={0.3}>
            <SpoilerToggle />
          </Reveal>
        </div>
        <ol className="notes" role="list">
          {s.items.map((item, i) => (
            <Reveal as="li" key={i} delay={i * 0.12} className={`note note--${i}`}>
              <span className="note__num" aria-hidden="true">
                {['壱', '弐', '参'][i]}
              </span>
              <Spoiler>
                <T as="h3">{item.title}</T>
                <T as="p">{item.body}</T>
              </Spoiler>
            </Reveal>
          ))}
        </ol>
        <Reveal>
          <T as="p" className="aside">
            {s.more}
          </T>
        </Reveal>
      </div>
    </section>
  )
}
