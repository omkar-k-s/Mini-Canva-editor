import React, { memo, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'ghost'
}

/**
 * Reusable Input with optional label, error message, and icon slots.
 */
export const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, leftIcon, rightIcon, variant = 'default', className, id, ...props }, ref) => {
      const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

      return (
        <div className="flex flex-col gap-1.5">
          {label && (
            <label htmlFor={inputId} className="text-xs font-medium text-slate-500">
              {label}
            </label>
          )}
          <div className="relative">
            {leftIcon && (
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                {leftIcon}
              </span>
            )}
            <input
              ref={ref}
              id={inputId}
              className={clsx(
                'w-full text-sm text-slate-900 placeholder:text-slate-500',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                'transition-colors duration-150',
                variant === 'default'
                  ? 'bg-editor-input border border-canvas-border rounded-lg h-9 px-3'
                  : 'bg-transparent border-b border-canvas-border rounded-none h-8 px-0',
                leftIcon  && 'pl-8',
                rightIcon && 'pr-8',
                error     && 'border-accent-red/60 focus:ring-accent-red/40',
                className
              )}
              {...props}
            />
            {rightIcon && (
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                {rightIcon}
              </span>
            )}
          </div>
          {error && <p className="text-xs text-accent-red">{error}</p>}
        </div>
      )
    }
  )
)

Input.displayName = 'Input'
