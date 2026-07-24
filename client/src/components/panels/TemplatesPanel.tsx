import React, { memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { fabric } from 'fabric'
import { TEMPLATES } from '@/constants/templates'
import { useCanvasStore } from '@/store/canvasStore'
import toast from 'react-hot-toast'
import type { CanvasTemplate } from '@/types/project.types'

/**
 * TemplatesPanel — displays a grid of built-in templates.
 * Clicking a template clears the canvas and loads its objects.
 */
const TemplatesPanel = memo(() => {
  const { canvas, setCanvasSize, setBackgroundColor } = useCanvasStore()

  const loadTemplate = useCallback((template: CanvasTemplate) => {
    if (!canvas) return

    // Confirm before clearing current work
    if (canvas.getObjects().length > 0) {
      const confirmed = window.confirm('Loading a template will replace your current design. Continue?')
      if (!confirmed) return
    }

    const toastId = toast.loading('Loading template...')

    try {
      // Update canvas dimensions
      setCanvasSize({ width: template.width, height: template.height, label: template.name })
      setBackgroundColor(template.backgroundColor)
      canvas.setWidth(template.width)
      canvas.setHeight(template.height)
      canvas.setBackgroundColor(template.backgroundColor, () => {})

      // Clear and load objects
      canvas.clear()
      canvas.setBackgroundColor(template.backgroundColor, () => {})

      // Load objects from template definition
      fabric.util.enlivenObjects(
        template.objects as fabric.Object[],
        (objects: fabric.Object[]) => {
          objects.forEach((obj) => {
            const o = obj as fabric.Object & { id?: string; name?: string }
            if (!o.id) o.id = crypto.randomUUID()
            canvas.add(obj)
          })
          canvas.requestRenderAll()
          toast.success(`"${template.name}" loaded!`, { id: toastId })
        },
        ''
      )
    } catch (err) {
      console.error('[Template Error]', err)
      toast.error('Failed to load template', { id: toastId })
    }
  }, [canvas, setCanvasSize, setBackgroundColor])

  const categoryColors: Record<string, string> = {
    social:       'bg-accent-pink/20 text-accent-pink',
    poster:       'bg-accent-purple/20 text-accent-purple',
    flyer:        'bg-accent-blue/20 text-accent-blue',
    certificate:  'bg-accent-orange/20 text-accent-orange',
    resume:       'bg-accent-green/20 text-accent-green',
    'business-card': 'bg-accent-cyan/20 text-accent-cyan',
  }

  return (
    <div className="p-3 space-y-2">
      <p className="text-xs text-slate-500 mb-3">Click a template to load it onto the canvas</p>
      {TEMPLATES.map((template) => (
        <motion.button
          key={template.id}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => loadTemplate(template)}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-editor-input hover:bg-canvas-hover border border-canvas-border hover:border-primary-500/50 transition-colors text-left"
          aria-label={`Load ${template.name} template`}
        >
          {/* Thumbnail emoji */}
          <div className="w-12 h-12 rounded-lg bg-canvas-bg flex items-center justify-center text-2xl shrink-0 border border-canvas-border">
            {template.thumbnail}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-medium text-slate-900 truncate">{template.name}</span>
              <span className={['text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0', categoryColors[template.category] || 'bg-slate-700 text-slate-600'].join(' ')}>
                {template.category}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">{template.description}</p>
            <p className="text-xs text-slate-600 mt-0.5">{template.width} × {template.height}px</p>
          </div>
        </motion.button>
      ))}
    </div>
  )
})

TemplatesPanel.displayName = 'TemplatesPanel'
export default TemplatesPanel
