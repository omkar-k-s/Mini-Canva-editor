import React, { memo, useState, useRef, useEffect } from 'react'
import { SketchPicker } from 'react-color'
import { AnimatePresence, motion } from 'framer-motion'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label?: string
}

/**
 * Compact color swatch that opens a SketchPicker popover.
 */
export const ColorPicker = memo(({ color, onChange, label }: ColorPickerProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative flex flex-col gap-1">
      {label && <span className="text-xs text-slate-500">{label}</span>}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-8 h-8 rounded-lg border-2 border-canvas-border hover:border-primary-500 transition-colors shadow-inner"
        style={{ backgroundColor: color }}
        aria-label={`Pick color — current: ${color}`}
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-10 left-0 z-[150]"
          >
            <SketchPicker
              color={color}
              onChange={(c) => onChange(c.hex)}
              disableAlpha={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

ColorPicker.displayName = 'ColorPicker'
