import { useI18n } from '../content/i18n'
import { WORK } from '../content/work'
import { Modal } from '../ui/Modal'
import { Nw } from '../ui/Text'

/** "Tentang" page as a dialog (deep link: #tentang / #about). */
export function About({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n()
  const a = t.about
  return (
    <Modal open={open} onClose={onClose} labelledBy="about-title" className="modal--about">
      <div className="about">
        <div className="about__bar">
          <p className="eyebrow">{t.header.unofficial}</p>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={a.close} data-autofocus>
            ×
          </button>
        </div>
        <h2 id="about-title">{a.title}</h2>
        <p className="lede">
          <Nw>{a.intro}</Nw>
        </p>
        {a.sections.map((s) => (
          <section key={s.title} className="about__block">
            <h3>{s.title}</h3>
            <p>
              <Nw>{s.body}</Nw>
            </p>
          </section>
        ))}
        <a className="pill" href={WORK.takedownUrl} target="_blank" rel="noopener noreferrer">
          {a.contact}
        </a>
      </div>
    </Modal>
  )
}
