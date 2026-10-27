import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { lockScroll } from '../lib/scroll'

/**
 * Accessible modal: role=dialog + aria-modal, focus moves in on open and back to the opener on
 * close, Escape closes, Tab is kept inside, page scroll is frozen.
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  className,
  children,
  onKey,
}: {
  open: boolean
  onClose: () => void
  labelledBy: string
  className?: string
  children: ReactNode
  onKey?: (e: KeyboardEvent) => void
}) {
  const panel = useRef<HTMLDivElement>(null)
  const opener = useRef<Element | null>(null)

  useEffect(() => {
    if (!open) return
    opener.current = document.activeElement
    lockScroll(true)
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>('[data-autofocus], button')?.focus(), 30)
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), iframe, [tabindex="0"]')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
      onKey?.(e)
    }
    addEventListener('keydown', key)
    return () => {
      window.clearTimeout(t)
      removeEventListener('keydown', key)
      lockScroll(false)
      ;(opener.current as HTMLElement | null)?.focus?.()
    }
  }, [open, onClose, onKey])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={`modal ${className ?? ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={panel}
            className="modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
