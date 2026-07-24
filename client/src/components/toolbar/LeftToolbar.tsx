import React, { memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdOutlineRectangle,
  MdRadioButtonUnchecked,
  MdChangeHistory,
  MdHorizontalRule,
  MdTitle,
  MdTextFields,
  MdShortText,
  MdImage,
  MdNearMe,
} from 'react-icons/md'
import { BiPolygon, BiStar } from 'react-icons/bi'
import { TbArrowRight, TbOval } from 'react-icons/tb'
import { Tooltip } from '@/components/ui/Tooltip'
import { useCanvasStore, selectActiveTool } from '@/store/canvasStore'
import {
  createHeading, createSubheading, createParagraph,
} from '@/utils/fabricHelpers'
import type { ToolType } from '@/types/canvas.types'
import { uploadService } from '@/services/uploadService'
import { fabric } from 'fabric'
import { assignObjectId } from '@/utils/fabricHelpers'
import toast from 'react-hot-toast'

interface ToolItem {
  id: ToolType
  label: string
  icon: React.ReactNode
  group?: string
}

const TOOL_GROUPS: { label: string; tools: ToolItem[] }[] = [
  {
    label: 'Select',
    tools: [
      { id: 'select',    label: 'Select (V)',   icon: <MdNearMe className="w-5 h-5" /> },
    ],
  },
  {
    label: 'Shapes',
    tools: [
      { id: 'rectangle', label: 'Rectangle (R)', icon: <MdOutlineRectangle className="w-5 h-5" /> },
      { id: 'circle',    label: 'Circle (C)',    icon: <MdRadioButtonUnchecked className="w-5 h-5" /> },
      { id: 'ellipse',   label: 'Ellipse',       icon: <TbOval className="w-5 h-5" /> },
      { id: 'triangle',  label: 'Triangle',      icon: <MdChangeHistory className="w-5 h-5" /> },
      { id: 'line',      label: 'Line (L)',       icon: <MdHorizontalRule className="w-5 h-5" /> },
      { id: 'arrow',     label: 'Arrow',         icon: <TbArrowRight className="w-5 h-5" /> },
      { id: 'polygon',   label: 'Polygon',       icon: <BiPolygon className="w-5 h-5" /> },
      { id: 'star',      label: 'Star',          icon: <BiStar className="w-5 h-5" /> },
    ],
  },
  {
    label: 'Text',
    tools: [
      { id: 'text',      label: 'Heading (T)',   icon: <MdTitle className="w-5 h-5" /> },
    ],
  },
]

/**
 * Left Toolbar — vertical strip of tool icons.
 * Memoized — only re-renders when activeTool changes.
 */
const LeftToolbar = memo(() => {
  const activeTool = useCanvasStore(selectActiveTool)
  const { setActiveTool, canvas } = useCanvasStore()

  const handleImageUpload = useCallback(() => {
    if (!canvas) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const toastId = toast.loading('Adding image...')
      try {
        let src: string
        try {
          const result = await uploadService.uploadImage(file)
          src = result.url
        } catch {
          // Fallback to base64 if server unavailable
          src = await uploadService.toDataUrl(file)
        }

        fabric.Image.fromURL(src, (img) => {
          // Scale down if too large
          if (img.width && img.width > 600) {
            img.scaleToWidth(600)
          }
          img.set({ left: 100, top: 100 })
          assignObjectId(img, 'Image')
          canvas.add(img)
          canvas.setActiveObject(img)
          canvas.requestRenderAll()
        })

        toast.success('Image added!', { id: toastId })
      } catch {
        toast.error('Failed to add image', { id: toastId })
      }
    }
    input.click()
  }, [canvas])

  return (
    <aside className="w-14 bg-editor-toolbar border-r border-canvas-border flex flex-col items-center py-3 gap-1 shrink-0">
      {TOOL_GROUPS.map((group) => (
        <React.Fragment key={group.label}>
          {/* Group separator */}
          <div className="w-8 h-px bg-canvas-border my-1" />
          {group.tools.map((tool) => (
            <Tooltip key={tool.id} content={tool.label} side="right">
              <ToolButton
                active={activeTool === tool.id}
                onClick={() => setActiveTool(tool.id)}
                aria-label={tool.label}
              >
                {tool.icon}
              </ToolButton>
            </Tooltip>
          ))}
        </React.Fragment>
      ))}

      {/* Image upload */}
      <div className="w-8 h-px bg-canvas-border my-1" />
      <Tooltip content="Upload Image" side="right">
        <ToolButton
          active={activeTool === 'image'}
          onClick={handleImageUpload}
          aria-label="Upload Image"
        >
          <MdImage className="w-5 h-5" />
        </ToolButton>
      </Tooltip>
    </aside>
  )
})

LeftToolbar.displayName = 'LeftToolbar'

// ─── Tool Button ──────────────────────────────────────────────────────────────

interface ToolButtonProps {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
  'aria-label'?: string
}

const ToolButton = memo(({ active, onClick, children, 'aria-label': ariaLabel }: ToolButtonProps) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    aria-label={ariaLabel}
    className={[
      'w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-150',
      active
        ? 'bg-primary-600 text-slate-900 shadow-glow-purple'
        : 'text-slate-500 hover:text-slate-900 hover:bg-canvas-hover',
    ].join(' ')}
  >
    {children}
  </motion.button>
))

ToolButton.displayName = 'ToolButton'

export default LeftToolbar
