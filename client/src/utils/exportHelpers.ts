import { fabric } from 'fabric'
import type { ExportOptions } from '@/types/canvas.types'

/**
 * Export canvas as PNG or JPEG.
 */
export async function exportAsImage(
  canvas: fabric.Canvas,
  options: ExportOptions
): Promise<void> {
  const { format, multiplier, transparentBackground, filename } = options

  const originalBg = canvas.backgroundColor

  if (transparentBackground && format === 'png') {
    canvas.setBackgroundColor('', () => canvas.renderAll())
  }

  const dataUrl = canvas.toDataURL({
    format,
    quality: multiplier === 3 ? 1 : 0.92,
    multiplier,
  })

  // Restore background
  if (transparentBackground) {
    canvas.setBackgroundColor(originalBg as string, () => canvas.renderAll())
  }

  downloadDataUrl(dataUrl, `${filename}.${format}`)
}

/**
 * Export canvas as PDF using jsPDF (dynamically imported to keep bundle lean).
 */
export async function exportAsPdf(
  canvas: fabric.Canvas,
  options: ExportOptions
): Promise<void> {
  const { jsPDF } = await import('jspdf')

  const canvasWidth  = canvas.getWidth()
  const canvasHeight = canvas.getHeight()

  // Determine orientation
  const orientation = canvasWidth >= canvasHeight ? 'landscape' : 'portrait'

  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [canvasWidth, canvasHeight],
    hotfixes: ['px_scaling'],
  })

  const dataUrl = canvas.toDataURL({ format: 'png', multiplier: options.multiplier })
  pdf.addImage(dataUrl, 'PNG', 0, 0, canvasWidth, canvasHeight)
  pdf.save(`${options.filename}.pdf`)
}

/**
 * Triggers a file download from a data URL.
 */
function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
