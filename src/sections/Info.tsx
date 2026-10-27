import { useI18n } from '../content/i18n'
import { WORK } from '../content/work'
import { OTHER_WORKS } from '../content/works'
import { Reveal, T } from '../ui/Text'

export function Info() {
  const { t } = useI18n()
  const s = t.sections.info
  return (
    <section id="info" className="sec sec--info" aria-labelledby="info-title">
      <div className="info">
        <div className="sec__body">
          <Reveal>
            <p className="eyebrow">
              <span className="eyebrow__depth">280 m</span> <T>{s.eyebrow}</T>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <T as="h2" id="info-title" tabIndex={-1}>
              {s.title}
            </T>
          </Reveal>
        </div>

        <Reveal className="facts" delay={0.15}>
          <dl>
            {s.facts.map(([k, v]) => (
              <div key={k} className="facts__row">
                <T as="dt">{k}</T>
                <T as="dd">{v}</T>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="trivia" delay={0.2}>
          <T as="h3">{s.triviaTitle}</T>
          <ul role="list">
            {s.trivia.map((x, i) => (
              <li key={i}>
                <T>{x}</T>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="others" delay={0.25}>
          <T as="h3">{s.othersTitle}</T>
          <ul role="list">
            {OTHER_WORKS.map((w) => (
              <li key={w.url}>
                <a href={w.url}>
                  <span className="others__year">{w.year}</span>
                  <span className="others__title">{w.title}</span>
                  <span className="others__jp" lang="ja">
                    {w.jp}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a className="link" href={WORK.hubUrl}>
            <T>{s.hub}</T>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
