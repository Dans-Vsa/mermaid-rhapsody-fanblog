import { motion } from 'motion/react'
import { LANGS, useI18n } from '../content/i18n'
import { WORK } from '../content/work'
import { AudioToggle } from './AudioToggle'

export function Header() {
  const { t, lang, setLang } = useI18n()
  return (
    <header className="header">
      <a className="skip" href="#main">
        {t.header.skip}
      </a>
      <a className="header__home" href={WORK.hubUrl}>
        <span className="header__archive">{t.header.archive}</span>
        <span className="header__tag">{t.header.unofficial}</span>
      </a>
      <div className="header__tools">
        <button type="button" className="header__about" onClick={() => dispatchEvent(new Event('mr:about'))}>
          {t.header.about}
        </button>
        <AudioToggle />
        <div className="lang" role="group" aria-label={t.header.langLabel}>
          {LANGS.map((l) => (
            <button key={l} type="button" aria-pressed={lang === l} lang={l} onClick={() => setLang(l)}>
              {lang === l && <motion.span layoutId="lang-pill" className="lang__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span className="lang__label">{l.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
