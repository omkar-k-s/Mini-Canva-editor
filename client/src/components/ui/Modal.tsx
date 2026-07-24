import React, { memo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MdClose } from 'react-icons/md'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

/**
 * Accessible modal dialog rendered via portal.
 * Traps focus and closes on Escape.
 */
export const Modal = memo(({ isOpen, onClose, title, children, maxWidth = 'md', showCloseButton = true }: ModalProps) => {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className={[
              'fixed top-1/2 left-1/2 z-50',
              'w-full max-h-[90vh] flex flex-col bg-editor-panel border border-canvas-border rounded-2xl shadow-panel',
              maxWidthClasses[maxWidth],
            ].join(' ')}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-canvas-border">
                {title && <h2 className="text-sm font-semibold text-slate-900">{title}</h2>}
                {showCloseButton && (
                  <Button variant="ghost" size="xs" onClick={onClose} aria-label="Close modal">
                    <MdClose className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
            {/* Content */}
            <div className="flex-1 p-5 overflow-y-auto min-h-0">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
})

Modal.displayName = 'Modal'
