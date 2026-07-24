import React, { memo } from 'react'
import { clsx } from 'clsx'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  showValue?: boolean
  unit?: string
}

/**
 * Custom styled range slider for property values.
 */
export const Slider = memo(({
  value, onChange,
  min = 0, max = 100, step = 1,
  label, showValue = true, unit = '',
}: SliderProps) => {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-1">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs text-slate-500">{label}</span>}
          {showValue && (
            <span className="text-xs text-slate-600 tabular-nums">
              {Number.isInteger(value) ? value : value.toFixed(1)}{unit}
            </span>
          )}
        </div>
      )}
      <div className="relative h-5 flex items-center">
        <div className="w-full h-1.5 bg-canvas-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-none"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={clsx(
            'absolute inset-0 w-full opacity-0 cursor-pointer h-5',
            'focus:outline-none'
          )}
          aria-label={label}
        />
        {/* Thumb indicator */}
        <div
          className="absolute w-3 h-3 bg-white rounded-full shadow-md pointer-events-none -translate-x-1/2"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  )
})

Slider.displayName = 'Slider'
