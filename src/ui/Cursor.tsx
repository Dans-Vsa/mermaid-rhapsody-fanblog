import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

/**
 * A soft ring that trails the pointer and swells over interactive elements. Fine pointers only; the
 * native cursor stays visible (the ring only follows it), so nothing is lost if this fails.
 */
export function Cursor() {
  const reduced = useReducedMotion()
  const [enabled] = useState(() => matchMedia('(pointer: fine)').matches)
  const [hover, setHover] = useState(false)
  const [shown, setShown] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 })

  useEffect(() => {
    if (!enabled || reduced) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setShown(true)
      const el = e.target as Element | null
      setHover(!!el?.closest('a, button, [role="switch"], .card, .tile'))
    }
    const leave = () => setShown(false)
    addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled, reduced, x, y])

  if (!enabled || reduced) return null
  return (
    <motion.div
      className="cursor"
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      animate={{ scale: hover ? 1.9 : 1, opacity: shown ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    />
  )
}
