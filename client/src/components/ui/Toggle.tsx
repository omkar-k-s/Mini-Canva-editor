import React, { memo } from 'react'
import { motion } from 'framer-motion'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  size?: 'sm' | 'md'
}

/**
 * Animated toggle switch.
 */
export const Toggle = memo(({ checked, onChange, label, size = 'md' }: ToggleProps) => {
  const sizes = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translateX: 16 },
    md: { track: 'w-10 h-5', thumb: 'w-4 h-4', translateX: 20 },
  }
  const s = sizes[size]

  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative flex items-center rounded-full transition-colors duration-200 p-0.5',
          s.track,
          checked ? 'bg-primary-600' : 'bg-canvas-border',
        ].join(' ')}
      >
        <motion.span
          className={['block rounded-full bg-white shadow', s.thumb].join(' ')}
          animate={{ x: checked ? s.translateX - (size === 'sm' ? 12 : 16) : 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        />
      </button>
      {label && <span className="text-xs text-slate-600">{label}</span>}
    </label>
  )
})

Toggle.displayName = 'Toggle'
