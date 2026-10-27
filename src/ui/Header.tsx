import { LANGS, useI18n } from '../content/i18n'
import { WORK } from '../content/work'

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
      <div className="lang" role="group" aria-label={t.header.langLabel}>
        {LANGS.map((l) => (
          <button key={l} type="button" aria-pressed={lang === l} lang={l} onClick={() => setLang(l)}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  )
}
