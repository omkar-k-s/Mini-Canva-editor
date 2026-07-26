import React, { memo, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  content: string
  children: React.ReactElement
  side?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

/**
 * Lightweight tooltip without a heavy library dependency.
 * Uses CSS positioning relative to the trigger element.
 */
export const Tooltip = memo(({ content, children, side = 'top', delay = 400 }: TooltipProps) => {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delay)
  }, [delay])

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
  }, [])

  const positionClasses: Record<string, string> = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.span
            key="tip"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.1 }}
            className={[
              'absolute z-[200] pointer-events-none whitespace-nowrap',
              'bg-slate-800 text-slate-100 text-xs font-medium px-2 py-1 rounded-lg',
              'border border-white/10 shadow-lg',
              positionClasses[side],
            ].join(' ')}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
})

Tooltip.displayName = 'Tooltip'
