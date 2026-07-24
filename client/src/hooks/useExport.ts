import { useCallback } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import { exportAsImage, exportAsPdf } from '@/utils/exportHelpers'
import type { ExportOptions } from '@/types/canvas.types'
import toast from 'react-hot-toast'

/**
 * useExport — provides export functions for PNG, JPEG, and PDF.
 * PDF is dynamically imported to keep the initial bundle lean.
 */
export function useExport() {
  const { canvas } = useCanvasStore()

  const exportCanvas = useCallback(
    async (options: ExportOptions) => {
      if (!canvas) {
        toast.error('No canvas to export')
        return
      }

      const toastId = toast.loading(`Exporting as ${options.format.toUpperCase()}...`)

      try {
        canvas.discardActiveObject()
        canvas.requestRenderAll()

        if (options.format === 'pdf') {
          await exportAsPdf(canvas, options)
        } else {
          await exportAsImage(canvas, options)
        }
        toast.success('Export complete!', { id: toastId })
      } catch (error) {
        console.error('[Export Error]', error)
        toast.error('Export failed. Please try again.', { id: toastId })
      }
    },
    [canvas]
  )

  return { exportCanvas }
}
