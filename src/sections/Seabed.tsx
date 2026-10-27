import { useI18n } from '../content/i18n'
import { WORK } from '../content/work'
import { scrollToSection } from '../lib/scroll'
import { Magnetic } from '../ui/Magnetic'
import { Reveal, T } from '../ui/Text'

export function Seabed({ onAbout }: { onAbout: () => void }) {
  const { t } = useI18n()
  const s = t.sections.seabed
  const f = t.footer
  return (
    <section id="seabed" className="sec sec--seabed" aria-labelledby="seabed-title">
      <div className="sec__body">
        <Reveal>
          <p className="eyebrow">
            <span className="eyebrow__depth">340 m</span> <T>{s.eyebrow}</T>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <T as="h2" id="seabed-title" tabIndex={-1}>
            {s.title}
          </T>
        </Reveal>
        <Reveal delay={0.2}>
          <T as="p">{s.body}</T>
        </Reveal>
        <Reveal delay={0.3} className="row">
          <Magnetic>
            <button type="button" className="pill" onClick={() => scrollToSection('surface')}>
              <T>{s.back}</T>
            </button>
          </Magnetic>
          <a className="link" href={WORK.hubUrl}>
            <T>{s.hub}</T>
          </a>
        </Reveal>
      </div>

      <footer className="footer">
        <p className="footer__mark" lang="ja" aria-hidden="true">
          {WORK.titleJp}
        </p>
        <T as="p" className="footer__disclaimer">
          {f.disclaimer}
        </T>
        <T as="p">{f.rights}</T>
        <nav className="footer__links" aria-label="Footer">
          <button type="button" className="link" onClick={onAbout}>
            <T>{f.about}</T>
          </button>
          <a className="link" href={WORK.takedownUrl} target="_blank" rel="noopener noreferrer">
            <T>{f.takedown}</T>
          </a>
          <a className="link" href={WORK.hubUrl}>
            Fujimoto Archive
          </a>
        </nav>
        <T as="p" className="footer__made">
          {f.made}
        </T>
      </footer>
    </section>
  )
}
