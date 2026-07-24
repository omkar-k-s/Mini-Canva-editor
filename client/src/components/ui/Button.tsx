import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass'
type Size = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
  children?: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-primary-600 hover:bg-primary-500 text-white shadow-glow-purple border border-primary-500/20',
  secondary: 'bg-editor-input hover:bg-canvas-hover text-slate-900 border border-canvas-border',
  ghost:     'bg-transparent hover:bg-canvas-hover text-slate-600 hover:text-slate-900',
  danger:    'bg-accent-red/20 hover:bg-accent-red/30 text-accent-red border border-accent-red/30',
  glass:     'bg-white/50 hover:bg-white/70 text-slate-900 border border-white/20 backdrop-blur-sm',
}

const sizeClasses: Record<Size, string> = {
  xs: 'h-6 px-2 text-xs rounded-md gap-1',
  sm: 'h-8 px-3 text-sm rounded-lg gap-1.5',
  md: 'h-9 px-4 text-sm rounded-xl gap-2',
  lg: 'h-11 px-6 text-base rounded-xl gap-2',
}

/**
 * Reusable Button with Framer Motion tap animation.
 * Memoized to prevent re-renders from parent state changes.
 */
export const Button = memo(
  ({
    variant = 'secondary',
    size = 'md',
    loading = false,
    icon,
    children,
    disabled,
    className,
    ...props
  }: ButtonProps) => {
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex items-center justify-center font-medium transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {loading ? (
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
