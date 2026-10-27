import { useI18n } from '../content/i18n'
import { SECTIONS, type SectionId } from '../content/sections'
import { WORK } from '../content/work'
import { scrollToSection } from '../lib/scroll'

// Stage (a) skeleton: every section exists with its real anchor, copy comes from content/*.ts.
// Rich content (cards, trailer window, spoilers, gallery) lands in stage (d).

const ALIGN: Record<SectionId, 'left' | 'right' | 'centre'> = {
  surface: 'centre',
  whale: 'left',
  city: 'right',
  themes: 'left',
  gallery: 'right',
  info: 'left',
  seabed: 'centre',
}

export function Sections() {
  const { t } = useI18n()
  const s = t.sections

  return (
    <main id="main">
      <section id="surface" className="sec sec--surface" aria-labelledby="surface-title">
        <p className="kanji" aria-hidden="true">
          {WORK.titleJp}
        </p>
        <div className="sec__body">
          <p className="eyebrow">{s.surface.eyebrow}</p>
          <h1 id="surface-title" tabIndex={-1}>
            <span className="sr-only">{WORK.titleJp} </span>
            {s.surface.title}
          </h1>
          <p className="lede">{s.surface.lede}</p>
          <button type="button" className="pill" onClick={() => scrollToSection('whale')}>
            {s.surface.dive}
          </button>
        </div>
        <p className="scroll-hint" aria-hidden="true">
          {s.surface.scrollHint}
        </p>
      </section>

      {SECTIONS.slice(1, -1).map(({ id, depth }) => {
        const c = s[id] as { eyebrow: string; title: string; body: string }
        return (
          <section key={id} id={id} className={`sec sec--${ALIGN[id]}`} aria-labelledby={`${id}-title`}>
            <div className="sec__body">
              <p className="eyebrow">
                <span className="eyebrow__depth">{depth} m</span> {c.eyebrow}
              </p>
              <h2 id={`${id}-title`} tabIndex={-1}>
                {c.title}
              </h2>
              <p>{c.body}</p>
            </div>
          </section>
        )
      })}

      <section id="seabed" className="sec sec--centre sec--seabed" aria-labelledby="seabed-title">
        <div className="sec__body">
          <p className="eyebrow">
            <span className="eyebrow__depth">340 m</span> {s.seabed.eyebrow}
          </p>
          <h2 id="seabed-title" tabIndex={-1}>
            {s.seabed.title}
          </h2>
          <p>{s.seabed.body}</p>
          <div className="row">
            <button type="button" className="pill" onClick={() => scrollToSection('surface')}>
              {s.seabed.back}
            </button>
            <a className="link" href={WORK.hubUrl}>
              {s.seabed.hub}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
