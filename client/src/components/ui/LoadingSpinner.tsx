import React, { memo } from 'react'
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export const LoadingSpinner = memo(({ size = 'md', message }: LoadingSpinnerProps) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className={[sizes[size], 'rounded-full border-2 border-canvas-border border-t-primary-500'].join(' ')}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
      />
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'
